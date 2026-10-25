# 3D TERRAIN DESIGN BRIEF & TECHNICAL ART SPECIFICATION
## High-Precision Alpine Topography & Tactical Line-of-Contact (LOC) Environments

**Project:** CAIRN & Immersive Defense Visualization  
**Target Engine:** WebGL / Three.js (React Three Fiber) + Real-time GLTF/GLB Pipeline  
**Visual Direction:** Scientific Visualization meets Tactical Rugged Aerospace ("The Intelligence Instrument")  
**Target Reference Plates:** Plate 01 (Atmospheric Ridge Depth), Plate 02 (Dot-Wave Elevation Field), Plate 03 (Exploded Stratified Layers)  
**Live Mapbox Reference Style:** `mapbox://styles/alokxmapbox/cmvnp68an00sz01s592ws09cp` (Sector 04 Valais Alps 3D)  

---

## 1. Creative Direction & Aesthetic Philosophy

### The "Intelligence Instrument" Aesthetic
We are **not** creating a generic fantasy video game mountain or photorealistic dirt-and-grass terrain. The terrain model must look like a **precision-engineered geospatial instrument**:
- **Sculpted Geological Realism with Technical Restraint:** Sharp, erosion-accurate ridgelines, dramatic glacial couloirs, and deep shadowed cirques.
- **Data-Readable Topography:** Ridgelines must clearly represent **physical RF barriers**. Valleys must clearly represent **occluded dead zones**. A viewer must understand within 3 seconds why a radio signal cannot pierce the mountain.
- **Architectural / Stratified Styling (LOC Style):** Stepped contours, geological fault scarps, razorback passes, and crisp crest silhouettes reminiscent of high-altitude tactical lines of control (Karakoram, Western Alps, Ladakh border ranges).

### What to Avoid:
- NO generic green grassy hills or brown dirt noise.
- NO smooth blobby heightmaps; ridges must have crisp, fractured knife-edge crests.
- NO sci-fi glowing neon tron-grids; data illumination must be surgical and purposeful.

---

## 2. Four Terrain Archetypes Required (The 4 Environments)

Design **4 distinct terrain meshes (or sub-sectors)** to support different operational tactical scenarios:

### Terrain 01 — "The Knife-Edge Divide" (Classic Tactical LOC)
- **Topography:** A towering, razor-thin central spine (3,000m+ equivalent) that divides two isolated valleys.
- **Tactical Purpose:** Absolute line-of-sight blockage between forward patrol positions and base command.
- **Key Features:**
  - High-altitude saddle pass (col) at 2,600m acting as the only possible relay choke point.
  - Sheer rock faces on the north-facing escarpment; stepped scree ramps on the south.
  - Flat pedestal anchor points on 2 peak summits designed for mast antenna deployments.

### Terrain 02 — "The Glacial Cirque & Amphitheater" (Search & Rescue Bowl)
- **Topography:** A deep, U-shaped glacial bowl surrounded on three sides by near-vertical 70-degree cirque walls.
- **Tactical Purpose:** Illustrates severe multipath reflection, extreme RF shadow, and dead-zone isolation.
- **Key Features:**
  - Flat basin floor (elevation 1,900m) stepping down with moraine ridges.
  - Narrow canyon outlet (drainage gap) creating a natural defile.

### Terrain 03 — "The Stepped Plateau & Fault Blocks" (Stratified LOC / Plate 03)
- **Topography:** Fault-block mountain structure with distinct terraced benches and sheer vertical drop-offs.
- **Tactical Purpose:** Built specifically for exploded-layer and tactical sector division.
- **Key Features:**
  - Terraced elevation steps at defined contour intervals (e.g., 2,000m, 2,400m, 2,800m).
  - Clean horizontal strata lines that accentuate contour-line rendering and orthographic elevation analysis.

### Terrain 04 — "The Multi-Ridge Saddle Network" (Dot-Wave Mesh / Plate 02)
- **Topography:** An undulating series of 3 parallel, staggered ridgelines separated by alpine troughs.
- **Tactical Purpose:** Showcases multi-hop mesh routing where packet hops arc over intermediate peaks.
- **Key Features:**
  - Optimal balance of crest peaks and intermediate line-of-sight corridors.
  - Ideal topology for dot-matrix vertex displacement shaders.

---

## 3. Technical Specifications & Budgets

### Geometric Dimensions & Real-Time Scale
- **Virtual Unit Scale:** 1 unit = 100 meters (or normalized to a `[-50, +50]` bounding box in WebGL coordinates).
- **Equivalent Real-World Footprint:** 10 km × 10 km per tile.
- **Vertical Relief:** Base at `Y = 0.0` (1,800m ASL), Highest Peak at `Y = +14.0` (3,200m ASL).

