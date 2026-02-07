import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { loadStarsPreset } from "@tsparticles/preset-stars";

const SpaceBackground = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    initParticlesEngine(async (engine) => {
      await loadStarsPreset(engine);
    }).then(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      preset: "stars",
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
      background: {
        color: "#05070f",
      },
      particles: {
        number: {
          value: 320,
          density: {
            enable: true,
            area: 900,
          },
        },
        size: {
          value: { min: 0.5, max: 1.8 },
        },
        opacity: {
          value: { min: 0.1, max: 0.6 },
        },
        move: {
          enable: true,
          speed: 0.12,
          direction: MoveDirection.none,
          outModes: OutMode.out,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
          resize: { enable: true },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!isReady) {
    return null;
  }

  return (
    <Particles
      id="space-background"
      options={options}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default SpaceBackground;
