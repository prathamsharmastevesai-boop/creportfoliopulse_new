import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RenewalTrackerSubmit } from "../../../Networking/Admin/APIs/RenewalTrackeApi";
import { BackButton } from "../../../Component/backButton";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";

export const RenewalTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const Role = role;

  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState({
    tenant_name: "",
    building_address: "",
    floor_suite: "",
    lease_commencement_date: "",
    lease_expiration_date: "",
    tenant_headcount: "",
    notice_of_renewal_date: "",
    renewal_clause: false,
    tenant_current_rent: "",
    most_recent_building_comp: "",
    tenant_contact_info: "",
    tenant_broker_contact_info: "",
    notes: "",
    q1: {
      check_in: false,
      headcount_confirmation: false,
      building_update_note_sent: false,
      holiday_gift: false,
    },
    q2: {
      check_in: false,
      headcount_confirmation: false,
      building_update_note_sent: false,
      holiday_gift: false,
    },
    q3: {
      check_in: false,
      headcount_confirmation: false,
      building_update_note_sent: false,
      holiday_gift: false,
    },
    q4: {
      check_in: false,
      headcount_confirmation: false,
      building_update_note_sent: false,
      holiday_gift: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const quarters = ["q1", "q2", "q3", "q4"];

  const resetForm = () => {
    setForm({
      tenant_name: "",
      building_address: "",
      floor_suite: "",
      lease_commencement_date: "",
      lease_expiration_date: "",
      tenant_headcount: "",
      notice_of_renewal_date: "",
      renewal_clause: false,
      tenant_current_rent: "",
      most_recent_building_comp: "",
      tenant_contact_info: "",
      tenant_broker_contact_info: "",
      notes: "",
      q1: {
        check_in: false,
        headcount_confirmation: false,
        building_update_note_sent: false,
        holiday_gift: false,
      },
      q2: {
        check_in: false,
        headcount_confirmation: false,
        building_update_note_sent: false,
        holiday_gift: false,
      },
      q3: {
        check_in: false,
        headcount_confirmation: false,
        building_update_note_sent: false,
        holiday_gift: false,
      },
      q4: {
        check_in: false,
        headcount_confirmation: false,
        building_update_note_sent: false,
        holiday_gift: false,
      },
    });
    setErrors({});
  };

  const handleQuarterToggle = (quarter, field) => {
    setForm((prev) => ({
      ...prev,
      [quarter]: {
        ...prev[quarter],
        [field]: !prev[quarter][field],
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!form.tenant_name?.trim()) {
      newErrors.tenant_name = "Tenant name is required";
    } else if (form.tenant_name.trim().length < 2) {
      newErrors.tenant_name = "Tenant name must be at least 2 characters";
    } else if (form.tenant_name.trim().length > 100) {
      newErrors.tenant_name = "Tenant name must be less than 100 characters";
    }

    if (!form.building_address?.trim()) {
      newErrors.building_address = "Building address is required";
    } else if (form.building_address.trim().length < 5) {
      newErrors.building_address = "Please enter a valid building address";
    }

    if (!form.floor_suite?.trim()) {
      newErrors.floor_suite = "Floor/Suite is required";
    }

    if (form.lease_commencement_date) {
      if (form.lease_commencement_date < today) {
        newErrors.lease_commencement_date =
          "Commencement date cannot be in the past";
      }
    }

    if (form.lease_expiration_date) {
      if (form.lease_expiration_date < today) {
        newErrors.lease_expiration_date =
          "Expiration date cannot be in the past";
      }
    }

    if (form.lease_commencement_date && form.lease_expiration_date) {
      const start = new Date(form.lease_commencement_date);
      const end = new Date(form.lease_expiration_date);
      if (start >= end) {
        newErrors.lease_expiration_date =
          "Expiration date must be after commencement date";
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 18250) {
        newErrors.lease_expiration_date =
          "Lease duration cannot exceed 50 years";
      }
    }

    if (form.notice_of_renewal_date) {
      if (form.notice_of_renewal_date < today) {
        newErrors.notice_of_renewal_date =
          "Notice of renewal date cannot be in the past";
      }

      if (
        form.lease_expiration_date &&
        form.notice_of_renewal_date >= form.lease_expiration_date
      ) {
        newErrors.notice_of_renewal_date =
          "Notice of renewal date should be before lease expiration";
      }
    }

    if (form.tenant_headcount) {
      if (
        isNaN(form.tenant_headcount) ||
        !Number.isInteger(Number(form.tenant_headcount))
      ) {
        newErrors.tenant_headcount = "Headcount must be a whole number";
      } else if (Number(form.tenant_headcount) < 0) {
        newErrors.tenant_headcount = "Headcount cannot be negative";
      } else if (Number(form.tenant_headcount) > 10000) {
        newErrors.tenant_headcount = "Headcount seems too high. Please verify";
      }
    }

    if (form.tenant_current_rent && form.tenant_current_rent.trim()) {
      const rentValue = form.tenant_current_rent.replace(/[^0-9.-]/g, "");
      if (rentValue && (isNaN(rentValue) || Number(rentValue) < 0)) {
        newErrors.tenant_current_rent = "Please enter a valid rent amount";
      }
    }

    if (
      form.tenant_contact_info &&
      form.tenant_contact_info.trim().length > 500
    ) {
      newErrors.tenant_contact_info =
        "Contact information must be less than 500 characters";
    }

    if (
      form.tenant_broker_contact_info &&
      form.tenant_broker_contact_info.trim().length > 500
    ) {
      newErrors.tenant_broker_contact_info =
        "Broker contact information must be less than 500 characters";
    }

    if (form.notes && form.notes.trim().length > 1000) {
      newErrors.notes = "Notes must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    const formatDate = (dateStr) => (dateStr ? `${dateStr}T00:00:00` : null);

    const payload = {
      tenant_name: form.tenant_name.trim(),
      building_address: form.building_address.trim(),
      floor_suite: form.floor_suite.trim(),
      lease_commencement_date: formatDate(form.lease_commencement_date),
      lease_expiration_date: formatDate(form.lease_expiration_date),
      tenant_headcount: form.tenant_headcount
        ? parseInt(form.tenant_headcount)
        : 0,
      notice_of_renewal_date: formatDate(form.notice_of_renewal_date),
      renewal_clause: form.renewal_clause,
      tenant_current_rent: form.tenant_current_rent?.trim() || null,
      most_recent_building_comp: form.most_recent_building_comp?.trim() || null,
      tenant_contact_info: form.tenant_contact_info?.trim() || null,
      tenant_broker_contact_info:
        form.tenant_broker_contact_info?.trim() || null,
      notes: form.notes?.trim() || null,
      q1: form.q1,
      q2: form.q2,
      q3: form.q3,
      q4: form.q4,
    };

    try {
      await dispatch(RenewalTrackerSubmit(payload)).unwrap();

      resetForm();

      Role === "admin"
        ? navigate("/admin-renewal-tracker-list")
        : navigate("/user-renewal-tracker-list");
    } catch (error) {
      console.error("Error creating renewal tracker:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderQuarterSection = (quarter, quarterName) => (
    <Card
      key={quarter}
      className="mb-4"
      variant="elevated"
      title={quarterName}
      bodyClass="p-3"
      style={{ backgroundColor: "#e9eef6" }}
    >
      <Row>
        <Col md={6} className="mb-2">
          <Form.Check
            type="switch"
            label="Check In"
            checked={form[quarter]?.check_in || false}
            onChange={() => handleQuarterToggle(quarter, "check_in")}
            id={`${quarter}-checkin`}
            className="fw-medium"
          />
        </Col>

        <Col md={6} className="mb-2">
          <Form.Check
            type="switch"
            label="Headcount Confirmation"
            checked={form[quarter]?.headcount_confirmation || false}
            onChange={() =>
              handleQuarterToggle(quarter, "headcount_confirmation")
            }
            id={`${quarter}-headcount`}
            className="fw-medium"
          />
        </Col>

        <Col md={6} className="mb-2">
          <Form.Check
            type="switch"
            label="Building Update Note Sent"
            checked={form[quarter]?.building_update_note_sent || false}
            onChange={() =>
              handleQuarterToggle(quarter, "building_update_note_sent")
            }
            id={`${quarter}-note-sent`}
            className="fw-medium"
          />
        </Col>

        <Col md={6} className="mb-2">
          <Form.Check
            type="switch"
            label="Holiday Gift"
            checked={form[quarter]?.holiday_gift || false}
            onChange={() => handleQuarterToggle(quarter, "holiday_gift")}
            id={`${quarter}-holiday-gift`}
            className="fw-medium"
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="container-fluid p-4">
      <PageHeader
        backButton={<BackButton />}
        title="New Renewal Tracker"
        subtitle="Input essential tenant, lease, and renewal details"
        actions={
          <Button
            variant="outline-secondary"
            size="sm"
            className="px-4"
            onClick={() => {
              Role === "admin"
                ? navigate("/admin-renewal-tracker-list")
                : navigate("/user-renewal-tracker-list");
            }}
          >
            Move to List
          </Button>
        }
      />

      <Card className="mb-4 shadow-sm" bodyClass="p-4" variant="elevated">
        <h5 className="fw-bold pb-2 border-bottom my-3">Basic Information</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label className="fw-semibold">
              Tenant Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="tenant_name"
              value={form.tenant_name}
              onChange={handleChange}
              isInvalid={!!errors.tenant_name}
              className="py-2"
              placeholder="Enter tenant name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_name}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Building Address <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="building_address"
              value={form.building_address}
              onChange={handleChange}
              isInvalid={!!errors.building_address}
              className="py-2"
              placeholder="Enter building address"
            />
            <Form.Control.Feedback type="invalid">
              {errors.building_address}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Floor/Suite <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="floor_suite"
              value={form.floor_suite}
              onChange={handleChange}
              isInvalid={!!errors.floor_suite}
              className="py-2"
              placeholder="Enter floor and/or suite number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.floor_suite}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Lease Commencement Date
            </Form.Label>
            <Form.Control
              type="date"
              name="lease_commencement_date"
              value={form.lease_commencement_date}
              onChange={handleChange}
              isInvalid={!!errors.lease_commencement_date}
              className="py-2"
              min={localDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lease_commencement_date}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Lease Expiration Date
            </Form.Label>
            <Form.Control
              type="date"
              name="lease_expiration_date"
              value={form.lease_expiration_date}
              onChange={handleChange}
              isInvalid={!!errors.lease_expiration_date}
              className="py-2"
              min={form.lease_commencement_date || localDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lease_expiration_date}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Notice of Renewal Date
            </Form.Label>
            <Form.Control
              type="date"
              name="notice_of_renewal_date"
              value={form.notice_of_renewal_date}
              onChange={handleChange}
              isInvalid={!!errors.notice_of_renewal_date}
              className="py-2"
              min={localDate}
              max={form.lease_expiration_date || undefined}
            />
            <Form.Control.Feedback type="invalid">
              {errors.notice_of_renewal_date}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">Tenant Headcount</Form.Label>
            <Form.Control
              type="number"
              name="tenant_headcount"
              value={form.tenant_headcount}
              onChange={handleChange}
              isInvalid={!!errors.tenant_headcount}
              className="py-2"
              placeholder="Number of employees"
              min="0"
              step="1"
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_headcount}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <h5 className="fw-bold pb-2 border-bottom my-3">
          Renewal & Financial Information
        </h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Renewal Clause"
              name="renewal_clause"
              checked={form.renewal_clause}
              onChange={handleChange}
              id="renewal-clause"
              className="fw-semibold mt-2"
            />
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">Tenant Current Rent</Form.Label>
            <Form.Control
              type="text"
              name="tenant_current_rent"
              value={form.tenant_current_rent}
              onChange={handleChange}
              isInvalid={!!errors.tenant_current_rent}
              className="py-2"
              placeholder="e.g., $5,000/month"
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_current_rent}
            </Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold">
              Most Recent Building Comp
            </Form.Label>
            <Form.Control
              type="text"
              name="most_recent_building_comp"
              value={form.most_recent_building_comp}
              onChange={handleChange}
              className="py-2"
              placeholder="Recent building comparable information"
            />
          </Col>

          <Col md={12}>
            <Form.Label className="fw-semibold">
              Tenant Contact Information
            </Form.Label>
            <Form.Control
              as="textarea"
              name="tenant_contact_info"
              value={form.tenant_contact_info}
              onChange={handleChange}
              isInvalid={!!errors.tenant_contact_info}
              className="py-2"
              rows="3"
              placeholder="Name, Phone, Email, etc."
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_contact_info}
            </Form.Control.Feedback>
          </Col>

          <Col md={12}>
            <Form.Label className="fw-semibold">
              Tenant Broker Contact Information
            </Form.Label>
            <Form.Control
              as="textarea"
              name="tenant_broker_contact_info"
              value={form.tenant_broker_contact_info}
              onChange={handleChange}
              isInvalid={!!errors.tenant_broker_contact_info}
              className="py-2"
              rows="3"
              placeholder="Broker name, Phone, Email, Company, etc."
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_broker_contact_info}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <h5 className="fw-bold pb-2 border-bottom my-3">Notes</h5>
        <Row>
          <Col md={12}>
            <Form.Control
              as="textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              isInvalid={!!errors.notes}
              className="py-2"
              rows="4"
              placeholder="Enter any additional notes related to this tenant or renewal..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.notes}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <h5 className="fw-bold pb-2 border-bottom my-3">
          Quarterly Status Updates
        </h5>
        {quarters.map((quarter, index) =>
          renderQuarterSection(quarter, `Quarter ${index + 1}`),
        )}

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3">
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="px-5 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
