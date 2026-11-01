// Place your own covers and videos in public/works/. Paths start with /works/.
export const works = [
  { id: 'aura', title: 'AURA ONE', category: 'Лендинг продукта', year: '2026', cover: '/works/aura-one-cover.jpg', video: '/works/project-01.mp4', description: 'Сайт о VR-гарнитуре: продукт, дизайн и характеристики.', demo: false, en: { category: 'Product landing page', description: 'A VR headset website: product, design and specifications.' } },
  { id: 'lapusik', title: 'ЛАПУСИК', category: 'Зоосалон', year: '2026', cover: '/works/lapusik-cover.jpg', video: '/works/project-02.mp4', description: 'Сайт зоосалона с услугами, ценами и записью.', demo: false, en: { title: 'LAPUSIK', category: 'Pet grooming', description: 'A pet grooming website with services, pricing and booking.' } },
  { id: 'lothric', title: 'LOTHRIC JEWELRY', category: 'Ювелирный магазин', year: '2026', cover: '/works/lothric-cover.jpg', video: '/works/lothric.mp4', description: 'Сайт ювелирного бренда с каталогом украшений.', demo: false, en: { category: 'Jewelry store', description: 'A jewelry brand website with a collection catalog.' } },
].map(work => ({
  ...work,
  cover: `${import.meta.env.BASE_URL}${work.cover.slice(1)}`,
  video: `${import.meta.env.BASE_URL}${work.video.slice(1)}`,
}));
export const localizeWork = (work, language) => language === 'en' ? { ...work, ...work.en } : work;
