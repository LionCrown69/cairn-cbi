# CAIRN — Offline-First Alpine Mesh Communication Platform

**Synthetic Scenario Concept:** Team communication and situational awareness in high-mountain terrain with zero cellular or satellite connectivity.

> **Important Disclosure:** This project is a synthetic concept for search-and-rescue, environmental observation, and backcountry patrol coordination. It does not claim real military, radio, or operational capability. **No targeting, weapons, or kinetic features exist or will ever be supported.**

---

## 1. Quick Start

### Prerequisites
- Node.js v18+ or v22+
- npm v10+

### Installation & Execution
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run the Vitest test suite
npm run test

# Run production build validation
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Route Directory & Architecture

- **Page 1 — Story (`/`):** Pinned WebGL dot-wave terrain canvas with 5-scene narrative sequence (Plate 02), SVG layered ridges fallback (Plate 01), Problem in 3 lines, Three promises, and "What this is and is not".
- **Page 2 — Field Console (`/console`):** Interactive 2D/3D spatial map, selected node telemetry, live BFS routing hops, line-of-sight elevation cross-section SVG, store-and-forward message buffer, AI situational digest, and Exploded Layers mode (Plate 03).
- **Page 3 — Method (`/method`):** Interactive link clearance simulator with dynamic sliders, store-and-forward architecture details, AI prompt isolation rules, offline resilience matrix, and honest roadmap disclosure.
- **Design System (`/design`):** Color tokens, Big Shoulders Display typography, multi-modal status matrix, and 1px engineered glass panels.
- **Metrics Dictionary (`/design/metrics`):** Strict data integrity dictionary defining every displayed metric, unit, source, and provenance tag.
- **Lab Explorations (`/lab/<story|console|method>/<a|b|c>`):** Nine working design exploration variants across Cinematic, Cartographic, and Editorial approaches.

---

## 3. Visual Plates Compliance

| Target Plate | Concept Description | Implementation in CAIRN |
| :--- | :--- | :--- |
| **Plate 01** | Atmospheric depth · 4 ridge layers + haze · synthetic | `SVGRidgeHeroFallback.tsx`: 4 overlapping ridge fills with volumetric haze, glowing node beacons, and Big Shoulders condensed headline. |
| **Plate 02** | Dot-wave field · dots encode elevation · orange = delivered path | `WebGLTerrainHero.tsx`: Three.js custom points mesh where 8,100 vertices are displaced by mountain DEM with animated tactical orange packet trajectory. |
| **Plate 03** | Exploded layers · each layer = one data source, one label | `ExplodedLayersLegend.tsx` & `ConsoleMap.tsx`: Stack separating L1 Terrain (Simulated), L2 Links (Estimated LOS), and L3 Messages (Observed Sim). |

---

## 4. Offline Testing Steps

1. Launch the application with `npm run dev` and navigate to `/console`.
2. Select station `PATROL-ALPHA` in the map.
3. In the right panel, observe that Alpha connects to Base Command via 2 hops (`ALPHA` &rarr; `RELAY-SADDLE-WEST` &rarr; `RELAY-RIDGE-NORTH` &rarr; `COMMAND`).
4. Select `RELAY-SADDLE-WEST` and click **"Take Offline"**.
5. Return to `PATROL-ALPHA`. Notice that the direct path is severed.
6. Type a field report (e.g., *"Spindrift increasing on ridge"*) and click **"Send"**.
7. Observe that the message transitions immediately to **`QUEUED IN CACHE`** (holding safely in local storage).
8. Bring `RELAY-SADDLE-WEST` back online.
9. Watch the store-and-forward daemon automatically discover the route, flush the queue, and transition the message to **`DELIVERED`** with a complete hop audit trail.
10. Disconnect your machine's Wi-Fi network: all core map calculations, terrain elevation profiles, and template digests continue operating with zero network dependency.

---

## 5. Scope Boundaries (Simulated vs Not Implemented)

### What is Simulated / Evaluated:
- **Terrain Elevation:** Synthetic procedural alpine DEM with continuous elevation function.
- **RF Line of Sight:** Ray vs. ground clearance math evaluated over 40 discrete samples with antenna mast heights.
- **Routing Engine:** Breadth-First Search (BFS) graph shortest-path derivation.
- **Store-and-Forward Buffering:** IndexedDB / LocalStorage delay-tolerant event queue.
- **AI Situational Digest:** Deterministic fallback templates and strict numeric validation.

### What is NOT Implemented (Honest Disclosure):
- Hardware RF transceiver binding (SDR / ESP32 LoRa radio hardware).
- Real-time weather Doppler radar feeds.
- End-to-end ChaCha20-Poly1305 hardware enclave encryption.
