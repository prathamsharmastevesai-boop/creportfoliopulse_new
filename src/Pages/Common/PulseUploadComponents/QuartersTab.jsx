import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Field, Btn } from "./SharedComponents";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";

import {
  createQuarterThunk,
  deleteQuarterThunk,
  publishQuarterThunk,
} from "../../../Networking/Admin/APIs/ThePulseUploadApi";

export const QuartersTab = ({ quarters, onRefresh }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    quarter: "",
    market: "Manhattan",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};
    const validQuarters = ["Q1", "Q2", "Q3", "Q4"];

    if (!form.quarter.trim()) {
      tempErrors.quarter = "Quarter label is required";
    } else if (!validQuarters.includes(form.quarter.toUpperCase().trim())) {
      tempErrors.quarter = "Must be one of: Q1, Q2, Q3, Q4";
    }

    if (!form.year || form.year < 2000 || form.year > 2100) {
      tempErrors.year = "Invalid year range (2000-2100)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createQuarterThunk({
          ...form,
          quarter: form.quarter.toUpperCase().trim(),
          year: parseInt(form.year),
        }),
      ).unwrap();

      setForm((f) => ({ ...f, quarter: "" }));
      setErrors({});
      onRefresh();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await dispatch(publishQuarterThunk(id)).unwrap();
      onRefresh();
    } catch {}
  };

  const handleDeleteClick = (q) => {
    setSelectedQuarter(q);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuarter) return;

    setDeleteLoading(true);
    try {
      await dispatch(deleteQuarterThunk(selectedQuarter.id)).unwrap();
      onRefresh();
      setShowDeleteModal(false);
      setSelectedQuarter(null);
    } catch {
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="tpu-tab-content">
      <div className="tpu-card">
        <p className="tpu-card-title">Add New Quarter</p>

        <div className="tpu-row">
          <Field
            label="Year"
            required
            type="number"
            value={form.year}
            onChange={(v) => {
              setForm((f) => ({ ...f, year: v }));
              if (errors.year) setErrors((prev) => ({ ...prev, year: "" }));
            }}
            error={errors.year}
          />

          <Field
            label="Quarter"
            required
            value={form.quarter}
            onChange={(v) => {
              setForm((f) => ({ ...f, quarter: v }));
              if (errors.quarter)
                setErrors((prev) => ({ ...prev, quarter: "" }));
            }}
            placeholder="Q1"
            error={errors.quarter}
          />

          <div>
            <p className="tpu-field-label">Market</p>
            <select
              value={form.market}
              onChange={(e) =>
                setForm((f) => ({ ...f, market: e.target.value }))
              }
              className="tpu-select"
            >
              {[
                "Manhattan",
                "Brooklyn",
                "Queens",
                "Bronx",
                "Staten Island",
              ].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tpu-btn-row">
          <Btn primary onClick={handleCreate} loading={loading}>
            + Create Quarter
          </Btn>
          <Btn onClick={onRefresh}>Refresh</Btn>
        </div>
      </div>

      <div className="tpu-card">
        <p className="tpu-card-title">Existing Quarters</p>

        {quarters.length === 0 ? (
          <p className="tpu-empty">No quarters yet. Create one above.</p>
        ) : (
          <div className="tpu-table-wrapper">
            <table className="tpu-table">
              <thead>
                <tr>
                  <th className="tpu-th">ID</th>
                  <th className="tpu-th">Label</th>
                  <th className="tpu-th">Year</th>
                  <th className="tpu-th">Quarter</th>
                  <th className="tpu-th">Market</th>
                  <th className="tpu-th">Status</th>
                  <th className="tpu-th">Actions</th>
                </tr>
              </thead>

              <tbody>
                {quarters.map((q) => (
                  <tr key={q.id} className="tpu-tr">
                    <td className="tpu-td">{q.id}</td>
                    <td className="tpu-td" style={{ fontWeight: 600 }}>
                      {q.label}
                    </td>
                    <td className="tpu-td">{q.year}</td>
                    <td className="tpu-td">{q.quarter}</td>
                    <td className="tpu-td">{q.market}</td>

                    <td className="tpu-td">
                      <span
                        className={`tpu-badge ${
                          q.is_published
                            ? "tpu-badge-published"
                            : "tpu-badge-draft"
                        }`}
                      >
                        {q.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="tpu-td">
                      <div style={{ display: "flex", gap: 8 }}>
                        {!q.is_published && (
                          <button
                            onClick={() => handlePublish(q.id)}
                            className="tpu-btn"
                            style={{
                              fontSize: 11,
                              padding: "4px 8px",
                              borderColor: "#10b981",
                              color: "#10b981",
                            }}
                          >
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteClick(q)}
                          className="tpu-btn"
                          style={{
                            fontSize: 11,
                            padding: "4px 8px",
                            borderColor: "#ef4444",
                            color: "#ef4444",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        show={showDeleteModal}
        selectedEmail={
          selectedQuarter
            ? `${selectedQuarter.label} (${selectedQuarter.year})`
            : ""
        }
        deleteLoading={deleteLoading}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedQuarter(null);
        }}
        onDelete={confirmDelete}
      />
    </div>
  );
};
