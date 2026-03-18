import { useState } from "react";

export const ActivityModal = ({ show, onClose, onSave, type, loading }) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!show) return null;

  const validate = () => {
    if (!notes.trim()) {
      setError("Notes are required.");
      return false;
    }

    if (notes.trim().length < 5) {
      setError("Notes must be at least 5 characters.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave(notes);
    setNotes("");
    setError("");
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Add {type === "email_outreach" ? "Email Outreach" : "Phone Call"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className={`form-control ${error ? "is-invalid" : ""}`}
                rows="3"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter notes..."
                autoFocus
                disabled={loading}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
