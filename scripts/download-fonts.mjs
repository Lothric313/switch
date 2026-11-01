import fs from 'node:fs/promises';
await fs.mkdir('public/fonts', { recursive: true });
for (const [name, url] of [
  ['manrope-latin.woff2', 'https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2'],
  ['manrope-cyrillic.woff2', 'https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggOxSuXd.woff2'],
  ['OFL.txt', 'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt'],
]) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download failed: ${name}`);
  await fs.writeFile(`public/fonts/${name}`, Buffer.from(await response.arrayBuffer()));
}
console.log('Manrope font and license saved locally.');
