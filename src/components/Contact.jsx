import { useRef, useState } from 'react';
import { getServices, serviceLabel } from '../config/services.js';
import { socials } from '../config/socials.js';
import { Arrow, SocialIcon } from './Icons.jsx';
import { CONTACT_PATTERN } from '../config/validation.js';
import { useLanguage } from './Language.jsx';
import Reveal from './Reveal.jsx';

export default function Contact({ selected, onSelect }) {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const f = t.form;
  const staticHosting = import.meta.env.VITE_STATIC_HOST === 'true';
  const [status, setStatus] = useState('idle');
  const [problem, setProblem] = useState('');
  const [errors, setErrors] = useState({});
  const startedAt = useRef(Date.now());
  const form = useRef(null);
  const submit = async event => {
    event.preventDefault();
    if (status === 'loading') return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const next = {};
    if (data.name.trim().length < 2) next.name = true;
    if (!CONTACT_PATTERN.test(data.contact.trim())) next.contact = true;
    setErrors(next);
    if (Object.keys(next).length) { form.current.elements[Object.keys(next)[0]].focus(); return; }
    if (staticHosting) { setStatus('error'); setProblem('unavailable'); return; }
    setStatus('loading');
    setProblem('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, service: selected, startedAt: startedAt.current, language }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        setProblem(response.status === 503 ? 'unavailable' : response.status === 429 ? 'rate' : response.status === 400 ? 'invalid' : 'delivery');
        setStatus('error'); return;
      }
      setStatus('success');
      for (const field of ['name', 'contact', 'comment', 'website']) form.current.elements[field].value = '';
      startedAt.current = Date.now();
    } catch { setStatus('error'); setProblem('network'); }
  };
  return <section id="contact" className="contact-section section-space container">
    <div className="contact-grid">
      <div className="contact-intro">
        <Reveal as="h2">{t.contactTitle}<span className="blue">↗</span></Reveal>
        <div className="social-links">{socials.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
          <SocialIcon id={social.id} /><span>{social.label}</span><Arrow />
        </a>)}</div>
      </div>
      <form ref={form} className="contact-form" onSubmit={submit} noValidate aria-label={f.label}>
        <div className="form-two">
          <div className="field">
            <label htmlFor="name">{f.name} <span>*</span></label>
            <input id="name" name="name" placeholder={f.namePlaceholder} autoComplete="name" required minLength={2} maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && <span id="name-error" className="field-error">{f.errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="contact-input">{f.contact} <span>*</span></label>
            <input id="contact-input" name="contact" placeholder={f.contactPlaceholder} autoComplete="tel" required maxLength={100} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'contact-error' : undefined} />
            {errors.contact && <span id="contact-error" className="field-error">{f.errors.contact}</span>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="project-type">{f.project}</label>
          <div className="select-wrap"><select id="project-type" name="service" value={selected} onChange={event => onSelect(event.target.value)}>{services.map(service => <option key={service.id} value={service.id}>{serviceLabel(service)}</option>)}</select><span aria-hidden="true">⌄</span></div>
        </div>
        <div className="field"><label htmlFor="comment">{f.comment}</label><textarea id="comment" name="comment" placeholder={f.commentPlaceholder} rows={3} maxLength={3000} /></div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">{f.website}</label><input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <button className="submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? f.sending : status === 'success' ? f.again : f.send}{status === 'loading' ? <span className="spinner" /> : <Arrow />}</button>
        <p className="form-message" role={status === 'error' ? 'alert' : 'status'} data-status={status}>{status === 'success' ? f.success : status === 'error' ? f.errors[problem] : ''}</p>
        <p className="form-note">{staticHosting ? f.errors.unavailable : f.note}</p>
      </form>
    </div>
  </section>;
}