### Polygon Budgets & Topology Requirements
- **Hero / High-Detail Model (Desktop):**
  - **Budget:** 40,000 to 60,000 triangles (or 150×150 quad grid).
  - **Topology:** Uniform, clean quad-based topology (or regularly sampled grid). Avoid irregular Delaunay triangles so custom GLSL vertex shaders can displace points cleanly along grid lines.
- **LOD 1 / Mobile Model:**
  - **Budget:** 8,000 to 12,000 triangles (or 60×60 grid).
- **Low-Poly Decimated Fallback:**
  - Clean edge-collapsed model with retained sharp ridge creases (crease angle 35°–45°).

### Vertex Color Baking (CRITICAL FOR SHADER INTEGRATION)
Please bake technical data into the **Vertex Colors (RGBA)**:
- **Red Channel (R):** Normalized Elevation `[0.0 = Valley Floor, 1.0 = Highest Peak]`.
- **Green Channel (G):** Surface Slope / Incline `[0.0 = Flat Basin, 1.0 = Vertical Cliff Face]`.
- **Blue Channel (B):** Ridge Crest Prominence / Occlusion Weight `[1.0 = Razor Ridge, 0.0 = Valley Trough]`.
- **Alpha Channel (A):** Ambient Occlusion / Crevasse Depth shadow.

---

## 4. Materials, PBR Texturing & Color Tokens

All materials must strictly conform to the **CAIRN Tactical Design Palette**:

| Element | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| **Deep Ground** | `#0E120A` | Deepest valley floors, atmospheric occlusion crevices, cavity shadows. |
| **Ground Rock** | `#1B1F16` | Base alpine rock faces, scree slopes, mid-elevation foundation. |
| **Surface Accent**| `#252A1E` | High-plateau benches, illuminated mountain slopes. |
| **Ridge Line** | `#3A4030` | 1px contour lines, topographic crest highlights. |
| **Signal Accent** | `#D4F53C` | Peak summit beacons, antenna deployment pads, active link anchors. |
| **Caution Accent**| `#FF8A3D` | Relay points, intervening ridge obstruction highlight points. |

### Texture Maps (2048×2048 & 1024×1024 sets)
1. **Normal Map (DirectX/OpenGL format):** High-frequency rock strata, glacial scouring, and chiseled crest edges.
2. **Ambient Occlusion (AO Map):** Deep shadows in cirque couloirs and valley floors.
3. **Roughness Map:** Matte, non-reflective stone surface (roughness 0.85–0.95), with subtle polished granite sheen on exposed peaks.
4. **16-bit Heightmap (EXR or 16-bit grayscale PNG):** Pure linear displacement height data for procedural WebGL and canvas fallback rendering.

---

## 5. Specific Features for Tactical Antennas & Stations

On each terrain model, include **pre-engineered station anchor locations**:
1. **Command Basecamp Pad:** A flat 50m×50m clearing in the main valley floor.
2. **Forward Outpost Benches:** 2 leveled natural rock ledges situated at 2,200m–2,400m.
3. **Relay Mast Summits:** 2 distinct sharp pinnacles with 5m flat tops, complete with pre-placed locator empty nodes (`LOC_NODE_RELAY_01`, `LOC_NODE_RELAY_02`) in the 3D hierarchy.
4. **Ridge Obstruction Zones:** Exactly one central ridge designed to breach the direct line-of-sight ray between Basecamp and Forward Outpost, with clearance delta of -120m to -180m.

---

## 6. Deliverable Package & Export Format

Please deliver the finished assets structured as follows:

```
cairn_terrains/
├── gltf/
│   ├── terrain_01_knife_edge_loc.glb        (Embedded textures & vertex colors)
│   ├── terrain_02_cirque_amphitheater.glb
│   ├── terrain_03_stepped_plateau.glb
│   └── terrain_04_multiridge_network.glb
├── heightmaps_16bit/
│   ├── terrain_01_height_16bit.png (or .exr)
│   ├── terrain_02_height_16bit.png
│   ├── terrain_03_height_16bit.png
│   └── terrain_04_height_16bit.png
├── textures_2k/
│   ├── terrain_shared_normal.png
│   ├── terrain_shared_ao.png
│   └── terrain_shared_roughness.png
└── source_blender_or_houdini/
    └── cairn_tactical_terrains_master.blend (.hip)
```

---

## 7. Designer's Quality Acceptance Checklist

Before delivering, verify:
- [ ] Model origin `(0, 0, 0)` is centered at the middle of the terrain grid base.
- [ ] Scales are frozen (scale `1.0, 1.0, 1.0`), rotation applied `(0, 0, 0)`.
- [ ] No non-manifold geometry, duplicate vertices, or flipped face normals.
- [ ] Ridge lines are sharp and identifiable in top-down orthographic view.
- [ ] Vertex colors are properly baked into channels R (Elevation), G (Slope), B (Crest), and A (AO).
- [ ] Tested in standard glTF viewer (e.g., https://gltf-viewer.donmccurdy.com/) with correct dark-matter tactical aesthetics.
