import { services } from '../src/config/services.js';
import { CONTACT_PATTERN } from '../src/config/validation.js';

export function validateContact(input, now = Date.now()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Некорректные данные заявки.' };
  if (typeof input.website === 'string' && input.website) return { spam: true };
  const { name, contact, comment = '', service } = input;
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) return { error: 'Укажите имя от 2 до 80 символов.' };
  if (typeof contact !== 'string' || !CONTACT_PATTERN.test(contact.trim())) return { error: 'Укажите телефон или Telegram в формате @username.' };
  if (typeof comment !== 'string' || comment.length > 3000) return { error: 'Комментарий должен быть короче 3 000 символов.' };
  const selected = services.find(item => item.id === service);
  if (!selected) return { error: 'Выберите тип проекта.' };
  if (!Number.isFinite(input.startedAt) || now - input.startedAt < 1500 || now - input.startedAt > 86400000) return { error: 'Обновите страницу и попробуйте ещё раз.' };
  return { data: { name: name.trim(), contact: contact.trim(), comment: comment.trim(), service: selected } };
}

export function emailContent(data) {
  return {
    subject: 'SWITCH — новая заявка с сайта',
    text: [`Имя: ${data.name}`, `Контакт: ${data.contact}`, `Тип проекта: ${data.service.title}`, `Стоимость: ${data.service.priceLabel}`, '', 'Комментарий:', data.comment || 'Без комментария'].join('\n'),
  };
}

// Resend works on Node and serverless runtimes. Credentials never enter the browser.
export async function sendViaResend(data, env, fetcher = fetch) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.MAIL_FROM) throw new Error('MAIL_NOT_CONFIGURED');
  const content = emailContent(data);
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: env.CONTACT_TO.split(',').map(value => value.trim()).filter(Boolean), ...content }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('MAIL_DELIVERY_FAILED');
}
