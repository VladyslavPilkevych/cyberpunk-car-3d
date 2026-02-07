# Cyberpunk Car 3D

A high-performance, visually stunning 3D landing page featuring a futuristic cyberpunk hovercar. This project demonstrates advanced web graphics, smooth GSAP animations, and immersive scroll-based interactions.

---

## Features

- **3D Interactive Model**: A highly detailed cyberpunk hovercar (GLB) with dynamic lighting and reflections.
- **Cinematic Transitions**: Smooth camera paths orchestrated by GSAP ScrollTrigger that respond to user scrolling.
- **Immersive Environment**:
  - **Starfield Background**: A deep-space atmosphere powered by `tsparticles`.
  - **Dynamic Lighting**: Real-time spotlight and ambient lighting effects that react to the car's position.
- **Glassmorphism UI**: Modern, translucent interface elements with backdrop blur and sleek typography.
- **Responsive Design**: Fully optimized for Desktop and Mobile experiences.
- **Hover Effects**: Micro-animations and scale transitions for interactive gallery elements.

## Tech Stack

- **Framework**: [React 19](https://reactjs.org/)
- **3D Engine**: [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber)
- **3D Utilities**: [`@react-three/drei`](https://github.com/pmndrs/drei)
- **Animation**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) with ScrollTrigger
- **Particles**: [`@tsparticles/react`](https://particles.js.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/VladyslavPilkevych/cyberpunk-car-3d.git
   cd cyberpunk-car-3d
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/Experience.tsx`: The heart of the 3D scene, containing the car model, camera logic, and GSAP scroll timelines.
- `src/SpaceBackground.tsx`: Implements the starfield background using particle systems.
- `src/App.tsx`: The main entry point that coordinates the 3D canvas and UI sections.
- `src/index.css`: Contains the custom design system, including Glassmorphism and scroll-indicator animations.

## Aesthetics

The project follows a "High Tech, Low Life" aesthetic:

- **Primary Font**: `Outfit` (Modern, geometric sans-serif)
- **Color Palette**: Dark background (`#050505`) with deep blue accents (`#007aff`) and sleek silver gradients.

---

## Credits

This project uses a third-party 3D asset under a Creative Commons license.
The model was modified and integrated into an interactive Three.js experience.

3D model "Free Cyberpunk Hovercar" by Lionsharp Studios
Source: https://sketchfab.com/3d-models/free-cyberpunk-hovercar-3205b1075bb44ffc826bce0c2a04d74c
License: Creative Commons Attribution–ShareAlike (CC BY-SA)

## License

This project’s source code is licensed under the MIT License.  
Third-party assets are licensed under their respective licenses.
