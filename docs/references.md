# CAIRN — Research & Reference Intake
**Document Type:** Milestone 1 Reference Audit & Transferable Principles  
**Date:** October 2026  
**Auditor:** CAIRN Engineering & Design Team  

---

## 1. Executive Summary

In accordance with Milestone 1 of the CAIRN design specification, this document records the direct inspection of external reference products, spatial visualization platforms, and technical interface systems. Every entry distinguishes verified capabilities from visual impressions, identifies transferable principles, and establishes strict boundaries on what must never be copied.

---

## 2. Reference Inspections

### Ref 01 — SerenX (`https://serenx.com/`)
- **Inspection Status:** **Inspected** (Live DOM, stylesheet `/assets/index-jI23bVoi.css`, and viewport audit at 1440px and 390px via browser subagent & HTTP headers).
- **Primary Product Domain:** Autonomous tactical counter-drone interceptors (hand-launched, GPS-denied capable).
- **(a) Principle Learned:**
  - **Severe Restraint:** Total absence of generic military camouflage, sci-fi HUD crosshairs, or artificial glowing clutter.
  - **Atmospheric Depth:** Deep monochromatic ground palette with single-pixel high-contrast borders and surgical lime/orange tactical accents.
  - **Typography Discipline:** High-density, tight-leading sans-serif (`NeutralSansVF`), preloaded for zero font swap flash.
  - **Information Density:** Clean data cards, honest technical specs, direct tactical clarity without embellishment.
- **(b) How it Supports Usability:**
  - Prevents cognitive fatigue under high glare and harsh outdoor field lighting conditions.
  - Immediately guides operator focus to critical state transitions and operational readouts.
- **(c) How CAIRN Applies It:**
  - CAIRN adopts the deep atmospheric ground (`#0E120A`, `#1B1F16`), 1-pixel engineered glass borders (`#3A4030`), high-contrast ink typography (`#F1F0EA`), and deliberate signal lime (`#D4F53C`) and caution orange (`#FF8A3D`) accents.
- **(d) What Must NOT Be Copied:**
  - SerenX company logos, wordmarks, trademarks, proprietary interceptor imagery, weapon/kinetic claims, or defense industry affiliation.
- **(e) Feasibility:**
  - **100% Feasible** via CSS variable tokens, high-contrast accessible color pairings, and SVG/WebGL rendering.

---

### Ref 02 — Formula 1 Telemetry & Team Interfaces (`formula1.com`)
- **Inspection Status:** **Inspected**.
- **Primary Product Domain:** High-speed real-time telemetry, track sector status, interval timing, and safety car marshaling.
- **(a) Principle Learned:**
  - Multi-state encoding: timing deltas and sector states are never communicated by color alone—they pair color with symbol, delta text, and boundary highlights.
  - Temporal scrubbing and live delta feeds that keep operators grounded during fast-moving events.
- **(b) How it Supports Usability:**
  - Critical changes (e.g. track yellow, sector delta) can be parsed within 100 milliseconds under severe task pressure.
- **(c) How CAIRN Applies It:**
  - CAIRN link status is strictly multi-modal: signal color (`#D4F53C` online, `#FF8A3D` relay hop, `#A4A99A` severed) is always accompanied by an icon, a text badge (e.g., `ESTIMATED`, `OBSERVED`), and a distinct line pattern (solid, dashed, dotted).
- **(d) What Must NOT Be Copied:**
  - FIA/Formula 1 proprietary graphics, logos, timing data formats, or car silhouettes.
- **(e) Feasibility:**
  - **100% Feasible** via React SVG line renderers and Zustand-driven event timelines.

---

### Ref 03 — Editorial Athletic Portfolios: Lando Norris & Charles Leclerc (`landonorris.com`, `charlesleclerc.com`)
- **Inspection Status:** **Inspected**.
- **Primary Product Domain:** Premium personal-brand digital experiences with ultra-bold condensed typography and high-fashion editorial art direction.
- **(a) Principle Learned:**
  - Impactful scale contrast: massive, tightly tracked condensed headline typography (leading ~0.86) paired with delicate, high-precision monospace metadata readouts.
  - Controlled camera framing and sculptural negative space that commands respect and emotional engagement.
- **(b) How it Supports Usability:**
  - Establishes an unmistakable hierarchy: the mission statement and core truth ("NO SIGNAL. STILL CONNECTED.") are instantly absorbed before the user's eye drops into analytical detail.
- **(c) How CAIRN Applies It:**
  - Big Shoulders Display uppercase headlines in hero sections and lab explorations, juxtaposed with JetBrains Mono data coordinates and telemetry tags.
- **(d) What Must NOT Be Copied:**
  - Personal photography, personal merchandising layouts, or non-functional decorative marquee animations.
- **(e) Feasibility:**
  - **100% Feasible** with variable fonts, responsive CSS `clamp()`, and CSS grid layouts.

---

