import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addLineItemsBulkApi } from "../../../Networking/User/APIs/ProjectManagement/projectManagement";

const CATEGORIES = [
  "Demolition",
  "Electrical",
  "HVAC",
  "Plumbing",
  "Flooring",
  "Painting",
];

const PHASES = [
  "Phase 1 - Demo",
  "Phase 2 - Rough-In",
  "Phase 3 - Electrical/HVAC",
  "Phase 4 - Finishes",
];

const RESPONSIBLE_MAP = {
  Landlord: "landlord",
  Tenant: "tenant",
  Shared: "shared",
};

export default function AddLineItemModal({ show, onClose, onAdd, projectId }) {
  const dispatch = useDispatch();

  const initialFormState = {
    category: "",
    responsible: "Landlord",
    description: "",
    cost: "",
    phase: "",
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [lineItems, setLineItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    category: "",
    description: "",
    cost: "",
  });

  useEffect(() => {
    if (show) {
      setForm(initialFormState);
      setErrors({ category: "", description: "", cost: "" });
    }
  }, [show]);

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {
      category: "",
      description: "",
      cost: "",
    };
    let isValid = true;

    if (!form.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!form.description || form.description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters";
      isValid = false;
    } else if (form.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    if (form.cost && (isNaN(form.cost) || Number(form.cost) < 0)) {
      newErrors.cost = "Cost must be a positive number";
      isValid = false;
    } else if (form.cost && Number(form.cost) > 999999999) {
      newErrors.cost = "Cost is too high (max $999,999,999)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddToList = () => {
    if (!validateForm()) return;

    const isDuplicate = lineItems.some(
      (item) =>
        item.category === form.category &&
        item.description.toLowerCase() === form.description.toLowerCase(),
    );

    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        description: "Similar item already exists in the list",
      }));
      return;
    }

    setLineItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        category: form.category,
        description: form.description.trim(),
        responsible_party: RESPONSIBLE_MAP[form.responsible],
        estimated_cost: form.cost ? Number(form.cost) : 0,
        timeline_phase: form.phase,
        status: "pending",
        notes: form.notes?.trim() || "",
      },
    ]);

    setForm(initialFormState);
    setErrors({ category: "", description: "", cost: "" });
  };

  const handleRemoveItem = (indexToRemove) => {
    setLineItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitBulk = async () => {
    if (!lineItems.length) {
      setErrors((prev) => ({
        ...prev,
        description: "Please add at least one line item before submitting",
      }));
      return;
    }

    try {
      setSubmitting(true);

      const itemsToSubmit = lineItems.map(({ id, ...item }) => item);

      const resultAction = await dispatch(
        addLineItemsBulkApi({
          projectId,
          lineItems: itemsToSubmit,
        }),
      ).unwrap();

      if (onAdd && typeof onAdd === "function") {
        onAdd(resultAction?.line_items || itemsToSubmit);
      }

      setLineItems([]);
      setForm(initialFormState);
      setErrors({ category: "", description: "", cost: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting line items:", error);

      if (error?.message) {
        setErrors((prev) => ({
          ...prev,
          description: `Submission failed: ${error.message}`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          description: "Failed to submit line items. Please try again.",
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return `$${Number(value).toLocaleString()}`;
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold">Add Line Items</h5>
              <small className="text-muted">
                Add multiple cost items before submitting
              </small>
            </div>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            />
          </div>

          <div className="modal-body pt-0">
            <div className="bg-light p-3 rounded-3 mb-4">
              <h6 className="fw-bold mb-3">Add New Item</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Responsible Party <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="responsible"
                    value={form.responsible}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option>Landlord</option>
                    <option>Tenant</option>
                    <option>Shared</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter detailed description of the work item"
                    disabled={submitting}
                    maxLength="500"
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                  <small className="text-muted">
                    {form.description.length}/500 characters
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Estimated Cost
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className={`form-control ${errors.cost ? "is-invalid" : ""}`}
                      name="cost"
                      value={form.cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={submitting}
                    />
                  </div>
                  {errors.cost && (
                    <div className="invalid-feedback">{errors.cost}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Timeline Phase
                  </label>
                  <select
                    className="form-select"
                    name="phase"
                    value={form.phase}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select phase</option>
                    {PHASES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Additional notes or specifications"
                    disabled={submitting}
                    maxLength="500"
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={handleAddToList}
                    disabled={submitting}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add to List
                  </button>
                </div>
              </div>
            </div>

            {lineItems.length > 0 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">
                    Items to be Added ({lineItems.length})
                  </h6>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setLineItems([])}
                    disabled={submitting}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear All
                  </button>
                </div>

                <div
                  className="list-group"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {lineItems.map((item, idx) => (
                    <div key={item.id || idx} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <span className="badge bg-primary">
                              {item.category}
                            </span>
                            <span className="badge bg-secondary">
                              {Object.keys(RESPONSIBLE_MAP).find(
                                (key) =>
                                  RESPONSIBLE_MAP[key] ===
                                  item.responsible_party,
                              ) || item.responsible_party}
                            </span>
                            {item.timeline_phase && (
                              <span className="badge bg-info">
                                {item.timeline_phase}
                              </span>
                            )}
                            {item.estimated_cost > 0 && (
                              <span className="badge bg-success">
                                {formatCurrency(item.estimated_cost)}
                              </span>
                            )}
                          </div>
                          <p className="mb-1">{item.description}</p>
                          {item.notes && (
                            <small className="text-muted">{item.notes}</small>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-link text-danger p-0 ms-2"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={submitting}
                          style={{ textDecoration: "none" }}
                        >
                          <i className="bi bi-x-circle fs-5"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 bg-light rounded-3">
                  <div className="d-flex justify-content-between">
                    <strong>Total Estimated Cost:</strong>
                    <strong className="text-success">
                      {formatCurrency(
                        lineItems.reduce(
                          (sum, item) => sum + (item.estimated_cost || 0),
                          0,
                        ),
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleSubmitBulk}
              disabled={!lineItems.length || submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                `Submit ${lineItems.length} Item${lineItems.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
