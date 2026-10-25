# CAIRN — Design System Specification
**Product:** CAIRN Offline-First Mesh Communication & Situational Awareness  
**Design Tokens Architecture:** CSS Variables + Tailwind Utility Tokens  
**Reference Plates:** Atmospheric Depth (Plate 01), Dot-Wave Field (Plate 02), Exploded Layers (Plate 03)  

---

## 1. Design Philosophy: The Intelligence Instrument

CAIRN is engineered as an analytical instrument for alpine rescue teams, backcountry coordinators, and field researchers operating in zero-connectivity terrain. Every visual element communicates verified physical reality or algorithmic estimation.

### Anti-Patterns Explicitly Forbidden
- No decorative video-game HUD rings, sci-fi crosshairs, or rotating radar sweeps.
- No military camouflage patterns or olive-drab saturation.
- No fake classification stamps (`TOP SECRET`, `CLASSIFIED`) or random coordinate feeds.
- Status is **never indicated by color alone**: every state couples color with a semantic icon, text badge, and line stroke style (solid, dashed, dotted).

---

## 2. Color System & Semantic Tokens

All colors are exposed as CSS custom properties in `:root` and mapped directly into the Tailwind configuration.

```css
:root {
  /* Ground & Surfaces */
  --cairn-deep-ground: #0E120A; /* Background canvas */
  --cairn-ground:      #1B1F16; /* Primary container fill */
  --cairn-surface:     #252A1E; /* Elevated cards and sheets */
  --cairn-line:        #3A4030; /* 1px technical borders and dividers */

  /* Ink & Contrast */
  --cairn-ink:         #F1F0EA; /* Primary display & body text */
  --cairn-mute:        #A4A99A; /* Secondary labels & metadata */

  /* Tactical Signals */
  --cairn-signal:      #D4F53C; /* Active link, node online, delivered message */
  --cairn-caution:     #FF8A3D; /* Hop relay, packet in transit, warning */
  --cairn-severed:     #555E49; /* Broken link, blocked line of sight */

  /* Atmospheric Gradients */
  --gradient-sky-haze: linear-gradient(180deg, #0C0F08 0%, #2A3320 38%, #6E7A3A 75%, #C9D96A 100%);
  --gradient-glass:    linear-gradient(180deg, rgba(37, 42, 30, 0.75) 0%, rgba(27, 31, 22, 0.85) 100%);
}
```

### Multi-Modal State Matrix

| State | Color Token | Icon | Text Label | Stroke Style |
| :--- | :--- | :--- | :--- | :--- |
| **Direct Link (LOS)** | `--cairn-signal` (`#D4F53C`) | `Radio` / `CheckCircle2` | `ONLINE (DIRECT)` | Solid 2px |
| **Relay Route (Mesh)** | `--cairn-caution` (`#FF8A3D`) | `GitFork` / `Repeat` | `RELAY (N HOPS)` | Dashed 2px |
| **Severed / Blocked** | `--cairn-severed` (`#555E49`) | `AlertTriangle` / `XCircle` | `SEVERED (LOS BLOCKED)`| Dotted 1.5px |
| **Queued (Store & Fwd)**| `--cairn-caution` (`#FF8A3D`) | `Clock` / `Archive` | `QUEUED IN CACHE` | Pulsing dashed |

---

## 3. Atmospheric Depth & Ridge Shading (Plate 01)

Depth is created using the 4-layer atmospheric attenuation model:
1. **Ridge 01 (Foreground):** `#1B1F16` — high contrast, crisp silhouette, antenna anchors.
2. **Ridge 02 (Midground 1):** `#2A3320` — subtle haze layer at 15% opacity.
3. **Ridge 03 (Midground 2):** `#3E4A28` — atmospheric haze at 35% opacity.
4. **Ridge 04 (Background):** `#5E6C38` — merging into sky gradient horizon at 60% haze.

---

## 4. Dot-Wave Field Terrain System (Plate 02)

The central spatial terrain in the Hero and 3D Console is rendered via WebGL (custom GLSL shaders):
- **Vertex Shader:** Displaces points on a regular grid according to a procedural mountain DEM (sum of octaves of Perlin/simplex noise + sinusoidal ridge folds). Point height $y = f(x, z)$.
- **Fragment Shader:** Evaluates point size and alpha based on camera depth and elevation. Higher elevations receive brighter `--cairn-signal` lime tint, while valleys attenuate into deep ground.
- **Dynamic Packet Trace:** Luminous cubic bezier curve with moving particle heads rendering store-and-forward packet transit from node to node.

---

## 5. Exploded Data Layers (Plate 03)

To ensure zero ambiguity regarding model truthfulness, the console supports an Exploded Layers projection:
- **Layer 3 (Top): Messages & Events** (`#FF8A3D`) — Label: `OBSERVED (SIM)`. Real-time store-and-forward packet deliveries and node check-ins.
- **Layer 2 (Middle): Network Links** (`#D4F53C`) — Label: `ESTIMATED (LINE OF SIGHT)`. Computed RF links based on Fresnel zone clearance and antenna height over terrain.
- **Layer 1 (Bottom): Topographic Terrain** (`#3A4030`) — Label: `SIMULATED MODEL`. Procedural digital elevation model with contour intervals.

---

## 6. Typography Scale & Hierarchy

- **Display Headline:** `Big Shoulders Display`, uppercase, `letter-spacing: -0.03em`, `line-height: 0.86`. Sizes: 40px, 64px, clamp(48px, 8vw, 128px).
- **Body & Editorial:** `Space Grotesk` or `Inter`, clean geometric sans, optimal legibility down to 12px.
- **Telemetry & Data Tables:** `JetBrains Mono`, tabular figures, strict column alignment.

---

## 7. Responsive Grid & Interaction Targets

- **Base Unit:** 4px grid (4, 8, 12, 16, 24, 32, 48, 64, 96).
- **Desktop:** 12-column layout with 24px gutters.
- **Mobile (<= 640px):** 4-column layout with 16px gutters, collapsible bottom sheet drawer for node details.
- **Touch Targets:** Minimum 44px x 44px for all interactive buttons, node selectors, and toggles.
- **Keyboard Navigation:** Full arrow-key mesh traversal, `O` (offline toggle), `S` (send message), `?` (shortcut sheet).
