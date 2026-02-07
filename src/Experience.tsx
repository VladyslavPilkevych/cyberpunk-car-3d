import { Environment, Float, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const SCENARIOS = [
  {
    id: "hero",
    position: new THREE.Vector3(0, 0.25, 1.4),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 32,
    lightIntensity: 0,
  },
  {
    id: "overview",
    position: new THREE.Vector3(1.8, 0.6, 2.6),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 45,
    lightIntensity: 0,
  },
  {
    id: "flight-system",
    position: new THREE.Vector3(-1.1, 1.1, 1.2),
    lookAt: new THREE.Vector3(0, 0.1, 0),
    fov: 38,
    lightIntensity: 0,
  },
  {
    id: "engine",
    position: new THREE.Vector3(0, 0.25, 1.4),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 32,
    lightIntensity: 5,
  },
  {
    id: "details",
    position: new THREE.Vector3(0.0, 1.6, 2.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 45,
    lightIntensity: 0,
  },
  {
    id: "vision",
    position: new THREE.Vector3(0, 0.25, 3.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 45,
    lightIntensity: 0,
  },
];

const ANIM_POINTS = {
  hero: 0.0,
  overview: 0.05,
  "flight-system": 0.1,
  engine: 0.2,
  details: 0.6,
  vision: 0.9,
} as const;

const damp = THREE.MathUtils.damp;

const Hovercar = ({
  spotLightRef,
}: {
  spotLightRef: React.RefObject<THREE.SpotLight | null>;
}) => {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const target = useRef({
    px: SCENARIOS[0].position.x,
    py: SCENARIOS[0].position.y,
    pz: SCENARIOS[0].position.z,
    lx: SCENARIOS[0].lookAt.x,
    ly: SCENARIOS[0].lookAt.y,
    lz: SCENARIOS[0].lookAt.z,
    fov: SCENARIOS[0].fov,
    light: SCENARIOS[0].lightIntensity,
    orbit: 0,
  });

  const animTarget = useRef({ t: 0 });
  const lookAtVec = useMemo(
    () =>
      new THREE.Vector3(
        target.current.lx,
        target.current.ly,
        target.current.lz,
      ),
    [],
  );
  const orbitAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const modelCenter = useMemo(() => new THREE.Vector3(), []);

  const { scene, animations } = useGLTF("/model/hovercar.glb");
  const { actions } = useAnimations(animations, group);

  const mainActionRef = useRef<THREE.AnimationAction | null>(null);
  const mainDurationRef = useRef(0);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh & { isMesh?: boolean };
      if (!mesh.isMesh) return;
      const n = (mesh.name || "").toLowerCase();
      if (
        n.startsWith("plane") ||
        n.includes("ground") ||
        n.includes("floor") ||
        n.includes("platform")
      )
        mesh.visible = false;
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    modelCenter.copy(center);
    scene.position.sub(center);
  }, [scene, modelCenter]);

  useEffect(() => {
    const list = Object.values(actions).filter(
      Boolean,
    ) as THREE.AnimationAction[];
    if (!list.length) return;

    const a = list[0];
    const d = a.getClip().duration;

    a.reset();
    a.play();
    a.paused = true;
    a.enabled = true;
    a.clampWhenFinished = true;

    mainActionRef.current = a;
    mainDurationRef.current = d;
    animTarget.current.t = 0;
  }, [actions]);

  useFrame((_, dt) => {
    const t = target.current;

    desiredPos
      .set(t.px, t.py, t.pz)
      .applyAxisAngle(orbitAxis, t.orbit);

    camera.position.set(
      damp(camera.position.x, desiredPos.x, 8, dt),
      damp(camera.position.y, desiredPos.y, 8, dt),
      damp(camera.position.z, desiredPos.z, 8, dt),
    );

    lookAtVec.set(
      damp(lookAtVec.x, t.lx, 8, dt),
      damp(lookAtVec.y, t.ly, 8, dt),
      damp(lookAtVec.z, t.lz, 8, dt),
    );

    camera.lookAt(lookAtVec);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = damp(camera.fov, t.fov, 8, dt);
      camera.updateProjectionMatrix();
    }

    if (spotLightRef.current) {
      spotLightRef.current.intensity = damp(
        spotLightRef.current.intensity,
        t.light,
        8,
        dt,
      );
    }

    const a = mainActionRef.current;
    if (a) {
      const nextTime = damp(a.time, animTarget.current.t, 10, dt);
      a.time = nextTime;
    }
  });

  useLayoutEffect(() => {
    let teardown: (() => void) | undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".landing-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      });

      const segments = SCENARIOS.length - 1;
      const duration = () => mainDurationRef.current || 0;

      SCENARIOS.forEach((s, i) => {
        if (i === 0) return;
        const at = i - 1;

        tl.to(
          target.current,
          {
            px: s.position.x,
            py: s.position.y,
            pz: s.position.z,
            lx: s.lookAt.x,
            ly: s.lookAt.y,
            lz: s.lookAt.z,
            fov: s.fov,
            light: s.lightIntensity,
            ease: "none",
            duration: 1,
          },
          at,
        );

        const p = ANIM_POINTS[s.id as keyof typeof ANIM_POINTS] ?? 0;
        tl.to(
          animTarget.current,
          {
            t: () => duration() * p,
            ease: "none",
            duration: 1,
          },
          at,
        );
      });

      tl.to(
        target.current,
        {
          orbit: Math.PI * 2,
          ease: "none",
          duration: segments,
        },
        0,
      );

      tl.totalDuration(segments);

      const syncToScroll = () => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
        tl.progress(tl.scrollTrigger?.progress ?? 0);
      };

      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(syncToScroll);
      });

      window.addEventListener("load", syncToScroll);
      window.addEventListener("pageshow", syncToScroll);
      ScrollTrigger.refresh();

      teardown = () => {
        cancelAnimationFrame(raf1);
        window.removeEventListener("load", syncToScroll);
        window.removeEventListener("pageshow", syncToScroll);
      };
    });

    return () => {
      teardown?.();
      ctx.revert();
    };
  }, []);

  return (
    <Float
      speed={2.5}
      rotationIntensity={0.2}
      floatIntensity={0.9}
      floatingRange={[-0.05, 0.05]}
    >
      <primitive
        ref={group}
        object={scene}
        scale={0.12}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </Float>
  );
};

const Experience = () => {
  const spotLightRef = useRef<THREE.SpotLight | null>(null);

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.4} />
      <spotLight
        ref={spotLightRef}
        position={[0, 0.5, 2]}
        angle={0.5}
        penumbra={1}
        intensity={0}
        distance={10}
      />
      <Hovercar spotLightRef={spotLightRef} />
    </>
  );
};

useGLTF.preload("/model/hovercar.glb");

export default Experience;
