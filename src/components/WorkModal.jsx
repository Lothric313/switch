import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from './Language.jsx';
import { localizeWork } from '../config/works.js';

export default function WorkModal({ selection, onClose }) {
  const { language, t } = useLanguage();
  const { rect } = selection;
  const work = localizeWork(selection.work, language);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const video = useRef(null);
  const closing = useRef(false);
  const [failed, setFailed] = useState(false);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const origin = () => {
    if (!rect || !panel.current) return { opacity: 0, transform: 'translateY(18px) scale(.97)' };
    const target = panel.current.getBoundingClientRect();
    return { opacity: .15, transform: `translate(${rect.x + rect.width / 2 - target.x - target.width / 2}px, ${rect.y + rect.height / 2 - target.y - target.height / 2}px) scale(${Math.min(rect.width / target.width, .9)})` };
  };
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    video.current?.pause();
    if (reduced) { onClose(); return; }
    const animation = panel.current.animate([{ opacity: 1, transform: 'none' }, origin()], { duration: 240, easing: 'ease-in', fill: 'forwards' });
    animation.finished.then(onClose).catch(onClose);
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  useLayoutEffect(() => {
    const previous = document.activeElement;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!reduced) panel.current.animate([origin(), { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    closeButton.current.focus();
    const key = event => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const nodes = [...panel.current.querySelectorAll('button, a[href], video[controls], [tabindex="0"]')];
        const first = nodes[0], last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = scroll; document.removeEventListener('keydown', key); previous?.focus?.({ preventScroll: true }); };
  }, []);
  return createPortal(<div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div ref={panel} className="work-modal" role="dialog" aria-modal="true" aria-labelledby="project-title">
      <button ref={closeButton} onClick={close} className="modal-close" aria-label={t.modal.close}>✕</button>
      {work.video && !failed ? <video ref={video} src={work.video} poster={work.cover} autoPlay muted controls playsInline preload="none" onError={() => setFailed(true)} aria-label={`${t.modal.video}: ${work.title}`} /> : <div className="project-poster"><img src={work.cover} alt={`${t.modal.cover}: ${work.title}`} /><span>{failed ? t.modal.unavailable : t.modal.soon}</span></div>}
      <div className="modal-description"><h2 id="project-title">{work.title}</h2></div>
    </div>
  </div>, document.body);
}
