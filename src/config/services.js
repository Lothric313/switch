// Prices are shared by the interface AND server. null means an individual quote.
export const services = [
  { id: 'landing', title: 'Одностраничный лендинг', price: 5000, priceLabel: 'до 5 000 рублей', description: 'Знакомит посетителя с вашим продуктом или услугой, отвечает на главные вопросы и помогает оставить заявку. Подходит для запуска рекламы и продвижения одного предложения.', example: 'lapusik' },
  { id: 'website', title: 'Многостраничный сайт', price: 7500, priceLabel: 'до 7 500 рублей', description: 'Рассказывает о компании, её услугах и опыте на отдельных страницах. Помогает посетителям найти нужную информацию, сравнить предложения и связаться с вами.', example: 'elbrus' },
  { id: 'shop', title: 'Интернет-магазин', price: 15000, priceLabel: 'до 15 000 рублей', description: 'Позволяет покупателям изучать товары, выбирать нужные варианты и оформлять заказы на сайте. Собирает ассортимент в удобный каталог и упрощает путь от выбора до покупки.', example: 'lothric' },
  { id: 'custom', title: 'Индивидуальный проект', price: null, priceLabel: 'Стоимость уточняется', description: 'Воплощает вашу идею с нужными функциями и визуальной подачей. Подходит для задач, которым нужен особый сценарий взаимодействия, необычная анимация или собственная логика работы.', example: 'aura' },
];
const english = {
  landing: { title: 'Landing page', priceLabel: 'up to 5,000 ₽', description: 'Introduces your product or service, answers key questions and helps visitors send an inquiry. Suits advertising campaigns and promoting a single offer.' },
  website: { title: 'Multi-page website', priceLabel: 'up to 7,500 ₽', description: 'Presents your company, services and experience on dedicated pages. Helps visitors find information, compare offers and get in touch.' },
  shop: { title: 'Online store', priceLabel: 'up to 15,000 ₽', description: 'Lets customers explore products, choose options and place orders on your website. Organizes your range in a convenient catalog and makes buying easier.' },
  custom: { title: 'Custom project', priceLabel: 'Price on request', description: 'Brings your idea to life with the functions and visual style it needs. Suits projects with unique interactions, animation or business logic.' },
};
export const getServices = language => services.map(service => ({ ...service, ...(language === 'en' ? english[service.id] : {}), short: language === 'en' ? english[service.id].title : service.title }));
export const serviceLabel = service => `${service.title} — ${service.priceLabel}`;
