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
        value={unit.tenant_name || ""}
        onChange={(e) => onChange("tenant_name", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        type="number"
        placeholder="SF *"
        value={unit.square_footage || ""}
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
        value={unit.status || "vacant"}
        onChange={(e) => onChange("status", e.target.value)}
        disabled={isSaving}
      >
        <option value="vacant">Vacant</option>
        <option value="occupied">Occupied</option>
      </select>
      <input
        className="bs-input"
        type="number"
        placeholder="Block order"
        value={unit.block_order ?? 0}
        onChange={(e) => onChange("block_order", e.target.value)}
        disabled={isSaving}
      />

      <input
        className="bs-input"
        placeholder="Company website"
        value={unit.company_website || ""}
        onChange={(e) => onChange("company_website", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        placeholder="Contact name"
        value={unit.contact_name || ""}
        onChange={(e) => onChange("contact_name", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        type="email"
        placeholder="Contact email"
        value={unit.contact_email || ""}
        onChange={(e) => onChange("contact_email", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        type="tel"
        placeholder="Contact phone"
        value={unit.contact_phone || ""}
        onChange={(e) => onChange("contact_phone", e.target.value)}
        disabled={isSaving}
      />
      <input
        className="bs-input"
        placeholder="Latest update"
        value={unit.latest_update || ""}
        onChange={(e) => onChange("latest_update", e.target.value)}
        disabled={isSaving}
      />

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
