import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Activity,
  MapPin,
  Briefcase,
  Repeat,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Btn } from "./SharedComponents";
import { SECTIONS, SEC_LABELS } from "./constants";
import { ingestDataThunk } from "../../../Networking/Admin/APIs/ThePulseUploadApi";

const SEC_ICONS = {
  kpi: <Activity size={14} />,
  leasing_trends: <TrendingUp size={14} />,
  availability_trends: <BarChart3 size={14} />,
  submarkets: <MapPin size={14} />,
  industry: <Briefcase size={14} />,
  transactions: <Repeat size={14} />,
  sources: <FileText size={14} />,
};

const SECTION_FIELDS = {
  kpi: [
    { key: "firm_id", label: "Firm", type: "firm" },
    {
      key: "asking_rent",
      label: "Asking Rent ($)",
      type: "number",
      placeholder: "e.g. 77.89",
    },
    {
      key: "availability_rate",
      label: "Availability Rate (%)",
      type: "number",
      placeholder: "e.g. 15.5",
    },
    {
      key: "leasing_sf",
      label: "Leasing SF",
      type: "number",
      placeholder: "e.g. 9050000",
    },
    {
      key: "net_absorption",
      label: "Net Absorption (SF)",
      type: "number",
      placeholder: "e.g. 13600000",
    },
  ],
  leasing_trends: [
    { key: "firm_id", label: "Firm", type: "firm" },
    {
      key: "period_label",
      label: "Period Label",
      type: "text",
      placeholder: "e.g. Q1 2025",
    },
    {
      key: "period_year",
      label: "Period Year",
      type: "number",
      placeholder: "e.g. 2025",
    },
    {
      key: "period_quarter",
      label: "Period Quarter",
      type: "select",
      options: ["Q1", "Q2", "Q3", "Q4"],
    },
    {
      key: "leasing_sf",
      label: "Leasing SF",
      type: "number",
      placeholder: "e.g. 9050000",
    },
  ],
  availability_trends: [
    { key: "firm_id", label: "Firm", type: "firm" },
    {
      key: "period_label",
      label: "Period Label",
      type: "text",
      placeholder: "e.g. Q1 2025",
    },
    {
      key: "period_year",
      label: "Period Year",
      type: "number",
      placeholder: "e.g. 2025",
    },
    {
      key: "period_quarter",
      label: "Period Quarter",
      type: "select",
      options: ["Q1", "Q2", "Q3", "Q4"],
    },
    {
      key: "rate",
      label: "Rate (%)",
      type: "number",
      placeholder: "e.g. 15.5",
    },
  ],
  submarkets: [
    { key: "firm_id", label: "Firm", type: "firm" },
    {
      key: "submarket_name",
      label: "Submarket Name",
      type: "text",
      placeholder: "e.g. Midtown",
    },
    {
      key: "vacancy_rate",
      label: "Vacancy Rate (%)",
      type: "number",
      placeholder: "e.g. 12.1",
    },
    {
      key: "asking_rent",
      label: "Asking Rent ($)",
      type: "number",
      placeholder: "e.g. 88.50",
    },
  ],
  industry: [
    {
      key: "industry_name",
      label: "Industry Name",
      type: "text",
      placeholder: "e.g. FIRE (Finance, Insurance, Real Estate)",
    },
    {
      key: "percentage",
      label: "Percentage (%)",
      type: "number",
      placeholder: "e.g. 37.0",
    },
  ],
  transactions: [
    {
      key: "tenant",
      label: "Tenant",
      type: "text",
      placeholder: "e.g. JPMorgan Chase",
    },
    {
      key: "address",
      label: "Address",
      type: "text",
      placeholder: "e.g. 270 Park Avenue",
    },
    { key: "sf", label: "SF", type: "number", placeholder: "e.g. 2500000" },
    {
      key: "deal_type",
      label: "Deal Type",
      type: "select",
      options: ["New Lease", "Renewal", "Expansion", "Sublease"],
    },
    {
      key: "submarket",
      label: "Submarket",
      type: "text",
      placeholder: "e.g. Plaza District",
    },
  ],
  sources: [
    { key: "firm_id", label: "Firm", type: "firm" },
    {
      key: "report_title",
      label: "Report Title",
      type: "text",
      placeholder: "e.g. Manhattan Office MarketView Q4 2025",
    },
    {
      key: "source_url",
      label: "Source URL",
      type: "text",
      placeholder: "https://...",
    },
    {
      key: "highlight_quote",
      label: "Highlight Quote",
      type: "textarea",
      placeholder: "Key quote from the report...",
    },
  ],
};

