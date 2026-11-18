import { useRef, useState } from 'react';
import { getServices, serviceLabel } from '../config/services.js';
import { socials } from '../config/socials.js';
import { Arrow, SocialIcon } from './Icons.jsx';
import { CONTACT_PATTERN } from '../config/validation.js';
import { sendInquiry } from '../config/web3forms.js';
import { useLanguage } from './Language.jsx';
import Reveal from './Reveal.jsx';

export default function Contact({ selected, onSelect }) {
  const { language, t } = useLanguage();
  const services = getServices(language);
  const f = t.form;
  const [status, setStatus] = useState('idle');
  const [problem, setProblem] = useState('');
  const [errors, setErrors] = useState({});
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
    setStatus('loading');
    setProblem('');
    try {
      const service = services.find(item => item.id === selected);
      if (!service) { setProblem('invalid'); setStatus('error'); return; }
      const response = await sendInquiry(data, service);
      if (!response.ok) {
        setProblem(response.status === 503 ? 'unavailable' : response.status === 429 ? 'rate' : response.status === 400 ? 'invalid' : 'delivery');
        setStatus('error'); return;
      }
      setStatus('success');
      for (const field of ['name', 'contact', 'comment', 'website']) form.current.elements[field].value = '';
    } catch { setStatus('error'); setProblem('network'); }
  };
  return <section id="contact" className="contact-section section-space" aria-labelledby="about-title">
    <div className="contact-grid container">
      <div className="contact-intro">
        <Reveal as="h2" id="about-title">{t.about.first} <span className="blue">{t.about.accent}.</span></Reveal>
        <Reveal className="about-rating" delay={80}>
          <div className="about-stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(star => <svg key={star} viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1z" />
            </svg>)}
          </div>
          <p className="about-score">{t.about.score}</p>
          <p className="about-rating-label">{t.about.rating}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="social-links">{socials.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
            <SocialIcon id={social.id} /><span>{social.label}</span><Arrow />
          </a>)}</div>
        </Reveal>
      </div>
      <Reveal delay={100} className="contact-form-wrap">
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
          <p className="form-note">{f.note}</p>
        </form>
      </Reveal>
    </div>
  </section>;
}
