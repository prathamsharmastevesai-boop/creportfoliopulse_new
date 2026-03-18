import {
  Wrench,
  Image,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Folder,
  Droplet,
  Zap,
  Thermometer,
  HelpCircle,
  Loader2,
} from "lucide-react";
import StatusBadge from "./statusbadge";
import { CATEGORY_LABELS } from "./maintenanceConstants";

const MaintenanceTable = ({
  items,
  loading,
  onEdit,
  onDelete,
  onHistory,
  onNewEntry,
  loadingHistory,
}) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      elevator: Wrench,
      plumbing: Droplet,
      electrical: Zap,
      hvac: Thermometer,
      general: Folder,
    };
    const Icon = iconMap[category] || HelpCircle;
    return <Icon size={16} />;
  };

  return (
    <div className="mu2-section">
      <div className="mu2-section__header">
        <div>
          <h2 className="mu2-section__title">Maintenance Log</h2>
          <p className="mu2-section__sub">
            {items.length} active {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button className="mu2-btn mu2-btn--primary" onClick={onNewEntry}>
          + New Entry
        </button>
      </div>

      <div className="mu2-table">
        <div className="mu2-table__head">
          <span>Category</span>
          <span>Status</span>
          <span>Description</span>
          <span>Tour Impact</span>
          <span>Photo</span>
          <span className="mu2-text-right">Actions</span>
        </div>

        {loading && (
          <div className="mu2-placeholder">
            <span className="mu2-spinner" />
            Loading…
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="mu2-placeholder">
            <Wrench size={30} className="mu2-placeholder__icon" />
            No maintenance entries yet
          </div>
        )}

        {!loading &&
          items.map((item, i) => {
            const alarm = item.status === "impaired" || item.status === "down";
            const isHistoryLoading = loadingHistory === item.id;

            return (
              <div
                key={item.id || i}
                className={`mu2-table__row${alarm ? " mu2-table__row--alarm" : ""}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="mu2-cell-cat">
                  <span className="mu2-cell-cat__icon">
                    {getCategoryIcon(item.category)}
                  </span>
                  {CATEGORY_LABELS[item.category] || item.category}
                </div>

                <div className="mu2-cell-status">
                  <StatusBadge status={item.status} />
                  {alarm && (
                    <span className="mu2-alarm-ring" title="Critical status">
                      <AlertCircle size={14} color="#ef4444" />
                    </span>
                  )}
                </div>

                <div className="mu2-cell-desc">{item.description || "—"}</div>

                <div>
                  {item.tour_impact ? (
                    <span className="mu2-impact-yes">⚠ YES</span>
                  ) : (
                    <span className="mu2-impact-no">No</span>
                  )}
                </div>

                <div>
                  {item.photo_url ? (
                    <a
                      href={item.photo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mu2-link"
                      title="View photo"
                    >
                      <Image size={16} />
                    </a>
                  ) : (
                    <span className="mu2-muted">—</span>
                  )}
                </div>

                <div className="mu2-cell-actions">
                  <button
                    className="mu2-icon-btn"
                    onClick={() => onHistory(item)}
                    title="View history"
                    disabled={isHistoryLoading}
                  >
                    {isHistoryLoading ? (
                      <Loader2 size={16} className="mu2-spin" />
                    ) : (
                      <Clock size={16} />
                    )}
                  </button>
                  <button
                    className="mu2-icon-btn"
                    onClick={() => onEdit(item)}
                    title="Edit entry"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="mu2-icon-btn"
                    onClick={() => onDelete(item.id)}
                    title="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MaintenanceTable;
