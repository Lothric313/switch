import { copy } from '../config/copy.js';

export function useLanguage() {
  const language = document.documentElement.lang;
  return { language, t: copy[language] };
}
