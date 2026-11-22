import { Arrow, SocialIcon } from './Icons.jsx';
import { useLanguage } from './Language.jsx';
import { contactSocials } from '../config/socials.js';
import './Footer.css';

const operatorEmail = 'mail.t.shevcov@gmail.com';
const operatorTelegram = contactSocials.find(social => social.id === 'telegram').url;

export default function Footer({ inert }) {
  const { t } = useLanguage();
  const links = [
    { id: 'home', label: t.home },
    { id: 'works', label: t.works },
    { id: 'services', label: t.services },
    { id: 'contact', label: t.contact },
  ];

  return <footer className="studio-footer" aria-label="Switch Studio" inert={inert}>
    <div className="studio-footer-top container">
      <nav className="studio-footer-nav" aria-label={t.footerNav}>
        {links.map(link => <a key={link.id} href={`#${link.id}`}>{link.label}</a>)}
      </nav>
      <div className="studio-footer-details">
        <div className="studio-footer-socials">
          {contactSocials.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}>
            <SocialIcon id={social.id} />
          </a>)}
        </div>
        <span className="studio-footer-brand">© Switch Studio</span>
        <a className="studio-footer-privacy" href={`${import.meta.env.BASE_URL}privacy.html`} hrefLang="ru">{t.privacy}</a>
        <a className="studio-footer-back" href="#home">{t.backTop}<Arrow /></a>
      </div>
      <address className="studio-footer-operator">
        <div>{t.operator.name}</div>
        <div>{t.operator.taxId} 010707555363</div>
        <div><a href={`mailto:${operatorEmail}`}>{operatorEmail}</a> · <a href={operatorTelegram}>@switchbuilder</a></div>
      </address>
    </div>
    <div className="studio-footer-wordmark" aria-hidden="true">SWITCH</div>
  </footer>;
}
