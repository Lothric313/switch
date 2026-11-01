import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { works, localizeWork } from '../config/works.js';
import { useLanguage } from './Language.jsx';
import Reveal from './Reveal.jsx';
const FlexCarousel = lazy(() => import('./react-bits/FlexCarousel/FlexCarousel.jsx'));

export default function Works({ onSelect }) {
  const { language, t } = useLanguage();
  const items = works.map(work => { const localized = localizeWork(work, language); return { src: work.cover, title: localized.title, alt: localized.title }; });
  const section = useRef(null);
  const carousel = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '350px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const open = (index, item, rect) => onSelect({ work: works[index], rect });
  return <section id="works" ref={section} className="works-section section-space">
    <div className="section-heading container"><Reveal as="h2">{t.works}<span className="blue">.</span></Reveal></div>
    <div className="carousel-wrap" ref={carousel}>
      {ready && <Suspense fallback={<div className="carousel-loading">{t.carousel.loading}</div>}><FlexCarousel items={items} preset="liquid" intro="none" autoScrollSpeed={50} cardHeight={.66} verticalOverflow={.16} gap={22} radius={10} fit="natural" lensWidth={.86} lensHeight={.88} tilt={62} bend={.24} reach={.45} curl="twist" dispersion={.12} squeeze={0} liquid={0} followCursor={false} captureWheel={false} wheelEnabled={false} dragMomentum={false} ariaLabel={t.carousel.label} countSeparator={t.carousel.of} focusOnClick={false} captions={false} onSelect={open} /></Suspense>}
    </div>
  </section>;
}
