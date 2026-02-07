import React, { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./Experience";
import Loader from "./Loader";
import Header from "./Header";
import SpaceBackground from "./SpaceBackground";
import { SECTION_IDS } from "./sections";

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".content-block").forEach((block) => {
        gsap.fromTo(
          block,
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".interlude-text").forEach((text) => {
        gsap.fromTo(
          text,
          { scale: 0.8, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
              scrub: 1,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 100, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play reverse play reverse",
            },
            delay: (i % 3) * 0.1,
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const galleryImages = [
    "/images/img1.png",
    "/images/img2.png",
    "/images/img3.png",
    "/images/img4.png",
    "/images/img5.png",
    "/images/img6.png",
  ];

  const contentSections = [
    {
      id: SECTION_IDS.overview,
      eyebrow: "02 — AERODYNAMICS",
      title: "SCULPTED BY WIND",
      body: "Every curve is calculated. The composite fuselage creates a frictionless envelope, allowing the X-1 to slice through the atmosphere with near-zero drag coefficient at high velocity.",
    },
    {
      id: SECTION_IDS.flightSystem,
      eyebrow: "03 — FLIGHT SYSTEM",
      title: "NEURAL LINK CONTROL",
      body: "Interface directly with the core. Our proprietary haptic flight feedback loop syncs with your nervous system, making the machine an extension of your own will.",
    },
    {
      id: SECTION_IDS.engine,
      eyebrow: "04 — PROPULSION",
      title: "ION-CORE REACTOR",
      body: "Silent. Limitless. The dual-stage ion thrusters generate 40,000 lbs of thrust, powered by a magnetically contained singularity that hums with infinite potential.",
    },
    {
      id: SECTION_IDS.details,
      eyebrow: "05 — COCKPIT",
      title: "TOTAL IMMERSION",
      body: "Surrounded by bioactive glass and adaptive telemetry displays, the cockpit offers 360-degree visibility and life-support systems rated for stratospheric cruising.",
    },
    {
      id: SECTION_IDS.vision,
      eyebrow: "06 — HORIZON",
      title: "OWN THE SKIES",
      body: "The ground is a memory. Ascend to new heights and claim your place among the clouds. The X-1 isn't just transport; it's absolute freedom.",
    },
  ];

  return (
    <>
      <Loader />
      <SpaceBackground />
      <Header />
      <div className="landing-container" ref={containerRef}>
        <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0.2, 2.8], fov: 45, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <Experience isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>

        <section id={SECTION_IDS.hero} className="hero">
          <div className="content-block hero-block">
            <span className="eyebrow">01 — PROTOTYPE REVEAL</span>
            <h1>ATLAS X-1</h1>
            <p>
              Beyond gravity. The Atlas X-1 represents the pinnacle of
              anti-gravitic propulsion, fusing raw power with elegant
              aerodynamics for the ultimate flight experience.
            </p>
          </div>
          <div className="scroll-indicator" title="Scroll Down"></div>
        </section>

        {contentSections.slice(0, 1).map((section) => (
          <section id={section.id} key={section.id}>
            <div className="content-block">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}

        <div id={SECTION_IDS.rear} className="interlude-section">
          <div className="interlude-text">
            NO ROADS
            <br />
            NO LIMITS
          </div>
        </div>

        {contentSections.slice(1, 3).map((section) => (
          <section id={section.id} key={section.id}>
            <div className="content-block">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}

        <div id={SECTION_IDS.gallery} className="gallery-section">
          <div className="gallery-grid">
            {galleryImages.map((src, index) => (
              <div key={index} className="gallery-item">
                <img src={src} alt={`Concept Art ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {contentSections.slice(3, 4).map((section) => (
          <section id={section.id} key={section.id}>
            <div className="content-block">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}

        <div className="interlude-section">
          <div className="interlude-text">
            FUTURE
            <br />
            NOW
          </div>
        </div>

        {contentSections.slice(4).map((section) => (
          <section id={section.id} key={section.id}>
            <div className="content-block">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default App;
