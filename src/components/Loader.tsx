import { useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <div className={`loader-container ${progress === 100 ? "hidden" : ""}`}>
      <div className="loader-content">
        <div className="loader-spinner"></div>
        <div className="loader-text">{Math.round(progress)}%</div>
      </div>
    </div>
  );
};

export default Loader;
