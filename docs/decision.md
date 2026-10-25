# CAIRN — Milestone 4 Design Decision Matrix
**Document Type:** Design Exploration Scoring & Selection Record  
**Date:** October 2026  
**Auditor:** CAIRN Engineering & Design Team  

---

## 1. Evaluation Rubric Criteria (0 to 5.0)

1. **Clarity of Hierarchy (CH):** Immediate understanding of primary status vs. supporting telemetry.
2. **Depth and Atmosphere (DA):** Physical sensation of alpine terrain scale and environmental immersion.
3. **Task Speed (TS):** Time required to inspect a node, reconfigure topology, and transmit a field report.
4. **Accessibility (AC):** Contrast ratios (&ge; 4.5:1), keyboard focus navigation, touch targets (&ge; 44px).
5. **Performance (PF):** Frame rate (&ge; 60fps console, &ge; 30fps hero), smooth DOM updates, low latency.
6. **Distinctiveness (DS):** Memorable aesthetic identity free from generic military or administrative tropes.
7. **Truthfulness of Labels (TL):** Strict adherence to Plate 03 data provenance model (`observed`, `derived`, `estimated`, `simulated`).

---

## 2. Exploration Scores Matrix (9 Variants)

### Page 1 — Story (`/` vs `/lab/story/*`)

| Variant | CH | DA | TS | AC | PF | DS | TL | Weighted Average | Decision Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **A (Cinematic)** | 4.8 | 5.0 | 4.2 | 4.7 | 4.6 | 4.9 | 4.8 | **4.71** | **WINNER (Selected Foundation)** |
| **B (Cartographic)**| 4.2 | 3.5 | 4.8 | 4.6 | 4.9 | 3.6 | 4.7 | **4.33** | Harvested for Console Map |
| **C (Editorial)** | 4.6 | 4.4 | 4.1 | 4.5 | 4.8 | 4.8 | 4.7 | **4.56** | Typography adopted globally |

**Story Decision Summary:**  
Variant A (Cinematic) wins for Page 1 Story. The 3D dot-wave field (Plate 02) and 5-scene narrative immediately demonstrate the physical problem of ridge occlusion and the beauty of store-and-forward mesh healing. It incorporates Variant C's bold condensed typography (`Big Shoulders Display`) and provides a fallback to Plate 01 SVG ridges.

---

### Page 2 — Field Console (`/console` vs `/lab/console/*`)

| Variant | CH | DA | TS | AC | PF | DS | TL | Weighted Average | Decision Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **A (Cinematic 3D)**| 4.4 | 4.9 | 4.2 | 4.5 | 4.5 | 4.8 | 4.7 | **4.57** | Preserved via 3D Tilt Toggle |
| **B (Cartographic)**| 4.9 | 4.0 | 4.9 | 4.8 | 4.9 | 4.2 | 4.9 | **4.66** | **WINNER (Selected Layout)** |
| **C (Editorial)** | 4.2 | 3.8 | 4.3 | 4.6 | 4.8 | 4.3 | 4.6 | **4.37** | Mobile card alternative |

**Console Decision Summary:**  
Variant B (Cartographic) wins as the structural base of the Field Console due to superior task speed, clean 2D/3D tilt toggle, and immediate inspection speed. It integrates Variant A's 3D perspective via the &ldquo;3D Oblique&rdquo; toggle and Plate 03 Exploded Layers.

---

### Page 3 — Method (`/method` vs `/lab/method/*`)

| Variant | CH | DA | TS | AC | PF | DS | TL | Weighted Average | Decision Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **A (Interactive)** | 4.8 | 4.5 | 4.7 | 4.8 | 4.8 | 4.7 | 4.9 | **4.74** | **WINNER (Interactive Core)** |
| **B (Cartographic)**| 4.6 | 3.7 | 4.6 | 4.7 | 4.9 | 3.9 | 5.0 | **4.49** | Table adopted in Section 4 |
| **C (Editorial)** | 4.7 | 4.2 | 4.4 | 4.7 | 4.9 | 4.8 | 4.8 | **4.64** | Ethics section adopted |

**Method Decision Summary:**  
A deliberate **hybrid winner**: Variant A provides the interactive line-of-sight elevation clearance simulator, Variant B supplies the rigorous offline resilience matrix and Friis formulas, and Variant C provides the explicit anti-war and anti-weapons ethical declaration.

---

## 3. Production Bundle Safeguards
All nine exploratory variants are cleanly partitioned under `/lab/*` for transparent auditability, ensuring that production bundle treeshaking excludes unneeded prototype overhead from the primary `/`, `/console`, and `/method` routes.