const blankRow = (sec) =>
  Object.fromEntries(SECTION_FIELDS[sec].map((f) => [f.key, ""]));

const FieldInput = ({ field, value, onChange, firms, error }) => {
  const cls = `tpu-input${error ? " tpu-input-error" : ""}`;

  if (field.type === "firm") {
    const selectedFirm = firms.find((f) => String(f.id) === String(value));
    return (
      <div className="tpu-firm-select-wrapper">
        {selectedFirm && (
          <span
            className="tpu-firm-color-dot"
            style={{ background: selectedFirm.color || "#ccc" }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`tpu-select tpu-firm-select${error ? " tpu-input-error" : ""}${selectedFirm ? " has-dot" : ""}`}
        >
          <option value="">Select firm…</option>
          {firms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.short_name})
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`tpu-select${error ? " tpu-input-error" : ""}`}
      >
        <option value="">Select…</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ""}
        className={cls}
        rows={3}
      />
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || ""}
      className={cls}
      step={field.type === "number" ? "any" : undefined}
      min={field.label.includes("(%)") ? 0 : undefined}
      max={field.label.includes("(%)") ? 100 : undefined}
    />
  );
};

const EntryCard = ({
  sec,
  index,
  row,
  firms,
  errors,
  onChange,
  onRemove,
  canRemove,
}) => {
  const fields = SECTION_FIELDS[sec];
  const hasFirmField = fields.some((f) => f.type === "firm");
  const firmId = row.firm_id;
  const firm = firms.find((f) => String(f.id) === String(firmId));
  const cardLabel = firm ? firm.name : `Entry ${index + 1}`;

  return (
    <div className="tpu-entry-card">

      <div className="tpu-entry-card-header">
        <span className="tpu-entry-card-label">
          {firm && (
            <span
              className="tpu-firm-color-dot me-2"
              style={{
                background: firm.color || "#ccc",
              }}
            />
          )}
          {cardLabel}
          {firm && (
            <span className="tpu-entry-card-short ms-1">
              ({firm.short_name})
            </span>
          )}
        </span>
        {canRemove && (
          <button
            type="button"
            className="tpu-entry-remove-btn"
            onClick={onRemove}
            title="Remove entry"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>


      <div className="tpu-entry-fields">
        {fields.map((field) => {
          const err = errors?.[field.key];
          return (
            <div
              key={field.key}
              className={`tpu-field-group ${field.type === "textarea" ? "tpu-field-group-full" : ""}`}
            >
              <label className="tpu-field-label">
                {field.label}
                <span className="text-danger ms-1">*</span>
              </label>
              <div className="position-relative">
                <FieldInput
                  field={field}
                  value={row[field.key]}
                  onChange={(val) => onChange(field.key, val)}
                  firms={firms}
                  error={!!err}
                />
                {err && (
                  <div className="tpu-field-error-icon">
                    <AlertCircle size={16} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              {err && <p className="tpu-error-text">{err}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const IngestTab = ({ quarters, firms = [], onRefresh }) => {
  const dispatch = useDispatch();

  const [quarterId, setQuarterId] = useState(
    quarters[0]?.id ? Number(quarters[0].id) : "",
  );

  const [activeSection, setActiveSection] = useState(SECTIONS[0]);

  const [sectionRows, setSectionRows] = useState(
    Object.fromEntries(SECTIONS.map((sec) => [sec, [blankRow(sec)]])),
  );

  const [enabledSections, setEnabledSections] = useState(
    Object.fromEntries(SECTIONS.map((sec) => [sec, sec === SECTIONS[0]])),
  );

  const [fieldErrors, setFieldErrors] = useState({});
  const [quarterError, setQuarterError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quarterId && quarters.length) {
      setQuarterId(Number(quarters[0].id));
    }
  }, [quarters]);


  const toggleSection = (sec) => {
    setEnabledSections((prev) => {
      const next = { ...prev, [sec]: !prev[sec] };

      if (!prev[sec] && sectionRows[sec].length === 0) {
        setSectionRows((r) => ({ ...r, [sec]: [blankRow(sec)] }));
      }
      return next;
    });
  };


  const updateRow = (sec, idx, key, val) => {
    setSectionRows((prev) => {
      const rows = prev[sec].map((r, i) =>
        i === idx ? { ...r, [key]: val } : r,
      );
      return { ...prev, [sec]: rows };
    });

    setFieldErrors((prev) => {
      const secErrs = (prev[sec] || []).map((e, i) =>
        i === idx ? { ...e, [key]: undefined } : e,
      );
      return { ...prev, [sec]: secErrs };
    });
  };

  const addRow = (sec) => {
    setSectionRows((prev) => ({
      ...prev,
      [sec]: [...prev[sec], blankRow(sec)],
    }));
  };

  const removeRow = (sec, idx) => {
    setSectionRows((prev) => ({
      ...prev,
      [sec]: prev[sec].filter((_, i) => i !== idx),
    }));
  };


  const validate = () => {
    let valid = true;
    const newFieldErrors = {};

    if (!quarterId) {
      setQuarterError("Please select a quarter");
      valid = false;
    } else {
      setQuarterError("");
    }

    const activeSecs = SECTIONS.filter((s) => enabledSections[s]);
    if (activeSecs.length === 0) {
      toast.error("Please enable at least one section");
      valid = false;
    }

    for (const sec of activeSecs) {
      const rows = sectionRows[sec];
      const rowErrors = rows.map((row) => {
        const errs = {};
        SECTION_FIELDS[sec].forEach((field) => {
          const val = row[field.key];
          if (val === "" || val === null || val === undefined) {
            errs[field.key] = "Required";
          } else if (field.label.includes("(%)")) {
            const numVal = Number(val);
            if (isNaN(numVal) || numVal < 0 || numVal > 100) {
              errs[field.key] = "Must be 0-100";
            }
          }
        });
        return errs;
      });

      const hasErr = rowErrors.some((e) => Object.keys(e).length > 0);
      if (hasErr) {
        newFieldErrors[sec] = rowErrors;
        valid = false;
      }
    }

    setFieldErrors(newFieldErrors);
    return valid;
  };


  const handleIngest = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const payload = {};
    for (const sec of SECTIONS) {
      if (enabledSections[sec]) {
        payload[sec] = sectionRows[sec].map((row) => {
          const out = { ...row };

          SECTION_FIELDS[sec].forEach((f) => {
            if (f.type === "number" || f.type === "firm") {
              if (out[f.key] !== "" && out[f.key] !== undefined) {
                out[f.key] = Number(out[f.key]);
              }
            }
          });
          return out;
        });
      }
    }

    setLoading(true);
    try {
      await dispatch(
        ingestDataThunk({ id: Number(quarterId), data: payload }),
      ).unwrap();

      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enabledCount = SECTIONS.filter((s) => enabledSections[s]).length;


  const sectionHasError = (sec) =>
    fieldErrors[sec]?.some((e) => Object.keys(e).length > 0);

  return (
    <div className="tpu-tab-content">
      <div className="tpu-card">
        <p className="tpu-card-title">
          <Activity className="text-primary" size={20} />
          Ingest Data{" "}

        </p>


        <div className="tpu-ingest-step">
          <div className="tpu-ingest-step-label">
            <RefreshCw size={12} className="me-1" />
            1. Select Quarter
          </div>

          <div className="tpu-select-wrapper tpu-select-quarter-wrap">
            <div className="position-relative d-flex align-items-center gap-3 flex-wrap">
              <div className="position-relative flex-1 tpu-select-inner-wrap">
                <select
                  value={quarterId}
                  onChange={(e) => {
                    setQuarterId(Number(e.target.value));
                    setQuarterError("");
                  }}
                  className={`tpu-select ${quarterError ? "tpu-input-error" : ""}`}
                >
                  {quarters.length === 0 ? (
                    <option value="">No quarters available</option>
                  ) : (
                    quarters.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.year} {q.quarter} — {q.market} (#{q.id})
                      </option>
                    ))
                  )}
                </select>
                {quarterError && (
                  <div className="position-absolute end-0 top-50 translate-middle-y me-3 pointer-events-none text-danger">
                    <AlertCircle size={18} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <Btn onClick={onRefresh}>Refresh</Btn>
            </div>
            {quarterError && <p className="tpu-error-text">{quarterError}</p>}
          </div>
        </div>


        <div className="tpu-ingest-step">
          <div className="tpu-ingest-step-label">
            <TrendingUp size={12} className="me-1" />
            2. Select Category
            <span className="ms-auto" style={{ textTransform: "none", opacity: 0.7 }}>
              {enabledCount} of {SECTIONS.length} enabled
            </span>
          </div>

          <div className="tpu-stab-group">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec;
              const isEnabled = enabledSections[sec];
              const hasErr = sectionHasError(sec);

              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={[
                    "tpu-stab",
                    isActive ? "tpu-stab-active" : "",
                  ].join(" ")}
                >
                  {SEC_ICONS[sec]}
                  {SEC_LABELS[sec]}
                  {(isEnabled || hasErr) && (
                    <span
                      className={`tpu-stab-indicator ${hasErr
                        ? "tpu-stab-indicator-error"
                        : isActive
                          ? "tpu-stab-indicator-active"
                          : "tpu-stab-indicator-success"
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>


          <div className="tpu-ingest-toggle mt-2">
            <input
              id={`cb-${activeSection}`}
              type="checkbox"
              checked={!!enabledSections[activeSection]}
              onChange={() => toggleSection(activeSection)}
              className="cursor-pointer"
            />
            <label htmlFor={`cb-${activeSection}`} className="cursor-pointer">
              Include <strong>{SEC_LABELS[activeSection]}</strong> in this
              ingest
            </label>
          </div>
        </div>


        {enabledSections[activeSection] ? (
          <div className="tpu-ingest-step">
            <div className="tpu-ingest-step-label">
              <Plus size={12} className="me-1" />
              3. Fill <span className="tpu-weight-600 ms-1">{SEC_LABELS[activeSection]}</span> Data
            </div>

            <div className="tpu-entries-list">
              {sectionRows[activeSection].map((row, idx) => (
                <EntryCard
                  key={idx}
                  sec={activeSection}
                  index={idx}
                  row={row}
                  firms={firms}
                  errors={fieldErrors[activeSection]?.[idx] || {}}
                  onChange={(key, val) =>
                    updateRow(activeSection, idx, key, val)
                  }
                  onRemove={() => removeRow(activeSection, idx)}
                  canRemove={sectionRows[activeSection].length > 1}
                />
              ))}
            </div>

            <button
              type="button"
              className="tpu-add-entry-btn"
              onClick={() => addRow(activeSection)}
            >
              <Plus size={15} />
              Add another {SEC_LABELS[activeSection]} entry
            </button>
          </div>
        ) : (
          <div className="tpu-section-disabled-notice">
            <ChevronRight size={16} />
            Enable <strong>{SEC_LABELS[activeSection]}</strong> above to fill in
            its data.
          </div>
        )}


        <div className="tpu-btn-row mt-4">
          <Btn primary onClick={handleIngest} loading={loading}>
            Run Ingest
          </Btn>

          <Btn
            onClick={() =>
              setEnabledSections(
                Object.fromEntries(SECTIONS.map((s) => [s, true])),
              )
            }
          >
            Enable All
          </Btn>

          <Btn
            onClick={() =>
              setEnabledSections(
                Object.fromEntries(SECTIONS.map((s) => [s, false])),
              )
            }
          >
            Disable All
          </Btn>
        </div>
      </div>
    </div>
  );
};