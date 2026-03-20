import { useState } from "react";
import {
  FileText,
  Building2,
  User,
  Mail,
  Tag,
  UploadCloud,
  CheckCircle2,
  Circle,
  Send,
  Paperclip,
  ClipboardList,
  MessageSquare,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  CheckCheck,
  Clock3,
  Download,
  TrendingUp,
  DollarSign,
  CalendarClock,
  Layers,
} from "lucide-react";

// ── Tab 1: Submit Proposal ────────────────────────────────────────────────────
const SubmitProposal = () => {
  const [checklist] = useState({
    pdf: true,
    tenantName: true,
    building: true,
    brokerEmail: true,
  });

  return (
    <div className="loi-tab-content">
      <div className="row g-4">
        {/* Left col */}
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <div className="loi-upload-box">
            <UploadCloud size={28} className="loi-upload-icon mb-2" />
            <div className="loi-upload-label">Attach Tenant LOI PDF</div>
            <div className="loi-upload-sub">Click to browse</div>
          </div>
          <Field
            label="Tenant Name *"
            value="Fantini USA Inc"
            icon={<User size={12} />}
          />
          <Field
            label="Building *"
            value="260 Fifth Avenue"
            icon={<Building2 size={12} />}
          />
          <Field
            label="Floor / Suite"
            value="Entire 8th Floor"
            icon={<Layers size={12} />}
          />
          <Field label="RSF" value="6000" icon={<Tag size={12} />} />
        </div>

        {/* Right col */}
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <SectionLabel icon={<User size={11} />}>BROKER DETAILS</SectionLabel>
          <Field
            label="Broker Name"
            value="Joshua Berg"
            icon={<User size={12} />}
          />
          <Field
            label="Broker Email * (required for deal tracking)"
            value="jberg@newmark.com"
            icon={<Mail size={12} />}
          />
          <Field
            label="Broker Company"
            value="Newmark"
            icon={<Building2 size={12} />}
          />
          <Field
            label="Deal Tag (unique ID)"
            value="Fantini_260_5th_Ave_2025"
            icon={<Tag size={12} />}
          />

          <div className="loi-checklist-box">
            <div className="loi-checklist-title">
              <ClipboardList size={12} className="me-2" />
              Submission Checklist
            </div>
            {Object.entries({
              "PDF uploaded": checklist.pdf,
              "Tenant name filled": checklist.tenantName,
              "Building filled": checklist.building,
              "Broker email filled": checklist.brokerEmail,
            }).map(([label, done]) => (
              <div key={label} className="loi-check-row">
                {done ? (
                  <CheckCircle2 size={13} className="loi-check-done" />
                ) : (
                  <Circle size={13} className="loi-check-pending" />
                )}
                <span
                  className={
                    done ? "loi-check-text-done" : "loi-check-text-pending"
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button className="loi-btn-primary d-flex align-items-center gap-2">
            <Send size={13} />
            Submit Proposal to Landlord
            <Badge variant="danger">5</Badge>
          </button>
          <div className="loi-hint">Hover red badge for API details</div>
        </div>
      </div>
    </div>
  );
};

// ── Tab 2: My Deals ───────────────────────────────────────────────────────────
const MyDeals = () => {
  const stats = [
    {
      label: "Total Deals",
      value: 3,
      icon: <Layers size={16} />,
      cls: "loi-stat--accent",
    },
    {
      label: "Awaiting Counter",
      value: 1,
      icon: <Clock3 size={16} />,
      cls: "loi-stat--mid",
    },
    {
      label: "Counter Received",
      value: 1,
      icon: <MessageSquare size={16} />,
      cls: "loi-stat--hover",
    },
    {
      label: "Executed",
      value: 1,
      icon: <CheckCheck size={16} />,
      cls: "loi-stat--green",
    },
  ];

  const deals = [
    {
      name: "Fantini USA Inc",
      address: "260 Fifth Avenue · 8th Floor · 6,000 RSF",
      update: "Last update: Nov 14, 2025 · V2",
      tag: "Counter Received",
      tagCls: "loi-tag--hover",
      borderCls: "loi-deal-border--hover",
    },
    {
      name: "GoodHomes Inc",
      address: "260 Fifth Avenue · 3rd Floor · 4,100 RSF",
      update: "",
      tag: "Awaiting Counter",
      tagCls: "loi-tag--mid",
      borderCls: "loi-deal-border--mid",
    },
    {
      name: "Apex Tech Inc",
      address: "260 Fifth Avenue · 6th Floor · 5,400 RSF",
      update: "",
      tag: "Executed",
      tagCls: "loi-tag--green",
      borderCls: "loi-deal-border--green",
    },
  ];

  return (
    <div className="loi-tab-content">
      <div className="row g-3 mb-3">
        {stats.map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className={`loi-stat-card ${s.cls}`}>
              <div className="loi-stat-icon">{s.icon}</div>
              <div className="loi-stat-val">{s.value}</div>
              <div className="loi-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="loi-section-header d-flex align-items-center gap-2 mb-2">
        <Layers size={11} />
        MY ACTIVE DEALS
        <Badge variant="danger">7</Badge>
        <span className="loi-hint ms-1">← hover</span>
      </div>

      <div className="d-flex flex-column gap-2 mb-3">
        {deals.map((d) => (
          <div key={d.name} className={`loi-deal-row ${d.borderCls}`}>
            <div className="flex-grow-1 overflow-hidden">
              <div className="loi-deal-name">{d.name}</div>
              <div className="loi-deal-addr">{d.address}</div>
              {d.update && <div className="loi-deal-update">{d.update}</div>}
            </div>
            <div className="d-flex flex-column align-items-end gap-1 ms-2">
              <span className={`loi-tag ${d.tagCls}`}>{d.tag}</span>
              {d.name === "Fantini USA Inc" && (
                <span className="loi-hint d-flex align-items-center gap-1">
                  Click → U3 Thread <ChevronRight size={10} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="loi-btn-primary d-flex align-items-center gap-2">
        <UploadCloud size={13} />
        Submit New Proposal
      </button>
    </div>
  );
};

// ── Tab 3: Negotiation Thread ─────────────────────────────────────────────────
const NegotiationThread = () => {
  const [reply, setReply] = useState("");

  const terms = [
    { label: "Base Rent", value: "$44.00/RSF", alarm: true },
    { label: "Free Rent", value: "4 months (inside)", alarm: true },
    { label: "Escalation", value: "3.00% fixed", alarm: true },
    { label: "Lease Term", value: "9 years", alarm: false },
    { label: "LL Work", value: "White box, offices, pantry", alarm: false },
    { label: "Restoration", value: "Required", alarm: true },
    { label: "Renewal", value: "Not accepted", alarm: true },
  ];

  return (
    <div className="loi-tab-content">
      <div className="row g-4">
        {/* Left — thread */}
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <div className="loi-section-header d-flex align-items-center gap-2">
            <MessageSquare size={11} />
            NEGOTIATION THREAD — FANTINI USA
            <Badge variant="accent">3</Badge>
            <span className="loi-hint">← hover</span>
          </div>

          <div className="loi-msg-box d-flex flex-column gap-2">
            <div className="loi-msg-system">
              Deal submitted by Joshua Berg. Awaiting admin review.
            </div>

            <div className="loi-msg-bubble loi-msg-bubble--sent ms-auto">
              <div className="loi-msg-meta">You · Nov 7</div>
              <div className="loi-msg-text">
                Proposing $39/RSF flat, 8 months free rent, 9-year term.
              </div>
            </div>

            <div className="loi-msg-bubble loi-msg-bubble--recv">
              <div className="loi-msg-meta">
                Darall Handler (Landlord) · Nov 14
              </div>
              <div className="loi-msg-text loi-text-green-hover">
                Counter at $44/RSF, 4 months free rent inside term, 3%
                escalation, restoration clause.
              </div>
            </div>

            <div className="loi-doc-chip d-flex align-items-center gap-2">
              <FileText size={13} className="loi-accent-icon" />
              <span className="loi-text-green-primary">
                Counter_LOI_V2_Certified.docx
              </span>
              <Badge variant="danger">11</Badge>
              <span className="loi-hint">← hover</span>
            </div>

            <div className="loi-msg-system">
              Landlord Counter-LOI V2 certified — ready for download.
            </div>
          </div>

          <textarea
            className="loi-reply-area w-100"
            placeholder="Type your response here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
          />

          <div className="d-flex flex-wrap gap-2">
            <button className="loi-btn-primary d-flex align-items-center gap-2">
              <Send size={13} />
              Send Reply <Badge variant="danger">5</Badge>
            </button>
            <button className="loi-btn-ghost d-flex align-items-center gap-2">
              <Paperclip size={13} />
              Attach PDF
            </button>
          </div>
        </div>

        {/* Right — counter terms */}
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <SectionLabel icon={<DollarSign size={11} />}>
            LANDLORD COUNTER TERMS
          </SectionLabel>

          <div className="loi-terms-box d-flex flex-column gap-2">
            {terms.map((t) => (
              <div
                key={t.label}
                className={`loi-term-row ${t.alarm ? "loi-term-row--alarm" : ""}`}
              >
                <span className="d-flex align-items-center gap-2">
                  {t.alarm && (
                    <AlertTriangle size={11} className="loi-alarm-icon" />
                  )}
                  <span className="loi-term-label">{t.label}</span>
                </span>
                <span
                  className={`loi-term-val ${t.alarm ? "loi-text-low" : "loi-text-primary"}`}
                >
                  {t.value}
                </span>
              </div>
            ))}
          </div>

          <div className="loi-hint">latest_counter from API #8</div>

          <button className="loi-btn-primary d-flex align-items-center gap-2">
            <BarChart3 size={13} />
            View Summary <Badge variant="danger">18</Badge>
          </button>
          <button className="loi-btn-ghost d-flex align-items-center gap-2 mt-2">
            <Download size={13} />
            Download .docx <Badge variant="danger">11</Badge>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tab 4: Deal Summary ───────────────────────────────────────────────────────
const DealSummary = () => {
  const tenantAsk = [
    { label: "Rent/RSF", value: "$39.00" },
    { label: "Annual Cost", value: "$234,000" },
    { label: "Free Rent", value: "8 months" },
    { label: "Escalation", value: "2.25%" },
    { label: "NER", value: "$34.20" },
  ];

  const llCounter = [
    { label: "Rent/RSF", value: "$44.00" },
    { label: "Annual Cost", value: "$264,000" },
    { label: "Free Rent", value: "4 months" },
    { label: "Escalation", value: "3.00%" },
    { label: "NER", value: "$40.70" },
  ];

  const gaps = [
    { label: "rent_gap", value: "+$5/RSF", icon: <DollarSign size={14} /> },
    { label: "fr_gap", value: "-4 mo.", icon: <CalendarClock size={14} /> },
    { label: "ner_gap", value: "+$6.50", icon: <TrendingUp size={14} /> },
    {
      label: "annual_cost_diff",
      value: "+$30K/yr",
      icon: <BarChart3 size={14} />,
    },
  ];

  const timeline = [
    {
      step: 1,
      label: "Initial Proposal Submitted",
      date: "Nov 7, 2025",
      done: true,
    },
    {
      step: 2,
      label: "Landlord Counter Received",
      date: "Nov 14, 2025",
      done: true,
    },
    {
      step: 3,
      label: "Tenant Response / Counter",
      date: "Your move",
      done: false,
      active: true,
    },
    { step: 4, label: "Final LOI Execution", done: false },
    { step: 5, label: "Lease Commencement", done: false },
  ];

  return (
    <div className="loi-tab-content">
      <div className="loi-section-header d-flex align-items-center flex-wrap gap-2 mb-3">
        <BarChart3 size={13} />
        DEAL ECONOMICS — FANTINI USA · 260 FIFTH AVE
        <Badge variant="danger">10</Badge>
        <span className="loi-hint">← all data on this screen from API #10</span>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <div className="loi-compare-card loi-compare-card--accent h-100">
            <div className="loi-compare-title loi-text-accent mb-2">
              Your Ask (V1) → tenant_ask
            </div>
            {tenantAsk.map((r) => (
              <div key={r.label} className="loi-term-row">
                <span className="loi-term-label">{r.label}</span>
                <span className="loi-term-val loi-text-primary">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className="loi-compare-card loi-compare-card--green h-100">
            <div className="loi-compare-title loi-text-green-primary mb-2">
              Landlord Counter (V2) → landlord_counter
            </div>
            {llCounter.map((r) => (
              <div key={r.label} className="loi-term-row">
                <span className="loi-term-label">{r.label}</span>
                <span className="loi-term-val loi-text-low">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="loi-box mb-3">
        <div className="loi-box-title d-flex align-items-center gap-2 mb-3">
          <TrendingUp size={11} />
          Gap Analysis → delta object from API #10
        </div>
        <div className="row g-2">
          {gaps.map((g) => (
            <div key={g.label} className="col-6 col-sm-3">
              <div className="loi-gap-card">
                <div className="loi-gap-icon loi-text-low mb-1">{g.icon}</div>
                <div className="loi-gap-val loi-text-low">{g.value}</div>
                <div className="loi-hint mt-1">{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="loi-box">
        <div className="loi-box-title d-flex align-items-center flex-wrap gap-2 mb-3">
          <CalendarClock size={11} />
          Deal Timeline
          <Badge variant="danger">18</Badge>
          <span className="loi-hint">
            ← hover → timeline[] array from API response
          </span>
        </div>

        <div className="loi-timeline">
          {timeline.map((t) => (
            <div key={t.step} className="loi-timeline-row">
              <div
                className={`loi-timeline-num ${t.done ? "loi-tnum--done" : t.active ? "loi-tnum--active" : "loi-tnum--idle"}`}
              >
                {t.done ? <CheckCheck size={11} /> : t.step}
              </div>
              <div className="loi-timeline-body">
                <div
                  className={`loi-timeline-label ${t.done ? "loi-text-green" : t.active ? "loi-text-green-light" : "loi-text-secondary"}`}
                >
                  {t.label}
                </div>
                {t.date && <div className="loi-hint mt-1">{t.date}</div>}
                {t.active && (
                  <div className="loi-timeline-warning d-flex align-items-center gap-1 mt-1">
                    <AlertTriangle size={10} />
                    step.done = false · your move
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Shared Helpers ────────────────────────────────────────────────────────────
const Field = ({ label, value, icon }) => (
  <div className="loi-field-wrap">
    <label className="loi-field-label">
      {icon && <span className="loi-field-icon me-1">{icon}</span>}
      {label}
    </label>
    <input className="loi-field-input" defaultValue={value} />
  </div>
);

const SectionLabel = ({ children, icon }) => (
  <div className="loi-section-label d-flex align-items-center gap-2">
    {icon}
    {children}
  </div>
);

const Badge = ({ variant = "danger", children }) => (
  <span className={`loi-badge loi-badge--${variant}`}>{children}</span>
);

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "submit",
    label: "Submit Proposal",
    short: "U1",
    Icon: UploadCloud,
    Component: SubmitProposal,
  },
  {
    id: "deals",
    label: "My Deals",
    short: "U2",
    Icon: Layers,
    Component: MyDeals,
  },
  {
    id: "negotiation",
    label: "Negotiation Thread",
    short: "U3",
    Icon: MessageSquare,
    Component: NegotiationThread,
  },
  {
    id: "summary",
    label: "Deal Summary",
    short: "U4",
    Icon: BarChart3,
    Component: DealSummary,
  },
];

// ── Root ──────────────────────────────────────────────────────────────────────
export const LoiAudit = () => {
  const [active, setActive] = useState("submit");
  const ActiveComponent = TABS.find((t) => t.id === active)?.Component ?? null;

  return (
    <div className="loi-root">
      <div className="loi-tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`loi-tab-btn ${active === tab.id ? "loi-tab-btn--active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            <tab.Icon size={14} className="flex-shrink-0" />
            <span className="loi-tab-short d-none d-sm-inline">
              {tab.short}
            </span>
            <span className="loi-tab-label d-none d-sm-inline">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {ActiveComponent && <ActiveComponent />}
    </div>
  );
};

export default LoiAudit;
