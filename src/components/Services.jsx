import { useRef, useState } from 'react';
import { getServices } from '../config/services.js';
import { Arrow } from './Icons.jsx';
import { useLanguage } from './Language.jsx';
import Reveal from './Reveal.jsx';
import ServiceSheet from './ServiceSheet.jsx';
import './Services.css';

export default function Services({ selected, onSelect }) {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const [open, setOpen] = useState(true);
  const [sheet, setSheet] = useState(null);
  const papers = useRef(new Map());
  const toggleFolder = () => { setSheet(null); setOpen(value => !value); };
  const choose = (item, event) => {
    onSelect(item.id);
    setOpen(true);
    setSheet({ id: item.id, trigger: event.currentTarget });
  };
  return <section id="services" className="services-section section-space container">
    <div className="section-heading"><Reveal as="h2">{t.services}<span className="blue">.</span></Reveal></div>
    <div className="services-layout">
      <div className="folder-showcase service-folder-showcase">
        <div className={`service-folder ${open ? 'is-open' : ''}`}>
          <div className="service-folder-back" aria-hidden="true" />
          <div className="service-folder-papers" inert={!open || sheet ? true : undefined}>
            {services.map((item, index) => <button key={item.id} ref={node => { if (node) papers.current.set(item.id, node); else papers.current.delete(item.id); }}
              className={`service-folder-paper ${sheet?.id === item.id ? 'is-lifted' : ''}`} style={{ '--paper-index': index }}
              aria-expanded={sheet?.id === item.id} aria-controls="service-sheet" onClick={event => choose(item, event)}>
              <span className="service-paper-index" aria-hidden="true">{index + 1}</span>
              <strong>{item.title}</strong><span className="service-paper-fold" aria-hidden="true" />
            </button>)}
          </div>
          <button className="service-folder-cover" aria-expanded={open} aria-label={t.folder.aria} onClick={toggleFolder}>
            <span className="service-folder-cover-outside">SWITCH<span>{t.services}</span></span>
            <span className="service-folder-cover-inside" aria-hidden="true"><svg className="service-folder-watermark" viewBox="-2 -2 104 104" preserveAspectRatio="none" focusable="false"><text x="0" y="100" fontSize="137" fontWeight="700" textLength="100" lengthAdjust="spacingAndGlyphs" transform="translate(0 100) rotate(-90)" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" paintOrder="stroke fill">SWITCH</text></svg></span>
          </button>
        </div>
        {sheet && <ServiceSheet key={sheet.id} service={services.find(item => item.id === sheet.id)} number={services.findIndex(item => item.id === sheet.id) + 1} getOrigin={() => papers.current.get(sheet.id)} onClose={() => {
          setSheet(null); setOpen(true);
          requestAnimationFrame(() => sheet.trigger?.focus({ preventScroll: true }));
        }} />}
      </div>
      <div className="service-list" role="group" aria-label={t.folder.group}>
        {services.map(item => <button key={item.id} className={`service-row ${selected === item.id ? 'selected' : ''}`} aria-pressed={selected === item.id} aria-expanded={sheet?.id === item.id} aria-controls="service-sheet" onClick={event => choose(item, event)}>
          <span className="service-name"><span className="service-title">{item.title}</span><small>{item.priceLabel}</small></span>
        </button>)}
        <a className="text-link" href="#contact">{t.folder.discuss} <Arrow /></a>
      </div>
    </div>
  </section>;
}
