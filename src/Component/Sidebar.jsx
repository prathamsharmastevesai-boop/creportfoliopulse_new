import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SessionList } from "../Pages/User/Session/sessionList";
import { SidebarSkeleton } from "./SidebarSkeleton";
import ThemeToggle from "./ThemeToggle";
import { NotificationToggle } from "./notificationToggle";

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userdata, loading } = useSelector((state) => state.ProfileSlice);

  const [openMenu, setOpenMenu] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [profileData, setProfileData] = useState({
    // gemini_chat_enabled: false,
    files_media_enabled: false,
    // forum_enabled: false,
    portfolio_insights_enabled: false,
    // email_drafting_enabled: false,
    // notes_enabled: false,
    // ai_lease_abstract_enabled: false,
    det_enabled: false,
    dct_enabled: false,
    // calculator_enabled: false,
    yardi_enabled: false,
    third_party_enabled: false,
    employee_contact_enabled: false,
    building_info_enabled: false,
    comparative_building_data_enabled: false,

    tenant_information_enabled: false,
    tenants_in_the_market_enabled: false,
    comps_enabled: false,
    sublease_tracker_enabled: false,
    renewal_tracker_enabled: false,
    leases_agreement_data_enabled: false,
    // deal_tracker_enabled: false,
    tour_enabled: false,
    chat_history: false,
    information_collaboration_enabled: false,
    // project_management_enabled: false,
    Conversation: false,
    space_up_enabled: false,
  });

  const role = sessionStorage.getItem("role");
  const is_owner_admin = sessionStorage.getItem("is_owner_admin");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);

      if (!mobile) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
        setOpenMenu(null);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileData({
          // gemini_chat_enabled: userdata?.gemini_chat_enabled || false,
          files_media_enabled: userdata?.files_media_enabled || false,
          // forum_enabled: userdata?.forum_enabled || false,
          portfolio_insights_enabled:
            userdata?.portfolio_insights_enabled || false,
          // email_drafting_enabled: userdata?.email_drafting_enabled || false,
          // notes_enabled: userdata?.notes_enabled || false,
          // ai_lease_abstract_enabled:
          //   userdata?.ai_lease_abstract_enabled || false,
          det_enabled: userdata?.det_enabled || false,
          dct_enabled: userdata?.dct_enabled || false,
          // calculator_enabled: userdata?.calculator_enabled || false,
          yardi_enabled: userdata?.yardi_enabled || false,
          third_party_enabled: userdata?.third_party_enabled || false,
          employee_contact_enabled: userdata?.employee_contact_enabled || false,
          building_info_enabled: userdata?.building_info_enabled || false,
          maintenance_updates_enabled:
            userdata?.maintenance_updates_enabled || false,
          comparative_building_data_enabled:
            userdata?.comparative_building_data_enabled || false,
          tenant_information_enabled:
            userdata?.tenant_information_enabled || false,
          tenants_in_the_market_enabled:
            userdata?.tenants_in_the_market_enabled || false,
          fire_safety_enabled: userdata?.fire_safety_enabled || false,
          comps_enabled: userdata?.comps_enabled || false,
          sublease_tracker_enabled: userdata?.sublease_tracker_enabled || false,
          renewal_tracker_enabled: userdata?.renewal_tracker_enabled || false,
          leases_agreement_data_enabled:
            userdata?.leases_agreement_data_enabled || false,
          // deal_tracker_enabled: userdata?.deal_tracker_enabled || false,
          tour_enabled: userdata?.tour_enabled || false,
          chat_history: userdata?.chat_history || false,
          information_collaboration_enabled:
            userdata?.information_collaboration_enabled || false,
          // project_management_enabled:
          //   userdata?.project_management_enabled || false,
          Conversation: userdata?.Conversation || false,
          space_up_enabled: userdata?.space_up_enabled || false,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfile();
  }, [userdata]);

  const toggleSidebar = () => {
    if (isMobile) {
      setCollapsed((prev) => !prev);
    }
  };

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname],
  );

  const handleLinkClick = useCallback(
    (path) => {
      navigate(path);
      if (isMobile) setCollapsed(true);
    },
    [navigate, isMobile, setCollapsed],
  );

  const toggleAccordion = useCallback((menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  const NavItem = useCallback(
    ({ path, icon, label, isActivePath, enabled = true }) => {
      if (!enabled) return null;

      return (
        <li className={`nav-item ${isActivePath ? "active" : ""}`}>
          <span
            onClick={() => handleLinkClick(path)}
            className="nav-link text-white"
            style={{ cursor: "pointer", fontSize: "12px" }}
          >
            <i className={`bi ${icon} me-1`} />
            {!collapsed && label}
          </span>
        </li>
      );
    },
    [handleLinkClick, collapsed],
  );

  const AccordionHeader = useCallback(
    ({ menuKey, label, enabled = true }) => {
      if (!enabled) return null;

      return (
        <li
          className="nav-header text-light small mt-3 d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => toggleAccordion(menuKey)}
        >
          <span>{label}</span>
          <i
            className={`bi ms-2 ${openMenu === menuKey ? "bi-chevron-down" : "bi-chevron-right"
              }`}
          />
        </li>
      );
    },
    [openMenu, toggleAccordion],
  );

  const isCategoryEnabled = useCallback(
    (features) => {
      return features.some((feature) => profileData[feature]);
    },
    [profileData],
  );

  const SuperAdminPanel = useMemo(
    () =>
      role === "superuser" && (
        <>
          {!collapsed && (
            <h6 className="text-uppercase fw-bold small text-secondary px-2">
              Super Admin Panel
            </h6>
          )}
          <li className="nav-header text-light small">Main</li>
          <NavItem
            path="/admin-management"
            icon="bi-speedometer2"
            label="Admin Management"
            isActivePath={isActive("/admin-management")}
            enabled={true}
          />
        </>
      ),
    [role, collapsed, NavItem, isActive],
  );

  const AdminPanel = useMemo(
    () =>
      role === "admin" && (
        <>
          {!collapsed && (
            <h6 className="text-uppercase fw-bold small text-secondary px-2">
              Admin Panel
            </h6>
          )}
          <li className="nav-header text-light small">Main</li>
          {is_owner_admin == true ? (
            <NavItem
              path="/owner-dashboard"
              icon="bi-speedometer2"
              label="Dashboard"
              isActivePath={isActive("/owner-dashboard")}
            />
          ) : (
            <NavItem
              path="/admin-dashboard"
              icon="bi-speedometer2"
              label="Dashboard"
              isActivePath={isActive("/admin-dashboard")}
            />
          )}
          <NavItem
            path="/calendar"
            icon="bi-calendar"
            label="Calendar"
            isActivePath={isActive("/calendar")}
          />
          <NavItem
            path="/user-management"
            icon="bi-people"
            label="User Management"
            isActivePath={isActive("/user-management")}
          />
          <NavItem
            path="/aianalytics"
            icon="bi-graph-up"
            label="AI Analytics"
            isActivePath={isActive("/aianalytics")}
          />
          <NavItem
            path="/rag-system"
            icon="bi-activity"
            label="RAG System Tracing"
            isActivePath={isActive("/rag-system")}
          />
          <NavItem
            path="/portfolio-voice"
            icon="bi-mic"
            label="Portfolio Voice"
            isActivePath={isActive("/portfolio-voice")}
          />
          {/* <NavItem
            path="/admin-portfolio-forum"
            icon="bi-chat-square-dots"
            label="Pulse Forum"
            isActivePath={isActive("/admin-portfolio-forum")}
          /> */}
          <NavItem
            path="/lease-drafting-upload"
            icon="bi-pencil-square"
            label="AI Lease Drafting"
            isActivePath={isActive("/lease-drafting-upload")}
          />
          <NavItem
            path="/admin-information-collaboration"
            icon="bi-people"
            label="Information Collaboration"
            isActivePath={isActive("/admin-information-collaboration")}
          />
          <NavItem
            path="/admin-distilled-comp-tracker"
            icon="bi-file-earmark-bar-graph"
            label="Distilled Comp Tracker"
            isActivePath={isActive("/admin-distilled-comp-tracker")}
          />
          <NavItem
            path="/distilled-expense-tracker"
            icon="bi-table"
            label="Distilled Expense Tracker"
            isActivePath={isActive("/distilled-expense-tracker")}
          />
          {/* <NavItem
            path="/admin-loi-audit"
            icon="bi-file-earmark-check"
            label="LOI Audit"
            isActivePath={isActive("/admin-loi-audit")}
          /> */}
          <NavItem
            path="/space-inquiry"
            icon="bi-journal-text"
            label="Space Inquiry"
            isActivePath={isActive("/space-inquiry")}
          />

          <NavItem
            path="/admin-maintenance-building-list"
            icon="bi-tools"
            label="Maintenance Update"
            isActivePath={isActive("/admin-maintenance-building-list")}
          />

          <AccordionHeader menuKey="dataCategories" label="Data Categories" />

          {openMenu === "dataCategories" && (
            <>
              <NavItem
                path="/tenants-market-upload"
                icon="bi-building-check"
                label="Tenants in the Market"
                isActivePath={isActive("/tenants-market-upload")}
              />
              <NavItem
                path="/comps-upload"
                icon="bi-bar-chart-line-fill"
                label="Comps"
                isActivePath={isActive("/comps-upload")}
              />
              <NavItem
                path="/tenant-info-building-list"
                icon="bi-card-list"
                label="Tenant Information"
                isActivePath={isActive("/tenant-info-building-list")}
              />
              <NavItem
                path="/contacts-hub-upload"
                icon="bi-people"
                label="Contacts Hub"
                isActivePath={isActive("/contacts-hub-upload")}
              />

              <NavItem
                path="/admin-fire-safety-building-mechanicals-list"
                icon="bi-shield-check"
                label="Fire Safety & Building Mechanicals"
                isActivePath={isActive(
                  "/admin-fire-safety-building-mechanicals-list",
                )}
              />

              <NavItem
                path="/comparative-building-list"
                icon="bi-bar-chart-line"
                label="Comparative Buildings Data"
                isActivePath={isActive("/comparative-building-list")}
              />

              <NavItem
                path="/building-info-list"
                icon="bi-building"
                label="Building Info Data"
                isActivePath={isActive("/building-info-list")}
              />

              <NavItem
                path="/sublease-tracker-list"
                icon="bi-journal-text"
                label="Sublease Tracker"
                isActivePath={isActive("/sublease-tracker-list")}
              />
              <NavItem
                path="/admin-renewal-tracker-list"
                icon="bi-arrow-repeat"
                label="Renewal Tracker"
                isActivePath={isActive("/admin-renewal-tracker-list")}
              />
              <NavItem
                path="/admin-tours"
                icon="bi-geo-alt"
                label="Tours"
                isActivePath={isActive("/admin-tours")}
              />
            </>
          )}

          {!collapsed && (
            <AccordionHeader menuKey="adminTools" label="Admin Tools" />
          )}

          {openMenu === "adminTools" && (
            <NavItem
              path="/admin-lease-loi-building-list"
              icon="bi-plus-circle"
              label="Add Building (LOI & Lease)"
              isActivePath={isActive("/admin-lease-loi-building-list")}
            />
          )}

          <AccordionHeader menuKey="adminSettings" label="Settings" />
          {openMenu === "adminSettings" && (
            <NavItem
              path="/admin-profile"
              icon="bi-person-circle"
              label="Profile"
              isActivePath={isActive("/admin-profile")}
              enabled={true}
            />
          )}
        </>
      ),
    [
      role,
      collapsed,
      NavItem,
      isActive,
      openMenu,
      AccordionHeader,
      profileData,
      isCategoryEnabled,
    ],
  );

  const UserPanel = useMemo(() => {
    if (role !== "user") return null;

    const dataCategoriesEnabled = isCategoryEnabled([
      "third_party_enabled",
      "employee_contact_enabled",
      "building_info_enabled",
      "comparative_building_data_enabled",
      "maintenance_updates_enabled",
      "tenant_information_enabled",
      "tenants_in_the_market_enabled",
      "comps_enabled",
      "sublease_tracker_enabled",
      "renewal_tracker_enabled",
      "leases_agreement_data_enabled",
      "tour_enabled",
      "chat_history",
      // "deal_tracker_enabled",
    ]);

    const settingsEnabled = true;

    return (
      <div className="mb-2">
        {!collapsed && (
          <h6 className="text-uppercase fw-bold small text-secondary px-2">
            User Panel
          </h6>
        )}

        <li className="nav-header text-light small">Main</li>

        <NavItem
          path="/dashboard"
          icon="bi-house-door"
          label="Dashboard"
          isActivePath={isActive("/dashboard")}
          enabled={profileData.building_info_enabled}
        />
        <NavItem
          path="/user-files-media"
          icon="bi-building"
          label="Files and Media"
          isActivePath={isActive("/user-files-media")}
          enabled={profileData.files_media_enabled}
        />
        <NavItem
          path="/calendar"
          icon="bi-calendar"
          label="Calendar"
          isActivePath={isActive("/calendar")}
        />
        <NavItem
          path="/portfolio-chat"
          icon="bi-mic"
          label="Portfolio Voice"
          isActivePath={isActive("/portfolio-chat")}
          enabled={profileData.portfolio_insights_enabled}
        />
        {/* <NavItem
          path="/cre-news"
          icon="bi-newspaper"
          label="CRE News"
          isActivePath={isActive("/cre-news")}
          enabled={true}
        />
        <NavItem
          path="/the-pulse"
          icon="bi-activity"
          label="THE PULSE"
          isActivePath={isActive("/the-pulse")}
          enabled={true}
        /> */}
        <NavItem
          path="/rss-tenant"
          icon="bi-rss"
          label="RSS Tenant"
          isActivePath={isActive("/rss-tenant")}
          enabled={true}
        />
        <NavItem
          path="/email-drafting"
          icon="bi-envelope-open"
          label="Email Drafting"
          isActivePath={isActive("/email-drafting")}
        // enabled={profileData.email_drafting_enabled}
        />

        {/* {profileData.gemini_chat_enabled && (
          <NavItem
            path="/gemini-chat"
            icon="bi-chat-dots-fill"
            label="Gemini"
            isActivePath={isActive("/gemini-chat")}
            enabled={profileData.gemini_chat_enabled}
          />
        )} */}

        <NavItem
          path="/notes"
          icon="bi-journal"
          label="Notes"
          isActivePath={isActive("/notes")}
        // enabled={profileData.notes_enabled}
        />

        {/* {profileData.forum_enabled && ( */}
        {/* <NavItem
          path="/pulse-forum"
          icon="bi-chat-square-dots"
          label="Pulse Forum"
          isActivePath={isActive("/pulse-forum")}
          enabled={profileData.forum_enabled}
        /> */}
        {/* )} */}

        {/* <NavItem
          path="/ai-lease-abstract-upload"
          icon="bi-file-earmark-text"
          label="AI Lease Abstract"
          isActivePath={isActive("/ai-lease-abstract-upload")}
          enabled={profileData.ai_lease_abstract_enabled}
        /> */}
        <NavItem
          path="/information-collaboration"
          icon="bi-people"
          label="Information Collaboration"
          isActivePath={isActive("/information-collaboration")}
          enabled={profileData.information_collaboration_enabled}
        />
        <NavItem
          path="/benchmark"
          icon="bi-bar-chart-line"
          label="DET"
          isActivePath={isActive("/benchmark")}
          enabled={profileData.det_enabled}
        />
        <NavItem
          path="/distilled-comp-tracker"
          icon="bi-kanban"
          label="DCT"
          isActivePath={isActive("/distilled-comp-tracker")}
          enabled={profileData.dct_enabled}
        />
        <NavItem
          path="/calculator"
          icon="bi-calculator"
          label="Calculator"
          isActivePath={isActive("/calculator")}
        // enabled={profileData.calculator_enabled}
        />
        <NavItem
          path="/yardi"
          icon="bi-briefcase"
          label="Yardi"
          isActivePath={isActive("/yardi")}
          enabled={profileData.yardi_enabled}
        />
        <NavItem
          path="/messages-center"
          icon="bi-journal-text"
          label="Message Center"
          isActivePath={isActive("/messages-center")}
          enabled={profileData.Conversation}
        />

        <NavItem
          path="/project-management"
          icon="bi-diagram-3"
          label="Project Management"
          isActivePath={isActive("/project-management")}
        // enabled={profileData.project_management_enabled}
        />

        <NavItem
          path="/broker-index"
          icon="bi-megaphone"
          label="Broker Index"
          isActivePath={isActive("/broker-index")}
          enabled={profileData.space_up_enabled}
        />
        <NavItem
          path="/maintenance-building-list"
          icon="bi-tools"
          label="Maintenance Update"
          isActivePath={isActive("/maintenance-building-list")}
          enabled={profileData.maintenance_updates_enabled}
        />
        {/* 
        <NavItem
          path="/loi-audit"
          icon="bi-tools"
          label="Loi Audit"
          isActivePath={isActive("/loi-audit")}
        /> */}

        <NavItem
          path="/deal-list"
          icon="bi-kanban"
          label="Lead and Deal Tracker"
          isActivePath={isActive("/deal-list")}
          enabled={profileData.deal_tracker_enabled}
        />

        {!collapsed && dataCategoriesEnabled && (
          <AccordionHeader menuKey="generalInfo" label="Data Categories" />
        )}

        {openMenu === "generalInfo" && dataCategoriesEnabled && (
          <ul className="nav flex-column mt-1">
            <NavItem
              path="/tenant-market"
              icon="bi-people-fill"
              label="Tenants in the Market"
              isActivePath={isActive("/tenant-market")}
              enabled={profileData.tenants_in_the_market_enabled}
            />
            <NavItem
              path="/comps-chat"
              icon="bi-bar-chart-line-fill"
              label="Comps"
              isActivePath={isActive("/comps-chat")}
              enabled={profileData.comps_enabled}
            />
            {/* <NavItem
              path="/tenent-info-user-building-list"
              icon="bi-chat-left-text"
              label="Tenant Information"
              isActivePath={isActive("/tenent-info-user-building-list")}
              enabled={profileData.tenant_information_enabled}
            /> */}
            <NavItem
              path="/contacts-hub-chat"
              icon="bi-telephone-fill"
              label="Contacts Hub"
              isActivePath={isActive("/contacts-hub-chat")}
              enabled={profileData.third_party_enabled}
            />
            {/* <NavItem
              path="/employee-info-chat"
              icon="bi-people-fill"
              label="Employee Contact Info"
              isActivePath={isActive("/employee-info-chat")}
              enabled={profileData.employee_contact_enabled}
            /> */}
            {/* <NavItem
              path="/user-building-info-list"
              icon="bi-building"
              label="Building Info Data"
              isActivePath={isActive("/user-building-info-list")}
              enabled={profileData.building_info_enabled}
            /> */}
            <NavItem
              path="/comparative-user-building-list"
              icon="bi-cpu"
              label="Comparative Building Data"
              isActivePath={isActive("/comparative-user-building-list")}
              enabled={profileData.comparative_building_data_enabled}
            />

            <NavItem
              path="/user-fire-safety-building-mechanicals-list"
              icon="bi-shield-check"
              label="Fire Safety & Building Mechanicals"
              isActivePath={isActive(
                "/user-fire-safety-building-mechanicals-list",
              )}
              enabled={profileData.fire_safety_enabled}
            />

            <NavItem
              path="/user-sublease-tracker-list"
              icon="bi-journal-text"
              label="Sublease Tracker"
              isActivePath={isActive("/user-sublease-tracker-list")}
              enabled={profileData.sublease_tracker_enabled}
            />
            <NavItem
              path="/user-renewal-tracker-list"
              icon="bi-arrow-repeat"
              label="Renewal Tracker"
              isActivePath={isActive("/user-renewal-tracker-list")}
              enabled={profileData.renewal_tracker_enabled}
            />
            <NavItem
              path="/user-lease-loi-building-list"
              icon="bi-journal-text"
              label="Leases Agreement Data & LOI Data"
              isActivePath={isActive("/user-lease-loi-building-list")}
              enabled={profileData.leases_agreement_data_enabled}
            />
            <NavItem
              path="/tours"
              icon="bi-geo-alt"
              label="Tours"
              isActivePath={isActive("/tours")}
              enabled={profileData.tour_enabled}
            />
          </ul>
        )}

        {!collapsed && settingsEnabled && (
          <AccordionHeader menuKey="Settings" label="Settings" />
        )}

        {openMenu === "Settings" && settingsEnabled && (
          <>
            <NavItem
              path="/user-profile"
              icon="bi-person-circle"
              label="Profile"
              isActivePath={isActive("/user-profile")}
              enabled={true}
            />
            <NavItem
              path="/history"
              icon="bi-clock-history"
              label="Chat History"
              isActivePath={isActive("/history")}
              enabled={profileData.chat_history}
            />
            <NavItem
              path="/terms-of-use"
              icon="bi-file"
              label="Terms Of Use"
              isActivePath={isActive("/terms-of-use")}
              enabled={true}
            />
          </>
        )}

        {isMobile && showSessionModal && (
          <div className="mt-2">
            <div className="bg-dark border w-75 rounded p-2">
              <SessionList setShowSessionModal={setShowSessionModal} />
            </div>
          </div>
        )}
      </div>
    );
  }, [
    role,
    collapsed,
    profileData,
    NavItem,
    isActive,
    openMenu,
    AccordionHeader,
    isMobile,
    showSessionModal,
    isCategoryEnabled,
  ]);

  return (
    <>
      <aside
        className={`sidebar-wrapper d-flex flex-column border-end ${isMobile && !collapsed ? "sidebar-mobile-open" : ""
          }`}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          color: "var(--text-primary)",
        }}
      >
        <div className="p-3 border-bottom">
          {!collapsed && (
            <span className="mb-0 fs-5 creportfoliopulse text-center">
              creportfoliopulse
            </span>
          )}
          {/* <div className="my-2">
            <NotificationToggle />
          </div> */}
          {isMobile && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i
                className={`bi ${collapsed
                  ? "bi-chevron-double-right"
                  : "bi-chevron-double-left"
                  }`}
              />
            </button>
          )}
        </div>

        <div
          className="sidebar-body flex-grow-1 overflow-auto px-3 pt-3"
          style={{ minHeight: 0 }}
        >
          <ul className="nav flex-column">
            {loading ? (
              <SidebarSkeleton collapsed={collapsed} />
            ) : (
              <>
                {SuperAdminPanel}
                {AdminPanel}
                {UserPanel}
              </>
            )}
          </ul>
        </div>

        <div className="mt-auto p-3 border-top">
          <div className="mb-3 d-flex justify-content-center">
            <ThemeToggle collapsed={collapsed} />
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100"
            aria-label="Logout"
          >
            <i className="bi bi-box-arrow-right me-1" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      <div className="chat-modify-btn p-3 border-bottom justify-content-between align-items-center">
        {!collapsed && <span className="mb-0 fs-5">creportfoliopulse</span>}
        {isMobile && (
          <button
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
                }`}
            />
          </button>
        )}
      </div>

      {!isMobile && showSessionModal && (
        <div
          className="modal d-flex align-items-center justify-content-start"
          style={{ display: "block" }}
          onClick={() => setShowSessionModal(false)}
          role="presentation"
        >
          <div
            className="modal-dialog modal-sm"
            style={{ marginLeft: "240px", marginTop: "240px" }}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="modal-content bg-dark">
              <div className="modal-body">
                <SessionList setShowSessionModal={setShowSessionModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
