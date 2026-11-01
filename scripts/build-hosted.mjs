import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

// Vite client stays usable with Express; this adds a self-contained Worker for Sites.
const root = path.resolve('dist/client');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8' };
const assets = {};
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { await walk(filename); continue; }
    const data = await fs.readFile(filename);
    if (data.length > 5 * 1024 * 1024) throw new Error('Large videos need Node hosting / CDN. Sites demo embeds small assets only. Use npm run build:client for Node hosting.');
    assets[`/${path.relative(root, filename).split(path.sep).join('/')}`] = { data: data.toString('base64'), type: types[path.extname(filename)] || 'application/octet-stream' };
  }
}
await walk(root);
const source = (await fs.readFile('server/worker.js', 'utf8')).replace('__SWITCH_ASSETS__', JSON.stringify(assets));
await build({ stdin: { contents: source, resolveDir: path.resolve('server'), sourcefile: 'worker.js' }, bundle: true, format: 'esm', platform: 'browser', target: 'es2022', outfile: 'dist/server/index.js', minify: true });
console.log(`Built serverless entry with ${Object.keys(assets).length} embedded assets.`);
