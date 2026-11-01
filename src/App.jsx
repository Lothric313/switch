import { useState } from 'react';
import Header from './components/Header.jsx';
import HeroLight from './components/HeroLight.jsx';
import Works from './components/Works.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';
import WorkModal from './components/WorkModal.jsx';
import Footer from './components/Footer.jsx';
import { Arrow } from './components/Icons.jsx';
import { useLanguage } from './components/Language.jsx';
import Reveal from './components/Reveal.jsx';

export default function App() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState('landing');
  const [selection, setSelection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const blocked = menuOpen || !!selection;
  return <>
    <a className="skip-link" href="#works">{t.skip}</a>
    <div inert={selection ? true : undefined}><Header onOpenChange={setMenuOpen} /></div>
    <main inert={blocked ? true : undefined}>
      <section id="home" className="hero">
        <HeroLight />
        <div className="hero-content">
          <Reveal as="h1">SWITCH</Reveal>
          <Reveal as="p" className="hero-studio-label" delay={120}>WEB DEVELOPMENT СТУДИЯ</Reveal>
        </div>
        <div className="hero-bottom"><a href="#works" className="scroll-cue" aria-label={t.hero.scroll}><Arrow direction="down" /></a></div>
      </section>
      <Works onSelect={setSelection} />
      <Services selected={selected} onSelect={setSelected} />
      <Contact selected={selected} onSelect={setSelected} />
    </main>
    <Footer inert={blocked ? true : undefined} />
    {selection && <WorkModal selection={selection} onClose={() => setSelection(null)} />}
  </>;
}
