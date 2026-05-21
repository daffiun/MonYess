import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { parseTransactionCommand } from '@financebot/shared';

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  TELEGRAM_WEBHOOK_SETUP_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  WEBAPP_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// 1. Health check
app.get('/health', (c) => c.json({ ok: true, service: 'financebot-worker' }));

// 2. Setup webhook (Admin only)
app.get('/telegram/set-webhook', async (c) => {
  const secret = c.req.query('secret');
  if (secret !== c.env.TELEGRAM_WEBHOOK_SETUP_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const workerUrl = new URL(c.req.url).origin;
  const webhookUrl = `${workerUrl}/telegram/webhook`;
  
  const telegramApi = `https://api.telegram.org/bot${c.env.TELEGRAM_BOT_TOKEN}/setWebhook`;
  
  const res = await fetch(telegramApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: c.env.TELEGRAM_WEBHOOK_SECRET,
    }),
  });

  const data = await res.json();
  return c.json(data);
});

// 3. Handle incoming Telegram updates
app.post('/telegram/webhook', async (c) => {
  // Validate secret token from Telegram
  const secretToken = c.req.header('X-Telegram-Bot-Api-Secret-Token');
  if (secretToken !== c.env.TELEGRAM_WEBHOOK_SECRET) {
    return c.text('Unauthorized', 401);
  }

  const update = await c.req.json();
  
  // Only process messages with text
  if (!update.message || !update.message.text) {
    return c.json({ ok: true });
  }

  const chatId = update.message.chat.id;
  const text = update.message.text.trim();
  const telegramUserId = update.message.from.id;
  const username = update.message.from.username || update.message.from.first_name || 'User';

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);

  // Helper to send reply
  const reply = async (message: string) => {
    await fetch(`https://api.telegram.org/bot${c.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  };

  // --- COMMAND ROUTING ---

  // /start
  if (text.startsWith('/start')) {
    await reply(`Halo kak ${username}! 👋\nSelamat datang di FinanceBot (MonYess).\n\nUntuk mulai mencatat transaksi dari sini, sambungkan dulu dengan akun web kamu menggunakan perintah:\n/link [KODE_LINK_KAMU]\n\nDapatkan kode link di menu Telegram pada web app.`);
    return c.json({ ok: true });
  }

  // /link CODE
  if (text.startsWith('/link')) {
    const parts = text.split(' ');
    if (parts.length < 2) {
      await reply('⚠️ Format salah.\nGunakan: /link KODE_LINK_KAMU');
      return c.json({ ok: true });
    }

    const code = parts[1].toUpperCase();

    // Find code in DB
    const { data: linkData } = await supabase
      .from('telegram_links')
      .select('*')
      .eq('link_code', code)
      .eq('is_linked', false)
      .single();

    if (!linkData || new Date() > new Date(linkData.code_expires_at)) {
      await reply('❌ Kode link tidak valid atau sudah kedaluwarsa. Silakan buat kode baru di web.');
      return c.json({ ok: true });
    }

    // Update link
    const { error } = await supabase
      .from('telegram_links')
      .update({
        telegram_user_id: telegramUserId,
        telegram_username: username,
        is_linked: true,
      })
      .eq('id', linkData.id);

    if (error) {
      await reply('❌ Gagal menghubungkan akun. Silakan coba lagi.');
    } else {
      await reply('✅ Berhasil dihubungkan!\nSekarang kamu bisa mencatat transaksi langsung dari sini.\n\nContoh:\n/expense 50000 | Makan | Beli bakso');
    }
    return c.json({ ok: true });
  }

  // Check if user is linked before allowing other commands
  const { data: linkedUser } = await supabase
    .from('telegram_links')
    .select('user_id')
    .eq('telegram_user_id', telegramUserId)
    .eq('is_linked', true)
    .maybeSingle();

  if (!linkedUser) {
    await reply('⚠️ Akun belum terhubung. Silakan gunakan perintah /link KODE untuk menghubungkan akun web MonYess kamu.');
    return c.json({ ok: true });
  }

  const userId = linkedUser.user_id;

  // /unlink
  if (text === '/unlink') {
    await supabase.from('telegram_links').delete().eq('telegram_user_id', telegramUserId);
    await reply('🔌 Akun Telegram berhasil dilepas dari MonYess.');
    return c.json({ ok: true });
  }

  // Transaction Commands: /expense or /income
  if (text.startsWith('/expense') || text.startsWith('/income')) {
    const type = text.startsWith('/expense') ? 'expense' : 'income';
    const parsed = parseTransactionCommand(text);

    if (!parsed) {
      await reply(`⚠️ Format salah.\nContoh benar:\n/${type} 25000 | Makan | Catatan`);
      return c.json({ ok: true });
    }

    // Find category
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .ilike('name', parsed.categoryName);

    if (!categories || categories.length === 0) {
      // Show available categories to help user
      const { data: allCats } = await supabase.from('categories').select('name').eq('user_id', userId).eq('type', type);
      const catList = allCats?.map(c => `- ${c.name}`).join('\n') || 'Belum ada kategori.';
      await reply(`❌ Kategori "${parsed.categoryName}" tidak ditemukan.\n\nKategori ${type} yang tersedia:\n${catList}`);
      return c.json({ ok: true });
    }
    const categoryId = categories[0].id;

    // Find account
    let accountId;
    if (parsed.accountName) {
      const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .ilike('name', parsed.accountName);
      
      if (!accounts || accounts.length === 0) {
        await reply(`❌ Akun "${parsed.accountName}" tidak ditemukan.`);
        return c.json({ ok: true });
      }
      accountId = accounts[0].id;
    } else {
      const { data: accounts } = await supabase.from('accounts').select('*').eq('user_id', userId).eq('is_active', true);
      if (!accounts || accounts.length === 0) {
        await reply('❌ Kamu belum memiliki akun aktif. Buat akun di web MonYess dulu ya.');
        return c.json({ ok: true });
      }
      if (accounts.length === 1) {
        accountId = accounts[0].id;
      } else {
        await reply('⚠️ Kamu memiliki lebih dari 1 akun aktif. Sertakan nama akun.\nContoh:\n/expense 50000 | Makan | NamaAkun | Beli bakso');
        return c.json({ ok: true });
      }
    }

    // Call RPC to create transaction and update balance securely
    const { error } = await supabase.rpc('create_transaction_with_balance', {
      p_user_id: userId,
      p_account_id: accountId,
      p_target_account_id: null,
      p_category_id: categoryId,
      p_amount: parsed.amount,
      p_type: type,
      p_date: new Date().toISOString().split('T')[0],
      p_note: parsed.note || ''
    });

    if (error) {
      await reply('❌ Gagal mencatat transaksi: ' + error.message);
    } else {
      // Check streak update
      const { data: stats } = await supabase.from('user_stats').select('current_streak').eq('user_id', userId).single();
      const streakMsg = stats ? `\n🔥 Streak: ${stats.current_streak} hari` : '';
      
      await reply(`✅ Berhasil dicatat!\n${type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}: Rp ${parsed.amount.toLocaleString('id-ID')}\nKategori: ${categories[0].name}${streakMsg}`);
    }
    return c.json({ ok: true });
  }

  // Unhandled commands
  await reply('Maaf, perintah tidak dikenali. Ketik /help untuk panduan.');
  return c.json({ ok: true });
});

export default app;
