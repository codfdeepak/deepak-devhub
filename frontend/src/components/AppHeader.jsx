import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import logoDark from "../assets/logo1.png";
import logoLight from "../assets/logo2.png";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/technologies", label: "Technologies" },
  { to: "/services", label: "Services" },
  { to: "/payment-policy", label: "Payment Policy" },
  { to: "/partners", label: "Partners" },
  { to: "/about-us", label: "About Us" },
  { to: "/contact-us", label: "Contact Us" },
];

function SunMetalIcon() {
  return (
    <svg className="theme-icon-metal" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="sun-ray-grad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f8df88" />
          <stop offset="55%" stopColor="#d9a63c" />
          <stop offset="100%" stopColor="#9b6a28" />
        </linearGradient>
        <radialGradient id="sun-core-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff2b5" />
          <stop offset="65%" stopColor="#e7b84b" />
          <stop offset="100%" stopColor="#a86f2b" />
        </radialGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#sun-ray-grad)"
        strokeLinecap="round"
        strokeWidth="1.8"
      >
        <path d="M12 2.6v2.3M12 19.1v2.3M21.4 12h-2.3M4.9 12H2.6M18.6 5.4l-1.6 1.6M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4" />
      </g>
      <circle
        cx="12"
        cy="12"
        r="4.3"
        fill="url(#sun-core-grad)"
        stroke="#8f6426"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function MoonMetalIcon() {
  return (
    <svg className="theme-icon-metal" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="moon-main-grad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f6df95" />
          <stop offset="55%" stopColor="#d6a24a" />
          <stop offset="100%" stopColor="#98662c" />
        </linearGradient>
        <linearGradient id="moon-mini-grad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffeebd" />
          <stop offset="100%" stopColor="#b97d34" />
        </linearGradient>
      </defs>
      <path
        d="M15.2 3.4a8.5 8.5 0 1 0 5.4 15.3 7.9 7.9 0 0 1-5.4-15.3Z"
        fill="url(#moon-main-grad)"
        stroke="#8f6426"
        strokeWidth="0.6"
      />
      <path
        d="M8.7 5.6a5.2 5.2 0 1 0 3.4 9.3 4.8 4.8 0 0 1-3.4-9.3Z"
        fill="url(#moon-mini-grad)"
        stroke="#8f6426"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function AppHeader({ theme, navOpen, onToggleTheme, onToggleNav, onCloseNav }) {
  const [hoveredPath, setHoveredPath] = useState("");
  const clearHoverTimerRef = useRef(null);
  const closeNavTimerRef = useRef(null);

  const getNavClassName = (isActive, path) => {
    const classNames = [];
    if (isActive) classNames.push("active");
    if (hoveredPath === path) classNames.push("hovered");
    return classNames.join(" ");
  };

  const queueHoverClear = (delay = 260) => {
    if (clearHoverTimerRef.current) {
      window.clearTimeout(clearHoverTimerRef.current);
    }
    clearHoverTimerRef.current = window.setTimeout(() => {
      setHoveredPath("");
      clearHoverTimerRef.current = null;
    }, delay);
  };

  const queueNavClose = (delay = 0) => {
    if (closeNavTimerRef.current) {
      window.clearTimeout(closeNavTimerRef.current);
      closeNavTimerRef.current = null;
    }

    if (delay <= 0) {
      onCloseNav();
      return;
    }

    closeNavTimerRef.current = window.setTimeout(() => {
      onCloseNav();
      closeNavTimerRef.current = null;
    }, delay);
  };

  const isCoarsePointer = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  const handleNavItemClick = () => {
    if (clearHoverTimerRef.current) {
      window.clearTimeout(clearHoverTimerRef.current);
      clearHoverTimerRef.current = null;
    }

    if (isCoarsePointer()) {
      // Keep tap highlight visible briefly on mobile before menu closes.
      queueHoverClear(360);
      queueNavClose(120);
      return;
    }

    setHoveredPath("");
    queueNavClose();
  };

  useEffect(
    () => () => {
      if (clearHoverTimerRef.current) {
        window.clearTimeout(clearHoverTimerRef.current);
      }
      if (closeNavTimerRef.current) {
        window.clearTimeout(closeNavTimerRef.current);
      }
    },
    [],
  );

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <div className="brand">
          <div className="brand-mark">
            <img
              src={theme === "dark" ? logoDark : logoLight}
              alt="Deepak Kumar logo"
            />
          </div>
          <div className="brand-copy">
            <span className="brand-title">MeraDev Technologies</span>
            <span className="brand-tag">Tech Solution Company</span>
          </div>
        </div>
      </div>

      <div className={`nav-links ${navOpen ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => getNavClassName(isActive, item.to)}
            onMouseEnter={() => setHoveredPath(item.to)}
            onMouseLeave={() => setHoveredPath("")}
            onTouchStart={() => setHoveredPath(item.to)}
            onTouchEnd={queueHoverClear}
            onTouchCancel={() => setHoveredPath("")}
            onClick={handleNavItemClick}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <SunMetalIcon /> : <MoonMetalIcon />}
        </button>

        <button
          type="button"
          className={`burger ${navOpen ? "open" : ""}`}
          onClick={onToggleNav}
          aria-label="Toggle menu"
          aria-expanded={navOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default AppHeader;
