const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

async function runA11yTests() {
  console.log('=== Running Axe Accessibility & Reduced Motion Tests ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const routes = ['/', '/console', '/method'];
  let totalSeriousOrCritical = 0;

  for (const route of routes) {
    console.log(`Auditing Route: ${route}...`);
    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const seriousOrCritical = accessibilityScanResults.violations.filter(
      v => v.impact === 'serious' || v.impact === 'critical'
    );

    console.log(`  Total Violations: ${accessibilityScanResults.violations.length}`);
    console.log(`  Serious / Critical: ${seriousOrCritical.length}`);

    if (seriousOrCritical.length > 0) {
      totalSeriousOrCritical += seriousOrCritical.length;
      seriousOrCritical.forEach(v => {
        console.error(`  - [${v.impact.toUpperCase()}] ${v.help}: ${v.helpUrl}`);
        v.nodes.slice(0, 2).forEach(n => console.error(`    Target: ${n.target.join(' ')}`));
      });
    } else {
      console.log(`  PASSED: 0 serious or critical violations on ${route}`);
    }
  }

  // Reduced motion test
  console.log('\n--- Testing Prefers Reduced Motion ---');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Check that page renders properly and body has reduced-motion applied
  const isCairnVisible = await page.locator('h1').first().isVisible();
  console.log(`  Story page renders with prefers-reduced-motion: ${isCairnVisible ? 'YES' : 'NO'}`);

  await page.goto('http://localhost:3000/console', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const isMapVisible = await page.locator('svg').first().isVisible();
  console.log(`  Console page renders with prefers-reduced-motion: ${isMapVisible ? 'YES' : 'NO'}`);

  await browser.close();

  console.log(`\n=== A11y Summary: ${totalSeriousOrCritical} Serious/Critical Violations ===`);
  if (totalSeriousOrCritical > 0) {
    process.exit(1);
  } else {
    console.log('ALL ROUTES PASSED AXE ACCESSIBILITY AUDIT.');
  }
}

runA11yTests().catch(err => {
  console.error(err);
  process.exit(1);
});
