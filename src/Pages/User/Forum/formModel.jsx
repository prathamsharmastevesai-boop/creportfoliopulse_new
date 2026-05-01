import { useEffect, useState } from "react";
import { X, Save, Check, Minus } from "lucide-react";
import { Spinner } from "react-bootstrap";

export const FormModal = ({
  show,
  title,
  fields,
  initialValues,
  onSubmit,
  onHide,
  loading,
}) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues(initialValues || {});
  }, [show]);

  if (!show) return null;

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  return (
    <div className="nyc-modal-backdrop" onClick={onHide}>
      <div
        className="nyc-modal-box nyc-modal-box--form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nyc-modal-header">
          <h5 className="nyc-modal-title">{title}</h5>
          <button
            onClick={onHide}
            className="nyc-modal-close"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="nyc-form-fields">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="nyc-form-label">
                {f.label}
                {f.required && <span className="nyc-form-required">*</span>}
              </label>

              {f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="nyc-input"
                >
                  <option value="">Select {f.label}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "checkbox" ? (
                <label className="nyc-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!values[f.key]}
                    onChange={(e) => set(f.key, e.target.checked)}
                    className="nyc-checkbox"
                  />
                  <span>{f.checkLabel}</span>
                </label>
              ) : f.type === "number" ? (
                <input
                  type="number"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, Number(e.target.value))}
                  placeholder={f.placeholder}
                  className="nyc-input"
                />
              ) : (
                <input
                  type="text"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="nyc-input"
                />
              )}
            </div>
          ))}
        </div>

        <div className="nyc-modal-footer nyc-modal-footer--top-gap">
          <button onClick={onHide} className="nyc-btn nyc-btn--secondary">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(values)}
            disabled={loading}
            className="nyc-btn nyc-btn--primary"
          >
            {loading ? (
              <Spinner small />
            ) : (
              <>
                <Save size={13} strokeWidth={2.2} /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const isGreen = status === "Available";
  const isBlue = status === "Leased";
  return (
    <span
      className="nyc-status-badge"
      style={{
        background: isGreen ? "#d1e7dd" : isBlue ? "#cfe2ff" : "#f1f3f5",
        color: isGreen ? "#0a3622" : isBlue ? "#052c65" : "#495057",
      }}
    >
      {status || "—"}
    </span>
  );
};

export const VerifiedIcon = ({ verified }) => (
  <span
    className={`nyc-verified-icon ${verified ? "nyc-verified-icon--yes" : "nyc-verified-icon--no"}`}
  >
    {verified ? (
      <Check size={11} strokeWidth={3} />
    ) : (
      <Minus size={11} strokeWidth={2.5} />
    )}
  </span>
);
