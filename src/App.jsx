import { useLayoutEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Works from './components/Works.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import WorkModal from './components/WorkModal.jsx';
import Footer from './components/Footer.jsx';
import CookieNotice from './components/CookieNotice.jsx';
import { Arrow } from './components/Icons.jsx';
import { useLanguage } from './components/Language.jsx';
import Reveal from './components/Reveal.jsx';

const acceptedCookie = 'switch-cookie-notice=accepted';

export default function App() {
  const { t } = useLanguage();
  const heroContent = useRef(null);
  useLayoutEffect(() => {
    const heading = heroContent.current.querySelector('h1');
    const word = heading.querySelector('span');
    let active = true;
    const fit = () => {
      if (!active) return;
      heading.style.removeProperty('--hero-fit');
      if (!window.matchMedia('(max-width: 700px)').matches) return;
      const available = Math.max(0, heroContent.current.clientWidth - 40);
      const width = word.getBoundingClientRect().width;
      if (width > available && available > 0) {
        heading.style.setProperty('--hero-fit', (parseFloat(getComputedStyle(heading).fontSize) * available / width) + 'px');
      }
    };
    fit();
    window.addEventListener('resize', fit);
    document.fonts?.addEventListener('loadingdone', fit);
    document.fonts?.ready.then(fit);
    return () => {
      active = false;
      window.removeEventListener('resize', fit);
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, []);
  const [selection, setSelection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    return document.cookie.split(';').some(cookie => cookie.trim() === acceptedCookie);
  });
  const blocked = menuOpen || !!selection;

  function updateCookieChoice(accepted) {
    const maxAge = accepted ? 31536000 : 0;
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${acceptedCookie}; Max-Age=${maxAge}; Path=${import.meta.env.BASE_URL}; SameSite=Lax${secure}`;
    setCookiesAccepted(accepted);
  }

  return <>
    <a className="skip-link" href="#works">{t.skip}</a>
    <div inert={selection ? true : undefined}><Header onOpenChange={setMenuOpen} /></div>
    <main inert={blocked ? true : undefined}>
      <section id="home" className="hero">
        <div className="hero-light" aria-hidden="true" />
        <div ref={heroContent} className="hero-content">
          <Reveal as="h1"><span>SWITCH</span></Reveal>
          <Reveal as="p" className="hero-studio-label" delay={120}>{t.hero.studioLabel}</Reveal>
        </div>
        <div className="hero-bottom"><a href="#works" className="scroll-cue" aria-label={t.hero.scroll}><Arrow direction="down" /></a></div>
      </section>
      <Works onSelect={setSelection} />
      <Services />
      <About />
    </main>
    <Footer inert={blocked ? true : undefined} onRevokeCookies={() => updateCookieChoice(false)} />
    {!cookiesAccepted && !blocked && <CookieNotice onAccept={() => updateCookieChoice(true)} />}
    {selection && <WorkModal selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
