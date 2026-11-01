// Serverless deployment for Sites. Node hosting uses server/index.js instead.
import { sendViaResend, validateContact } from './contact.js';
const assets = __SWITCH_ASSETS__;
const attempts = new Map();
const json = (value, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true });
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ message: 'Используйте POST.' }, 405);
      const origin = request.headers.get('Origin');
      if (origin && origin !== (env.APP_ORIGIN || url.origin)) return json({ message: 'Отправка с этого адреса недоступна.' }, 403);
      // Per-isolate burst protection. For public high-traffic hosting add an edge rate limit.
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const now = Date.now();
      for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
      const record = attempts.get(ip) || { count: 0, expires: now + 15 * 60 * 1000 };
      record.count++;
      attempts.set(ip, record);
      if (record.count > 5) return json({ message: 'Слишком много заявок. Попробуйте через 15 минут.' }, 429);
      if (Number(request.headers.get('Content-Length')) > 12288) return json({ message: 'Заявка слишком большая.' }, 413);
      let body;
      try {
        const reader = request.body?.getReader();
        if (!reader) return json({ message: 'Пустая заявка.' }, 400);
        let length = 0;
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 12288) { await reader.cancel(); return json({ message: 'Заявка слишком большая.' }, 413); }
          chunks.push(value);
        }
        const bytes = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        body = JSON.parse(new TextDecoder().decode(bytes));
      } catch { return json({ message: 'Некорректный формат данных.' }, 400); }
      const result = validateContact(body);
      if (result.spam) return json({ ok: true });
      if (result.error) return json({ message: result.error }, 400);
      try { await sendViaResend(result.data, env); return json({ ok: true }); }
      catch (error) {
        const missing = error.message === 'MAIL_NOT_CONFIGURED';
        return json({ message: missing ? 'Приём заявок скоро откроется. Попробуйте немного позже.' : 'Не удалось доставить заявку. Пожалуйста, попробуйте ещё раз.' }, missing ? 503 : 502);
      }
    }
    if (url.pathname.startsWith('/api/')) return json({ message: 'Адрес не найден.' }, 404);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const asset = assets[url.pathname === '/' ? '/index.html' : url.pathname];
    if (!asset) return new Response('Not found', { status: 404 });
    const bytes = Uint8Array.from(atob(asset.data), char => char.charCodeAt(0));
    const headers = {
      'Content-Type': asset.type, 'Cache-Control': url.pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      'Accept-Ranges': 'bytes', 'Content-Length': String(bytes.length),
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY',
    };
    const range = request.headers.get('Range');
    if (range && request.method === 'GET') {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.length}` } });
      const start = match[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match[2]));
      const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1;
      if (start > end || start >= bytes.length) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.length}` } });
      const chunk = bytes.slice(start, end + 1);
      return new Response(chunk, { status: 206, headers: { ...headers, 'Content-Length': String(chunk.length), 'Content-Range': `bytes ${start}-${end}/${bytes.length}` } });
    }
    return new Response(request.method === 'HEAD' ? null : bytes, { headers });
  },
};
