
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FilePlus,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Search,
  Trophy,
  User,
  X,
} from "lucide-react";

import "./Navbar.css";

const translations = {
  en: {
    tagline: "Citizen Complaint Portal",
    langLabel: "Switch to Hindi",
    english: "English",
    hindi: "Hindi",
    profile: "My account",
    menu: "Menu",
    close: "Close menu",
    nav: {
      home: "Home",
      explore: "Explore Issues",
      leaderboard: "Leaderboard",
      report: "Report Issue",
      dashboard: "Dashboard",
      login: "Login",
    },
  },

  hi: {
    tagline: "नागरिक शिकायत पोर्टल",
    langLabel: "Switch to English",
    english: "अंग्रेज़ी",
    hindi: "हिन्दी",
    profile: "मेरा खाता",
    menu: "मेनू",
    close: "मेनू बंद करें",
    nav: {
      home: "मुख्य पृष्ठ",
      explore: "समस्याएँ देखें",
      leaderboard: "लीडरबोर्ड",
      report: "शिकायत दर्ज करें",
      dashboard: "डैशबोर्ड",
      login: "लॉगिन",
    },
  },
};

const links = [
  { to: "/", key: "home", icon: Home, end: true },
  { to: "/explore", key: "explore", icon: Search },
  { to: "/leaderboard", key: "leaderboard", icon: Trophy },
  { to: "/report-issue", key: "report", icon: FilePlus },
];

export default function Navbar({
  lang = "en",
  onLangChange = () => {},
  user = null,
}) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = translations[currentLang];

  const isLoggedIn = Boolean(user);

  const accountLink = {
    to: isLoggedIn ? "/dashboard" : "/login",
    key: isLoggedIn ? "dashboard" : "login",
    icon: isLoggedIn ? LayoutDashboard : LogIn,
  };

  const menuLinks = [...links, accountLink];

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close menu on Escape or outside click
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  // Change language
  const changeLanguage = () => {
    onLangChange(currentLang === "en" ? "hi" : "en");
  };

  return (
    <header className="gn" lang={currentLang}>
      {/* Tricolour strip */}
      <div className="gn-tricolour" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* Main navigation */}
      <nav className="gn-bar" aria-label="Main navigation">
        {/* Brand */}
        <Link
          to="/"
          className="gn-brand"
          aria-label="CivicSetu home"
          onClick={() => setOpen(false)}
        >
          <img
            className="gn-emblem"
            src="/civicsetu-emblem.png"
            alt=""
            aria-hidden="true"
          />

          <span className="gn-divider" aria-hidden="true" />

          <span className="gn-name">
            <strong>CivicSetu</strong>
            <small>{t.tagline}</small>
          </span>
        </Link>

        {/* Right-side actions */}
        <div className="gn-actions">
          {/* Language switcher */}
          <button
            type="button"
            className={`gn-lang ${
              currentLang === "hi"
                ? "is-hindi"
                : "is-english"
            }`}
            onClick={changeLanguage}
            aria-label={t.langLabel}
            title={t.langLabel}
            role="switch"
            aria-checked={currentLang === "hi"}
          >
            <span className="gn-lang-thumb" aria-hidden="true">
              <span
                className="gn-lang-burst"
                key={currentLang}
              />
            </span>

            <span
              className="gn-lang-opt gn-lang-opt-hi"
              lang="hi"
              aria-hidden="true"
            >
              अ
            </span>

            <span
              className="gn-lang-opt gn-lang-opt-en"
              lang="en"
              aria-hidden="true"
            >
              A
            </span>
          </button>

          {/* Profile: Dashboard if logged in, Login otherwise */}
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="gn-icon-btn"
            aria-label={t.profile}
            title={t.profile}
            onClick={() => setOpen(false)}
          >
            <User size={20} aria-hidden="true" />
          </Link>

          {/* Menu */}
          <div className="gn-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className={`gn-icon-btn gn-burger ${
                open ? "is-open" : ""
              }`}
              aria-expanded={open}
              aria-controls="gn-menu"
              aria-label={open ? t.close : t.menu}
              onClick={() =>
                setOpen((previous) => !previous)
              }
            >
              <Menu
                size={21}
                className="gn-ico-menu"
                aria-hidden="true"
              />

              <X
                size={21}
                className="gn-ico-close"
                aria-hidden="true"
              />
            </button>

            {/* Dropdown */}
            <div
              id="gn-menu"
              className={`gn-menu ${
                open ? "is-open" : ""
              }`}
              aria-hidden={!open}
              inert={!open}
            >
              <p className="gn-menu-title">
                {t.menu}
              </p>

              <ul>
                {menuLinks.map(
                  ({ to, key, icon: Icon, end }, index) => (
                    <li
                      key={to}
                      style={{ "--i": index }}
                    >
                      <NavLink
                        to={to}
                        end={end}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          isActive ? "is-active" : ""
                        }
                      >
                        <Icon
                          size={18}
                          aria-hidden="true"
                        />

                        <span>{t.nav[key]}</span>
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
