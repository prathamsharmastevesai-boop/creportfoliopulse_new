import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./appHeader.css";

const NAV_TABS = [
  {
    key: "the-pulse",
    label: "The Pulse",
    path: "/the-pulse",
    alwaysVisible: true,
  },
  {
    key: "ask-gemini",
    label: "Ask Gemini",
    path: "/gemini-chat",
    permissionKey: "gemini_chat_enabled",
  },
  {
    key: "ai-abstract",
    label: "AI Abstract",
    path: "/ai-lease-abstract-upload",
    permissionKey: "ai_lease_abstract_enabled",
  },
  {
    key: "cre-news",
    label: "CRE News",
    path: "/cre-news",
    alwaysVisible: true,
  },
  {
    key: "lead-deal-tracker",
    label: "Lead & Deal Tracker",
    path: "/deal-list",
    permissionKey: "deal_tracker_enabled",
  },
];

export const AppHeader = ({
  companyName: companyNameProp,
  showHero = true,
  sidebarCollapsed = true,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const companyName =
    companyNameProp || sessionStorage.getItem("company_name") || "Miles";

  const { userdata } = useSelector((state) => state.ProfileSlice);

  const isAdmin = sessionStorage.getItem("role");

  const isTabVisible = (tab) => {
    if (isAdmin == "admin") {
      return tab.key === "the-pulse";
    }

    if (tab.alwaysVisible) return true;

    if (tab.permissionKey) {
      return Boolean(userdata?.[tab.permissionKey]);
    }

    return false;
  };

  const visibleTabs = NAV_TABS.filter(isTabVisible);

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

  const handleNavClick = () => setMenuOpen(false);

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

          <nav className="app-header__nav" aria-label="Main navigation">
            <ul className="app-header__tab-list">
              {visibleTabs.map((tab) => (
                <li key={tab.key} className="app-header__tab-item">
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `app-header__tab-link${isActive ? " app-header__tab-link--active" : ""}`
                    }
                  >
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className={`app-header__hamburger${menuOpen ? " app-header__hamburger--open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className={`app-header__drawer${menuOpen ? " app-header__drawer--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <nav aria-label="Mobile navigation">
            <ul className="app-header__drawer-list">
              {visibleTabs.map((tab) => (
                <li key={tab.key}>
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `app-header__drawer-link${isActive ? " app-header__drawer-link--active" : ""}`
                    }
                    onClick={handleNavClick}
                  >
                    {tab.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div
          className="app-header__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
