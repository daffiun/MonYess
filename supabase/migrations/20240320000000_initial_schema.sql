-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Base trigger for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.profiles enable row level security;
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure handle_updated_at();

-- Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. USER_STATS (Gamification base)
create table public.user_stats (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  health_score integer default 50 not null,
  level integer default 1 not null,
  total_transactions integer default 0 not null,
  last_transaction_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.user_stats enable row level security;
create policy "Users can view own stats." on public.user_stats for select using (auth.uid() = user_id);

create trigger on_user_stats_updated
  before update on public.user_stats
  for each row execute procedure handle_updated_at();

-- Auto-create stats trigger
create or replace function public.handle_new_profile()
returns trigger as $$
begin
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- 3. TELEGRAM_LINKS
create table public.telegram_links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  telegram_user_id bigint unique,
  telegram_username text,
  link_code text unique not null,
  code_expires_at timestamptz not null,
  is_linked boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.telegram_links enable row level security;
create policy "Users can view own links." on public.telegram_links for select using (auth.uid() = user_id);
create policy "Users can manage own links." on public.telegram_links for all using (auth.uid() = user_id);

-- 4. ACCOUNTS
create type account_type as enum ('cash', 'bank', 'ewallet', 'credit_card', 'investment', 'debt', 'other');

create table public.accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type account_type not null default 'cash',
  balance numeric(15,2) default 0 not null,
  color text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.accounts enable row level security;
create policy "Users can view own accounts." on public.accounts for select using (auth.uid() = user_id);
create policy "Users can insert own accounts." on public.accounts for insert with check (auth.uid() = user_id);
create policy "Users can update own accounts." on public.accounts for update using (auth.uid() = user_id);
create policy "Users can delete own accounts." on public.accounts for delete using (auth.uid() = user_id);

create trigger on_accounts_updated
  before update on public.accounts
  for each row execute procedure handle_updated_at();

-- 5. CATEGORIES
create type category_type as enum ('income', 'expense', 'transfer');

create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type category_type not null,
  icon text,
  color text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.categories enable row level security;
create policy "Users can view own categories." on public.categories for select using (auth.uid() = user_id);
create policy "Users can manage own categories." on public.categories for all using (auth.uid() = user_id);

-- 6. TRANSACTIONS
create type transaction_status as enum ('completed', 'pending');

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  target_account_id uuid references public.accounts(id) on delete cascade, -- for transfers
  category_id uuid references public.categories(id) on delete restrict,
  amount numeric(15,2) not null check (amount > 0), -- Stored as positive, 'type' determines +/-
  type category_type not null,
  date date not null default current_date,
  note text,
  status transaction_status not null default 'completed',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  check (
    (type = 'transfer' and target_account_id is not null and account_id != target_account_id) or
    (type != 'transfer' and target_account_id is null)
  )
);
alter table public.transactions enable row level security;
create policy "Users can view own tx." on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own tx." on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own tx." on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete own tx." on public.transactions for delete using (auth.uid() = user_id);

create trigger on_transactions_updated
  before update on public.transactions
  for each row execute procedure handle_updated_at();

-- 7. BUDGETS
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  amount numeric(15,2) not null check (amount > 0),
  period text not null, -- Format YYYY-MM
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, category_id, period)
);
alter table public.budgets enable row level security;
create policy "Users can manage own budgets." on public.budgets for all using (auth.uid() = user_id);

-- 8. GOALS
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  target_amount numeric(15,2) not null check (target_amount > 0),
  current_amount numeric(15,2) default 0 not null,
  deadline date,
  color text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.goals enable row level security;
create policy "Users can manage own goals." on public.goals for all using (auth.uid() = user_id);

-- 9. DEBTS
create type debt_type as enum ('payable', 'receivable');

create table public.debts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type debt_type not null,
  amount numeric(15,2) not null check (amount > 0),
  remaining numeric(15,2) not null check (remaining >= 0),
  due_date date,
  is_settled boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.debts enable row level security;
create policy "Users can manage own debts." on public.debts for all using (auth.uid() = user_id);

