import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { emailContent, sendViaResend, validateContact } from '../server/contact.js';

const valid = () => ({ name: 'Алексей', contact: '@switch_user', service: 'landing', comment: 'Нужен сайт', website: '', startedAt: Date.now() - 3000 });
test('validation rejects invalid contact, unknown tariffs and honeypot spam', () => {
  assert.ok(validateContact({ ...valid(), contact: '<script>' }).error);
  assert.ok(validateContact({ ...valid(), contact: '-------' }).error);
  assert.ok(validateContact({ ...valid(), service: 'free' }).error);
  assert.ok(validateContact({ ...valid(), startedAt: Date.now() }).error);
  assert.ok(validateContact({ ...valid(), website: 'spam' }).spam);
});
test('price in the email comes from server config, ignoring forged client price', () => {
  const result = validateContact({ ...valid(), price: '1 ₽' });
  assert.ok(emailContent(result.data).text.includes('от 2 500 до 5 000 ₽'));
  assert.equal(result.data.contact, '@switch_user');
});
test('Resend receives credentials only on the server and sends the expected email', async () => {
  await sendViaResend(validateContact(valid()).data, { RESEND_API_KEY: 'test-key', CONTACT_TO: 'studio@example.com', MAIL_FROM: 'hello@example.com' }, async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    assert.match(JSON.parse(options.body).text, /Нужен сайт/);
    return { ok: true };
  });
});
test('endpoint delivers valid requests, rejects cross-origin and malformed JSON, rate limits spam', async t => {
  const received = [];
  const app = createApp({ deliver: async data => received.push(data), env: { APP_ORIGIN: 'https://switch.test' } });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (data, origin = 'https://switch.test') => fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(data) });
  assert.equal((await post(valid())).status, 200);
  assert.equal(received.length, 1);
  assert.equal((await post(valid(), 'https://evil.test')).status, 403);
  assert.equal((await post({ ...valid(), website: 'bot' })).status, 200);
  assert.equal(received.length, 1);
  assert.equal((await post({ ...valid(), name: '' })).status, 400);
  assert.equal((await post(valid())).status, 200);
  assert.equal((await post(valid())).status, 429);
  const malformed = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
});
test('missing provider returns a real error rather than a fake successful submission', async t => {
  const server = createApp({ env: {} }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid()) });
  assert.equal(response.status, 503);
});
test('serverless endpoint shares validation and serves the bundled client', async () => {
  const { readFile } = await import('node:fs/promises');
  let source = await readFile(new URL('../server/worker.js', import.meta.url), 'utf8');
  // Import a small source fixture so tests do not require a production build.
  source = source.replace("'./contact.js'", JSON.stringify(new URL('../server/contact.js', import.meta.url).href));
  source = source.replace('__SWITCH_ASSETS__', JSON.stringify({ '/index.html': { type: 'text/html', data: Buffer.from('<html lang="ru">SWITCH</html>').toString('base64') }, '/works/test.mp4': { type: 'video/mp4', data: Buffer.from('0123456789').toString('base64') } }));
  const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const response = await worker.fetch(new Request('https://switch.test/'), {});
  assert.match(await response.text(), /SWITCH/);
  const video = await worker.fetch(new Request('https://switch.test/works/test.mp4', { headers: { Range: 'bytes=2-5' } }), {});
  assert.equal(video.status, 206);
  assert.equal(video.headers.get('Content-Range'), 'bytes 2-5/10');
  assert.equal(await video.text(), '2345');
  const suffix = await worker.fetch(new Request('https://switch.test/works/test.mp4', { headers: { Range: 'bytes=-3' } }), {});
  assert.equal(await suffix.text(), '789');
  const invalid = await worker.fetch(new Request('https://switch.test/works/test.mp4', { headers: { Range: 'bytes=20-' } }), {});
  assert.equal(invalid.status, 416);
  const post = input => worker.fetch(new Request('https://switch.test/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }), {});
  assert.equal((await post(valid())).status, 503);
  assert.equal((await post({ ...valid(), name: '' })).status, 400);
});
