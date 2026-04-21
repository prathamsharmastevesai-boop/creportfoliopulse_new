import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  extractLoiDataApi,
  fetchDeltaReportApi,
  fetchBuildingProfilesApi,
  fetchDealPdfApi,
  updateAllLoiFieldsApi,
} from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import {
  clearCurrentDealDelta,
  clearExtractedLoiData,
} from "../../../../Networking/Admin/Slice/AdminLoiAuditSlice";
import RAGLoader from "../../../../Component/Loader";

const INITIAL_FORM = {
  tenant: "",
  landlord: "",
  building: "",
  premises: "",
  rsf: "",
  use: "",
  lease_term_years: "",
  lease_commencement: "",
  rent_commencement: "",
  free_rent_months: "",
  free_rent_type: "",
  base_rent_steps: "",
  escalation_pct: "",
  escalation_type: "",
  opex_structure: "",
  tax_base_year: "",
  ti_allowance_psf: "",
  landlord_work: "",
  electricity: "",
  hvac: "",
  cleaning: "",
  renewal_options: "",
  rofo_rofr: "",
  termination_option: "",
  assignment_sublease: "",
  restoration_clause: "",
  compliance: "",
  security_deposit: "",
  brokerage: "",
  access: "",
  confidentiality: "",
  financial_security: "",
  net_effective_rent: "",
};

const FIELD_CONFIG = [
  { label: "Tenant", name: "tenant" },
  { label: "Landlord", name: "landlord" },
  { label: "Building", name: "building" },
  { label: "Premises", name: "premises" },
  { label: "RSF", name: "rsf" },
  { label: "Use", name: "use", multiline: true },
  { label: "Lease Term (Years)", name: "lease_term_years" },
  { label: "Lease Commencement", name: "lease_commencement" },
  { label: "Rent Commencement", name: "rent_commencement" },
  { label: "Free Rent Months", name: "free_rent_months" },
  { label: "Free Rent Type", name: "free_rent_type" },
  { label: "Base Rent Steps", name: "base_rent_steps", multiline: true },
  { label: "Escalation %", name: "escalation_pct" },
  { label: "Escalation Type", name: "escalation_type" },
  { label: "OpEx Structure", name: "opex_structure", multiline: true },
  { label: "Tax Base Year", name: "tax_base_year" },
  { label: "TI Allowance PSF", name: "ti_allowance_psf" },
  { label: "Landlord Work", name: "landlord_work", multiline: true },
  { label: "Electricity", name: "electricity" },
  { label: "HVAC", name: "hvac" },
  { label: "Cleaning", name: "cleaning" },
  { label: "Renewal Options", name: "renewal_options", multiline: true },
  { label: "ROFO / ROFR", name: "rofo_rofr", multiline: true },
  { label: "Termination Option", name: "termination_option", multiline: true },
  {
    label: "Assignment / Sublease",
    name: "assignment_sublease",
    multiline: true,
  },
  { label: "Restoration Clause", name: "restoration_clause", multiline: true },
  { label: "Compliance", name: "compliance", multiline: true },
  { label: "Security Deposit", name: "security_deposit" },
  { label: "Brokerage", name: "brokerage", multiline: true },
  { label: "Access", name: "access" },
  { label: "Confidentiality", name: "confidentiality", multiline: true },
  { label: "Financial Security", name: "financial_security" },
  { label: "Net Effective Rent", name: "net_effective_rent" },
];

const DEAL_PREFILL_MAP = {
  tenant: "tenant_name",
  building: ["building_name", "building"],
  premises: "premises",
  lease_term_years: "lease_term",
  free_rent_months: "free_rent",
  base_rent_steps: "base_rent_steps",
  escalation_pct: "escalation",
  ti_allowance_psf: "ti_allowance",
};

const getVal = (field) => {
  if (
    !field ||
    field.is_na ||
    field.value === null ||
    field.value === undefined
  ) {
    return "";
  }
  return String(field.value);
};

const buildPrefilledForm = (deal) => {
  const form = { ...INITIAL_FORM };

  Object.entries(DEAL_PREFILL_MAP).forEach(([formKey, dealKey]) => {
    if (Array.isArray(dealKey)) {
      form[formKey] = deal?.[dealKey[0]] || deal?.[dealKey[1]] || "";
    } else {
      form[formKey] = deal?.[dealKey] || "";
    }
  });

  return form;
};

