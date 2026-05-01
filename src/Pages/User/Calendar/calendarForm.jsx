import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTourApi,
  updateTourApi,
} from "../../../Networking/User/APIs/calendar/calendarApi";

const TOUR_TYPES = [
  "Building Tour",
  "Office Tour",
  "Facility Tour",
  "Site Visit",
];
const DURATIONS = ["30 minutes", "1 hour", "1.5 hours", "2 hours", "3 hours"];

const INITIAL_FORM = {
  tour_type: "Building Tour",
  duration: "1 hour",
  building: "",
  title: "",
  tour_date: "",
  tour_time: "10:00",
  description: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  is_global: false,
};

export const TourForm = ({
  editData = null,
  preselectedDate = "",
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const { error } = useSelector((s) => s.tours ?? {});

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (editData) {
      setForm({ ...INITIAL_FORM, ...editData });
    } else if (preselectedDate) {
      setForm((prev) => ({ ...prev, tour_date: preselectedDate }));
    }
  }, [editData, preselectedDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.building.trim()) errs.building = "Building is required";
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.tour_date) errs.tour_date = "Date is required";
    if (!form.contact_name.trim()) errs.contact_name = "Name is required";
    if (!form.contact_email.trim()) {
      errs.contact_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      errs.contact_email = "Invalid email";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const ve = validate();
    if (Object.keys(ve).length) {
      setErrors(ve);
      return;
    }

    setLoading(true);
    try {
      const result = editData?.id
        ? await dispatch(updateTourApi({ id: editData.id, payload: form }))
        : await dispatch(createTourApi(form));

      if (!result.error) {
        setForm(INITIAL_FORM);
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cal-card--no-clip rounded-3">
      {loading && (
        <div className="cal-form-overlay">
          <div
            className="spinner-border cal-form-overlay__spinner"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="cal-form-overlay__text">
            {editData ? "Updating event…" : "Scheduling event…"}
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between px-4 py-3 cal-section-border">
        <div>
          <h6 className="mb-0 fw-semibold cal-title">
            {editData ? "Edit Tour" : "Schedule an Event"}
          </h6>
          <small className="cal-subtitle">Fill in the details below</small>
        </div>
        {onCancel && (
          <button
            type="button"
            className="btn-close"
            onClick={onCancel}
            aria-label="Close"
            disabled={loading}
            style={{
              opacity: loading ? 0.4 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          />
        )}
      </div>

      <div
        className={`cal-form-body px-4 py-3${loading ? " cal-form-body--loading" : ""}`}
      >
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label small fw-medium mb-1 cal-form-label">
              Tour Type
            </label>
            <select
              name="tour_type"
              value={form.tour_type}
              onChange={handleChange}
              className="form-select form-select-sm cal-input"
            >
              {TOUR_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label small fw-medium mb-1 cal-form-label">
              Duration
            </label>
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="form-select form-select-sm cal-input"
            >
              {DURATIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-medium mb-1 cal-form-label">
            Building
          </label>
          <span class="text-danger ms-1">*</span>
          <input
            name="building"
            value={form.building}
            onChange={handleChange}
            placeholder="e.g., 1515 Broadway, New York, NY"
            className={`form-control form-control-sm cal-input${errors.building ? " is-invalid" : ""}`}
          />
          {errors.building && (
            <div className="invalid-feedback">{errors.building}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label small fw-medium mb-1 cal-form-label">
            Title
          </label>
          <span class="text-danger ms-1">*</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Tour of 1515 Broadway"
            className={`form-control form-control-sm cal-input${errors.title ? " is-invalid" : ""}`}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label small fw-medium mb-1 cal-form-label">
              Date
            </label>
            <span class="text-danger ms-1">*</span>
            <input
              type="date"
              name="tour_date"
              value={form.tour_date}
              onChange={handleChange}
              className={`form-control form-control-sm cal-input${errors.tour_date ? " is-invalid" : ""}`}
            />
            {errors.tour_date && (
              <div className="invalid-feedback">{errors.tour_date}</div>
            )}
          </div>
          <div className="col-6">
            <label className="form-label small fw-medium mb-1 cal-form-label">
              Time
            </label>
            <input
              type="time"
              name="tour_time"
              value={form.tour_time}
              onChange={handleChange}
              className="form-control form-control-sm cal-input"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-medium mb-1 cal-form-label">
            Description{" "}
            <span className="fw-normal cal-subtitle">(optional)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Additional details..."
            className="form-control form-control-sm cal-input"
            style={{ resize: "none" }}
          />
        </div>

        <div className="cal-contact-block p-3 mb-3">
          <p className="cal-contact-block__label mb-2">Contact Information</p>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small fw-medium mb-1 cal-form-label">
                Name
              </label>
              <span class="text-danger ms-1">*</span>
              <input
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                placeholder="Full name"
                className={`form-control form-control-sm cal-input${errors.contact_name ? " is-invalid" : ""}`}
              />
              {errors.contact_name && (
                <div className="invalid-feedback">{errors.contact_name}</div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label small fw-medium mb-1 cal-form-label">
                Email
              </label>
              <span class="text-danger ms-1">*</span>
              <input
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`form-control form-control-sm cal-input${errors.contact_email ? " is-invalid" : ""}`}
              />
              {errors.contact_email && (
                <div className="invalid-feedback">{errors.contact_email}</div>
              )}
            </div>
          </div>
          <div>
            <label className="form-label small fw-medium mb-1 cal-form-label">
              Phone <span className="fw-normal">(optional)</span>
            </label>
            <input
              name="contact_phone"
              value={form.contact_phone}
              onChange={handleChange}
              placeholder="(555) 000-0000"
              className="form-control form-control-sm cal-input"
            />
          </div>
        </div>
        {(role === "admin" || role === "superuser") && (
          <div className="mb-3 form-check px-4">
            <input
              type="checkbox"
              name="is_global"
              className="form-check-input"
              id="isGlobalCheck"
              checked={form.is_global}
              onChange={handleChange}
            />
            <label
              className="form-check-label small fw-medium cal-form-label"
              htmlFor="isGlobalCheck"
              style={{ cursor: "pointer" }}
            >
              Make this a Global (Admin) Event
            </label>
            <div className="form-text mt-0 cal-subtitle" style={{ fontSize: '11px' }}>
              Global events are visible to all users.
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger py-2 small mb-0">
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 px-4 py-3 cal-section-border-top">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cal-btn cal-btn--cancel"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="cal-btn cal-btn--submit"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              />
              {editData ? "Updating…" : "Scheduling…"}
            </>
          ) : editData ? (
            "Update Event"
          ) : (
            "Schedule Event"
          )}
        </button>
      </div>
    </div>
  );
};
