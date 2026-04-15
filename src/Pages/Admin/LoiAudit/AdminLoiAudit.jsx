import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PenTool,
  LayoutDashboard,
  Settings,
  History,
  FileSearch,
  Loader2,
} from "lucide-react";
import { fetchAdminPendingDealsApi } from "../../../Networking/Admin/APIs/AdminLoiAuditApi";
import "./AdminLoiAudit.css";

import IngestionAuditSection from "./Sections/A1_IngestionAudit";
import DraftingStudioSection from "./Sections/A2_DraftingStudio";
import AuditTrailSection from "./Sections/A3_AuditTrail";
import AllDealsSection from "./Sections/A4_AllDeals";
import SettingsSection from "./Sections/A5_Settings";
import RAGLoader from "../../../Component/Loader";

const AdminLoiAudit = () => {
  const dispatch = useDispatch();
  const { pendingDeals, loading } = useSelector((state) => state.adminLoiAudit);

  const [activeTab, setActiveTab] = useState("A1");
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminPendingDealsApi());
  }, [dispatch]);

  useEffect(() => {
    if (pendingDeals.length > 0 && !selectedDeal) {
      setSelectedDeal(pendingDeals[0]);
    }
  }, [pendingDeals, selectedDeal]);

  const tabs = [
    {
      id: "A1",
      label: "A1 — Ingestion & Audit",
      icon: <FileSearch size={16} />,
    },
    { id: "A2", label: "A2 — Drafting Studio", icon: <PenTool size={16} /> },
    { id: "A3", label: "A3 — Audit Trail", icon: <History size={16} /> },
    { id: "A4", label: "A4 — All Deals", icon: <LayoutDashboard size={16} /> },
    { id: "A5", label: "A5 — Settings", icon: <Settings size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "A1":
        return (
          <IngestionAuditSection
            selectedDeal={selectedDeal}
            onDealSelect={setSelectedDeal}
            pendingDeals={pendingDeals}
          />
        );
      case "A2":
        return <DraftingStudioSection selectedDeal={selectedDeal} />;
      case "A3":
        return <AuditTrailSection selectedDeal={selectedDeal} />;
      case "A4":
        return <AllDealsSection />;
      case "A5":
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="loi-audit-container">
      <div className="loi-audit-tabs text-center text-md-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`loi-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="loi-audit-content">{renderContent()}</div>
    </div>
  );
};

export default AdminLoiAudit;
