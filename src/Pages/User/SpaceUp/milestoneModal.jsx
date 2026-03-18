import { useState, useEffect } from "react";

export const MilestoneModal = ({
  show,
  onClose,
  onSave,
  milestone,
  loading,
}) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setNotes("");
      setError("");
    }
  }, [show]);

  if (!show) return null;

  const formatMilestoneLabel = (field) => {
    if (!field) return "Milestone";
    return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleSave = () => {
    const trimmed = notes.trim();

    if (trimmed.length === 0) {
      setError("Notes are required.");
      return;
    }

    if (trimmed && trimmed.length < 3) {
      setError("If adding notes, please enter at least 3 characters.");
      return;
    }

    if (trimmed.length > 500) {
      setError("Notes cannot exceed 500 characters.");
      return;
    }

    setError("");
    onSave(trimmed || null);
    setNotes("");
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Complete {formatMilestoneLabel(milestone)}
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
              <label htmlFor="milestone-notes" className="form-label">
                Notes (optional)
              </label>
              <textarea
                id="milestone-notes"
                className={`form-control ${error ? "is-invalid" : ""}`}
                rows="3"
                maxLength={500}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Add any notes about this milestone..."
                autoFocus
                disabled={loading}
              />
              <div className="d-flex justify-content-between">
                {error && (
                  <div className="invalid-feedback d-block">{error}</div>
                )}
                <small className="text-muted ms-auto">{notes.length}/500</small>
              </div>
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
