import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Field, Btn, TextAreaField } from "./SharedComponents";
import {
  createFirmThunk,
  deleteFirmThunk,
} from "../../../Networking/Admin/APIs/ThePulseUploadApi";
import { Trash2 } from "lucide-react";

export const FirmsTab = ({ firms, onRefresh }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    short_name: "",
    color: "",
    methodology_notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Firm name is required";
    if (!form.short_name.trim())
      tempErrors.short_name = "Short name is required";
    if (!form.color.trim()) {
      tempErrors.color = "Color is required";
    } else {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(form.color)) {
        tempErrors.color = "Use valid Hex format (e.g. #003087)";
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      await dispatch(createFirmThunk(form)).unwrap();
      setForm({ name: "", short_name: "", color: "", methodology_notes: "" });
      setErrors({});
      onRefresh();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    try {
      await dispatch(deleteFirmThunk(id)).unwrap();
      onRefresh();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpu-tab-content">
      <div className="tpu-card">
        <p className="tpu-card-title">Add New Firm</p>
        <div className="tpu-row">
          <Field
            label="Name"
            required
            value={form.name}
            onChange={(v) => {
              setForm((f) => ({ ...f, name: v }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="e.g. CBRE"
            error={errors.name}
          />
          <Field
            label="Short Name"
            required
            value={form.short_name}
            onChange={(v) => {
              setForm((f) => ({ ...f, short_name: v }));
              if (errors.short_name)
                setErrors((prev) => ({ ...prev, short_name: "" }));
            }}
            placeholder="e.g. CBRE"
            error={errors.short_name}
          />
        </div>
        <div className="tpu-row">
          <div className="w-100">
            <label className="sc-label">
              Color <span className="text-danger">*</span>
            </label>

            <div className="d-flex align-items-center gap-2">
              <input
                type="color"
                value={form.color || "#0969da"}
                onChange={(e) => {
                  setForm((f) => ({ ...f, color: e.target.value }));
                  if (errors.color) {
                    setErrors((prev) => ({ ...prev, color: "" }));
                  }
                }}
                style={{
                  width: "48px",
                  height: "38px",
                  padding: "2px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                }}
              />
              <Field
                value={form.color}
                onChange={(v) => setForm((f) => ({ ...f, color: v }))}
                placeholder="#0969da"
                error={errors.color}
              />
            </div>
          </div>

          <div className="w-100">
            <TextAreaField
              label="Methodology Notes"
              value={form.methodology_notes}
              onChange={(v) =>
                setForm((f) => ({ ...f, methodology_notes: v }))
              }
              placeholder="Enter methodology details..."
              rows={2}
            />
          </div>
        </div>
        <div className="tpu-btn-row">
          <Btn primary onClick={handleCreate} loading={loading}>
            + Create Firm
          </Btn>
          <Btn onClick={onRefresh}>Refresh</Btn>
        </div>
      </div>

      <div className="tpu-card">
        <p className="tpu-card-title">Existing Firms</p>
        {firms.length === 0 ? (
          <p className="tpu-empty">No firms yet. Create one above.</p>
        ) : (
          <div className="tpu-table-wrapper">
            <table className="tpu-table">
              <thead>
                <tr>
                  <th className="tpu-th" style={{ width: 50 }}>
                    ID
                  </th>
                  <th className="tpu-th" style={{ width: 140 }}>
                    Name
                  </th>
                  <th className="tpu-th" style={{ width: 100 }}>
                    Short
                  </th>
                  <th className="tpu-th" style={{ width: 100 }}>
                    Color
                  </th>
                  <th className="tpu-th">Methodology Notes</th>
                  <th className="tpu-th" style={{ width: 80, textAlign: "center" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {firms.map((f) => (
                  <tr key={f.id} className="tpu-tr">
                    <td className="tpu-td">{f.id}</td>
                    <td className="tpu-td" style={{ fontWeight: 600 }}>
                      {f.name}
                    </td>
                    <td className="tpu-td">{f.short_name || "—"}</td>
                    <td className="tpu-td">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            borderRadius: 4,
                            background: f.color || "#ccc",
                            border: "1px solid var(--border-color)",
                          }}
                        />
                        <span style={{ fontSize: 11, fontFamily: "monospace" }}>
                          {f.color || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="tpu-td">
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          maxWidth: 400,
                          lineHeight: 1.4,
                        }}
                      >
                        {f.methodology_notes || "—"}
                      </div>
                    </td>
                    <td className="tpu-td" style={{ textAlign: "center" }}>
                      <button
                        className="tpu-delete-btn"
                        onClick={() => handleDelete(f.id, f.name)}
                        title="Delete Firm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
