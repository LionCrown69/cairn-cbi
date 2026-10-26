# CAIRN — Component Inventory & 21st.dev Audit

This document records the component architecture, 21st.dev inspired patterns, and Radix/Vaul primitives installed to simplify the CAIRN user experience.

---

## 1. Component Registry & Vetting Log

| Component Name | Author / Source | Purpose & Why Chosen | Replaced Components | Licence | Bundle Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`BottomSheet`** (`vaul`) | Emil Kowalski / Vaul | iOS-inspired bottom sheet with drag handle, 3 snap points (`peek`, `half`, `full`), focus trap, and background scaling. | Replaced 4 simultaneously open side panels on `/console` (`NodeControlPanel`, `TerrainProfileView`, `MessageQueuePanel`, `AIDigestPanel`). | MIT | ~3.8 kB gzipped |
| **`SegmentedControl`** | Custom / iOS Spec | iOS tab switcher with spring scaling (`0.97` on press), keyboard arrow navigation, and audio clicks. | Replaced scattered disparate filter pills across `/console`, `/timeline`, and `/dispatch`. | MIT | < 1 kB |
| **`IOSDropdown`** | Radix UI Primitive | Accessible dropdown select with type-ahead, Escape dismiss, and scale/fade animation (180ms). | Replaced unstyled custom dropdowns in Navbar and scenario injectors. | MIT | ~2.1 kB gzipped |
| **`IOSAccordion`** | Radix UI Primitive | Accessible collapsible accordion where only one physics section opens at a time. | Replaced endless static scroll paragraphs and formulas on `/method`. | MIT | ~2.0 kB gzipped |
| **`IOSSwitch`** | Radix UI Primitive | iOS-style spring toggle switch with tactile audio click. | Replaced raw HTML checkbox and awkward button toggles for station online/offline state. | MIT | < 1 kB |
| **`CapabilityBadge`** | CAIRN Design System | Standardized capability indicator (`Live`, `Estimate`, `Template`, `Coming soon`) with icon plus text. | Replaced arbitrary color-only badges and ambiguous status indicators. | MIT | < 0.5 kB |
| **`WhatWorksSheet`** | CAIRN Design System | Universal header sheet accessible from any page detailing exact simulated vs. planned capabilities. | Clarifies truth in engineering across the entire application. | MIT | < 1.5 kB |

---

## 2. Three Unique Elements (Step 6)

1. **`CairnScrollIndicator`** (`components/ui/cairn-scroll-indicator.tsx`):  
   - Vertical floating three-stone lockup representing Promise 1 (Visible Network), Promise 2 (Store-and-Forward Healing), and Promise 3 (Tactical AI).  
   - Progressively illuminates stones with Signal Lime aura as the user scrolls.  
   - Includes full keyboard navigation, screen reader announcement, and reduced-motion text equivalent.

2. **`LinkStrengthRing`** (`components/ui/link-strength-ring.tsx`):  
   - Clean SVG arc showing "can reach Command in X hops" without gauge clutter.  
   - Plain-language status: *"Nominal line-of-sight propagation verified"* vs *"Occluded by Ridge — Waiting for Saddle Crest"*.  
   - Includes screen-reader text equivalent.

3. **`MessageTrail`** (`components/ui/message-trail.tsx`):  
   - Draws a clean orange line across multi-hop peer nodes on verified delivery.  
   - Switches to an animated dashed pause line when a message is held in node flash cache (store-and-forward).  
   - Includes screen-reader text equivalent.

---

## 3. Component Budget Verification

- **Budget Target:** At most 3 new components per page, 10 across the entire site.
- **Actual Installed Count:**
  - Drawer (`vaul`): 1
  - SegmentedControl: 1
  - IOSDropdown: 1
  - IOSAccordion: 1
  - IOSSwitch: 1
  - CapabilityBadge: 1
  - WhatWorksSheet: 1
  - 3 Unique Elements: 3
  - **Total: 10 components.** Strictly within budget.
