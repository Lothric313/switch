export const socials = [
  { id: 'telegram', label: 'Telegram', url: 'https://t.me/switch_develop' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@switchwebdev' },
];

export const contactSocials = socials.map(social => social.id === 'telegram'
  ? { ...social, url: 'https://t.me/switchbuilder' }
  : social);
