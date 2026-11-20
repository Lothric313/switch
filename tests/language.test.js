import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage, rememberLanguage, savedLanguage } from '../src/config/language.js';

test('browser language selects Russian by prefix and otherwise defaults to English', () => {
  assert.equal(detectLanguage({ language: 'RU-ru' }), 'ru');
  assert.equal(detectLanguage({ language: '', languages: ['ru-RU', 'en-US'] }), 'ru');
  assert.equal(detectLanguage({ language: 'de-DE', languages: ['ru-RU'] }), 'en');
  assert.equal(detectLanguage({ languages: ['uk-UA', 'ru-RU'] }), 'en');
  assert.equal(detectLanguage({}), 'en');
});

test('manual choices use the current storage key and unsupported values are ignored', t => {
  const values = new Map([['switch-language', 'en'], ['switch-language-choice', 'fr']]);
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true, value: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) },
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  });
  assert.equal(savedLanguage(), undefined);
  rememberLanguage('en');
  assert.equal(savedLanguage(), 'en');
  rememberLanguage('ru');
  assert.equal(values.get('switch-language-choice'), 'ru');
  assert.equal(savedLanguage(), 'ru');
});
