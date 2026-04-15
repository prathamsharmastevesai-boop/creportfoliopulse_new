import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Users,
  UserPlus,
  CalendarCheck,
  Wrench,
  FileText,
} from "lucide-react";

const PulseReportForm = ({
  pulseForm,
  setPulseForm,
  editReport,
  onSubmit,
  onClose,
}) => {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    if (editReport) {
      setInitialForm(JSON.parse(JSON.stringify(pulseForm)));
    }
  }, [editReport]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPulseForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    setPulseForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!pulseForm.date) newErrors.date = "Date is required";
    if (!pulseForm.status) newErrors.status = "Status is required";

    if (pulseForm.occupancy_rate === "" || pulseForm.occupancy_rate == null)
      newErrors.occupancy_rate = "Required";

    if (pulseForm.new_leads === "" || pulseForm.new_leads == null)
      newErrors.new_leads = "Required";

    if (pulseForm.tours_completed === "" || pulseForm.tours_completed == null)
      newErrors.tours_completed = "Required";

    if (
      pulseForm.maintenance_issues === "" ||
      pulseForm.maintenance_issues == null
    )
      newErrors.maintenance_issues = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormChanged = () => {
    if (!initialForm) return true;

    return JSON.stringify(initialForm) !== JSON.stringify(pulseForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editReport && !isFormChanged()) {
      console.log("No changes detected");
      onClose();
      return;
    }

    setSaving(true);
    try {
      await onSubmit();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mu2-overlay" onClick={onClose}>
      <div
        className="mu2-dialog mu2-dialog--wide mu2-dialog--scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mu2-dialog__header">
          <h3 className="mu2-dialog__title">
            {editReport ? "Edit Pulse Report" : "New Pulse Report"}
          </h3>

          <button className="mu2-icon-btn" onClick={onClose} disabled={saving}>
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <div
            className="mu2-dialog__body"
            style={{
              padding: "14px",
              height: "300px",
              overflowY: "auto",
              gap: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="mu2-pulse-grid">
              <div className="mu2-field">
                <label className="mu2-field__label">
                  <Calendar size={14} style={{ marginRight: 4 }} />
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  className="mu2-input"
                  value={pulseForm.date || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
                {errors.date && <div className="mu2-error">{errors.date}</div>}
              </div>

              <div className="mu2-field">
                <label className="mu2-field__label">Status</label>

                <div className="mu2-status-picker">
                  {["draft", "sent"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`mu2-status-opt ${
                        pulseForm.status === s ? "mu2-status-opt--on" : ""
                      }`}
                      onClick={() => {
                        setPulseForm((prev) => ({ ...prev, status: s }));
                        setErrors((prev) => ({ ...prev, status: "" }));
                      }}
                      disabled={saving}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>

                {errors.status && (
                  <div className="mu2-error">{errors.status}</div>
                )}
              </div>
            </div>

            <div className="mu2-pulse-grid">
              {[
                {
                  name: "occupancy_rate",
                  label: "Occupancy Rate (%)",
                  icon: <Users size={14} />,
                },
                {
                  name: "new_leads",
                  label: "New Leads",
                  icon: <UserPlus size={14} />,
                },
                {
                  name: "tours_completed",
                  label: "Tours Completed",
                  icon: <CalendarCheck size={14} />,
                },
                {
                  name: "maintenance_issues",
                  label: "Maintenance Issues",
                  icon: <Wrench size={14} />,
                },
              ].map((field) => (
                <div className="mu2-field" key={field.name}>
                  <label className="mu2-field__label">
                    {field.icon} {field.label}
                  </label>

                  <input
                    type="number"
                    name={field.name}
                    className="mu2-input"
                    value={pulseForm[field.name] ?? ""}
                    onChange={handleNumberChange}
                    disabled={saving}
                  />

                  {errors[field.name] && (
                    <div className="mu2-error">{errors[field.name]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mu2-field mu2-field--full">
              <label className="mu2-field__label">
                <FileText size={14} style={{ marginRight: 4 }} />
                Notes / Summary
              </label>

              <textarea
                name="notes"
                className="mu2-textarea"
                rows={4}
                value={pulseForm.notes || ""}
                onChange={handleChange}
                placeholder="Overall performance notes…"
                disabled={saving}
              />
            </div>
          </div>

          <div className="mu2-dialog__footer">
            <button
              type="button"
              className="mu2-btn mu2-btn--ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="mu2-btn mu2-btn--accent"
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : editReport
                  ? "Save Changes"
                  : "Create Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PulseReportForm;
