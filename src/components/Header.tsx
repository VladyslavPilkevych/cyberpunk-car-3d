import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SECTION_IDS } from "@/utils/sections";

gsap.registerPlugin(ScrollToPlugin);

const Header = () => {
  const navItems = [
    { label: "Hero", target: `#${SECTION_IDS.hero}` },
    { label: "Overview", target: `#${SECTION_IDS.overview}` },
    { label: "Flight System", target: `#${SECTION_IDS.flightSystem}` },
    { label: "Engine", target: `#${SECTION_IDS.engine}` },
    { label: "Details", target: `#${SECTION_IDS.details}` },
  ];

  const handleScrollTo = (target: string) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: target, offsetY: 0 },
      ease: "power2.inOut",
    });
  };

  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-text">3D Sky Drive</span>
      </div>
      <nav className="header-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.target}>
              <button
                onClick={() => handleScrollTo(item.target)}
                className="nav-link"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
