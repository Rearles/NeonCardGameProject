/*
 * Regression check for the battle-game board layout (fix: modernize-card-game).
 *
 * Bug it guards against: the in-play card slots (.enemyCardPlay / .playerCard) are
 * 320x420 and, when .game-board is position:static, they anchor to <body> and render
 * ON TOP of the "Attack!" button (.enemy-face) — so clicking Attack hit the card,
 * not the button, and the board looked "garbled". See game.component.css.
 *
 * This script logs in as the seeded `test` user, builds a 10-card deck, enters the
 * game, and asserts every action button is hit-testable (elementFromPoint at the
 * button center returns the button itself, not an overlapping card).
 *
 * Run (requires the app running on http://localhost:5001 and Google Chrome):
 *   npm i puppeteer-core           # not a project dependency; install ad hoc
 *   node verify-game/board-layout.check.js
 * Exit 0 = pass, 1 = fail.
 */
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL || 'http://localhost:5001';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu'], defaultViewport: { width: 1366, height: 900 } });
  const page = await browser.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => { localStorage.setItem('user', 'test'); localStorage.setItem('difficulty', 'Easy'); });
  await page.goto(BASE + '/deck', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);
  for (let i = 0; i < 10; i++) { const c = await page.$$('app-card'); if (!c.length) break; await c[0].click(); await sleep(250); }
  await sleep(2500);

  const result = await page.evaluate(() => {
    const check = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, ok: false, why: 'missing' };
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { sel, ok: hit === el || el.contains(hit), hit: hit && hit.tagName + '.' + hit.className };
    };
    return { url: location.href, buttons: ['.concede-button', '.end-turn', '.enemy-face'].map(check) };
  });
  await browser.close();

  const failures = result.buttons.filter(b => !b.ok);
  console.log(JSON.stringify(result, null, 2));
  if (result.url.endsWith('/game') && failures.length === 0) { console.log('PASS: all action buttons clickable'); process.exit(0); }
  console.error('FAIL: ' + JSON.stringify(failures));
  process.exit(1);
})().catch(e => { console.error('ERROR', e && e.stack || e); process.exit(1); });
