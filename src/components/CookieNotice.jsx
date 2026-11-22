import { useState } from 'react';
import { useLanguage } from './Language.jsx';
import './CookieNotice.css';

const acceptedCookie = 'switch-cookie-notice=accepted';

export default function CookieNotice({ hidden }) {
  const { t } = useLanguage();
  const [accepted, setAccepted] = useState(() => document.cookie.split(';').some(cookie => cookie.trim() === acceptedCookie));

  if (accepted || hidden) return null;

  function accept() {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${acceptedCookie}; Max-Age=31536000; Path=${import.meta.env.BASE_URL}; SameSite=Lax${secure}`;
    setAccepted(true);
  }

  return <aside className="cookie-notice" aria-labelledby="cookie-notice-text">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.5a9 9 0 1 1-9.5-9.5 4 4 0 0 0 4 4 4 4 0 0 0 5.5 5.5Z" />
      <path d="M8.5 8.5h.01M7.5 14h.01M12 12h.01M12 17h.01M16.5 15.5h.01" strokeWidth="2.5" />
    </svg>
    <span id="cookie-notice-text">{t.cookie.notice}</span>
    <button type="button" onClick={accept}>{t.cookie.accept}</button>
  </aside>;
}
