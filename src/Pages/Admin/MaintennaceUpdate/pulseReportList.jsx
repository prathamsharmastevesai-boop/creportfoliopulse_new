import { Clipboard, FileText, Settings, Plus } from "lucide-react";
import StatusBadge from "./statusbadge";

const PulseReportList = ({ reports, loading, onView, onEdit, onNewReport }) => {
  return (
    <div className="mu2-section">
      <div className="mu2-section__header">
        <div>
          <h2 className="mu2-section__title">Pulse Report Archive</h2>
          <p className="mu2-section__sub">
            Nightly Leasing Pulse · {reports.length} reports
          </p>
        </div>

        <button className="mu2-btn mu2-btn--accent" onClick={onNewReport}>
          <Plus size={16} style={{ marginRight: "4px" }} />
          New Report
        </button>
      </div>

      <div className="mu2-report-list">
        {loading && (
          <div className="mu2-placeholder">
            <span className="mu2-spinner" />
            Loading…
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="mu2-placeholder mu2-placeholder--bordered">
            <FileText size={30} className="mu2-placeholder__icon" />
            No pulse reports yet
          </div>
        )}

        {!loading &&
          reports.map((r, i) => (
            <div
              key={r.id || i}
              className="mu2-report-card"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => onView(r)}
            >
              <div className="mu2-report-card__icon">
                <Clipboard size={20} />
              </div>
              <div className="mu2-report-card__body">
                <div className="mu2-report-card__title">
                  {r.date
                    ? new Date(r.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : `Report #${r.id}`}
                </div>
                <div className="mu2-report-card__preview">
                  {(
                    r.content?.notes ||
                    r.content?.summary ||
                    "Tap to view full report"
                  ).slice(0, 72)}
                  {(r.content?.notes || r.content?.summary || "").length > 72
                    ? "…"
                    : ""}
                </div>
              </div>
              <div className="mu2-report-card__meta">
                <StatusBadge status={r.status} />

                <button
                  className="mu2-btn mu2-btn--xs mu2-btn--ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(r);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="mu2-admin-note">
        <Settings size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Editor Controls:</strong> Draft reports editable before 6:00
          PM dispatch. Cron auto-generates nightly at 18:00.
        </span>
      </div>
    </div>
  );
};

export default PulseReportList;
