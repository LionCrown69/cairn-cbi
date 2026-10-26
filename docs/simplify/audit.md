# CAIRN — Baseline Complexity Audit & Simplification Targets

Date: October 26, 2026  
Status: Pre-Simplification Baseline (Step 1 Complete)  
Screenshots: `docs/simplify/before/` (1440px desktop, 820px tablet, 390px mobile)

---

## 1. Executive Summary

The CAIRN application has strong core physics, store-and-forward mesh logic, and live Google Gemini 2.5 Flash situational intelligence. However, several pages suffer from cognitive overload: too many simultaneous graphs, telemetry chips, raw metrics, and competing buttons. Users cannot immediately discern what is interactive versus decorative, or what is simulated versus real.

This audit establishes the baseline complexity score for each screen and defines strict reduction targets based on an **iOS-inspired, minimal, progressive-disclosure design language**.

---

## 2. Page-by-Page Audit

### 2.1 Story Page (`/`)

- **The One Thing the User Came to Do:**  
  Understand what Cairn is (an offline-first alpine mesh platform) and immediately experience the core promise before launching the console.
- **Every Visible Element (Current):**  
  Top banner, Navbar ticker, 3D WebGL terrain hero, camera perspective buttons (3), narrative scene stepper (5 dots), AI Command Terminal with 3D thinking orb, 5 instant query chips, raw telemetry metric cards (4), Commander Action directive card, Interactive Mesh Lab sandbox (node drag handles, 6 status bars, store buttons), Problem vs Solution 2-column breakdown, 3 Pillars cards, Dispatch live stream teaser cards (2), Sprint Chronicle timeline (14 items, day filter pills), Scope & Integrity cards (8 list items), bottom CTA button cluster (4 buttons).
- **Elements that do NOT serve that one thing:**  
  Interactive Mesh Lab duplicate sandbox directly beneath the AI terminal; dense timeline sprint chronicle (14 items) on the narrative home page; multiple duplicate CTA buttons.
- **Data a first-time user cannot interpret in 5 seconds:**  
  "Clearance margin -925.7m", "40-step numerical ray-casting", "BFS path length 1", "704hPa (-2.4hPa/3h)".
- **Places where truthfulness/capability status is ambiguous:**  
  Scene stepper appears like a video player but triggers camera changes; timeline items appear like clickable tasks.
- **Current Complexity Score:**
  - Distinct interactive controls: **28**
  - Simultaneously visible data values: **34**
  - Colours used: **6** (Dark ground, Ink white, Signal lime, Caution orange, Slate mute, Severed red)
  - Competing focal points: **4** (Hero 3D terrain vs AI Terminal vs Mesh Lab vs Timeline)
- **Simplification Targets:**
  - Primary action: **1** ("Launch Field Console")
  - Visible controls above fold: **1**
  - Visible data values: **3 key promises**
  - Focal points: **1** (Hero title & scroll-driven parallax)

---

### 2.2 Field Console (`/console`)

- **The One Thing the User Came to Do:**  
  Monitor active alpine radio links and send/receive a field check-in packet across the mesh.
- **Every Visible Element (Current):**  
  Navbar with scenario injector dropdown, audio mute toggle, UTC ticker, Mapbox GL / 3D Canvas, Node Control Panel (6 nodes with battery, elevation, coordinates, tx power, toggle button), Terrain Profile View (elevation chart with Fresnel ellipse, clearance meter), Message Queue Panel (queued packets, hops list, payload bytes, deliver button), AI Digest Panel (SITREP headline, summary, recommended action, question input, telemetry audit drawer), layer filter buttons.
- **Elements that do NOT serve that one thing:**  
  All 4 panels simultaneously crowding the viewport around the map; raw transmitter dBm numbers and latitude/longitude shown upfront; duplicate scenario buttons in both navbar and panels.
- **Data a first-time user cannot interpret in 5 seconds:**  
  Tx power 27 dBm, Fresnel 60% clearance radius in meters, raw hop array IDs (`node-alpha -> node-relay-2 -> node-relay-1 -> node-cmd`).
- **Places where truthfulness/capability status is ambiguous:**  
  Whether nodes can actually be dragged on the terrain or if positions are fixed; whether "simulated" applies to the terrain or the packet transport.
- **Current Complexity Score:**
  - Distinct interactive controls: **32**
  - Simultaneously visible data values: **48**
  - Colours used: **5**
  - Competing focal points: **5** (Map center, Left node panel, Bottom-left profile, Bottom-right queue, Right AI panel)
