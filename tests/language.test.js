import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, rememberLanguage, savedLanguage } from '../src/config/language.js';

test('IP country selects the landing language', async () => {
  for (const [country, expected] of Object.entries({
    RU: 'ru', AM: 'ru', AZ: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', MD: 'ru', TJ: 'ru', TM: 'ru', UZ: 'ru',
    US: 'en', GE: 'en', DE: 'en', XX: 'en',
  })) {
    assert.equal(await detectLanguage(async () => Response.json({ country })), expected, country);
  }
});

test('failed lookup, timeout and malformed responses fall back to English', async () => {
  for (const fetcher of [
    async () => Response.error(),
    async () => { throw new Error('Timed out'); },
    async () => new Response('not json'),
    async () => Response.json({}),
  ]) assert.equal(await detectLanguage(fetcher), 'en');
});

test('saved explicit choices override the previous automatic Russian default', t => {
  const values = new Map([['switch-language', 'ru']]);
  t.mock.getter(globalThis, 'localStorage', () => ({
    getItem: key => values.get(key), setItem: (key, value) => values.set(key, value),
  }));
  assert.equal(savedLanguage(), undefined);
  values.set('switch-language', 'en');
  assert.equal(savedLanguage(), 'en');
  rememberLanguage('ru');
  assert.equal(savedLanguage(), 'ru');
});
