import { CATEGORY_LABELS } from "./maintenanceConstants";

const HistoryModal = ({ item, data, onClose }) => {
  return (
    <div className="mu2-overlay" onClick={onClose}>
      <div className="mu2-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="mu2-dialog__header">
          <div>
            <h3 className="mu2-dialog__title">Edit History</h3>
            <p className="mu2-dialog__sub">
              {CATEGORY_LABELS[item.category]} · Entry #{item.id}
            </p>
          </div>
          <button className="mu2-icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mu2-dialog__body mu2-dialog__body--scroll">
          {data.length === 0 ? (
            <p
              className="mu2-muted"
              style={{ padding: "24px", textAlign: "center" }}
            >
              No history available.
            </p>
          ) : (
            data.map((h, i) => (
              <div key={i} className="mu2-history-item">
                <div className="mu2-history-item__dot" />
                <div className="mu2-history-item__meta">
                  {h.edited_by || h.changed_by || "System"} ·{" "}
                  {h.edited_at || h.timestamp || "—"}
                </div>
                <div className="mu2-history-item__desc">
                  {h.changes?.initial === "create" ? (
                    <span>Entry created</span>
                  ) : (
                    Object.entries(h.changes || {}).map(([key, value]) => {
                      if (key === "category")
                        value = CATEGORY_LABELS[value] || value;
                      if (key === "tour_impact") value = value ? "Yes" : "No";

                      return (
                        <div key={key}>
                          <strong>{key.replace("_", " ")}</strong>:{" "}
                          {String(value)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
