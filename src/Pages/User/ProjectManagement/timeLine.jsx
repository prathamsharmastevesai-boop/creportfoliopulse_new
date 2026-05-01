import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTimelinePhasesApi,
  addTimelinePhaseApi,
  updateTimelinePhaseApi,
} from "../../../Networking/User/APIs/ProjectManagement/projectManagement";
import Card from "../../../Component/Card/Card";

export const TimelinePhaseSection = ({ projectId }) => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.timelineSlice);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmPhase, setConfirmPhase] = useState(null);
  const [marking, setMarking] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    phase_name: "",
    order_index: "",
    start_date: "",
    end_date: "",
  });

  const PHASES = [
    "Phase 1 - Demo",
    "Phase 2 - Rough-In",
    "Phase 3 - Electrical/HVAC",
    "Phase 4 - Finishes",
  ];

  useEffect(() => {
    dispatch(fetchTimelinePhasesApi({ projectId }));
  }, [dispatch, projectId]);

  const resetForm = () => {
    setForm({
      phase_name: "",
      order_index: "",
      start_date: "",
      end_date: "",
    });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!form.phase_name) {
      newErrors.phase_name = "Phase name is required";
    }

    if (!form.order_index) {
      newErrors.order_index = "Order index is required";
    } else if (
      isNaN(form.order_index) ||
      !Number.isInteger(Number(form.order_index))
    ) {
      newErrors.order_index = "Order index must be a whole number";
    } else if (Number(form.order_index) < 0) {
      newErrors.order_index = "Order index must be a positive number";
    } else if (Number(form.order_index) > 1000) {
      newErrors.order_index = "Order index is too high (max 1000)";
    } else {
      if (!editingId) {
        const isDuplicateOrder = list.some(
          (phase) => phase.order_index === Number(form.order_index),
        );
        if (isDuplicateOrder) {
          newErrors.order_index =
            "Order index already exists. Please use a unique number";
        }
      }
    }

    if (!form.start_date) {
      newErrors.start_date = "Start date is required";
    } else if (form.start_date < today) {
      newErrors.start_date = "Start date cannot be in the past";
    }

    if (!form.end_date) {
      newErrors.end_date = "End date is required";
    } else if (form.start_date && form.end_date < form.start_date) {
      newErrors.end_date = "End date must be after or equal to start date";
    } else if (form.end_date < today) {
      newErrors.end_date = "End date cannot be in the past";
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 365) {
        newErrors.end_date = "Phase duration cannot exceed 365 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        order_index: Number(form.order_index),
        start_date: form.start_date,
        end_date: form.end_date,
      };

      if (editingId) {
        await dispatch(
          updateTimelinePhaseApi({
            projectId,
            phaseId: editingId,
            payload,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addTimelinePhaseApi({
            projectId,
            payload,
          }),
        ).unwrap();
      }

      resetForm();

      await dispatch(fetchTimelinePhasesApi({ projectId }));
    } catch (error) {
      console.error("Error submitting phase:", error);

      if (error?.message) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message,
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const editPhase = (phase) => {
    setForm({
      phase_name: phase.phase_name,
      order_index: phase.order_index,
      start_date: phase.start_date,
      end_date: phase.end_date,
    });
    setEditingId(phase.id);
    setShowForm(true);
    setErrors({});
  };

  const handleMark = (phase) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark "${phase.phase_name}" as completed?`,
    );

    if (!confirmed) return;

    markCompleted(phase);
  };

  const markCompleted = async (phase) => {
    try {
      setMarking(true);

      await dispatch(
        updateTimelinePhaseApi({
          projectId,
          phaseId: phase.id,
          payload: {
            phase_name: phase.phase_name,
            order_index: phase.order_index,
            start_date: phase.start_date,
            end_date: phase.end_date,
            is_completed: true,
          },
        }),
      ).unwrap();

      await dispatch(fetchTimelinePhasesApi({ projectId }));
      setConfirmPhase(null);
    } catch (error) {
      console.error("Error marking phase as completed:", error);
      alert("Failed to mark phase as completed. Please try again.");
    } finally {
      setMarking(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="timeline-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Project Timeline</h5>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            setShowForm(true);
            setErrors({});
          }}
          disabled={submitting}
        >
          + Add Phase
        </button>
      </div>

      {showForm && (
        <Card className="mb-4 shadow-sm" bodyClass="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">
              Phase Name <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.phase_name ? "is-invalid" : ""}`}
              value={form.phase_name}
              onChange={(e) => {
                setForm({ ...form, phase_name: e.target.value });
                if (errors.phase_name) {
                  setErrors({ ...errors, phase_name: "" });
                }
              }}
              disabled={submitting}
            >
              <option value="" disabled>
                Select phase
              </option>
              {PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
            {errors.phase_name && (
              <div className="invalid-feedback">{errors.phase_name}</div>
            )}
          </div>

          <div className="col-md-2">
            <label className="form-label fw-semibold">
              Order <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.order_index ? "is-invalid" : ""}`}
              placeholder="Order"
              value={form.order_index}
              onChange={(e) => {
                setForm({ ...form, order_index: e.target.value });
                if (errors.order_index) {
                  setErrors({ ...errors, order_index: "" });
                }
              }}
              disabled={submitting}
              min="0"
              step="1"
            />
            {errors.order_index && (
              <div className="invalid-feedback">{errors.order_index}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Start Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.start_date ? "is-invalid" : ""}`}
              value={form.start_date}
              onChange={(e) => {
                setForm({ ...form, start_date: e.target.value });
                if (errors.start_date) {
                  setErrors({ ...errors, start_date: "" });
                }
              }}
              disabled={submitting}

            />
            {errors.start_date && (
              <div className="invalid-feedback">{errors.start_date}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">
              End Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${errors.end_date ? "is-invalid" : ""}`}
              value={form.end_date}
              onChange={(e) => {
                setForm({ ...form, end_date: e.target.value });
                if (errors.end_date) {
                  setErrors({ ...errors, end_date: "" });
                }
              }}
              disabled={submitting}
              min={form.start_date}
            />
            {errors.end_date && (
              <div className="invalid-feedback">{errors.end_date}</div>
            )}
          </div>

          {errors.submit && (
            <div className="col-12">
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errors.submit}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrors({ ...errors, submit: "" })}
                />
              </div>
            </div>
          )}

          <div className="col-12 text-end">
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              className="btn btn-sm btn-success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editingId ? "Updating..." : "Saving..."}
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <ul className="timeline list-unstyled">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="timeline-item mb-3 d-flex">
              <div
                className="me-3 mt-2 placeholder-glow"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                }}
              >
                <span className="placeholder col-12 rounded-circle"></span>
              </div>

              <Card
                className="shadow-sm w-100"
                bodyClass="d-flex justify-content-between"
              >
                <div className="w-75 placeholder-glow">
                  <span className="placeholder col-6 mb-2 d-block"></span>
                  <span className="placeholder col-4 d-block"></span>
                </div>

                <div className="text-end placeholder-glow">
                  <span className="placeholder col-6 d-block mb-2"></span>

                  <div className="d-flex gap-2 justify-content-end">
                    <span
                      className="placeholder rounded-circle"
                      style={{ width: 32, height: 32 }}
                    ></span>
                    <span
                      className="placeholder rounded-circle"
                      style={{ width: 32, height: 32 }}
                    ></span>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : list.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-calendar2-week fs-1 text-muted"></i>
          <p className="text-muted mt-2">No timeline phases added yet</p>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowForm(true)}
          >
            Add your first phase
          </button>
        </div>
      ) : (
        <ul className="timeline list-unstyled">
          {[...list]
            .sort((a, b) => a.order_index - b.order_index)
            .map((phase) => (
              <li key={phase.id} className="timeline-item mb-3 d-flex">
                <div
                  className={`timeline-dot me-3 mt-2 ${phase.is_completed ? "bg-success" : "bg-secondary"
                    }`}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  }}
                />

                <Card
                  className="timeline-content shadow-sm w-100"
                  bodyClass="d-flex justify-content-between align-items-start"
                >
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="fw-bold mb-0">{phase.phase_name}</h6>
                      <span className="badge bg-secondary">
                        Order: {phase.order_index}
                      </span>
                    </div>
                    <small className="text-muted">
                      {formatDate(phase.start_date)} →{" "}
                      {formatDate(phase.end_date)}
                    </small>

                    {phase.completed_at && (
                      <div className="text-success small mt-1">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Completed on{" "}
                        {new Date(phase.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="text-end">
                    <span
                      className={`badge mb-2 ${phase.is_completed
                        ? "bg-success"
                        : "bg-warning text-dark"
                        }`}
                    >
                      {phase.is_completed ? "Completed" : "Pending"}
                    </span>

                    {!phase.is_completed && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editPhase(phase)}
                          disabled={submitting}
                          title="Edit Phase"
                        >
                          <i className="bi bi-pencil" />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setConfirmPhase(phase)}
                          disabled={marking}
                          title="Mark as Completed"
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </li>
            ))}
        </ul>
      )}

      {confirmPhase && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Completion</h5>
                <button
                  type="button"
                  className="btn-close"
                  disabled={marking}
                  onClick={() => setConfirmPhase(null)}
                />
              </div>

              <div className="modal-body">
                Are you sure you want to mark{" "}
                <strong>{confirmPhase.phase_name}</strong> as completed?
                {confirmPhase.end_date &&
                  new Date(confirmPhase.end_date) < new Date() && (
                    <div className="alert alert-warning mt-2 mb-0 small">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      This phase's end date has passed.
                    </div>
                  )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  disabled={marking}
                  onClick={() => setConfirmPhase(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  disabled={marking}
                  onClick={() => markCompleted(confirmPhase)}
                >
                  {marking ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Marking...
                    </>
                  ) : (
                    "Yes, Mark Completed"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
