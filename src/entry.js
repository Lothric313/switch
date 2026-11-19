import { detectLanguage, rememberLanguage, savedLanguage } from './config/language.js';

if (document.documentElement.hasAttribute('data-language-entry')) {
  let selected = false;
  for (const link of document.querySelectorAll('a[hreflang]')) {
    link.search = location.search;
    link.hash = location.hash;
    link.addEventListener('click', () => {
      selected = true;
      rememberLanguage(link.hreflang);
    });
  }
  const language = savedLanguage() || await detectLanguage();
  if (!selected) location.replace(document.querySelector(`a[hreflang="${language}"]`).href);
} else {
  await import('./main.jsx');
}
