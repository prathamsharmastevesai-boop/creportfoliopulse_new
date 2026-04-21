import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./appHeader.css";

const role = sessionStorage.getItem("role");

export const AppHeader = ({
  companyName: companyNameProp,
  showHero = true,
  sidebarCollapsed = true,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");
  const [is_owner_admin, setOwneradmin] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
    const is_owner_admin = sessionStorage.getItem("is_owner_admin");
    setOwneradmin(is_owner_admin);
  }, []);

  const getPulsePath = () => {
    const isOwnerAdmin = JSON.parse(
      sessionStorage.getItem("is_owner_admin") || "false",
    );

    if (role === "admin") {
      return isOwnerAdmin ? "/the-pulse-upload" : "/admin-the-pulse";
    }

    if (role === "superuser") return "/super-user-the-pulse";

    return "/user-the-pulse";
  };

  const NAV_TABS =
    role === "admin" || role === "superuser"
      ? [{ key: "the-pulse", label: "The Pulse", path: getPulsePath() }]
      : [
          { key: "the-pulse", label: "The Pulse", path: getPulsePath() },
          { key: "ask-gemini", label: "Ask Gemini", path: "/gemini-chat" },
          {
            key: "ai-abstract",
            label: "AI Abstract",
            path: "/ai-lease-abstract-upload",
          },
          { key: "cre-news", label: "CRE News", path: "/cre-news" },
          {
            key: "lead-deal-tracker",
            label: "Lead & Deal Tracker",
            path: "/deal-list",
          },
        ];

  const companyName =
    companyNameProp || sessionStorage.getItem("company_name") || "Miles";

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const headerLeft = sidebarCollapsed
    ? "var(--sidebar-width, 60px)"
    : "var(--sidebar-expanded-width, 240px)";

  return (
    <>
      <header className="app-header" ref={menuRef} style={{ left: headerLeft }}>
        <div className="app-header__bar">
          {showHero && (
            <div className="app-header__welcome">
              <span className="app-header__welcome-text">
                WELCOME TO <strong>{companyName.toUpperCase()} AI</strong>
              </span>
            </div>
          )}

          <nav className="app-header__nav">
            <ul className="app-header__tab-list">
              {NAV_TABS.map((tab) => (
                <li key={tab.key} className="app-header__tab-item">
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `app-header__tab-link${
                        isActive ? " app-header__tab-link--active" : ""
                      }`
                    }
                  >
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className={`app-header__hamburger${
              menuOpen ? " app-header__hamburger--open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className={`app-header__drawer${
            menuOpen ? " app-header__drawer--open" : ""
          }`}
        >
          <ul className="app-header__drawer-list">
            {NAV_TABS.map((tab) => (
              <li key={tab.key}>
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `app-header__drawer-link${
                      isActive ? " app-header__drawer-link--active" : ""
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {menuOpen && (
        <div
          className="app-header__backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};
