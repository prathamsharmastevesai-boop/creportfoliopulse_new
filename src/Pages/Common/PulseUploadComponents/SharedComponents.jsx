import React from "react";
import { AlertCircle } from "lucide-react";


export const Field = ({ label, value, onChange, placeholder, type = "text", error, required, disabled }) => {
  return (
    <div className="sc-field">
      {label && (
        <label className="sc-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="position-relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`sc-input ${error ? "sc-input-error" : ""}`}
        />
        {error && (
          <div className="position-absolute end-0 top-50 translate-middle-y me-3 text-danger d-flex align-items-center">
            <AlertCircle size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {error && <p className="sc-error-msg">{error}</p>}
    </div>
  );
};

export const SelectField = ({ label, value, onChange, options, error, required, disabled, placeholder }) => {
  return (
    <div className="sc-field">
      {label && (
        <label className="sc-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="position-relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`sc-select ${error ? "sc-input-error" : ""}`}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt.value || opt.id} value={opt.value || opt.id}>
              {opt.label || opt.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="sc-error-msg">{error}</p>}
    </div>
  );
};

export const Badge = ({ children, type = "neutral", className = "" }) => {
  const badgeClass = `sc-badge sc-badge-${type} ${className}`;
  return <span className={badgeClass}>{children}</span>;
};


export const TextAreaField = ({ label, value, onChange, placeholder, error, required, disabled, rows = 3 }) => {
  return (
    <div className="sc-field">
      {label && (
        <label className="sc-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`sc-input ${error ? "sc-input-error" : ""}`}
        style={{ minHeight: '80px', resize: 'vertical' }}
      />
      {error && <p className="sc-error-msg">{error}</p>}
    </div>
  );
};


export const Btn = ({ children, onClick, primary, loading, danger, disabled, className = "", type = "button" }) => {
  const btnClass = `tpu-btn ${primary ? "tpu-btn-primary" : ""} ${danger ? "tpu-btn-danger" : ""
    } ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={btnClass}
      style={{ opacity: (loading || disabled) ? 0.7 : 1 }}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