- **Simplification Targets:**
  - Primary action: **1** ("Send Check-in" floating button)
  - Visible controls: **3 to 5** (Segmented control: Map / Nodes / Messages; one layers dropdown; scenario switch)
  - Visible data values: **5 to 7** (Headline network status, online station count, queue count)
  - Focal point: **1** (Full-bleed Map with bottom floating control bar)
  - Detailed telemetry moved to: **iOS Bottom Sheet with 3 snap points (peek, half, full)** and Level 3 "Details" disclosure.

---

### 2.3 Method & Physics Page (`/method`)

- **The One Thing the User Came to Do:**  
  Understand the RF line-of-sight math and how store-and-forward delay-tolerant routing overcomes mountain occlusion.
- **Every Visible Element (Current):**  
  Hero header, 4 long technical prose cards, interactive SVG Fresnel cross-section diagram, mathematical formulas with LaTeX-style notation, RF link loss margin formulas, delay-tolerant routing state machine diagram, 3-column capability table.
- **Elements that do NOT serve that one thing:**  
  Dense paragraphs rendered simultaneously forcing endless scrolling; redundant formula explanations.
- **Data a first-time user cannot interpret in 5 seconds:**  
  `r_1 = sqrt((lambda * d1 * d2) / (d1 + d2))`, decibel path loss fractions.
- **Places where truthfulness/capability status is ambiguous:**  
  Whether the SVG diagram is driven by live calculations or hardcoded.
- **Current Complexity Score:**
  - Distinct interactive controls: **8**
  - Simultaneously visible data values: **18**
  - Colours used: **4**
  - Competing focal points: **3**
- **Simplification Targets:**
  - Primary action: **1** ("Test in Console")
  - Visible controls: **Accordion sections (one open at a time)**
  - Visible data values: **5 key physics principles**
  - Focal point: **1** (Active accordion item with matching clean diagram)
  - Capability table: **3-column clean list (Works Offline / Needs Connection / Not Built Yet)**.

---

### 2.4 Timeline Page (`/timeline`)

- **The One Thing the User Came to Do:**  
  Review the chronological engineering milestones and verifiable deliverables from the 2-day hackathon sprint.
- **Every Visible Element (Current):**  
  Filter buttons (All 14, Day 1 7, Day 2 7), 14 detailed milestone cards with deliverable tags, timestamp pills, category badges, checkmark icons.
- **Elements that do NOT serve that one thing:**  
  All 14 milestones open simultaneously with multiple deliverable tags, creating dense vertical scrolling.
- **Data a first-time user cannot interpret in 5 seconds:**  
  Dense lists of internal module names.
- **Current Complexity Score:**
  - Distinct interactive controls: **5**
  - Simultaneously visible data values: **28**
  - Colours used: **4**
  - Competing focal points: **2**
- **Simplification Targets:**
  - Primary action: **Day Filter (Segmented Control: All / Day 1 / Day 2)**
  - Grouped inset cards with progressive disclosure for technical deliverables.

---

### 2.5 Team Dispatch & Transceiver Auth (`/dispatch`, `/login`)

- **The One Thing the User Came to Do:**  
  Send an emergency or status radio transmission and view chronological receipts.
- **Current Score:**  
  Relatively clean, but can be further refined with iOS grouped inset lists and spring transitions.

---

## 3. Global Complexity Summary & Targets Matrix

| Screen | Baseline Controls | Target Controls | Baseline Visible Data | Target Visible Data | Baseline Focal Points | Target Focal Points |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Story (`/`)** | 28 | **1–3** | 34 | **5–7** | 4 | **1** |
| **Console (`/console`)** | 32 | **3–5** | 48 | **5–7** | 5 | **1** |
| **Method (`/method`)** | 8 | **3–4** | 18 | **5–6** | 3 | **1** |
| **Timeline (`/timeline`)** | 5 | **3** | 28 | **7** | 2 | **1** |
| **Dispatch (`/dispatch`)** | 12 | **4** | 22 | **6** | 2 | **1** |
| **Login (`/login`)** | 8 | **3** | 12 | **4** | 1 | **1** |

---

## 4. Key Rules for Next Steps

1. **One job per screen stated in code comments.**
2. **Three-level progressive disclosure:**
   - Level 1: Status & primary action.
   - Level 2: Bottom sheet / inline expansion on tap.
   - Level 3: "Details" disclosure for model & AI inputs.
3. **Capability Badges with Icon + Text:**
   - `[● Live]` (Works now, simulated data)
   - `[~ Estimate]` (Model output)
   - `[▤ Template]` (Offline fallback)
   - `[○ Coming soon]` (Not built, non-interactive with 1-line explanation)
4. **Build 3 unique elements only:**
   - Cairn 3-stone scroll progress indicator
   - Link-strength ring on selected node
   - Message delivery trail (drawing line on delivery, dashed pause when queued)
5. **Add global "What works today" sheet** reachable from navbar on every page.
