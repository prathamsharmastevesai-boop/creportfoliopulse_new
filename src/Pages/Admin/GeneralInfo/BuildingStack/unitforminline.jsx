import React from "react";
import { Save, X, Loader } from "lucide-react";

export const UnitFormInline = ({
  unit,
  onChange,
  onSave,
  onCancel,
  containerStyle,
  isSaving = false,
}) => (
  <div
    className="bs-unit-block"
    style={{
      flex: "0 0 200px",
      background: "#fff",
      border: "1px dashed #ccc",
      padding: 8,
      alignSelf: "stretch",
      ...containerStyle,
    }}
  >
    <div className="bs-unit-edit-form">
      <input
        className="bs-input"
        placeholder="Tenant (optional)"
        value={unit.tenant_name}
        onChange={(e) => onChange("tenant_name", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        type="number"
        placeholder="SF *"
        value={unit.square_footage}
        onChange={(e) => onChange("square_footage", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        type="date"
        value={unit.lease_expiration || ""}
        onChange={(e) => onChange("lease_expiration", e.target.value)}
        disabled={isSaving}
      />
      <select
        className="bs-input"
        value={unit.status}
        onChange={(e) => onChange("status", e.target.value)}
        disabled={isSaving}
      >
        <option value="vacant">Vacant</option>
        <option value="occupied">Occupied</option>
      </select>

      <div className="bs-unit-edit-form__row d-flex gap-1 mt-1">
        <button className="bs-btn-save" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <Loader size={12} className="spin" />
          ) : (
            <Save size={12} />
          )}
        </button>
        <button
          className="bs-btn-cancel"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  </div>
);
