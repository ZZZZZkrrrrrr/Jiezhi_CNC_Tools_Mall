import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4173';
const routes = (process.env.ROUTES || '/').split(',').map(x => x.trim()).filter(Boolean);
const viewports = [
  { name: 'reference', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
];
const outDir = path.resolve('reference/diffs/current');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts?.ready);
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
    await page.screenshot({ path: path.join(outDir, `${slug}-${vp.name}.png`), fullPage: true });
  }
  await context.close();
}
await browser.close();
console.log(`Screenshots written to ${outDir}`);
