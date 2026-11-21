const languageChoiceKey = 'switch-language-choice';

export function savedLanguage() {
  try {
    const choice = localStorage.getItem(languageChoiceKey);
    if (choice === 'ru' || choice === 'en') return choice;
  } catch { /* The site also works with storage disabled. */ }
}

export function rememberLanguage(lang) {
  try { localStorage.setItem(languageChoiceKey, lang); } catch { /* Optional storage. */ }
}

export function detectLanguage(browser = navigator) {
  const language = browser.language || browser.languages?.[0] || '';
  return /^ru/i.test(language) ? 'ru' : 'en';
}