const buildExtractedForm = (extracted) => {
  const form = { ...INITIAL_FORM };

  Object.keys(INITIAL_FORM).forEach((key) => {
    form[key] = getVal(extracted?.[key]);
  });

  return form;
};

const Field = ({ label, name, multiline, formData, handleChange }) => (
  <div className="form-field">
    <label>{label}</label>
    {multiline ? (
      <textarea
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    ) : (
      <input
        type="text"
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    )}
  </div>
);

const IngestionAuditSection = ({
  selectedDeal,
  onDealSelect,
  pendingDeals = [],
}) => {
  const dispatch = useDispatch();

  const {
    currentDealDelta,
    buildingProfiles,
    extractedLoiData,
    extractionLoading,
    updateFieldLoading,
    dealPdfUrl,
    dealPdfLoading,
    pendingDealsLoading,
    deltaReportLoading,
    profilesLoading,
  } = useSelector((state) => state.adminLoiAudit);

  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!buildingProfiles.length) {
      dispatch(fetchBuildingProfilesApi());
    }
  }, [dispatch, buildingProfiles.length]);

  useEffect(() => {
    if (!selectedDeal?.deal_id) return;

    dispatch(clearExtractedLoiData());
    dispatch(clearCurrentDealDelta());
    dispatch(fetchDealPdfApi(selectedDeal.deal_id));

    setSelectedProfileId("");
    setFormData(buildPrefilledForm(selectedDeal));
  }, [selectedDeal?.deal_id, dispatch]);

  useEffect(() => {
    if (!extractedLoiData?.extracted) return;
    setFormData(buildExtractedForm(extractedLoiData.extracted));
  }, [extractedLoiData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtract = () => {
    if (!selectedDeal?.deal_id) return;
    dispatch(extractLoiDataApi(selectedDeal.deal_id));
  };

  const handleSaveAll = async () => {
    if (!selectedDeal?.deal_id || !extractedLoiData?.extracted) return;

    const extracted = extractedLoiData.extracted;
    const updates = {};

    Object.keys(formData).forEach((key) => {
      const oldValue = getVal(extracted[key]).trim();
      const newValue = String(formData[key] ?? "").trim();

      if (oldValue !== newValue && newValue !== "") {
        updates[key] = formData[key];
      }
    });

    if (!Object.keys(updates).length) {
      // console.log("No changes to save");
      return;
    }

    try {
      await dispatch(
        updateAllLoiFieldsApi({
          dealId: selectedDeal.deal_id,
          updates,
        }),
      ).unwrap();

      // console.log("All changed fields updated successfully");
    } catch (error) {
      console.error("Bulk update failed:", error);
    }
  };

  const handleProfileChange = (e) => {
    const profileId = e.target.value;
    setSelectedProfileId(profileId);

    if (!selectedDeal?.deal_id || !profileId) return;

    dispatch(
      fetchDeltaReportApi({
        dealId: selectedDeal.deal_id,
        buildingProfileId: profileId,
      }),
    );
  };

  const fp = { formData, handleChange };

  const pdfUrl =
    typeof dealPdfUrl === "string" ? dealPdfUrl : dealPdfUrl?.url || "";
  // console.log(dealPdfUrl, "dealPdfUrl");

  return (
    <div className="loi-section-grid a1-grid">
      <div className="loi-column left-col" style={{ maxHeight: "500px" }}>
        <div className="col-header">
          <span className="col-title">PDF Viewer</span>
        </div>

        <div className="pending-deals-list">
          <div className="section-subtitle">
            PENDING DEALS{" "}
            <span className="badge-id">{pendingDeals.length}</span>
          </div>

          {pendingDealsLoading ? (
            <div className="d-flex align-items-center gap-2 py-4 text-muted small">
              Fetching deals...
            </div>
          ) : pendingDeals.length > 0 ? (
            pendingDeals.map((deal) => (
              <div
                key={deal.deal_id}
                className={`deal-card ${
                  selectedDeal?.deal_id === deal.deal_id ? "selected" : ""
                }`}
                onClick={() => onDealSelect(deal)}
              >
                <div className="deal-info">
                  <div className="deal-name">{deal.tenant_name}</div>
                  <div className="deal-address">
                    {deal.building} · {deal.broker_company}
                  </div>
                </div>
                <span className="status-badge pending">Pending</span>
              </div>
            ))
          ) : (
            <div className="text-muted small mt-3">No pending deals found</div>
          )}
        </div>

        <div className="pdf-preview-box">
          {dealPdfLoading ? (
            <div className="pdf-placeholder">
              <RAGLoader />
              <div className="pdf-instruction mt-2">Loading PDF…</div>
            </div>
          ) : dealPdfUrl ? (
            <iframe
              src={dealPdfUrl}
              title="LOI PDF"
              className="pdf-iframe"
              style={{
                width: "100%",
                height: "100%",
                minHeight: 480,
                border: "none",
              }}
            />
          ) : (
            <div className="pdf-placeholder">
              <div className="pdf-name">
                {selectedDeal?.tenant_name
                  ? `${selectedDeal.tenant_name}_LOI.pdf`
                  : "Select a deal to view PDF"}
              </div>
              <div className="pdf-instruction">
                PDF will render here once a deal is selected
              </div>
            </div>
          )}
        </div>

        <button
          className="extract-btn mt-3 w-100"
          onClick={handleExtract}
          disabled={!selectedDeal?.deal_id || extractionLoading}
        >
          {extractionLoading ? "Extracting…" : "Run Extraction"}
        </button>
      </div>

      <div className="loi-column middle-col" style={{ maxHeight: "500px" }}>
        <div className="col-header">
          <span className="col-title">Smart Form</span>
          {extractedLoiData?.confidence && (
            <span className="conf-summary">
              {extractedLoiData.confidence.total}/
              {extractedLoiData.confidence.out_of} fields extracted
            </span>
          )}
        </div>

        <div className="smart-form">
          <div className="form-group-header">
            <CheckCircle2 size={14} className="verified-icon" /> Extracted
            Fields
          </div>

          {FIELD_CONFIG.map((field) => (
            <Field key={field.name} {...field} {...fp} />
          ))}

          <div className="form-footer">
            {updateFieldLoading
              ? "Saving…"
              : "Click 'Save All Changes' to save"}
          </div>

          <div className="form-actions mt-3 d-flex gap-2">
            <button
              className="extract-btn"
              onClick={handleSaveAll}
              disabled={updateFieldLoading || !selectedDeal?.deal_id}
            >
              {updateFieldLoading ? "Saving…" : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="loi-column right-col" style={{ maxHeight: "500px" }}>
        <div className="col-header">
          <span className="col-title">Delta Report</span>
        </div>

        <div className="profile-selector">
          <label>Building Profile</label>
          {profilesLoading ? (
            <div className="d-flex align-items-center gap-2 text-muted small py-1">
              Loading profiles...
            </div>
          ) : (
            <select
              className="premium-select"
              value={selectedProfileId}
              onChange={handleProfileChange}
            >
              <option value="">Select Profile</option>
              {buildingProfiles?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.building_name} / {p.profile_label}
                </option>
              ))}
            </select>
          )}
        </div>

        {currentDealDelta?.message && !currentDealDelta?.delta?.length && (
          <div
            className="ai-insight-box mb-2"
            style={{ borderLeft: "3px solid #f59e0b" }}
          >
            <strong>Info:</strong> {currentDealDelta.message}
          </div>
        )}

        <div className="delta-table-container">
          <table className="delta-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Tenant Offer</th>
                <th>Building Target</th>
                <th>Delta</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {deltaReportLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <RAGLoader />
                      <span className="text-muted small">
                        Analyzing Delta...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : currentDealDelta?.delta?.length > 0 ? (
                currentDealDelta.delta.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.label}</td>
                    <td>{item.tenant_offer ?? "—"}</td>
                    <td>{item.building_target ?? "—"}</td>
                    <td>
                      {item.delta_value ?? "—"}
                      {item.delta_pct != null ? ` (${item.delta_pct}%)` : ""}
                    </td>
                    <td>
                      <span
                        className={`flag ${item.flag?.toLowerCase() || ""}`}
                      >
                        {item.flag || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    {currentDealDelta?.message ||
                      "Select a profile to see delta"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {currentDealDelta?.rag_summary && (
          <div className="ai-insight-box mt-3">
            <strong>AI Insight:</strong> {currentDealDelta.rag_summary}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngestionAuditSection;
