import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FirmsTab } from "./PulseUploadComponents/FirmsTab";
import { QuartersTab } from "./PulseUploadComponents/QuartersTab";
import { IngestTab } from "./PulseUploadComponents/IngestTab";
import { NAV_TABS } from "./PulseUploadComponents/constants";
import {
  fetchFirms,
  fetchQuarters,
} from "../../Networking/CommonApi/thePulseApi";
import RAGLoader from "../../Component/Loader";
import { ContactsHubUpload } from "../Admin/GeneralInfo/ContactsHub";
import { OwnerAdminDashboard } from "../Admin/DashBoard/OwnerAdminDashboard";

export const ThePulseUpload = () => {
  const dispatch = useDispatch();
  const is_owner_admin = sessionStorage.getItem("is_owner_admin");
  console.log(is_owner_admin, "is_owner_admin");

  const [ownerView, setOwnerView] = useState(null);

  const [mainTab, setMainTab] = useState("intelligence");
  const [view, setView] = useState("firms");

  const {
    firms,
    quarters,
    loading: marketLoading,
  } = useSelector((state) => state.marketSlice);

  const { loading: uploadLoading } = useSelector(
    (state) => state.pulseUploadSlice || { loading: false },
  );

  const handleRefresh = useCallback(() => {
    dispatch(fetchFirms());
    dispatch(fetchQuarters());
  }, [dispatch]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const isLoading = marketLoading || uploadLoading;

  if (is_owner_admin && ownerView === null) {
    return (
      <div className="tpu-app position-relative">
        <div className="tpu-header">
          <div className="tpu-header-left">
            <div className="tpu-header-titles">
              <h4 className="tpu-logo-main">The Pulse</h4>
              <span className="tpu-logo-divider">|</span>
              <span className="tpu-logo-sub">Owner Dashboard</span>
            </div>
          </div>

          <div className="tpu-tab-group">
            <button
              className="tp-tab"
              onClick={() => setOwnerView("intelligence")}
            >
              Market Intelligence
            </button>
            <button className="tp-tab" onClick={() => setOwnerView("comps")}>
              Contacts Hub
            </button>
          </div>
        </div>
        <div className="tpu-main">
          <OwnerAdminDashboard />
        </div>
      </div>
    );
  }

  if (is_owner_admin && ownerView === "intelligence") {
    return (
      <div className="tpu-app position-relative">
        {isLoading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              zIndex: 1000,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(2px)",
              borderRadius: "inherit",
            }}
          >
            <RAGLoader />
          </div>
        )}
        <div className="tpu-header">
          <div className="tpu-header-left">
            <button
              className="tp-tab"
              onClick={() => setOwnerView(null)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Back
            </button>
            <div className="tpu-header-titles" style={{ marginLeft: 8 }}>
              <h4 className="tpu-logo-main">Market Intelligence</h4>
            </div>
          </div>

          <div className="tpu-tab-group">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`tp-tab ${view === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tpu-main">
          {view === "firms" && (
            <FirmsTab firms={firms} onRefresh={handleRefresh} />
          )}
          {view === "quarters" && (
            <QuartersTab quarters={quarters} onRefresh={handleRefresh} />
          )}
          {view === "ingest" && (
            <IngestTab
              quarters={quarters}
              firms={firms}
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </div>
    );
  }

  if (is_owner_admin && ownerView === "comps") {
    return (
      <div className="tpu-app position-relative">
        <div className="tpu-header">
          <div className="tpu-header-left">
            <button
              className="tp-tab"
              onClick={() => setOwnerView(null)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Back
            </button>
            <div className="tpu-header-titles" style={{ marginLeft: 8 }}>
              <h4 className="tpu-logo-main">Contacts Hub</h4>
              <span className="tpu-logo-divider">|</span>
              <span className="tpu-logo-sub">Comparable Transactions</span>
            </div>
          </div>
        </div>
        <div className="tpu-main">
          <ContactsHubUpload />
        </div>
      </div>
    );
  }

  return (
    <div className="tpu-app position-relative">
      {isLoading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 1000,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(2px)",
            borderRadius: "inherit",
          }}
        >
          <RAGLoader />
        </div>
      )}

      <div className="tpu-header">
        <div className="tpu-header-left">
          <div className="tpu-header-titles">
            <h4 className="tpu-logo-main">The Pulse</h4>
            <span className="tpu-logo-divider">|</span>
            <span className="tpu-logo-sub">Upload Console</span>
          </div>
          <div className="tp-main-tabs tpu-main-tabs">
            <button
              className={`tp-main-tab ${mainTab === "intelligence" ? "active" : ""}`}
              onClick={() => setMainTab("intelligence")}
            >
              Market Intelligence
            </button>
            <button
              className={`tp-main-tab ${mainTab === "contacts" ? "active" : ""}`}
              onClick={() => setMainTab("contacts")}
            >
              Contact Hub
            </button>
          </div>
        </div>

        {mainTab === "intelligence" && (
          <div className="tpu-tab-group">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`tp-tab ${view === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tpu-main">
        {mainTab === "intelligence" && (
          <>
            {view === "firms" && (
              <FirmsTab firms={firms} onRefresh={handleRefresh} />
            )}
            {view === "quarters" && (
              <QuartersTab quarters={quarters} onRefresh={handleRefresh} />
            )}
            {view === "ingest" && (
              <IngestTab
                quarters={quarters}
                firms={firms}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
        {mainTab === "contacts" && <ContactsHubUpload />}
      </div>
    </div>
  );
};

export default ThePulseUpload;
