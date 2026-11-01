// Prices are shared by the interface AND server. null means an individual quote.
export const services = [
  { id: 'landing', title: 'Одностраничный лэндинг', price: 2500, priceLabel: 'от 2 500 до 5 000 ₽', description: 'Знакомит посетителя с вашим продуктом или услугой, отвечает на главные вопросы и помогает оставить заявку. Подходит для запуска рекламы и продвижения одного предложения.', example: 'lapusik' },
  { id: 'website', title: 'Многостраничный сайт', price: 5000, priceLabel: 'от 5 000 до 7 500 ₽', description: 'Рассказывает о компании, её услугах и опыте на отдельных страницах. Помогает посетителям найти нужную информацию, сравнить предложения и связаться с вами.' },
  { id: 'shop', title: 'Интернет магазин', price: 10000, priceLabel: 'от 10 000 до 15 000 ₽', description: 'Позволяет покупателям изучать товары, выбирать нужные варианты и оформлять заказы на сайте. Собирает ассортимент в удобный каталог и упрощает путь от выбора до покупки.', example: 'lothric' },
  { id: 'custom', title: 'Индивидуальный проект', price: null, priceLabel: 'Стоимость уточняется', description: 'Воплощает вашу идею с нужными функциями и визуальной подачей. Подходит для задач, которым нужен особый сценарий взаимодействия, необычная анимация или собственная логика работы.', example: 'aura' },
];
const english = {
  landing: { title: 'Landing page', priceLabel: 'from 2,500 to 5,000 ₽', description: 'Introduces your product or service, answers key questions and helps visitors send an inquiry. Suits advertising campaigns and promoting a single offer.' },
  website: { title: 'Multi-page website', priceLabel: 'from 5,000 to 7,500 ₽', description: 'Presents your company, services and experience on dedicated pages. Helps visitors find information, compare offers and get in touch.' },
  shop: { title: 'Online store', priceLabel: 'from 10,000 to 15,000 ₽', description: 'Lets customers explore products, choose options and place orders on your website. Organizes your range in a convenient catalog and makes buying easier.' },
  custom: { title: 'Custom project', priceLabel: 'Price on request', description: 'Brings your idea to life with the functions and visual style it needs. Suits projects with unique interactions, animation or business logic.' },
};
export const getServices = language => services.map(service => ({ ...service, ...(language === 'en' ? english[service.id] : {}), short: language === 'en' ? english[service.id].title : service.title }));
export const serviceLabel = service => `${service.title} — ${service.priceLabel}`;
