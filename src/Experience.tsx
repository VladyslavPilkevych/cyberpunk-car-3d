import { Environment, Float, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SECTION_IDS, type SectionId } from "./sections";
import { asset } from "./utils/assets";

gsap.registerPlugin(ScrollTrigger);

const SCENARIOS: Array<{
  id: SectionId;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
  lightIntensity: number;
}> = [
  {
    id: SECTION_IDS.hero,
    position: new THREE.Vector3(0, 0.25, 1.4),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 32,
    lightIntensity: 0,
  },
  {
    id: SECTION_IDS.overview,
    position: new THREE.Vector3(1.8, 0.6, 2.6),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 35,
    lightIntensity: 0,
  },
  {
    id: SECTION_IDS.rear,
    position: new THREE.Vector3(1.3, -0.3, 1.885),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 30,
    lightIntensity: 0,
  },
  {
    id: SECTION_IDS.flightSystem,
    position: new THREE.Vector3(2.1, -0.4, 3.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 38,
    lightIntensity: 0,
  },
  {
    id: SECTION_IDS.engine,
    position: new THREE.Vector3(0, 0.25, 1.4),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 32,
    lightIntensity: 5,
  },
  {
    id: SECTION_IDS.gallery,
    position: new THREE.Vector3(2.5, 0.8, 3.5),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 40,
    lightIntensity: 3,
  },
  {
    id: SECTION_IDS.details,
    position: new THREE.Vector3(0.0, 1.6, 2.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 45,
    lightIntensity: 0,
  },
  {
    id: SECTION_IDS.vision,
    position: new THREE.Vector3(0, 0.25, 3.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 45,
    lightIntensity: 0,
  },
];

const ANIM_POINTS: Record<SectionId, number> = {
  [SECTION_IDS.hero]: 0.0,
  [SECTION_IDS.overview]: 0.0,
  [SECTION_IDS.rear]: 0.04,
  [SECTION_IDS.flightSystem]: 0.08,
  [SECTION_IDS.engine]: 0.1,
  [SECTION_IDS.gallery]: 0.2,
  [SECTION_IDS.details]: 0.09,
  [SECTION_IDS.vision]: 0.0,
};

const damp = THREE.MathUtils.damp;

const Hovercar = ({
  spotLightRef,
  isMobile,
}: {
  spotLightRef: React.RefObject<THREE.SpotLight | null>;
  isMobile: boolean;
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

  const { scene, animations } = useGLTF(asset("model/hovercar.glb"));
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
      .applyAxisAngle(orbitAxis, isMobile ? 0 : t.orbit);

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

        const p = ANIM_POINTS[s.id] ?? 0;
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
      speed={isMobile ? 1.5 : 2.5}
      rotationIntensity={isMobile ? 0.1 : 0.2}
      floatIntensity={isMobile ? 0.5 : 0.9}
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

const Experience = ({ isMobile = false }: { isMobile?: boolean }) => {
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
      <Hovercar spotLightRef={spotLightRef} isMobile={isMobile} />
    </>
  );
};

useGLTF.preload(asset("model/hovercar.glb"));

export default Experience;
