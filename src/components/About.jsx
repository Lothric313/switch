import { socials } from '../config/socials.js';
import { Arrow, SocialIcon } from './Icons.jsx';
import { useLanguage } from './Language.jsx';
import Reveal from './Reveal.jsx';

export default function About() {
  const { t } = useLanguage();
  return <section id="contact" className="about-section section-space" aria-labelledby="about-title">
    <div className="container">
      <div className="section-heading">
        <Reveal as="h2" id="about-title">{t.about.title}<span className="blue">.</span></Reveal>
      </div>
      <Reveal className="about-rating" delay={80}>
        <div className="about-score-group">
          <div className="about-stars" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(star => <svg key={star} viewBox="2 2 20 19.1" fill="currentColor">
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1z" />
            </svg>)}
          </div>
          <p>{t.about.score}</p>
        </div>
        <p>{t.about.rating}</p>
      </Reveal>
      <Reveal className="social-links" delay={120}>
        {socials.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer">
          <SocialIcon id={social.id} /><span>{social.label}</span><Arrow />
        </a>)}
      </Reveal>
    </div>
  </section>;
}
