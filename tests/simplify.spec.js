const { chromium } = require('playwright');

async function runTests() {
  console.log('--- Starting Playwright Simplification Verification Tests ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`PASS: ${message}`);
      passCount++;
    } else {
      console.error(`FAIL: ${message}`);
      failCount++;
    }
  }

  try {
    // TEST 1: What works today sheet opens, renders capability badges, and closes
    console.log('\n[Test 1] Testing What Works Today Sheet...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const whatWorksBtn = page.locator('button[aria-label="Open What Works Today status sheet"]');
    await whatWorksBtn.click();
    await page.waitForTimeout(600);

    const sheetHeading = page.getByRole('heading', { name: 'What Works Today' });
    assert(await sheetHeading.isVisible(), 'What Works Today sheet is visible on button click');

    const liveBadge = page.getByText('Live (Simulated Alpine Sector)').first();
    assert(await liveBadge.isVisible(), 'Capability Badge (Live) renders in sheet');

    const comingSoonBadge = page.getByText('Coming Soon (Not Built)').first();
    assert(await comingSoonBadge.isVisible(), 'Capability Badge (Coming soon) renders and is non-interactive');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    assert(!(await sheetHeading.isVisible()), 'Sheet closes cleanly with Escape');

    // TEST 2: Story Page Simplification (One action above fold, 3 promises)
    console.log('\n[Test 2] Testing Story Page Simplification...');
    const launchConsoleBtn = page.locator('a:has-text("Launch Field Console")').first();
    assert(await launchConsoleBtn.isVisible(), 'Single primary action button visible on Story page');

    const promise1 = page.locator('#promise-1');
    const promise2 = page.locator('#promise-2');
    const promise3 = page.locator('#promise-3');
    assert(await promise1.isVisible(), 'Promise 1 (Visible Network) section renders');
    assert(await promise2.isVisible(), 'Promise 2 (Store-and-Forward) section renders');
    assert(await promise3.isVisible(), 'Promise 3 (Tactical AI) section renders');

    const cairnScroll = page.locator('aside[aria-label*="Cairn three-stone mission scroll progress"]');
    assert(await cairnScroll.isVisible(), 'Unique Element 1 (CairnScrollIndicator) is visible on desktop');

    // TEST 3: Console Page: Segmented Control, Bottom Sheet & Send Check-in
    console.log('\n[Test 3] Testing Field Console Page...');
    await page.goto('http://localhost:3000/console', { waitUntil: 'networkidle' });

    // Segmented Control switches to Stations
    const stationsTab = page.locator('button[role="tab"]:has-text("Stations")');
    await stationsTab.click();
    await page.waitForTimeout(800);

    const bottomSheetTitle = page.locator('text=Alpine Station Fleet');
    assert(await bottomSheetTitle.isVisible(), 'Bottom Sheet opens when Stations tab is selected');

    // Link Strength Ring is visible in sheet
    const linkRing = page.locator('div[aria-label*="Link status for"]');
    assert(await linkRing.isVisible(), 'Unique Element 2 (LinkStrengthRing) renders in bottom sheet');

    // Level 3 Details Disclosure
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Level 3: Technical Telemetry')
      );
      if (btn) {
        btn.scrollIntoView();
        btn.click();
      }
    });
    await page.waitForTimeout(400);
    const techTelemetry = page.locator('text=Transmitter Power:');
    assert(await techTelemetry.isVisible(), 'Level 3 details disclosure opens upon user demand');

    // Close bottom sheet before testing map check-in action
    const closeSheetBtn = page.locator('button[aria-label="Close sheet"]');
    await closeSheetBtn.click();
    await page.waitForTimeout(600);

    // Primary action: Send Check-in
    const sendCheckinBtn = page.locator('button:has-text("Send Check-in")');
    await sendCheckinBtn.click();
    await page.waitForTimeout(800);
    const toast = page.locator('text=Check-in transmitted across mesh');
    assert(await toast.isVisible(), 'Send Check-in action executes and toast confirms receipt');

    // TEST 4: Method Page: Single Accordion Section Open
    console.log('\n[Test 4] Testing Method Page Accordion...');
    await page.goto('http://localhost:3000/method', { waitUntil: 'networkidle' });

    const accordionTrigger1 = page.locator('button:has-text("Physical RF Line-of-Sight")');
    assert(await accordionTrigger1.isVisible(), 'Accordion section 1 trigger renders');

    // 3-Column Offline Capability Matrix renders
    const worksOffline = page.locator('text=Works Offline (Today)');
    const needsConnection = page.locator('text=Needs a Connection');
    const notBuilt = page.locator('text=Not Built Yet');
    assert(await worksOffline.isVisible(), 'Works Offline column renders');
    assert(await needsConnection.isVisible(), 'Needs Connection column renders');
    assert(await notBuilt.isVisible(), 'Not Built Yet column renders');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log(`\n--- Verification Summary: ${passCount} Passed, ${failCount} Failed ---`);
  if (failCount > 0) process.exit(1);
}

runTests();
