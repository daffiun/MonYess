-- RPC: CREATE TRANSACTION
create or replace function public.create_transaction_with_balance(
  p_user_id uuid,
  p_account_id uuid,
  p_category_id uuid,
  p_amount numeric,
  p_type category_type,
  p_date date,
  p_note text,
  p_target_account_id uuid default null
)
returns public.transactions as $$
declare
  v_tx public.transactions;
begin
  -- Validation
  if p_amount <= 0 then
    raise exception 'Amount must be greater than 0';
  end if;

  if p_type = 'transfer' then
    if p_target_account_id is null then
      raise exception 'Target account is required for transfer';
    end if;
    if p_account_id = p_target_account_id then
      raise exception 'Source and target accounts must be different';
    end if;
  end if;

  -- Create transaction
  insert into public.transactions (user_id, account_id, target_account_id, category_id, amount, type, date, note)
  values (p_user_id, p_account_id, p_target_account_id, p_category_id, p_amount, p_type, p_date, p_note)
  returning * into v_tx;

  -- Update Balance
  if p_type = 'expense' then
    update public.accounts set balance = balance - p_amount where id = p_account_id and user_id = p_user_id;
  elsif p_type = 'income' then
    update public.accounts set balance = balance + p_amount where id = p_account_id and user_id = p_user_id;
  elsif p_type = 'transfer' then
    update public.accounts set balance = balance - p_amount where id = p_account_id and user_id = p_user_id;
    update public.accounts set balance = balance + p_amount where id = p_target_account_id and user_id = p_user_id;
  end if;

  -- Gamification: Update Streak
  -- Called asynchronously or at the end to not block. Handled in a separate function if needed, 
  -- but we can do a simple update here.
  perform public.refresh_user_stats(p_user_id, p_date);

  return v_tx;
end;
$$ language plpgsql security definer;


-- RPC: DELETE TRANSACTION
create or replace function public.delete_transaction_with_balance(
  p_tx_id uuid,
  p_user_id uuid
)
returns boolean as $$
declare
  v_tx public.transactions;
begin
  -- Get existing tx
  select * into v_tx from public.transactions where id = p_tx_id and user_id = p_user_id;
  if not found then
    raise exception 'Transaction not found or unauthorized';
  end if;

  -- Reverse balance effect
  if v_tx.type = 'expense' then
    update public.accounts set balance = balance + v_tx.amount where id = v_tx.account_id and user_id = p_user_id;
  elsif v_tx.type = 'income' then
    update public.accounts set balance = balance - v_tx.amount where id = v_tx.account_id and user_id = p_user_id;
  elsif v_tx.type = 'transfer' then
    update public.accounts set balance = balance + v_tx.amount where id = v_tx.account_id and user_id = p_user_id;
    update public.accounts set balance = balance - v_tx.amount where id = v_tx.target_account_id and user_id = p_user_id;
  end if;

  -- Delete tx
  delete from public.transactions where id = p_tx_id;
  
  return true;
end;
$$ language plpgsql security definer;


-- RPC: UPDATE TRANSACTION
create or replace function public.update_transaction_with_balance(
  p_tx_id uuid,
  p_user_id uuid,
  p_account_id uuid,
  p_category_id uuid,
  p_amount numeric,
  p_type category_type,
  p_date date,
  p_note text,
  p_target_account_id uuid default null
)
returns public.transactions as $$
declare
  v_tx public.transactions;
begin
  -- Reverse old
  perform public.delete_transaction_with_balance(p_tx_id, p_user_id);
  
  -- Re-create new using existing RPC logic but preserving ID if possible. 
  -- Actually, let's do it safely without ID change.
  
  -- [Since we deleted, we can't preserve ID easily with just call. Let's rewrite natively to preserve ID]
  raise exception 'Please implement via reverse and manual update to preserve ID';
end;
$$ language plpgsql security definer;

-- Safer UPDATE implementation preserving ID
create or replace function public.update_transaction_with_balance_safe(
  p_tx_id uuid,
  p_user_id uuid,
  p_account_id uuid,
  p_category_id uuid,
  p_amount numeric,
  p_type category_type,
  p_date date,
  p_note text,
  p_target_account_id uuid default null
)
returns public.transactions as $$
declare
  v_old_tx public.transactions;
  v_new_tx public.transactions;
begin
  if p_amount <= 0 then raise exception 'Amount must be > 0'; end if;

  select * into v_old_tx from public.transactions where id = p_tx_id and user_id = p_user_id for update;
  if not found then raise exception 'Transaction not found'; end if;

  -- Reverse old
  if v_old_tx.type = 'expense' then
    update public.accounts set balance = balance + v_old_tx.amount where id = v_old_tx.account_id;
  elsif v_old_tx.type = 'income' then
    update public.accounts set balance = balance - v_old_tx.amount where id = v_old_tx.account_id;
  elsif v_old_tx.type = 'transfer' then
    update public.accounts set balance = balance + v_old_tx.amount where id = v_old_tx.account_id;
    update public.accounts set balance = balance - v_old_tx.amount where id = v_old_tx.target_account_id;
  end if;

  -- Apply new
  if p_type = 'expense' then
    update public.accounts set balance = balance - p_amount where id = p_account_id;
  elsif p_type = 'income' then
    update public.accounts set balance = balance + p_amount where id = p_account_id;
  elsif p_type = 'transfer' then
    update public.accounts set balance = balance - p_amount where id = p_account_id;
    update public.accounts set balance = balance + p_amount where id = p_target_account_id;
  end if;

  -- Update record
  update public.transactions
  set account_id = p_account_id,
      target_account_id = p_target_account_id,
      category_id = p_category_id,
      amount = p_amount,
      type = p_type,
      date = p_date,
      note = p_note,
      updated_at = now()
  where id = p_tx_id
  returning * into v_new_tx;

  return v_new_tx;
end;
$$ language plpgsql security definer;


-- GAMIFICATION: Refresh Stats
create or replace function public.refresh_user_stats(p_user_id uuid, p_tx_date date)
returns void as $$
declare
  v_stats public.user_stats;
  v_diff integer;
begin
  select * into v_stats from public.user_stats where user_id = p_user_id for update;
  
  if v_stats.last_transaction_date is null then
    -- First transaction
    update public.user_stats 
    set current_streak = 1, longest_streak = 1, total_transactions = 1, last_transaction_date = p_tx_date
    where user_id = p_user_id;
  else
    v_diff := current_date - v_stats.last_transaction_date;
    
    if v_diff = 1 or (v_diff = 0 and p_tx_date >= v_stats.last_transaction_date) then
      -- Streak continues (or same day)
      update public.user_stats 
      set current_streak = case when v_diff = 1 then current_streak + 1 else current_streak end,
          longest_streak = greatest(longest_streak, case when v_diff = 1 then current_streak + 1 else current_streak end),
          total_transactions = total_transactions + 1,
          last_transaction_date = greatest(last_transaction_date, p_tx_date)
      where user_id = p_user_id;
    elsif v_diff > 1 then
      -- Streak broken
      update public.user_stats 
      set current_streak = 1,
          total_transactions = total_transactions + 1,
          last_transaction_date = p_tx_date
      where user_id = p_user_id;
    end if;
  end if;
end;
$$ language plpgsql security definer;
