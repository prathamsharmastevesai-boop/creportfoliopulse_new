import {
  Calendar,
  FileText,
  Users,
  UserPlus,
  CalendarCheck,
  Wrench,
  AlertCircle,
  Edit,
  X,
} from "lucide-react";
import StatusBadge from "./statusbadge";

const PulseReportView = ({ report, isAdmin, onClose, onEdit }) => {
  const c = report.content || {};

  const occupancy = c.occupancy_rate != null ? `${c.occupancy_rate}%` : "—";
  const leads = c.new_leads ?? "—";
  const tours = c.tours_completed ?? "—";
  const maintenance = c.maintenance_issues ?? c.maintenance_alerts ?? "—";
  const notes = c.notes || c.summary || null;

  const formattedDate = report.date
    ? new Date(report.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mu2-overlay" onClick={onClose}>
      <div
        className="mu2-dialog mu2-dialog--pulse"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mu2-dialog__header mu2-dialog__header--accent">
          <div className="mu2-dialog__header-left">
            <div className="mu2-pulse-eyebrow">
              <Calendar size={12} style={{ marginRight: 4 }} />
              NIGHTLY LEASING PULSE
            </div>
            <div className="mu2-pulse-date">{formattedDate}</div>
            <div style={{ marginTop: "8px" }}>
              <StatusBadge status={report.status} />
            </div>
          </div>
          <div className="mu2-dialog__header-actions">
            {isAdmin && (
              <button
                className="mu2-icon-btn"
                onClick={onEdit}
                title="Edit report"
              >
                <Edit size={18} />
              </button>
            )}
            <button className="mu2-icon-btn" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mu2-dialog__body">
          <div className="mu2-stats-grid">
            <div className="mu2-stat-card">
              <Users className="mu2-stat-card__icon" />
              <span className="mu2-stat-card__value">{occupancy}</span>
              <span className="mu2-stat-card__label">Occupancy Rate</span>
            </div>
            <div className="mu2-stat-card">
              <UserPlus className="mu2-stat-card__icon" />
              <span className="mu2-stat-card__value">{leads}</span>
              <span className="mu2-stat-card__label">New Leads</span>
            </div>
            <div className="mu2-stat-card">
              <CalendarCheck className="mu2-stat-card__icon" />
              <span className="mu2-stat-card__value">{tours}</span>
              <span className="mu2-stat-card__label">Tours Done</span>
            </div>
            <div className="mu2-stat-card">
              {maintenance !== "—" && Number(maintenance) > 0 ? (
                <AlertCircle className="mu2-stat-card__icon" color="#ef4444" />
              ) : (
                <Wrench className="mu2-stat-card__icon" />
              )}
              <span className="mu2-stat-card__value">{maintenance}</span>
              <span className="mu2-stat-card__label">Maint. Issues</span>
            </div>
          </div>

          {notes && (
            <div className="mu2-notes-block">
              <div className="mu2-notes-block__label">
                <FileText size={14} style={{ marginRight: 6 }} />
                NOTES / SUMMARY
              </div>
              <p className="mu2-notes-block__text">{notes}</p>
            </div>
          )}

          {process.env.NODE_ENV === "development" && !notes && (
            <pre className="mu2-json-pre">{JSON.stringify(c, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PulseReportView;
