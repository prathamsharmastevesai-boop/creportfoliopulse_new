import { useState } from "react";
import {
  UploadCloud,
  MessageSquare,
  BarChart3,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { SubmitProposal } from "./submitProposal";
import { MyDeals } from "./myDeal";
import { NegotiationThread } from "./negotiationThread";
import { DealSummary } from "./dealSummary";

export const Field = ({
  label,
  value,
  onChange,
  icon,
  type = "text",
  validate,
}) => {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    if (validate === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      setError(val && !isValid ? "Enter a valid email address" : "");
    } else if (validate === "integer") {
      const isValid = /^\d*$/.test(val);
      setError(val && !isValid ? "Only whole numbers allowed" : "");
    } else if (validate === "string") {
      const isValid = /^[a-zA-Z\s]*$/.test(val);
      setError(val && !isValid ? "Only letters allowed" : "");
    }
    onChange(e);
  };

  return (
    <div className="loi-field-wrap">
      <label className="loi-field-label">
        {icon && <span className="loi-field-icon me-1">{icon}</span>}
        {label}
      </label>
      <input
        className={`loi-field-input ${error ? "loi-field-error" : ""}`}
        type={type}
        value={value}
        onChange={handleChange}
      />
      {error && <span className="loi-field-error-msg">{error}</span>}
    </div>
  );
};

export const SectionLabel = ({ children, icon }) => (
  <div className="loi-section-label d-flex align-items-center gap-2">
    {icon}
    {children}
  </div>
);

export const Badge = ({ variant = "danger", children }) => (
  <span className={`loi-badge loi-badge--${variant}`}>{children}</span>
);

const MAIN_TABS = [
  { id: "submit", label: "Submit Proposal", Icon: UploadCloud },
  { id: "deals", label: "My Deals", Icon: Layers },
];

const DEAL_TABS = [
  { id: "negotiation", label: "Negotiation Thread", Icon: MessageSquare },
  { id: "summary", label: "Deal Summary", Icon: BarChart3 },
];

export const LoiAudit = () => {
  const [active, setActive] = useState("submit");
  const [selectedDeal, setSelectedDeal] = useState(null);
  console.log(selectedDeal, "selectedDeal");

  const handleDealClick = (deal) => {
    setSelectedDeal({
      id: deal.raw.deal_id,
      version: deal.raw.current_version,
    });
    setActive("negotiation");
  };

  const handleBack = () => {
    setSelectedDeal(null);
    setActive("deals");
  };

  const inDealView = !!selectedDeal;
  const tabs = inDealView ? DEAL_TABS : MAIN_TABS;

  return (
    <div className="loi-root">
      <div className="loi-tabbar d-flex align-items-center gap-2 px-md-0 px-5">
        {inDealView && (
          <button
            className="loi-tab-btn d-flex align-items-center gap-1"
            onClick={handleBack}
            title="Back to My Deals"
          >
            <ArrowLeft size={14} />
            <span className="loi-tab-label d-none d-sm-inline">Back</span>
          </button>
        )}

        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`loi-tab-btn ${active === tab.id ? "loi-tab-btn--active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            <tab.Icon size={14} className="flex-shrink-0" />
            <span className="loi-tab-label d-none d-sm-inline">
              {tab.label}
            </span>
          </button>
        ))}

        {inDealView && selectedDeal?.name && (
          <span className="loi-tag ms-auto" style={{ fontSize: 11 }}>
            {selectedDeal.name}
          </span>
        )}
      </div>

      {!inDealView && active === "submit" && <SubmitProposal />}
      {!inDealView && active === "deals" && (
        <MyDeals onDealClick={handleDealClick} />
      )}
      {inDealView && active === "negotiation" && (
        <NegotiationThread
          dealId={selectedDeal.id}
          currentVersion={selectedDeal.version}
        />
      )}

      {inDealView && active === "summary" && (
        <DealSummary dealId={selectedDeal.id} />
      )}
    </div>
  );
};

export default LoiAudit;
