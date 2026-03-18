import { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPulseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setPulseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        className="mu2-dialog mu2-dialog--wide"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
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
                  required
                  disabled={saving}
                />
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
                      onClick={() =>
                        setPulseForm((prev) => ({ ...prev, status: s }))
                      }
                      disabled={saving}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mu2-pulse-grid">
              <div className="mu2-field">
                <label className="mu2-field__label">
                  <Users size={14} style={{ marginRight: 4 }} />
                  Occupancy Rate (%)
                </label>
                <input
                  type="number"
                  name="occupancy_rate"
                  className="mu2-input"
                  value={pulseForm.occupancy_rate ?? ""}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                  step="1"
                  disabled={saving}
                />
              </div>

              <div className="mu2-field">
                <label className="mu2-field__label">
                  <UserPlus size={14} style={{ marginRight: 4 }} />
                  New Leads
                </label>
                <input
                  type="number"
                  name="new_leads"
                  className="mu2-input"
                  value={pulseForm.new_leads ?? ""}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  disabled={saving}
                />
              </div>

              <div className="mu2-field">
                <label className="mu2-field__label">
                  <CalendarCheck size={14} style={{ marginRight: 4 }} />
                  Tours Completed
                </label>
                <input
                  type="number"
                  name="tours_completed"
                  className="mu2-input"
                  value={pulseForm.tours_completed ?? ""}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  disabled={saving}
                />
              </div>

              <div className="mu2-field">
                <label className="mu2-field__label">
                  <Wrench size={14} style={{ marginRight: 4 }} />
                  Maintenance Issues
                </label>
                <input
                  type="number"
                  name="maintenance_issues"
                  className="mu2-input"
                  value={pulseForm.maintenance_issues ?? ""}
                  onChange={handleNumberChange}
                  min="0"
                  step="1"
                  disabled={saving}
                />
              </div>
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
