import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./appHeader.css";

export const AppHeader = ({
  companyName: companyNameProp,
  showHero = true,
  sidebarCollapsed = true,
  isMobile = false,
  headerLeft,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  const { userdata } = useSelector((state) => state.ProfileSlice);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const getPulsePath = () => {
    const isOwnerAdmin = JSON.parse(
      sessionStorage.getItem("is_owner_admin") || "false",
    );
    if (role === "admin")
      return isOwnerAdmin ? "/the-pulse-upload" : "/admin-the-pulse";
    if (role === "superuser") return "/super-user-the-pulse";
    return "/user-the-pulse";
  };

  const NAV_TABS =
    role === "admin" || role === "superuser"
      ? [
          { key: "the-pulse", label: "The Pulse", path: getPulsePath() },
          {
            key: "pulse-forum",
            label: "Pulse Forum",
            path: "/admin-portfolio-forum",
          },
        ]
      : [
          { key: "the-pulse", label: "The Pulse", path: getPulsePath() },
          {
            key: "ask-portfolio-pulse",
            label: "Ask Portfolio Pulse",
            path: "/gemini-chat",
          },
          {
            key: "ai-abstract",
            label: "AI Lease Abstract",
            path: "/ai-lease-abstract-upload",
          },
          { key: "cre-news", label: "CRE News", path: "/cre-news" },
          { key: "pulse-forum", label: "Pulse Forum", path: "/pulse-forum" },
          // { key: "lead-deal-tracker", label: "Lead & Deal Tracker", path: "/deal-list" },
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

  const computedLeft =
    headerLeft || (isMobile ? "0px" : sidebarCollapsed ? "0px" : "240px");

  const handleNavigation = () => {
    if (role == "admin") {
      navigation.navigate("/admin-profile");
    } else {
      navigation.navigate("/user-profile");
    }
  };

  return (
    <>
      <header
        className="app-header"
        ref={menuRef}
        style={{ left: computedLeft, transition: "left 0.3s ease" }}
      >
        <div className="app-header__bar">
          {isMobile && (
            <button
              className={`app-header__hamburger${menuOpen ? " app-header__hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}

          {showHero && role !== "superuser" && (
            <div className="app-header__welcome">
              <span className="app-header__welcome-text">
                WELCOME TO <strong>{companyName.toUpperCase()} AI</strong>
              </span>
            </div>
          )}

          {!isMobile && (
            <nav className="app-header__nav">
              <ul className="app-header__tab-list">
                {NAV_TABS.map((tab) => (
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
          )}

          {(role === "user" || role === "admin") && (
            <div
              className="li-header-profile ms-auto"
              onClick={() => handleNavigation()}
            >
              <div className="li-header-profile-avatar">
                {userdata?.photo_url ? (
                  <img src={userdata.photo_url} alt="Profile" />
                ) : (
                  <div className="li-header-profile-initial">
                    {(userdata?.name ||
                      sessionStorage.getItem("name") ||
                      "U")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className="li-header-profile-info">
                  <span className="li-header-profile-name">
                    {userdata?.name || sessionStorage.getItem("name") || "User"}
                  </span>
                  <span className="li-header-profile-role">{role}</span>
                </div>
              )}
            </div>
          )}

          {!isMobile && (
            <button
              className={`app-header__hamburger${menuOpen ? " app-header__hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>

        <div
          className={`app-header__drawer${menuOpen ? " app-header__drawer--open" : ""}`}
        >
          <ul className="app-header__drawer-list">
            {NAV_TABS.map((tab) => (
              <li key={tab.key}>
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `app-header__drawer-link${isActive ? " app-header__drawer-link--active" : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {isMobile && (role === "user" || role === "admin") && (
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                className="li-header-profile-avatar"
                style={{ width: 36, height: 36 }}
              >
                {userdata?.photo_url ? (
                  <img src={userdata.photo_url} alt="Profile" />
                ) : (
                  <div className="li-header-profile-initial">
                    {(userdata?.name ||
                      sessionStorage.getItem("name") ||
                      "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                  {userdata?.name || sessionStorage.getItem("name") || "User"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                  }}
                >
                  {role}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <div
          className="app-header__backdrop"
          onClick={() => setMenuOpen(false)}
          style={{ zIndex: 1038 }}
        />
      )}
    </>
  );
};
