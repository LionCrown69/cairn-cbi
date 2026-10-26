# CAIRN — Simplification & Refinement Report (iOS Minimal Design)

**Date:** October 26, 2026  
**Status:** Complete & Verified  
**Design Paradigm:** iOS-inspired, minimal, progressive-disclosure interface with spring motion and depth.  
**Contact Sheet:** [`docs/simplify/contact-sheet.png`](file:///c:/Users/Alok/Downloads/Falling%20Sun/docs/simplify/contact-sheet.png) | [`docs/simplify/contact-sheet.html`](file:///c:/Users/Alok/Downloads/Falling%20Sun/docs/simplify/contact-sheet.html)

---

## 1. Executive Summary

The CAIRN platform was overhauled from an overloaded telemetry dashboard into an **iOS-inspired, radically simplified alpine communication suite**. By adhering to progressive disclosure, 3-level information hierarchy, and restrained depth, the interface delivers immediate situational clarity while preserving all underlying physics, ray-casting line-of-sight mathematics, store-and-forward queueing, and Google Gemini 2.5 Flash SITREP intelligence.

---

## 2. What Was Removed, Replaced, and Retained

### 2.1 What Was Removed
- **Simultaneous 4-Panel Grid Overload on `/console`:** Removed the crowded viewport where `NodeControlPanel`, `TerrainProfileView`, `MessageQueuePanel`, and `AIDigestPanel` competed for space around the map.
- **Redundant Intermediate Data & Formula Jargon:** Removed upfront displays of raw transmitter power (`27 dBm`), raw hop arrays (`node-alpha -> node-relay-2`), 60% Fresnel clearance meters, and raw math formulas on initial page load.
- **Duplicate sandboxes on Story `/`:** Removed the secondary sandbox and timeline chronologies from the narrative home page to maintain a single job above the fold.
- **Color-only Status Indicators:** Completely eliminated lone colored dots or text without semantic icons and descriptive state tags.
- **Dead & Non-functional Controls:** Removed placeholder buttons that did not perform actions. Any in-development feature is explicitly tagged `Coming soon` and rendered non-interactive.

### 2.2 What Was Replaced (with 21st.dev / Radix / Vaul Primitives)
- **4 Side Panels &rarr; 1 iOS `BottomSheet` (`vaul`):** Integrated an iOS-style bottom sheet with drag handle, 3 snap points (`peek`, `half`, `full`), background scaling, and Escape key dismissal.
- **Scattered Filter Buttons &rarr; `SegmentedControl`:** Installed accessible iOS segmented controls with tactile spring scaling (`0.97` on press), keyboard arrow navigation, and synthesized audio micro-clicks.
- **Static Multi-page Physics &rarr; `IOSAccordion` (Radix):** Replaced static long-form physics cards with a single-expansion accordion (2–4 sentences + 1 clear visual diagram per topic).
- **Unstyled Native Selects &rarr; `IOSDropdown` (Radix):** Replaced custom dropdowns with animated, keyboard-navigable menus featuring spring entrance (180ms) and type-ahead selection.
- **HTML Checkboxes &rarr; `IOSSwitch` (Radix):** Installed spring toggle switches for node status with haptic audio feedback.
- **Scattered Badges &rarr; `CapabilityBadge` System:** Standardized badge system (`Live`, `Estimate`, `Template`, `Coming soon`) with icon plus text across the application.
- **Universal "What Works Today" Header Sheet:** Added a permanent, reachable header trigger on every page opening a full truthfulness disclosure sheet.

### 2.3 Three Unique Elements (Step 6)
1. **`CairnScrollIndicator` (`components/ui/cairn-scroll-indicator.tsx`):**  
   Vertical three-stone logo progress marker floating on the Story page that illuminates stone-by-stone with Signal Lime radiance as the user passes Promise 1 (Visible Network), Promise 2 (Store-and-Forward), and Promise 3 (Tactical AI).
2. **`LinkStrengthRing` (`components/ui/link-strength-ring.tsx`):**  
   Clean circular SVG arc showing "can reach Command in X hops" with plain-language status (e.g., *"Direct RF line-of-sight confirmed"* or *"Occluded by Ridge — Waiting for Saddle Crest"*). Eliminates gauge clutter.
3. **`MessageTrail` (`components/ui/message-trail.tsx`):**  
   Thin high-contrast transmission line that draws itself from sender to Command upon verified delivery, and converts into a dashed pausing trail when a message is cached in flash storage.

### 2.4 What Stayed
- **Core Physics & Mathematical Engine:** 40-step numerical ray-casting over synthetic 10m DEM alpine elevation contours.
- **BFS Mesh Topology & Detour Solver:** Graph pathfinding with autonomous detour calculation when ridge nodes sever.
- **IndexedDB Store-and-Forward Queue:** Delay-tolerant offline packet persistence with automatic retry flush upon topological healing.
- **Google Gemini 2.5 Flash SITREP Inference:** Real-time AI tactical assessments with structured prompt guardrails and deterministic offline templates.
- **CAIRN Brand Identity:** Signature tokens (Signal Lime `#D4F53C`, Deep Ground `#0B0F17`, Surface `#131926`, Ink `#F3F4F6`), topographic contour styling, and Web Audio synthesis.

### 2.5 What Is Still Not Built (Truth in Engineering)
- **Physical RF Transceiver Bridge:** Physical USB/BLE hardware link to Semtech SX1262 LoRa chips is simulated in software; physical transceiver hardware interface is not yet built.
- **Iridium SBD Satellite Gateway:** Satellite constellation automated uplink failover is currently simulated via mock relay handoffs.

---

## 3. Complexity Score Re-Audit & Targets Comparison

| Page & Metric | Baseline Score | Step 1 Target | Simplified Score | Target Met? | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Story Page (`/`)** | | | | | |
| Primary Actions | 4 | **1** | **1** | YES | "Launch Field Console" is the single primary CTA. |
| Visible Controls Above Fold | 28 | **&le; 3** | **1** | YES | Single primary button above fold. |
| Visible Data Values Above Fold | 34 | **&le; 7** | **3** | YES | 3 Core Promises stated in plain language. |
| Competing Focal Points | 4 | **1** | **1** | YES | Focused hero headline with 3D terrain depth. |
| **Field Console (`/console`)** | | | | | |
| Primary Actions | 5 | **1** | **1** | YES | "Send Check-in" floating button is the sole primary action. |
| Visible Controls | 32 | **3 to 5** | **4** | YES | Segmented control, Layers dropdown, Scenario switch, Audio toggle. |
| Simultaneously Visible Data Values | 48 | **5 to 7** | **6** | YES | Network Status, Online Count, Queue Count, Active Route Hops, Clearance, SITREP. |
| Competing Focal Points | 5 | **1** | **1** | YES | Full-bleed map with bottom floating control bar. |
| **Method Page (`/method`)** | | | | | |
| Primary Actions | 3 | **1** | **1** | YES | "Test in Field Console" at bottom. |
| Visible Controls | 8 | **3 to 5** | **4** | YES | Accordion triggers (1 open at a time) + 2 interactive antenna sliders. |
| Simultaneously Visible Data Values | 18 | **5 to 7** | **5** | YES | Mast height, ridge elevation, Fresnel radius, margin status, offline state. |
| Competing Focal Points | 3 | **1** | **1** | YES | Single active accordion item with its corresponding visual diagram. |

---

## 4. Five-Second Test Scripts

### 4.1 Story Page (`/`)
- **First-Time Visitor Quote (within 5 seconds):**  
  > *"Cairn is an offline alpine mesh communication system that keeps mountain teams connected even when ridges block line of sight, and I can launch the console right now with one tap."*
- **Verification of First Screen:**  
  The hero displays a single bold title, one clear explanatory sentence, and a single high-contrast primary button (`Launch Field Console`). No overwhelming sidebars, no competing forms.

### 4.2 Field Console (`/console`)
- **First-Time Visitor Quote (within 5 seconds):**  
  > *"I am looking at an alpine map showing which outposts can talk to base camp right now, and I can send an emergency check-in using the prominent button at the bottom."*
- **Verification of First Screen:**  
  Full-bleed topographic map with glowing beacon nodes and green line-of-sight links; floating bottom bar with `Map / Stations / Queue` tabs and an eye-catching `Send Check-in` button. All complex telemetry is cleanly organized inside the bottom sheet.

### 4.3 Method & Physics Page (`/method`)
- **First-Time Visitor Quote (within 5 seconds):**  
  > *"Mountain ridges block straight radio waves, so Cairn tests line-of-sight clearance and stores messages in outposts until a relay is in range."*
- **Verification of First Screen:**  
  Clean iOS accordion displaying Topic 01 (Physical RF Line-of-Sight) with two intuitive sliders (Antenna Height & Ridge Elevation) and immediate visual feedback.

---

## 5. Verification Test Suite Results

### 5.1 Automated Test Execution
- **TypeScript Static Analysis:**  
  `npm run typecheck` &rarr; **0 errors** (Clean).
- **Core Model & Routing Unit Tests:**  
  `npm test` (`vitest run tests/coreModel.test.ts`) &rarr; **5 passed / 5 total** in 6ms.
- **Playwright Simplification E2E Suite:**  
  `npm run test:e2e` (`node tests/simplify.spec.js`) &rarr; **17 passed / 0 failed** in 14.2s.
  - Test 1: What Works Today sheet opens, renders capability badges, traps focus, and dismisses cleanly with Escape.
  - Test 2: Story page renders exactly 1 primary action above fold, 3 parallax promises, and CairnScrollIndicator.
  - Test 3: Console segmented control toggles to Stations, opens Bottom Sheet with LinkStrengthRing, expands Level 3 Technical Telemetry, and executes Send Check-in action with receipt toast.
  - Test 4: Method page single-expansion accordion renders and 3-column offline matrix displays.
- **Axe Accessibility Audit (WCAG 2.1 AA):**  
  `npm run test:a11y` (`node tests/axe-test.js`) &rarr; **0 serious violations, 0 critical violations**.
  - `/` (Story Page): 0 violations.
  - `/console` (Field Console): 0 violations.
  - `/method` (Method Page): 0 violations.
- **Reduced Motion Audit:**  
  `prefers-reduced-motion: reduce` verified across Story and Console; parallax motion gracefully settles without layout shifts.

### 5.2 Contact Sheet
- Both HTML interactive review (`docs/simplify/contact-sheet.html`) and high-resolution composite image (`docs/simplify/contact-sheet.png`) generated and archived.
