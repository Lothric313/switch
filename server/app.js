import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { emailContent, sendViaResend, validateContact } from './contact.js';

export function createApp({ env = process.env, deliver } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Set TRUST_PROXY=1 only behind exactly one trusted reverse proxy.
  if (env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY' });
    next();
  });
  app.use('/api', express.json({ limit: '12kb' }));
  app.get('/api/health', (req, res) => res.json({ ok: true }));
  let transport;
  const send = deliver || (async data => {
    if ((env.MAIL_PROVIDER || 'resend') === 'resend') return sendViaResend(data, env);
    if (env.MAIL_PROVIDER !== 'smtp' || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.CONTACT_TO || !env.MAIL_FROM) throw new Error('MAIL_NOT_CONFIGURED');
    transport ||= nodemailer.createTransport({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true', auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 12000 });
    await transport.sendMail({ from: env.MAIL_FROM, to: env.CONTACT_TO, ...emailContent(data) });
  });
  app.post('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Слишком много заявок. Попробуйте через 15 минут.' } }), async (req, res) => {
    const origin = req.get('origin');
    const expected = env.APP_ORIGIN || `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== expected) return res.status(403).json({ message: 'Отправка с этого адреса недоступна.' });
    const result = validateContact(req.body);
    if (result.spam) return res.json({ ok: true });
    if (result.error) return res.status(400).json({ message: result.error });
    try { await send(result.data); return res.json({ ok: true }); }
    catch (error) {
      // Only a static category is logged. Never log submitted personal data or provider responses.
      const missing = error.message === 'MAIL_NOT_CONFIGURED';
      console.error(missing ? 'Contact mail provider is not configured.' : 'Contact mail delivery failed.');
      return res.status(missing ? 503 : 502).json({ message: missing ? 'Приём заявок скоро откроется. Попробуйте немного позже.' : 'Не удалось доставить заявку. Пожалуйста, попробуйте ещё раз.' });
    }
  });
  app.use('/api', (req, res) => res.status(404).json({ message: 'Адрес не найден.' }));
  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) return res.status(400).json({ message: 'Некорректный формат данных.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Заявка слишком большая.' });
    console.error('Contact request failed.');
    return res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
  });
  return app;
}
