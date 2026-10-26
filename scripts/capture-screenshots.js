const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_FOLDER = process.argv[2] || 'before';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'simplify', TARGET_FOLDER);

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
];

const ROUTES = [
  { path: '/', name: 'story' },
  { path: '/console', name: 'console' },
  { path: '/method', name: 'method' },
  { path: '/timeline', name: 'timeline' },
  { path: '/dispatch', name: 'dispatch' },
  { path: '/login', name: 'login' },
];

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Starting screenshot capture into docs/simplify/${TARGET_FOLDER}...`);
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `http://localhost:3000${route.path}`;
      try {
        console.log(`Capturing ${route.name} at ${vp.width}px...`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1500); // Allow WebGL/animations to settle

        const filename = `${route.name}_${vp.width}px.png`;
        const filePath = path.join(OUTPUT_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(` Saved ${filename}`);
      } catch (err) {
        console.error(`Failed to capture ${route.name} at ${vp.width}px:`, err.message);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log(`All screenshots captured in docs/simplify/${TARGET_FOLDER}!`);
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