-- 10. RECURRING
create type recurring_frequency as enum ('daily', 'weekly', 'monthly', 'yearly');

create table public.recurring_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  target_account_id uuid references public.accounts(id) on delete cascade,
  category_id uuid references public.categories(id) on delete restrict,
  name text not null,
  amount numeric(15,2) not null check (amount > 0),
  type category_type not null,
  frequency recurring_frequency not null,
  next_date date not null,
  active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.recurring_transactions enable row level security;
create policy "Users can manage own recurring." on public.recurring_transactions for all using (auth.uid() = user_id);

create table public.recurring_transaction_runs (
  id uuid default uuid_generate_v4() primary key,
  recurring_id uuid references public.recurring_transactions(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  run_date date not null,
  created_at timestamptz default now() not null
);
alter table public.recurring_transaction_runs enable row level security;
create policy "Users can view own runs." on public.recurring_transaction_runs 
  for select using (exists (
    select 1 from public.recurring_transactions r 
    where r.id = recurring_id and r.user_id = auth.uid()
  ));

-- 11. ACHIEVEMENTS & GAMIFICATION
create table public.achievements (
  id text primary key, -- e.g., 'catat_7_hari'
  name text not null,
  description text not null,
  icon text not null,
  condition text not null,
  tier integer default 1 not null
);
alter table public.achievements enable row level security;
create policy "Anyone can read achievements." on public.achievements for select to authenticated using (true);

create table public.user_achievements (
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text references public.achievements(id) on delete cascade not null,
  earned_at timestamptz default now() not null,
  primary key (user_id, achievement_id)
);
alter table public.user_achievements enable row level security;
create policy "Users can view own achievements." on public.user_achievements for select using (auth.uid() = user_id);

create table public.weekly_challenges (
  id text primary key,
  title text not null,
  description text not null,
  target_value numeric not null,
  unit text not null -- e.g., 'days', 'idr', 'percent'
);
alter table public.weekly_challenges enable row level security;
create policy "Anyone can read challenges." on public.weekly_challenges for select to authenticated using (true);

create table public.user_weekly_challenges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id text references public.weekly_challenges(id) on delete cascade not null,
  current_value numeric default 0 not null,
  start_date date not null,
  end_date date not null,
  completed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.user_weekly_challenges enable row level security;
create policy "Users can view own challenges." on public.user_weekly_challenges for select using (auth.uid() = user_id);

-- Insert Default Achievements
insert into public.achievements (id, name, description, icon, condition) values
('catat_7_hari', 'Konsisten 7 Hari', 'Mencatat transaksi 7 hari berturut-turut.', 'Flame', 'streak>=7'),
('catat_14_hari', 'Konsisten 14 Hari', 'Mencatat transaksi 14 hari berturut-turut.', 'Flame', 'streak>=14'),
('budget_aman', 'Budget Aman', 'Pengeluaran tidak melebihi batas anggaran dalam sebulan.', 'ShieldCheck', 'budget_status=safe'),
('bebas_telat_bayar', 'Bebas Telat', 'Membayar hutang atau tagihan tepat waktu.', 'Clock', 'no_overdue'),
('tabungan_naik', 'Tabungan Naik', 'Net cashflow positif di akhir bulan.', 'TrendingUp', 'cashflow>0'),
('laporan_mingguan', 'Analis Pemula', 'Membuka halaman laporan 4 kali.', 'BarChart', 'view_reports'),
('telegram_terhubung', 'Bot Master', 'Menghubungkan akun dengan bot Telegram.', 'Smartphone', 'telegram=linked')
on conflict (id) do nothing;

-- Insert Default Challenges
insert into public.weekly_challenges (id, title, description, target_value, unit) values
('catat_7_hari_minggu_ini', 'Catat Penuh Seminggu', 'Catat pengeluaranmu tanpa putus minggu ini.', 7, 'days'),
('review_laporan_mingguan', 'Review Laporan', 'Buka dan periksa laporan keuangan mingguanmu.', 1, 'times'),
('jaga_budget_makan', 'Kontrol Jajan', 'Pastikan kategori Makan Luar aman minggu ini.', 100, 'percent')
on conflict (id) do nothing;
