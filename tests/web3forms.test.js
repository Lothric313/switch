import test from 'node:test';
import assert from 'node:assert/strict';
import { sendInquiry } from '../src/config/web3forms.js';

const data = { name: ' Анна ', contact: '@anna_test', comment: 'Нужен сайт', website: '' };
const service = { title: 'Лендинг', priceLabel: 'до 5 000 рублей' };

test('Web3Forms receives the inquiry and selected service', async () => {
  const result = await sendInquiry(data, service, async (url, options) => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    const body = JSON.parse(options.body);
    assert.equal(body['Имя'], 'Анна');
    assert.equal(body['Контакт'], '@anna_test');
    assert.equal(body['Тип проекта'], 'Лендинг');
    assert.equal(body['Стоимость'], 'до 5 000 рублей');
    assert.equal(body.botcheck, false);
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  });
  assert.deepEqual(result, { ok: true, status: 200 });
});

test('Web3Forms failures are never reported as success', async () => {
  const result = await sendInquiry({ ...data, website: 'spam' }, service, async (_url, options) => {
    assert.equal(JSON.parse(options.body).botcheck, true);
    return { ok: true, status: 200, json: async () => ({ success: false }) };
  });
  assert.equal(result.ok, false);
});
