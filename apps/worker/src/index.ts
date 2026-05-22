import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { parseTransactionCommand } from '@financebot/shared';
import { addDays, addMonths, addYears, format, isBefore, parseISO, startOfDay } from 'date-fns';

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  TELEGRAM_WEBHOOK_SETUP_SECRET: string;
  CRON_TEST_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  WEBAPP_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// --- HELPERS ---

const sendTelegramMessage = async (token: string, chatId: string | number, text: string) => {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

const processAutomation = async (env: Env, force: boolean = false) => {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // 1. PROCESS RECURRING TRANSACTIONS
  const { data: recurringTxs } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('active', true)
    .lte('next_date', todayStr);

  if (recurringTxs) {
    for (const rt of recurringTxs) {
      const { data: existingRun } = await supabase
        .from('recurring_transaction_runs')
        .select('*')
        .eq('recurring_id', rt.id)
        .eq('run_date', todayStr)
        .maybeSingle();

      if (existingRun) continue;

      const { data: newTx, error: txError } = await supabase.rpc('create_transaction_with_balance', {
        p_user_id: rt.user_id,
        p_account_id: rt.account_id,
        p_target_account_id: rt.target_account_id,
        p_category_id: rt.category_id,
        p_amount: rt.amount,
        p_type: rt.type,
        p_date: todayStr,
        p_note: `[Auto] ${rt.name}`
      });

      if (!txError) {
        await supabase.from('recurring_transaction_runs').insert({
          recurring_id: rt.id,
          transaction_id: (newTx as any).id,
          run_date: todayStr
        });

        let nextDate = parseISO(rt.next_date);
        if (rt.frequency === 'daily') nextDate = addDays(nextDate, 1);
        else if (rt.frequency === 'weekly') nextDate = addDays(nextDate, 7);
        else if (rt.frequency === 'monthly') nextDate = addMonths(nextDate, 1);
        else if (rt.frequency === 'yearly') nextDate = addYears(nextDate, 1);

        await supabase.from('recurring_transactions').update({ next_date: format(nextDate, 'yyyy-MM-dd') }).eq('id', rt.id);
      }
    }
  }

  // 2. SEND REMINDERS
  const { data: linkedUsers } = await supabase
    .from('telegram_links')
    .select('user_id, telegram_user_id')
    .eq('is_linked', true);

  if (linkedUsers) {
    const isMorning = today.getUTCHours() === 0 || force; 
    const isNight = today.getUTCHours() === 14 || force;

    for (const link of linkedUsers) {
      if (isMorning) {
        await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, 
          `Selamat pagi! ☀️\nJangan lupa catat transaksi hari ini ya. Konsistensi adalah kunci kesehatan finansial! 🔥`
        );

        const { data: budgets } = await supabase
          .from('budgets')
          .select('*, category:category_id(name)')
          .eq('user_id', link.user_id)
          .eq('period', format(today, 'yyyy-MM'));
        
        if (budgets) {
          for (const b of budgets) {
             const { data: txs } = await supabase.from('transactions').select('amount').eq('category_id', b.category_id).eq('user_id', link.user_id).gte('date', format(startOfMonth(today), 'yyyy-MM-dd'));
             const spent = txs?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
             const percent = (spent / b.amount) * 100;
             if (percent >= 100) {
               await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `⚠️ Alert Budget: Pengeluaran "${b.category.name}" sudah melebihi anggaran! (${Math.round(percent)}%)`);
             } else if (percent >= 80) {
               await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `🔔 Waspada: Pengeluaran "${b.category.name}" sudah mencapai ${Math.round(percent)}% dari anggaran.`);
             }
          }
        }

        const { data: debts } = await supabase.from('debts').select('*').eq('user_id', link.user_id).eq('is_settled', false).is('due_date', 'not.null');
        if (debts) {
          for (const d of debts) {
            const dueDate = parseISO(d.due_date);
            const diff = differenceInDays(dueDate, today);
            if (diff === 0) await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `⏰ Hari ini jatuh tempo: "${d.name}" sebesar Rp ${Number(d.remaining).toLocaleString('id-ID')}.`);
            else if (diff > 0 && diff <= 3) await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `📅 Pengingat: "${d.name}" jatuh tempo dalam ${diff} hari lagi.`);
          }
        }
      }

      if (isNight) {
        const { data: todayTxs } = await supabase.from('transactions').select('amount, type').eq('user_id', link.user_id).eq('date', todayStr);
        if (todayTxs && todayTxs.length > 0) {
          const inc = todayTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
          const exp = todayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `Rekap Hari Ini 🌙\n\n📥 Masuk: Rp ${inc.toLocaleString('id-ID')}\n📤 Keluar: Rp ${exp.toLocaleString('id-ID')}\n\nTerima kasih sudah mencatat hari ini! ✨`);
        } else {
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, link.telegram_user_id, `Belum ada catatan hari ini? 🌙\nYuk luangkan 1 menit untuk mencatat pengeluaranmu hari ini agar streak kamu tidak terputus!`);
        }
      }
    }
  }
};

