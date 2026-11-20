import { detectLanguage, rememberLanguage, savedLanguage } from './config/language.js';

if (document.documentElement.hasAttribute('data-language-entry')) {
  for (const link of document.querySelectorAll('a[hreflang]')) {
    link.search = location.search;
    link.hash = location.hash;
    link.addEventListener('click', () => rememberLanguage(link.hreflang));
  }
  const language = savedLanguage() || detectLanguage();
  location.replace(document.querySelector(`a[hreflang="${language}"]`).href);
} else {
  await import('./main.jsx');
}
