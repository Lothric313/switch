import { createContext, useContext, useEffect, useState } from 'react';
import { copy } from '../config/copy.js';

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('switch-language') === 'en' ? 'en' : 'ru'; }
    catch { return 'ru'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy[language].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy[language].description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy[language].title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy[language].description);
    try { localStorage.setItem('switch-language', language); } catch { /* Storage may be disabled. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: copy[language] }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
