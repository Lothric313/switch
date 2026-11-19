import { copy } from '../src/config/copy.js';
import { getServices } from '../src/config/services.js';

const languages = ['ru', 'en'];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function searchPages(env) {
  let base;
  const site = env.SITE_URL ? new URL(env.SITE_URL.replace(/\/?$/, '/')).href : null;
  const publicUrl = path => escape((site || base) + path);

  function render(html, language) {
    const t = copy[language || 'en'];
    const path = language ? language + '/' : '';
    const links = languages.map(lang =>
      `<a href="${escape(base)}${lang}/" hreflang="${lang}" lang="${lang}">${lang === 'ru' ? 'Русский' : 'English'}</a>`).join(' ');
    const head = [
      `<title>${escape(t.title)}</title>`,
      `<meta name="description" content="${escape(t.description)}">`,
      `<meta property="og:title" content="${escape(t.title)}">`,
      `<meta property="og:description" content="${escape(t.description)}">`,
      `<link rel="canonical" href="${publicUrl(path)}">`,
      ...languages.map(lang => `<link rel="alternate" hreflang="${lang}" href="${publicUrl(lang + '/')}">`),
      `<link rel="alternate" hreflang="x-default" href="${publicUrl('')}">`,
    ];
    for (const [name, token] of [['google-site-verification', env.GOOGLE_SITE_VERIFICATION], ['yandex-verification', env.YANDEX_VERIFICATION]]) {
      if (token) head.push(`<meta name="${name}" content="${escape(token)}">`);
    }
    const content = language
      ? `<h1>${escape(t.title)}</h1><p>${escape(t.description)}</p>
         <h2>${t.services}</h2><ul>${getServices(language).map(s => `<li>${escape(s.title)} — ${escape(s.priceLabel)}</li>`).join('')}</ul>
         <h2>${t.about.title}</h2><p>${escape(t.about.approach)}</p>`
      : '<h1>SWITCH</h1>';
    return html.replace('<html lang="en">', language ? `<html lang="${language}">` : '<html lang="en" data-language-entry>')
      .replace('<!--page-head-->', () => head.join('\n    '))
      .replace('<!--page-content-->', () => `<main class="entry-content">${content}<nav aria-label="Language">${links}</nav></main>`);
  }
  return {
    name: 'search-pages',
    enforce: 'post',
    configResolved(config) { base = config.base; },
    transformIndexHtml(html, ctx) {
      if (!ctx.server) return;
      const pathname = new URL(ctx.originalUrl || ctx.path, 'http://localhost').pathname;
      const lang = languages.find(lang => pathname.replace(/(?:\/index\.html|\/$)/, '').endsWith('/' + lang));
      return render(html, lang);
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html'];
        const template = index.source;
        index.source = render(template);
        for (const lang of languages) {
          this.emitFile({ type: 'asset', fileName: `${lang}/index.html`, source: render(template, lang) });
        }
        if (!site) return;
        const urls = ['', 'ru/', 'en/', 'privacy.html'].map(path => `  <url><loc>${publicUrl(path)}</loc></url>`);
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${site}sitemap.xml\n` });
      },
    },
  };
}
