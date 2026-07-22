import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const targetUrl = process.argv[2] || 'https://modao.cc/ai/share/project/6a5ee1fe75d0275ef6b40be0';
const outDir = path.resolve(process.argv[3] || 'reference');
const viewport = { width: Number(process.env.VIEWPORT_W || 390), height: Number(process.env.VIEWPORT_H || 844) };

await fs.mkdir(path.join(outDir, 'screenshots'), { recursive: true });
await fs.mkdir(path.join(outDir, 'network'), { recursive: true });
await fs.mkdir(path.join(outDir, 'manifests'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  locale: 'zh-CN',
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/135 Mobile Safari/537.36',
});
const page = await context.newPage();

const consoleLog = [];
const networkLog = [];
page.on('console', msg => consoleLog.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', err => consoleLog.push({ type: 'pageerror', text: String(err) }));
page.on('response', async response => {
  const headers = await response.allHeaders().catch(() => ({}));
  const contentType = headers['content-type'] || '';
  const item = {
    url: response.url(),
    status: response.status(),
    method: response.request().method(),
    resourceType: response.request().resourceType(),
    contentType,
  };
  networkLog.push(item);
  if (/application\/json|text\/json/.test(contentType)) {
    try {
      const body = await response.text();
      const hash = crypto.createHash('sha1').update(response.url()).digest('hex').slice(0, 12);
      await fs.writeFile(path.join(outDir, 'network', `${hash}.json.txt`), body);
    } catch {}
  }
});

await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(10000);

const title = await page.title();
const url = page.url();
const html = await page.content();
const visibleText = await page.locator('body').innerText().catch(() => '');
const storage = await page.evaluate(async () => {
  const local = Object.fromEntries(Object.entries(localStorage));
  const session = Object.fromEntries(Object.entries(sessionStorage));
  const indexedDBs = typeof indexedDB.databases === 'function' ? await indexedDB.databases() : [];
  return { local, session, indexedDBs };
});

const interactives = await page.locator('a,button,input,select,textarea,[role="button"],[role="tab"],[onclick],[tabindex]').evaluateAll(nodes =>
  nodes.map((el, index) => {
    const r = el.getBoundingClientRect();
    return {
      index,
      tag: el.tagName,
      role: el.getAttribute('role'),
      text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 160),
      href: el.getAttribute('href'),
      testId: el.getAttribute('data-testid'),
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      visible: r.width > 0 && r.height > 0,
    };
  }).filter(x => x.visible)
).catch(() => []);

const canvases = await page.locator('canvas').evaluateAll(nodes => nodes.map((el, index) => {
  const r = el.getBoundingClientRect();
  return { index, width: el.width, height: el.height, rect: { x: r.x, y: r.y, width: r.width, height: r.height } };
})).catch(() => []);

await page.screenshot({ path: path.join(outDir, 'screenshots', 'initial-viewport.png'), fullPage: false });
await page.screenshot({ path: path.join(outDir, 'screenshots', 'initial-fullpage.png'), fullPage: true });
await fs.writeFile(path.join(outDir, 'manifests', 'initial.html'), html);
await fs.writeFile(path.join(outDir, 'manifests', 'visible-text.txt'), visibleText);
await fs.writeFile(path.join(outDir, 'manifests', 'console.json'), JSON.stringify(consoleLog, null, 2));
await fs.writeFile(path.join(outDir, 'manifests', 'network.json'), JSON.stringify(networkLog, null, 2));
await fs.writeFile(path.join(outDir, 'manifests', 'initial-state.json'), JSON.stringify({ targetUrl, url, title, viewport, storage, interactives, canvases }, null, 2));

console.log(JSON.stringify({ title, url, interactives: interactives.length, canvases: canvases.length, networkResponses: networkLog.length }, null, 2));
await browser.close();
