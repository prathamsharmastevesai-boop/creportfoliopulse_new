import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PenTool,
  Settings,
  History,
  FileSearch,
  ArrowLeft,
} from "lucide-react";
import "./AdminLoiAudit.css";

import IngestionAuditSection from "./Sections/A1_IngestionAudit";
import DraftingStudioSection from "./Sections/A2_DraftingStudio";
import AuditTrailSection from "./Sections/A3_AuditTrail";
import AllDealsSection from "./Sections/A4_AllDeals";
import SettingsSection from "./Sections/A5_Settings";
import { SubmitProposal } from "../../User/LoiAudit/submitProposal";

export const AdminLoiAudit = () => {
  const { pendingDeals, loading } = useSelector((state) => state.adminLoiAudit);

  const [view, setView] = useState("A4");
  const [activeTab, setActiveTab] = useState("A1");
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    if (pendingDeals.length > 0 && !selectedDeal) {
      setSelectedDeal(pendingDeals[0]);
    }
  }, [pendingDeals, selectedDeal]);

  const handleDealSelect = (deal) => {
    setSelectedDeal(deal);
    setActiveTab("A1");
    setView("DEAL");
  };

  const handleOpenSettings = () => {
    setView("A5");
  };

  const handleOpenSubmitProposal = () => {
    setView("SUBMIT");
  };

  const handleBackToAllDeals = () => {
    setView("A4");
  };

  const dealTabs = [
    {
      id: "A1",
      label: "A1 — Ingestion & Audit",
      icon: <FileSearch size={16} />,
    },
    { id: "A2", label: "A2 — Drafting Studio", icon: <PenTool size={16} /> },
    { id: "A3", label: "A3 — Audit Trail", icon: <History size={16} /> },
  ];

  const renderDealContent = () => {
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
      default:
        return null;
    }
  };

  if (view === "A4") {
    return (
      <div className="loi-audit-container">
        <div className="loi-audit-content">
          <AllDealsSection
            onDealClick={handleDealSelect}
            onOpenSettings={handleOpenSettings}
            onOpenSubmitProposal={handleOpenSubmitProposal}
          />
        </div>    
      </div> 
    );
  } 

  if (view === "A5") {
    return (
      <div className="loi-audit-container">
        <div className="loi-audit-tabs text-center text-md-start">
          <button
            className="loi-tab-btn back-btn"
            onClick={handleBackToAllDeals}
          >
            <span className="tab-icon">
              <ArrowLeft size={16} />
            </span>
            <span className="tab-label">Back to All Deals</span>
          </button>
          <div className="tab-divider" />
          <button className="loi-tab-btn active">
            <span className="tab-icon">
              <Settings size={16} />
            </span>
            <span className="tab-label">A5 — Settings</span>
          </button>
        </div>
        <div className="loi-audit-content">
          <SettingsSection />
        </div>
      </div>
    );
  }

  if (view === "SUBMIT") {
    return (
      <div className="loi-audit-container">
        <div className="loi-audit-tabs text-center text-md-start">
          <button
            className="loi-tab-btn back-btn"
            onClick={handleBackToAllDeals}
          >
            <span className="tab-icon">
              <ArrowLeft size={16} />
            </span>
            <span className="tab-label">Back to All Deals</span>
          </button>
          <div className="tab-divider" />
          <button className="loi-tab-btn active">
            <span className="tab-icon">
              <PenTool size={16} />
            </span>
            <span className="tab-label">Submit Proposal</span>
          </button>
        </div>
        <div className="loi-audit-content">
          <SubmitProposal />
        </div>
      </div>
    );
  }

  return (
    <div className="loi-audit-container">
      <div className="loi-audit-tabs text-center text-md-start">
        <button className="loi-tab-btn back-btn" onClick={handleBackToAllDeals}>
          <span className="tab-icon">
            <ArrowLeft size={16} />
          </span>
          <span className="tab-label">All Deals</span>
        </button>
        <div className="tab-divider" />
        {dealTabs.map((tab) => (
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
      <div className="loi-audit-content">{renderDealContent()}</div>
    </div>
  );
};
