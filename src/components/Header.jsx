import { useEffect, useState } from 'react';
import StaggeredMenu from './react-bits/StaggeredMenu/StaggeredMenu.jsx';
import { socials } from '../config/socials.js';
import { useLanguage } from './Language.jsx';

export default function Header({ onOpenChange }) {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  const change = value => { setOpen(value); onOpenChange(value); };
  return <>
    {open && <div className="menu-shade" aria-hidden="true" />}
    <StaggeredMenu isFixed logoUrl={`${import.meta.env.BASE_URL}logo.svg`} className="switch-menu" colors={['#143657', '#1e6fff']} menuButtonColor="#f7f8fa" openMenuButtonColor="#f7f8fa" accentColor="#5fd4ff"
      logoAfter={<span className={`header-wordmark${pastHero ? ' is-visible' : ''}`} aria-hidden="true">SWITCH</span>}
      items={[{ label: t.home, link: '#home' }, { label: t.works, link: '#works' }, { label: t.services, link: '#services' }, { label: t.contact, link: '#contact' }]}
      labels={t.menu}
      panelFooter={<div className="language-switch" role="group" aria-label={t.menu.language}>{['ru', 'en'].map(lang => <button key={lang} type="button" lang={lang} aria-pressed={language === lang} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}</div>}
      socialItems={socials.map(s => ({ label: s.label, link: s.url }))}
      onMenuOpen={() => change(true)} onMenuClose={() => change(false)} />
  </>;
}
