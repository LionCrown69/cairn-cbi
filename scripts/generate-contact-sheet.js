const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function generateContactSheet() {
  const routes = ['story', 'console', 'method', 'dispatch', 'timeline', 'login'];
  const viewports = ['1440px', '820px', '390px'];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CAIRN — Before vs After Simplification Contact Sheet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f17; color: #f3f4f6; margin: 0; padding: 40px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #f97316; }
    p.subtitle { color: #9ca3af; margin-bottom: 32px; font-size: 15px; }
    .page-section { margin-bottom: 60px; background: #131926; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.08); }
    .page-title { font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
    .viewport-group { margin-bottom: 28px; }
    .viewport-label { font-size: 14px; font-weight: 600; color: #e5e7eb; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .badge { font-size: 11px; padding: 2px 8px; background: rgba(56,189,248,0.2); color: #38bdf8; border-radius: 12px; }
    .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { background: #1a2234; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
    .card-header { padding: 10px 16px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-header.before { background: rgba(239, 68, 68, 0.15); color: #f87171; border-bottom: 1px solid rgba(239, 68, 68, 0.3); }
    .card-header.after { background: rgba(34, 197, 94, 0.15); color: #4ade80; border-bottom: 1px solid rgba(34, 197, 94, 0.3); }
    .img-container { width: 100%; max-height: 480px; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; background: #000; }
    .img-container img { width: 100%; height: auto; object-fit: contain; }
  </style>
</head>
<body>
  <h1>CAIRN — Before vs After Simplification Contact Sheet</h1>
  <p class="subtitle">Radical simplification: iOS-inspired design language, 3-level progressive disclosure, unified capability badges, and 21st.dev / Radix building blocks.</p>
`;

  for (const route of routes) {
    html += `
  <div class="page-section">
    <div class="page-title">Page: /${route === 'story' ? '' : route}</div>`;

    for (const vp of viewports) {
      const beforeImg = `before/${route}_${vp}.png`;
      const afterImg = `after/${route}_${vp}.png`;

      html += `
    <div class="viewport-group">
      <div class="viewport-label">Viewport: ${vp} <span class="badge">Side-by-Side</span></div>
      <div class="comparison-grid">
        <div class="card">
          <div class="card-header before">Before (Overloaded / Baseline)</div>
          <div class="img-container">
            <img src="${beforeImg}" alt="Before ${route} at ${vp}" />
          </div>
        </div>
        <div class="card">
          <div class="card-header after">After (Radically Simplified / iOS-Style)</div>
          <div class="img-container">
            <img src="${afterImg}" alt="After ${route} at ${vp}" />
          </div>
        </div>
      </div>
    </div>`;
    }

    html += `  </div>`;
  }

  html += `
</body>
</html>`;

  const htmlPath = path.join(__dirname, '../docs/simplify/contact-sheet.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`Generated HTML contact sheet at: ${htmlPath}`);

  // Now capture screenshot of contact sheet with Playwright
  console.log('Rendering and capturing contact sheet image...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  
  const contactSheetPng = path.join(__dirname, '../docs/simplify/contact-sheet.png');
  await page.screenshot({ path: contactSheetPng, fullPage: true });
  console.log(`Saved full contact sheet image to: ${contactSheetPng}`);

  await browser.close();
}

generateContactSheet().catch(console.error);