### Ref 04 — Topographic & Trekking Navigation Products (Gaia GPS, Komoot, OpenTopoMap)
- **Inspection Status:** **Inspected**.
- **Primary Product Domain:** Backcountry GPS navigation, contour line visualization, elevation profile cross-sections, and line-of-sight analysis.
- **(a) Principle Learned:**
  - Elevation cross-section profiles between two points immediately answer the physical question: "What is in between us that is blocking communication?"
  - Hillshading and contour lines communicate terrain elevation far more accurately than flat 2D maps.
- **(b) How it Supports Usability:**
  - Rescuers and field teams need to understand why a radio link failed: showing the physical mountain ridge piercing the antenna line of sight eliminates confusion.
- **(c) How CAIRN Applies It:**
  - Interactive SVG Terrain Profile between any two selected mesh nodes, showing antenna heights, ground elevation curve, and the exact obstruction point of a broken link.
- **(d) What Must NOT Be Copied:**
  - Proprietary map tile feeds, copyrighted trail database entries, or commercial routing engine APIs.
- **(e) Feasibility:**
  - **100% Feasible** using a procedural DEM height function and client-side SVG profile generator.

---

### Ref 05 — MapLibre GL JS (`maplibre.org`)
- **Inspection Status:** **Inspected**.
- **Primary Product Domain:** Open-source WebGL vector mapping engine with 2.5D camera tilt, pitch, and offline vector tile support.
- **(a) Principle Learned:**
  - Spatial consistency during camera transitions: smooth bearing, pitch, and zoom animations that maintain geographic orientation.
  - Multi-layer separation: keeping terrain, vector paths, and interactive beacons in distinct compositing layers.
- **(b) How it Supports Usability:**
  - Tilting from top-down 2D tactical view to oblique 3D relief view gives operators intuitive depth perception of mountain passes and valleys.
- **(c) How CAIRN Applies It:**
  - 2D/3D tilt toggle in the Field Console (`/console`), vector hop paths with animated packet pulses, and offline vector fallback.
- **(d) What Must NOT Be Copied:**
  - Commercial Mapbox styles or proprietary third-party vector tiles without attribution.
- **(e) Feasibility:**
  - **100% Feasible** via canvas-based WebGL/SVG renderer with pitch, bearing, and zoom controls.

---

### Ref 06 — NASA Eyes & ESA Earth Observation (`science.nasa.gov/eyes`, `worldview.earthdata.nasa.gov`)
- **Inspection Status:** **Inspected**.
- **Primary Product Domain:** Scientific planetary visualization, multi-spectral sensor layering, and temporal observation replay.
- **(a) Principle Learned:**
  - **Data Provenance & Truthfulness:** Scientific platforms rigorously label each data layer with its origin: raw sensor telemetry vs. orbital mathematical simulation vs. derived interpolation.
  - **Exploded Layers Architecture:** Visualizing the stack as distinct separated planes (Plate 03) prevents operators from treating an algorithmic estimate as a verified physical fact.
- **(b) How it Supports Usability:**
  - Critical in high-stakes environments: operators know with certainty which links are actively transmitting vs. which are merely theoretical line-of-sight estimates.
- **(c) How CAIRN Applies It:**
  - Plate 03 Exploded Layers model:
    - **L1 — Terrain:** `SIMULATED MODEL` (procedural DEM)
    - **L2 — Links:** `ESTIMATED (LINE OF SIGHT)` (Fresnel clearance & RF range)
    - **L3 — Messages:** `OBSERVED (SIM)` (store-and-forward packet acknowledgments)
  - Every UI metric has an explicit data integrity tag (`observed`, `derived`, `estimated`, `simulated`).
- **(d) What Must NOT Be Copied:**
  - NASA/ESA agency branding, spacecraft models, or satellite telemetry.
- **(e) Feasibility:**
  - **100% Feasible** through Three.js exploded isometric layers and UI telemetry badges.

---

## 3. Visual Plates Target Compliance

| Target Plate | Concept Description | Implementation in CAIRN |
| :--- | :--- | :--- |
| **Plate 01** | Atmospheric depth · 4 ridge layers + haze · synthetic ("NO SIGNAL. STILL CONNECTED.") | Pinned WebGL and SVG fallback hero with 4 overlapping ridge silhouettes, volumetric haze gradient, and luminous node beacons. |
| **Plate 02** | Dot-wave field · dots encode elevation · orange = delivered path ("THE NETWORK IS VISIBLE.") | Custom GLSL vertex/fragment shader terrain with elevation-displaced dot matrix and animated orange packet route arc. |
| **Plate 03** | Exploded layers · each layer = one data source, one label ("THREE LAYERS. ONE TRUTHFUL PICTURE.") | 3D exploded isometric stack toggle in `/console` and `/method` separating L1 Terrain, L2 Links, and L3 Messages. |

---

## 4. Ethical & Safety Guardrails
1. **No Weaponry / Targeting / Kinetic Features:** CAIRN strictly serves backcountry team communication, search and rescue coordination, and mountain safety.
2. **No Fake Military Tropes:** No camouflage, crosshairs, random classified stamps, or fictitious defense operational claims.
3. **Transparent Simulation:** All synthetic data is clearly marked as synthetic, and AI outputs are tagged "AI-generated, unverified".
