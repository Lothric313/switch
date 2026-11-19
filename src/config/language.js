const russianCountries = new Set(['AM', 'AZ', 'BY', 'KG', 'KZ', 'MD', 'RU', 'TJ', 'TM', 'UZ']);

export function savedLanguage() {
  try {
    const choice = localStorage.getItem('switch-language-choice');
    if (choice === 'ru' || choice === 'en') return choice;
    // The previous site saved ru on every first visit. Only en proves a manual choice.
    if (localStorage.getItem('switch-language') === 'en') return 'en';
  } catch { /* The site also works with storage disabled. */ }
}

export function rememberLanguage(language) {
  try { localStorage.setItem('switch-language-choice', language); } catch { /* Optional storage. */ }
}

export async function detectLanguage(fetchCountry = fetch) {
  try {
    const response = await fetchCountry('https://api.country.is/', {
      signal: AbortSignal.timeout(2000), credentials: 'omit', referrerPolicy: 'no-referrer',
    });
    if (response.ok && russianCountries.has((await response.json()).country)) return 'ru';
  } catch { /* On timeout, network failure or invalid data, use English. */ }
  return 'en';
}
