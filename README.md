# UTD-Graphics-Final-Project

A **3D Solar System visualization** built with Three.js and Vite.

## Features 

- **Realistic Solar System**: All 8 planets with proper relative sizes
- **Sun as Light Source**: Planets have lit and shadowed sides
- **Orbital Motion**: Each planet orbits at realistic speeds (inner planets faster)
- **Moon**: Orbits Earth (not the Sun)
- **Saturn's Rings**: Transparent rings with proper tilting
- **Asteroid Belt**: 500+ asteroids between Mars and Jupiter
- **Orbit Visualization**: Faint lines showing each planet's orbital path
- **Planet Labels**: Text labels for all celestial bodies
- **Interactive Camera**: Rotate, zoom, and click planets to focus

## Project Setup

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build
```

Then open **http://localhost:5173/** in your browser.

## Project Structure

```
├── index.html                    # Main HTML file
├── style.css                     # Styling
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies
├── javascript/
│   ├── main.js                  # Main scene setup & animation loop
│   ├── planets.js               # Planet, ring, and asteroid creation functions
│   └── cameraControls.js        # Camera control setup (OrbitControls)
├── shaders/
│   ├── vertex/
│   │   ├── planetGenericVertex.glsl
│   │   └── sunVertex.glsl
│   └── fragment/
│       ├── planetGenericFragment.glsl
│       └── sunFragment.glsl
└── assets/                       # Textures (Sun, Earth, Mars)
    ├── 8k_sun.jpg
    ├── 8k_earth_daymap.jpg
    ├── mars6ksurface.jpg
    └── 8k_stars_milky_way.jpg
```

## Controls

- **Mouse Drag**: Rotate camera view
- **Scroll Wheel**: Zoom in/out
- **Click Planet**: Center camera on that planet

## Technical Details

### Libraries

- **Three.js**: 3D graphics rendering
- **Vite**: Fast build tool and dev server
- **OrbitControls**: Interactive camera control

### Key Implementation Details

- Planets use `MeshPhongMaterial` for realistic lighting
- Sun acts as main `PointLight` (intensity: 2)
- Ambient light (intensity: 0.4) for night-side visibility
- Orbital speeds decrease with distance from Sun (Kepler's laws inspired)
- Labels use Canvas texture rendering as Three.js Sprites
- Asteroid belt optimized with cloned materials

## Future Improvements

- Custom shaders for more realistic planet surfaces
- Planet rotation axes tilting
- Moons for other planets
- Comet/meteor effects
- Performance optimizations for larger asteroid counts
- Real astronomical data integration

---

**Status**: Fully functional solar system with all major features implemented.
