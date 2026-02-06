import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Loader from "./Loader";
import Header from "./Header";

const App: React.FC = () => {
  return (
    <>
      <Loader />
      <Header />
      <div className="landing-container">
        <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0.2, 2.8], fov: 45, near: 0.1, far: 100 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </div>

        <section id="hero" className="hero">
          <h1>3D Sky Drive</h1>
          <p>Elevate your digital storage to the next dimension.</p>
          <div className="scroll-indicator" title="Scroll Down"></div>
        </section>

        <section id="overview">
          <div className="content-block">
            <h2>Neural Storage</h2>
            <p>
              Experience data access at the speed of thought. Our decentralized
              3D grid organizes your files in a spatial environment that feels
              natural and intuitive.
            </p>
          </div>
        </section>

        <section id="flight-system">
          <div className="content-block">
            <h2>Vortex Protocol</h2>
            <p>
              Powered by the latest breakthrough in quantum encryption, your
              data is atomized and distributed across the sky network with
              zero-knowledge security.
            </p>
          </div>
        </section>

        <section id="engine">
          <div className="content-block">
            <h2>Quantum Core</h2>
            <p>
              At the heart of the drive lies a singularity engine, capable of
              compressing petabytes into sub-atomic clusters instantly.
            </p>
          </div>
        </section>

        <section id="details">
          <div className="content-block">
            <h2>Spacial Interaction</h2>
            <p>
              Don't just browse files—move through them. Our immersive interface
              allows you to visualize data clusters and navigate your digital
              universe in real-time.
            </p>
          </div>
        </section>

        <section id="vision">
          <div className="content-block">
            <h2>Infinite Horizon</h2>
            <p>
              Ready to explore? Join the future of human-computer interaction
              and let your data take flight in the 3D Sky Drive ecosystem.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default App;
