import { useRef, useState } from "react";
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    if (!form.description || form.description.trim() === "") {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isLoading) return;

    if (!validateForm()) return;

    onSubmit();
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
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
              onChange={(e) => handleChange("category", e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>

            {errors.category && (
              <div className="mu2-error">{errors.category}</div>
            )}
          </div>

          <div className="mu2-field">
            <label className="mu2-field__label">Current Status</label>

            <div className="mu2-status-picker">
              {Object.entries(STATUS_CONFIG)
                .filter(([k]) => k !== "completed")
                .map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    className={`mu2-status-opt ${
                      form.status === k ? "mu2-status-opt--on" : ""
                    }`}
                    style={
                      form.status === k ? { "--oc": v.color, "--ob": v.bg } : {}
                    }
                    onClick={() => handleChange("status", k)}
                    disabled={isLoading}
                  >
                    {v.label}
                  </button>
                ))}
            </div>

            {errors.status && <div className="mu2-error">{errors.status}</div>}
          </div>

          <div className="mu2-field">
            <label className="mu2-field__label">Incident Description</label>

            <textarea
              className="mu2-textarea"
              rows={3}
              placeholder="e.g. Elevator 4 out of service…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isLoading}
            />

            {errors.description && (
              <div className="mu2-error">{errors.description}</div>
            )}
          </div>

          <div className="mu2-toggle-row">
            <div>
              <div className="mu2-toggle-row__label">Tour Impact</div>
              <div className="mu2-toggle-row__sub">
                Flags space as unshowable
              </div>
            </div>

            <button
              type="button"
              className={`mu2-toggle ${
                form.tour_impact ? "mu2-toggle--on" : ""
              }`}
              onClick={() => handleChange("tour_impact", !form.tour_impact)}
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
              onChange={(e) => handleChange("photo", e.target.files[0])}
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
