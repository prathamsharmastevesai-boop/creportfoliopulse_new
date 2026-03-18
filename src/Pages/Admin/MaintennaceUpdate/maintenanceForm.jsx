import { useRef } from "react";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORIES,
  STATUS_CONFIG,
} from "./maintenanceConstants";

const MaintenanceForm = ({
  form,
  setForm,
  editItem,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const fileRef = useRef();

  const handleSubmit = () => {
    if (isLoading) return;
    onSubmit();
  };

  return (
    <div className="mu2-overlay" onClick={!isLoading ? onClose : undefined}>
      <div className="mu2-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="mu2-dialog__header">
          <h3 className="mu2-dialog__title">
            {editItem ? "Edit Entry" : "New Maintenance Entry"}
          </h3>

          <button
            className="mu2-icon-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="mu2-dialog__body">
          <div className="mu2-field">
            <label className="mu2-field__label">System Category</label>

            <select
              className="mu2-select"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              disabled={isLoading}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="mu2-field">
            <label className="mu2-field__label">Current Status</label>

            <div className="mu2-status-picker">
              {Object.entries(STATUS_CONFIG)
                .filter(([k]) => k !== "completed")
                .map(([k, v]) => (
                  <button
                    key={k}
                    className={`mu2-status-opt ${
                      form.status === k ? "mu2-status-opt--on" : ""
                    }`}
                    style={
                      form.status === k ? { "--oc": v.color, "--ob": v.bg } : {}
                    }
                    onClick={() => setForm((f) => ({ ...f, status: k }))}
                    disabled={isLoading}
                  >
                    {v.label}
                  </button>
                ))}
            </div>
          </div>

          <div className="mu2-field">
            <label className="mu2-field__label">Incident Description</label>

            <textarea
              className="mu2-textarea"
              rows={3}
              placeholder="e.g. Elevator 4 out of service…"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              disabled={isLoading}
            />
          </div>

          <div className="mu2-toggle-row">
            <div>
              <div className="mu2-toggle-row__label">Tour Impact</div>
              <div className="mu2-toggle-row__sub">
                Flags space as unshowable
              </div>
            </div>

            <button
              className={`mu2-toggle ${
                form.tour_impact ? "mu2-toggle--on" : ""
              }`}
              onClick={() =>
                setForm((f) => ({ ...f, tour_impact: !f.tour_impact }))
              }
              disabled={isLoading}
            >
              <span className="mu2-toggle__knob" />
            </button>
          </div>

          <div className="mu2-field">
            <label className="mu2-field__label">Photo (Optional)</label>

            <div
              className="mu2-upload"
              onClick={() => !isLoading && fileRef.current.click()}
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {form.photo ? (
                <>📷 {form.photo.name}</>
              ) : (
                <>☁ Click to upload site photo</>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setForm((f) => ({ ...f, photo: e.target.files[0] }))
              }
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mu2-dialog__footer">
          <button
            className="mu2-btn mu2-btn--ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            className="mu2-btn mu2-btn--primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>{editItem ? "Editing..." : "Creating..."}</>
            ) : editItem ? (
              "Save Changes"
            ) : (
              "Create Entry"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;
