import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const app = createApp();
const isDev = process.argv.includes('--dev');
let vite;
if (isDev) {
  const { createServer } = await import('vite');
  vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const dist = fileURLToPath(new URL('../dist/client', import.meta.url));
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.get('/{*path}', (req, res) => res.sendFile(`${dist}/index.html`));
}
const port = Number(process.env.PORT || 5173);
const server = app.listen(port, process.env.HOST || (isDev ? '127.0.0.1' : '0.0.0.0'), () => console.log(`SWITCH is ready: http://localhost:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await vite?.close(); server.close(() => process.exit(0)); });