function differenceInDays(d1: Date, d2: Date) {
  const diffTime = d1.getTime() - d2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// --- APP ROUTES ---

app.get('/health', (c) => c.json({ ok: true, service: 'financebot-worker' }));

app.get('/cron/test', async (c) => {
  const secret = c.req.query('secret');
  if (secret !== c.env.CRON_TEST_SECRET) return c.json({ error: 'Unauthorized' }, 401);
  await processAutomation(c.env, true);
  return c.json({ ok: true, message: 'Automation triggered (FORCED) successfully' });
});

app.get('/telegram/set-webhook', async (c) => {
  const secret = c.req.query('secret');
  if (secret !== c.env.TELEGRAM_WEBHOOK_SETUP_SECRET) return c.json({ error: 'Unauthorized' }, 401);
  const workerUrl = new URL(c.req.url).origin;
  const webhookUrl = `${workerUrl}/telegram/webhook`;
  const res = await fetch(`https://api.telegram.org/bot${c.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl, secret_token: c.env.TELEGRAM_WEBHOOK_SECRET }),
  });
  return c.json(await res.json());
});

app.post('/telegram/webhook', async (c) => {
  const secretToken = c.req.header('X-Telegram-Bot-Api-Secret-Token');
  if (secretToken !== c.env.TELEGRAM_WEBHOOK_SECRET) return c.text('Unauthorized', 401);
  const update = await c.req.json();
  if (!update.message || !update.message.text) return c.json({ ok: true });
  const chatId = update.message.chat.id;
  const text = update.message.text.trim();
  const telegramUserId = update.message.from.id;
  const username = update.message.from.username || update.message.from.first_name || 'User';
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  const reply = (msg: string) => sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId, msg);

  if (text.startsWith('/start')) {
    await reply(`Halo kak ${username}! 👋\nSelamat datang di MonYess.\n\n/link [KODE] - Hubungkan akun\n/saldo - Cek semua saldo\n/today - Rekap hari ini\n/expense [nominal] | [kategori] | [catatan]`);
    return c.json({ ok: true });
  }

  if (text.startsWith('/link')) {
    const parts = text.split(' ');
    if (parts.length < 2) return reply('Gunakan: /link KODE');
    const code = parts[1].toUpperCase();
    const { data: linkData } = await supabase.from('telegram_links').select('*').eq('link_code', code).eq('is_linked', false).single();
    if (!linkData || new Date() > new Date(linkData.code_expires_at)) return reply('❌ Kode tidak valid.');
    const { error } = await supabase.from('telegram_links').update({ telegram_user_id: telegramUserId, telegram_username: username, is_linked: true }).eq('id', linkData.id);
    if (error) await reply('❌ Gagal menghubungkan.');
    else await reply('✅ Berhasil terhubung!');
    return c.json({ ok: true });
  }

  const { data: linkedUser } = await supabase.from('telegram_links').select('user_id').eq('telegram_user_id', telegramUserId).eq('is_linked', true).maybeSingle();
  if (!linkedUser) return reply('⚠️ Akun belum terhubung. Gunakan /link KODE');
  const userId = linkedUser.user_id;

  if (text === '/saldo') {
    const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', userId).eq('is_active', true);
    if (!accounts || accounts.length === 0) return reply('Belum ada akun aktif.');
    const msg = accounts.map(a => `- ${a.name}: Rp ${Number(a.balance).toLocaleString('id-ID')}`).join('\n');
    const total = accounts.reduce((s, a) => s + Number(a.balance), 0);
    await reply(`💰 Saldo Kamu:\n${msg}\n\nTotal: Rp ${total.toLocaleString('id-ID')}`);
    return c.json({ ok: true });
  }

  if (text === '/today') {
    const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', userId).eq('date', format(new Date(), 'yyyy-MM-dd'));
    const inc = txs?.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) || 0;
    const exp = txs?.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) || 0;
    await reply(`📊 Rekap Hari Ini:\n📥 Masuk: Rp ${inc.toLocaleString('id-ID')}\n📤 Keluar: Rp ${exp.toLocaleString('id-ID')}`);
    return c.json({ ok: true });
  }

  if (text.startsWith('/expense') || text.startsWith('/income')) {
    const type = text.startsWith('/expense') ? 'expense' : 'income';
    const parsed = parseTransactionCommand(text);
    if (!parsed) return reply(`⚠️ Format salah: /${type} [nominal] | [kategori] | [catatan]`);
    const { data: categories } = await supabase.from('categories').select('*').eq('user_id', userId).eq('type', type).ilike('name', parsed.categoryName);
    if (!categories || categories.length === 0) return reply(`❌ Kategori "${parsed.categoryName}" tidak ditemukan.`);
    const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', userId).eq('is_active', true);
    let accountId = accounts?.[0]?.id;
    if (parsed.accountName) {
      const found = accounts?.find(a => a.name.toLowerCase() === parsed.accountName?.toLowerCase());
      if (found) accountId = found.id;
      else return reply(`❌ Akun "${parsed.accountName}" tidak ditemukan.`);
    } else if (accounts && accounts.length > 1) return reply('⚠️ Sertakan nama akun (karena kamu punya > 1 akun).');
    const { error } = await supabase.rpc('create_transaction_with_balance', { p_user_id: userId, p_account_id: accountId, p_target_account_id: null, p_category_id: categories[0].id, p_amount: parsed.amount, p_type: type, p_date: format(new Date(), 'yyyy-MM-dd'), p_note: parsed.note || '' });
    if (error) await reply('❌ Gagal: ' + error.message);
    else await reply(`✅ Berhasil dicatat!\n${type === 'expense' ? 'Keluar' : 'Masuk'}: Rp ${parsed.amount.toLocaleString('id-ID')}\nKategori: ${categories[0].name}`);
    return c.json({ ok: true });
  }

  return c.json({ ok: true });
});

export default {
  fetch: app.fetch,
  async scheduled(event: any, env: Env, ctx: any) {
    ctx.waitUntil(processAutomation(env));
  },
};
