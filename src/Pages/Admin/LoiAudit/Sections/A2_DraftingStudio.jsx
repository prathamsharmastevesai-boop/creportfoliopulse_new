import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Download, CheckCircle } from "lucide-react";
import {
  draftCounterLoiApi,
  fetchCitationsApi,
  fetchLoiDocumentApi,
  certifyVersionApi,
  downloadCertifiedDocApi,
  fetchLoiTemplatesApi,
  fetchDealPdfApi,
} from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import RAGLoader from "../../../../Component/Loader";

const DraftingStudioSection = ({ selectedDeal }) => {
  const dispatch = useDispatch();

  const {
    currentDealCitations,
    currentDealDocument,
    templates,
    draftLoading,
    certifyLoading,
    versionId,
    dealPdfUrl,
    dealPdfLoading,
  } = useSelector((state) => state.adminLoiAudit);

  const [strategy, setStrategy] = useState(
    "Counter Rent at $44.00/RSF flat for Years 1-9. Reduce free rent to 4 months inside term only. Escalation at 3.00% starting Month 13. No renewal option. Add restoration clause for specialized build-outs.",
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [smeCertified, setSmeCertified] = useState(false);
  const [certifyDone, setCertifyDone] = useState(false);
  const [certifyError, setCertifyError] = useState(null);

  useEffect(() => {
    dispatch(fetchLoiTemplatesApi());
  }, [dispatch]);

  useEffect(() => {
    if (templates?.length && !selectedTemplateId) {
      setSelectedTemplateId(String(templates[0].template_id));
    }
  }, [templates, selectedTemplateId]);

  useEffect(() => {
    if (!selectedDeal?.deal_id) return;

    dispatch(
      fetchLoiDocumentApi({
        dealId: selectedDeal.deal_id,
        version: "v2",
      }),
    );

    dispatch(fetchDealPdfApi(selectedDeal.deal_id));

    setSmeCertified(false);
    setCertifyDone(false);
    setCertifyError(null);
  }, [dispatch, selectedDeal?.deal_id]);

  useEffect(() => {
    if (!selectedDeal?.deal_id || !versionId) return;

    dispatch(
      fetchCitationsApi({
        dealId: selectedDeal.deal_id,
        versionId,
      }),
    );
  }, [dispatch, selectedDeal?.deal_id, versionId]);

  const handleDraftCounter = async () => {
    if (!selectedDeal?.deal_id) return;

    try {
      setSmeCertified(false);
      setCertifyDone(false);
      setCertifyError(null);

      const res = await dispatch(
        draftCounterLoiApi({
          dealId: selectedDeal.deal_id,
          strategy_text: strategy,
          template_id: Number(selectedTemplateId) || 0,
        }),
      ).unwrap();

      if (res) {
        await dispatch(fetchDealPdfApi(selectedDeal.deal_id));
      }
    } catch (error) {
      console.error("Draft Counter LOI failed:", error);
      setCertifyError(error?.message || "Something went wrong");
    }
  };

  const handleCertify = (e) => {
    const checked = e.target.checked;
    setSmeCertified(checked);
    setCertifyError(null);

    if (checked && selectedDeal?.deal_id && versionId) {
      dispatch(
        certifyVersionApi({
          dealId: selectedDeal.deal_id,
          version_id: versionId,
        }),
      ).then((action) => {
        if (action.error || action.payload?.available === false) {
          setCertifyDone(false);
          setSmeCertified(false);
          setCertifyError(
            action.payload?.message ??
              "Certification failed. Please draft the counter first.",
          );
        } else {
          setCertifyDone(true);
        }
      });
    } else {
      setCertifyDone(false);
    }
  };

  const cv = currentDealDocument?.counter_values ?? {};
  const ner = currentDealDocument?.ner_estimate;

  const counterRows = [
    {
      label: "Base Rent",
      value:
        cv.base_rent_psf != null ? `$${cv.base_rent_psf.toFixed(2)}/RSF` : "—",
      cls: "text-success",
    },
    {
      label: "Free Rent",
      value:
        cv.free_rent_months != null ? `${cv.free_rent_months} months` : "—",
      cls: "text-success",
    },
    {
      label: "Escalation",
      value:
        cv.escalation_pct != null ? `${cv.escalation_pct.toFixed(2)}%` : "—",
      cls: "text-success",
    },
    {
      label: "Restoration",
      value:
        cv.restoration_clause != null
          ? cv.restoration_clause
            ? "Required"
            : "None"
          : "—",
      cls: cv.restoration_clause ? "text-warning" : "",
    },
    {
      label: "NER Estimate",
      value: ner != null ? `$${ner.toFixed(2)}` : "—",
      cls: "font-bold",
      total: true,
    },
  ];

  return (
    <div className="loi-section-grid a2-grid">
      <div className="loi-column left-col">
        <div className="col-header">
          <span className="col-title">Strategy Input</span>
        </div>

        <div className="strategy-input-container">
          <label>Plain-English Counter Strategy</label>
          <textarea
            className="strategy-textarea"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            rows={8}
            placeholder="e.g. Counter rent at $44/RSF, reduce free rent to 4 months inside term…"
          />

          <div className="template-selector mt-3">
            <label>Template</label>
            <select
              className="premium-select"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              {templates?.map((tpl) => (
                <option key={tpl.template_id} value={tpl.template_id}>
                  {tpl.template_name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="apply-draft-btn mt-4"
            onClick={handleDraftCounter}
            disabled={draftLoading || !selectedDeal?.deal_id}
          >
            {draftLoading ? "Drafting…" : "Apply & Draft Counter"}
          </button>

          {currentDealDocument?.tags_used?.length > 0 && (
            <div className="tags-used-summary mt-3">
              <div className="section-subtitle">Tags Used</div>
              <div className="tags-list">
                {currentDealDocument.tags_used.map((tag, i) => (
                  <span key={i} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="counter-values-summary mt-4">
            <h6>Counter Values</h6>
            {counterRows.map(({ label, value, cls, total }) => (
              <div
                key={label}
                className={`summary-row${total ? " total" : ""}`}
              >
                <span>{label}</span>
                <span className={`value ${cls}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="loi-column middle-col">
        <div
          className="docx-preview-box"
          style={{ padding: 0, overflow: "hidden" }}
        >
          {dealPdfLoading ? (
            <div className="docx-placeholder">
              <RAGLoader />
              <p className="mt-2">Loading preview...</p>
            </div>
          ) : dealPdfUrl ? (
            <iframe
              src={dealPdfUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "600px", border: "none" }}
            />
          ) : (
            <div className="docx-placeholder">
              <FileText size={48} />
              <p>
                {draftLoading
                  ? "Generating draft…"
                  : "Draft a counter to see preview"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="loi-column right-col">
        <div className="col-header">
          <span className="col-title">SME Verification</span>
        </div>

        <div className="sme-citations">
          {currentDealCitations?.length > 0 ? (
            currentDealCitations.map((citation, idx) => (
              <div key={idx} className="citation-group">
                <label className="citation-field-label">
                  {citation.field_name}
                </label>
                <div className="citation-card">
                  <div className="citation-text">
                    {citation.text_snippet || citation.text}
                  </div>
                  <div className="citation-meta">
                    {citation.page_number != null && (
                      <span className="page-badge">
                        Page {citation.page_number}
                      </span>
                    )}

                    <span
                      className={`conf-badge ${
                        citation.confidence_score > 0.8
                          ? "high"
                          : citation.confidence_score > 0.6
                            ? "medium"
                            : "low"
                      }`}
                    >
                      {Math.round((citation.confidence_score || 0) * 100)}% conf
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              <FileText size={32} className="mb-2 opacity-40" />
              <p>No citations available</p>
            </div>
          )}
        </div>

        <div className="certification-checkbox mt-4">
          <input
            type="checkbox"
            id="sme-cert"
            checked={smeCertified}
            onChange={handleCertify}
            disabled={certifyLoading || draftLoading || !versionId}
          />
          <label htmlFor="sme-cert">
            {certifyLoading ? (
              "Certifying…"
            ) : certifyDone ? (
              <>
                <CheckCircle size={14} className="text-success me-1" /> SME
                Certified
              </>
            ) : (
              "SME Certified — I have reviewed all citations"
            )}
          </label>
        </div>

        {certifyError && (
          <div className="hint-text mt-2 text-danger text-center">
            {certifyError}
          </div>
        )}

        <a
          href={smeCertified && certifyDone ? dealPdfUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          download
          className={`download-btn mt-3 w-100 ${
            !smeCertified || !certifyDone || !dealPdfUrl ? "disabled" : ""
          }`}
          onClick={(e) => {
            if (!smeCertified || !certifyDone || !dealPdfUrl) {
              e.preventDefault();
            }
          }}
        >
          <Download size={14} className="me-1" />
          Download Certified PDF
        </a>

        {!smeCertified && !certifyError && (
          <div className="hint-text mt-2 text-muted text-center">
            Check the box above to unlock download
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftingStudioSection;
