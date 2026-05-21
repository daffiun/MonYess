export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true, service: 'financebot-worker' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Telegram webhook placeholder
    if (url.pathname === '/telegram/webhook' && request.method === 'POST') {
      // TODO: Validate X-Telegram-Bot-Api-Secret-Token
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
