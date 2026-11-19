import { useEffect, useState } from 'react';
import StaggeredMenu from './react-bits/StaggeredMenu/StaggeredMenu.jsx';
import { socials } from '../config/socials.js';
import { useLanguage } from './Language.jsx';
import { rememberLanguage } from '../config/language.js';

export default function Header({ onOpenChange }) {
  const { t, language } = useLanguage();
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
  const change = value => { window.dispatchEvent(new CustomEvent('switch-menu-change', { detail: value })); setOpen(value); onOpenChange(value); };
  return <>
    {open && <div className="menu-shade" aria-hidden="true" />}
    <StaggeredMenu isFixed logoUrl={`${import.meta.env.BASE_URL}logo.svg`} className={`switch-menu${pastHero ? ' is-past-hero' : ''}`} colors={['#143657', '#1e6fff']} menuButtonColor="#f7f8fa" openMenuButtonColor="#f7f8fa" accentColor="#5fd4ff"
      logoAfter={<span className={`header-wordmark${pastHero ? ' is-visible' : ''}`} aria-hidden="true">SWITCH STUDIO<span className="header-wordmark-dot">.</span></span>}
      items={[{ label: t.home, link: '#home' }, { label: t.works, link: '#works' }, { label: t.services, link: '#services' }, { label: t.contact, link: '#contact' }]}
      labels={t.menu}
      panelFooter={<nav className="language-switch" aria-label={t.menu.language}>{['ru', 'en'].map(lang => <a key={lang}
        href={`${import.meta.env.BASE_URL}${lang}/${location.search}${location.hash}`} lang={lang} hrefLang={lang}
        aria-current={language === lang ? 'page' : undefined} onClick={() => rememberLanguage(lang)}>{lang.toUpperCase()}</a>)}</nav>}
      socialItems={socials.map(s => ({ label: s.label, link: s.url }))}
      onMenuOpen={() => change(true)} onMenuClose={() => change(false)} />
  </>;
}
