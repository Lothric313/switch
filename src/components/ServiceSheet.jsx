import { useLayoutEffect, useRef, useState } from 'react';
import { localizeWork, works } from '../config/works.js';
import { useLanguage } from './Language.jsx';

export default function ServiceSheet({ service, number, getOrigin, onClose }) {
  const { language, t } = useLanguage();
  const paper = useRef(null);
  const motion = useRef(null);
  const corner = useRef(null);
  const video = useRef(null);
  const animation = useRef(null);
  const flip = useRef(null);
  const back = useRef(null);
  const foldAnimation = useRef(null);
  const faceFrame = useRef(0);
  const rotation = useRef({ from: 180, to: 180 });
  const closing = useRef(false);
  const drag = useRef(null);
  const dragged = useRef(false);
  const [failed, setFailed] = useState(false);
  const example = works.find(work => work.id === service.example);
  const work = example && localizeWork(example, language);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentAngle = () => {
    const progress = flip.current?.effect.getComputedTiming().progress;
    return typeof progress === 'number' ? rotation.current.from + (rotation.current.to - rotation.current.from) * progress : rotation.current.to;
  };
  const turnTo = (to, timing, from = currentAngle()) => {
    cancelAnimationFrame(faceFrame.current);
    flip.current?.cancel();
    rotation.current = { from, to };
    const showFace = angle => paper.current?.classList.toggle('shows-front', Math.cos(angle * Math.PI / 180) >= 0);
    showFace(from);
    flip.current = paper.current.animate([{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }], timing);
    const syncFace = () => {
      showFace(currentAngle());
      if (flip.current?.playState === 'running') faceFrame.current = requestAnimationFrame(syncFace);
    };
    faceFrame.current = requestAnimationFrame(syncFace);
  };

  // Change the paper's dimensions, never scale its text on separate axes.
  // Both directions share the live catalog position and the same central pivot.
  const originFrame = () => {
    const source = getOrigin();
    if (!source) return { width: getComputedStyle(motion.current).width, height: getComputedStyle(motion.current).height, transform: 'none' };
    const sourceRect = source.getBoundingClientRect();
    const stage = motion.current.parentElement.getBoundingClientRect();
    const sourceStyle = getComputedStyle(source);
    const angle = sourceStyle.getPropertyValue('--paper-turn').trim() || '0deg';
    return {
      width: sourceStyle.width,
      height: sourceStyle.height,
      transform: `translate(${sourceRect.x + sourceRect.width / 2 - stage.x - stage.width / 2}px, ${sourceRect.y + sourceRect.height / 2 - stage.y - stage.height / 2}px) rotate(${angle})`,
    };
  };

  const dismiss = (afterClose = null) => {
    if (closing.current) return;
    closing.current = true;
    video.current?.pause();
    const finish = () => { onClose(); if (afterClose) requestAnimationFrame(afterClose); };
    if (reduced()) { finish(); return; }
    const motionStyle = getComputedStyle(motion.current);
    const current = { width: motionStyle.width, height: motionStyle.height, transform: motionStyle.transform };
    const angle = currentAngle();
    const fold = getComputedStyle(back.current).getPropertyValue('--fold-size');
    animation.current?.cancel();
    const target = originFrame();
    paper.current.classList.add('is-returning');
    paper.current.classList.remove('is-dragging');
    const timing = { duration: 640, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' };
    // Keep the information side full size until the turn reveals the title side.
    const hold = angle > 90 ? Math.min(.9, (angle - 90) / angle + .02) : 0;
    animation.current = motion.current.animate([
      { ...current, offset: 0 },
      ...(hold ? [{ ...current, offset: hold }] : []),
      { ...target, offset: 1 },
    ], timing);
    turnTo(0, timing, angle);
    foldAnimation.current = back.current.animate([{ '--fold-size': fold }, { '--fold-size': '15px' }], timing);
    animation.current.finished.then(finish).catch(() => {});
  };

  useLayoutEffect(() => {
    if (!reduced()) {
      const timing = { duration: 720, easing: 'cubic-bezier(.4,0,.2,1)' };
      const motionStyle = getComputedStyle(motion.current);
      const full = { width: motionStyle.width, height: motionStyle.height, transform: 'none' };
      animation.current = motion.current.animate([
        { ...originFrame(), offset: 0 },
        { ...full, offset: .48 },
        { ...full, offset: 1 },
      ], timing);
      turnTo(180, timing, 0);
      flip.current.finished.then(() => { if (!closing.current) corner.current?.focus({ preventScroll: true }); }).catch(() => {});
    }
    corner.current.focus({ preventScroll: true });
    return () => { cancelAnimationFrame(faceFrame.current); animation.current?.cancel(); flip.current?.cancel(); foldAnimation.current?.cancel(); };
  }, []);

  const resetFold = () => {
    paper.current.classList.remove('is-dragging');
    back.current.style.removeProperty('--fold-size');
  };
  const release = event => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    dragged.current = current.distance > 6;
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.down > 85) dismiss();
    else resetFold();
  };

  return <div className="service-sheet-place">
    <div ref={motion} className="service-sheet-motion">
    <article ref={paper} id="service-sheet" className="service-sheet" aria-labelledby="service-sheet-title" onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
    }}>
      <div className="service-sheet-front" aria-hidden="true"><span className="service-sheet-front-number">{number}</span><strong>{service.title}</strong><span className="service-sheet-front-fold" /></div>
      <div ref={back} className="service-sheet-back">
      <div className="service-sheet-content">
        <header className="service-sheet-header"><h3 id="service-sheet-title">{service.title}</h3><span className="service-sheet-price">{service.priceLabel}</span></header>
        <p className="service-sheet-description">{service.description}</p>
        {work && <div className="service-sheet-example" onContextMenu={event => event.preventDefault()}>
          {!failed ? <video ref={video} src={work.video} poster={work.cover} autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback controlsList="nodownload nofullscreen noremoteplayback" tabIndex={-1} preload="metadata" onError={() => setFailed(true)} aria-label={`${t.modal.video}: ${work.title}`} /> : <div className="service-sheet-poster"><img src={work.cover} alt={work.title} /><span>{t.modal.unavailable}</span></div>}
        </div>}
        <a className="service-sheet-contact" href="#contact" onClick={event => {
          event.preventDefault();
          dismiss(() => document.getElementById('contact')?.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth' }));
        }}>{t.folder.discuss}</a>
      </div>
      <button ref={corner} className="service-sheet-corner" aria-label={t.folder.return} title={t.folder.return}
        onClick={event => { if (dragged.current && event.detail !== 0) { dragged.current = false; return; } dismiss(); }}
        onPointerDown={event => {
          if (event.button !== 0 || closing.current) return;
          animation.current?.cancel();
          cancelAnimationFrame(faceFrame.current);
          flip.current?.cancel();
          rotation.current = { from: 180, to: 180 };
          paper.current.classList.remove('shows-front');
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, down: 0, distance: 0 };
          paper.current.classList.add('is-dragging');
        }}
        onPointerMove={event => {
          const current = drag.current;
          if (!current || current.pointerId !== event.pointerId) return;
          current.down = Math.max(0, event.clientY - current.startY);
          current.distance = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);
          const fold = Math.min(Math.min(back.current.offsetWidth, back.current.offsetHeight) * .65, 36 + current.down * 1.1);
          back.current.style.setProperty('--fold-size', `${fold}px`);
        }}
        onPointerUp={release}
        onPointerCancel={event => {
          if (!drag.current) return;
          dragged.current = true; drag.current = null; resetFold();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}><span aria-hidden="true" /></button>
      </div>
    </article>
    </div>
  </div>;
}
