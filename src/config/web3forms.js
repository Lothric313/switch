const ACCESS_KEY = '56d90727-85ab-49d5-ae50-f605b952b145';

export async function sendInquiry(data, service, fetcher = fetch) {
  const response = await fetcher('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: 'SWITCH — новая заявка с сайта',
      from_name: 'SWITCH',
      'Имя': data.name.trim(),
      'Контакт': data.contact.trim(),
      'Тип проекта': service.title,
      'Стоимость': service.priceLabel,
      'Комментарий': data.comment.trim() || 'Без комментария',
      botcheck: Boolean(data.website),
    }),
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json().catch(() => ({}));
  return { ok: response.ok && result.success === true, status: response.status };
}
