import React from "react";
import { AlertCircle } from "lucide-react";

export const Field = ({ label, value, onChange, placeholder, type = "text", error, required }) => {
  return (
    <div className="tpu-field" style={{ marginBottom: '1.25rem' }}>
      <p className="tpu-field-label" style={{ display: 'flex', gap: '4px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </p>
      <div className="position-relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`tpu-input ${error ? "tpu-input-error" : ""}`}
          style={{
            background: 'var(--bg-secondary)',
            borderColor: error ? '#ef4444' : 'var(--border-color)',
            paddingRight: error ? '40px' : '12px',
            color: 'var(--text-primary)'
          }}
        />
        {error && (
          <div 
            className="position-absolute end-0 top-50 translate-middle-y me-3"
            style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
          >
            <AlertCircle size={20} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {error && (
        <p style={{ 
          color: '#ff8080', 
          fontSize: '13px', 
          marginTop: '6px', 
          fontWeight: '400',
          letterSpacing: '0.01em'
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export const Btn = ({ children, onClick, primary, loading, danger, disabled }) => {
  const className = `tpu-btn ${primary ? "tpu-btn-primary" : ""} ${
    danger ? "tpu-btn-danger" : ""
  }`;
  
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={className}
      style={{ opacity: (loading || disabled) ? 0.7 : 1 }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
