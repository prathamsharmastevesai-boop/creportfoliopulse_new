import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import {
  fetchAuditStatsApi,
  fetchDealContrastApi,
  askRAGApi,
} from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import ReactMarkdown from "react-markdown";
import RAGLoader from "../../../../Component/Loader";

const FLAG_CLASS = {
  GREEN: "text-success",
  AMBER: "text-warning",
  RED: "text-danger",
};

const FLAG_ARROW = {
  GREEN: "↑",
  RED: "↓",
  AMBER: "~",
};

const AuditTrailSection = ({ selectedDeal }) => {
  const dispatch = useDispatch();
  const {
    currentAuditStats,
    currentDealContrast,
    ragAnswer,
    buildingProfiles,
    auditStatsLoading,
    contrastLoading,
    ragLoading,
  } = useSelector((state) => state.adminLoiAudit);
  const [contrastQuery, setContrastQuery] = useState("Compare to last deals ");
  const [ragQuery, setRagQuery] = useState("");

  useEffect(() => {
    if (selectedDeal?.deal_id) {
      dispatch(fetchAuditStatsApi(selectedDeal.deal_id));
    }
  }, [dispatch, selectedDeal]);

  const handleContrastSearch = () => {
    if (selectedDeal?.deal_id && contrastQuery.trim()) {
      dispatch(
        fetchDealContrastApi({
          current_deal_id: selectedDeal.deal_id,
          query: contrastQuery,
        }),
      );
    }
  };

  const handleRagSearch = () => {
    if (ragQuery.trim()) {
      dispatch(askRAGApi({ question: ragQuery }));
    }
  };

  const auditData = currentAuditStats || {};
  const versions = auditData.versions || [];
  const scorecard = auditData.scorecard || {};
  const currentProfile =
    buildingProfiles.find((p) => p.building_name === auditData.building) || {};

  const comparedTo = currentDealContrast?.compared_to;
  const comparisonRows = currentDealContrast?.comparison || [];
  const aiSummary = currentDealContrast?.ai_summary;

  return (
    <div className="loi-section-grid a3-grid">
      <div className="loi-column full-width-col">
        <div className="audit-header-row">
          {auditStatsLoading ? (
            <div className="w-100 py-3 d-flex justify-content-center">
              loading...
            </div>
          ) : (
            <>
              <div className="audit-stat">
                <label>Final NER vs Target</label>
                <div className="stat-value">
                  {scorecard.final_ner ? `$${scorecard.final_ner}` : "N/A"}
                  <span className="small text-muted"> vs </span>$
                  {currentProfile.target_ner || "0.00"}
                </div>
              </div>
              <div className="audit-stat">
                <label>Status</label>
                <span
                  className={`status-badge ${auditData.status?.toLowerCase() || "submitted"}`}
                >
                  {auditData.status || "SUBMITTED"}
                </span>
              </div>
              <div className="audit-stat">
                <label>Vectorized</label>
                <span
                  className={`rag-badge ${scorecard.is_vectorized ? "success" : "pending"}`}
                >
                  {scorecard.is_vectorized ? "In RAG ✓" : "Pending"}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="audit-main-content mt-4">
          <div className="timeline-container">
            <div className="section-title">VERSION TIMELINE</div>
            <div className="timeline">
              {auditStatsLoading ? (
                <div className="text-center py-5">loading...</div>
              ) : versions.length > 0 ? (
                versions.map((ver) => (
                  <div
                    key={ver.version_number}
                    className={`timeline-item ${ver.status === "CERTIFIED" ? "active" : ""}`}
                  >
                    <div className={`v-circle v${ver.version_number}`}>
                      V{ver.version_number}
                    </div>
                    <div className="v-content">
                      <div className="v-title">
                        {ver.version_type.replace(/_/g, " ")}
                      </div>
                      <div className="v-meta">
                        {new Date(ver.timestamp).toLocaleString()}
                        {ver.certified_by &&
                          ` · Certified by ${ver.certified_by}`}
                      </div>
                      <div className="v-data">{ver.summary}</div>
                      {ver.strategy_notes && (
                        <div className="v-strategy text-success">
                          Strategy: "{ver.strategy_notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 text-muted">
                  No version history found
                </div>
              )}
            </div>
          </div>

          <div className="contrast-container">
            <div className="section-title">DEAL CONTRAST</div>
            <div className="comparison-box">
              <div className="comp-selector">
                <input
                  type="text"
                  value={contrastQuery}
                  onChange={(e) => setContrastQuery(e.target.value)}
                />
                <button className="compare-btn" onClick={handleContrastSearch}>
                  Compare
                </button>
              </div>

              {contrastLoading ? (
                <div className="text-center py-5">
                  <RAGLoader />
                  <p className="text-muted small">Comparing deals...</p>
                </div>
              ) : comparisonRows.length > 0 ? (
                <>
                  <table className="comp-table mt-3">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Current</th>
                        <th>Historical</th>
                        <th>Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((m, i) => (
                        <tr key={i}>
                          <td>{m.metric}</td>
                          <td>{m.current}</td>
                          <td>
                            <span className={FLAG_CLASS[m.flag] || ""}>
                              {m.historical} {FLAG_ARROW[m.flag] || ""}
                            </span>
                          </td>
                          <td className={FLAG_CLASS[m.flag] || ""}>
                            {m.delta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {aiSummary && (
                    <div className="ai-summary mt-3">
                      AI summary: {aiSummary}
                    </div>
                  )}
                </>
              ) : (
                <div className="search-result-placeholder mt-3 text-muted">
                  Specify comparison query to see deep contrast...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rag-search-container mt-4">
          <div className="section-title">RAG NATURAL LANGUAGE SEARCH</div>
          <div className="search-bar-premium">
            <Search size={20} />
            <input
              type="text"
              placeholder="Ask anything about this deal or portfolio..."
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRagSearch()}
            />
            <button className="search-submit-btn" onClick={handleRagSearch}>
              Search
            </button>
          </div>

          {ragLoading ? (
            <div className="text-center py-5">
              <div className="rag-loader-minimal">
                <RAGLoader />
                <p className="text-muted small">Searching repository...</p>
              </div>
            </div>
          ) : (
            ragAnswer && (
              <div className="rag-response-box mt-3">
                <div className="response-label">AI ANSWER</div>
                <div className="response-text">
                  <ReactMarkdown>{ragAnswer.answer || ragAnswer}</ReactMarkdown>
                </div>

                {ragAnswer.sources?.length > 0 && (
                  <div className="rag-sources mt-3">
                    <div className="response-label">SOURCES</div>
                    <div className="rag-source-list">
                      {Array.from(
                        new Map(
                          ragAnswer.sources.map((s) => [s.deal_id, s]),
                        ).values(),
                      ).map((src) => (
                        <div key={src.deal_id} className="rag-source-chip">
                          <span className="source-tenant">{src.tenant}</span>
                          <span className="source-building text-muted">
                            {" "}
                            @ {src.building}
                          </span>
                          <span className="source-score ms-2 text-info">
                            {Math.round(src.score * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailSection;
