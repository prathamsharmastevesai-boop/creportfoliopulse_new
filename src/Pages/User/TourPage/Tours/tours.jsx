import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toursCreateSubmit } from "../../../../Networking/User/APIs/Tours/toursApi";

export const Tours = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    date: "",
    building: "",
    floor_suite: "",
    tenant: "",
    broker: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    const maxDateString = maxDate.toISOString().split("T")[0];

    if (!formData.date) {
      newErrors.date = "Tour date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const currentDate = new Date(today);

      if (selectedDate < currentDate) {
        newErrors.date = "Tour date cannot be in the past";
      }

      if (selectedDate > new Date(maxDateString)) {
        newErrors.date = "Tour date cannot be more than 2 years in the future";
      }

      const dayOfWeek = selectedDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.date = "Tours are typically scheduled on weekdays only";
      }
    }

    if (!formData.building?.trim()) {
      newErrors.building = "Building name is required";
    } else if (formData.building.trim().length < 2) {
      newErrors.building = "Building name must be at least 2 characters";
    } else if (formData.building.trim().length > 200) {
      newErrors.building = "Building name must be less than 200 characters";
    }

    if (formData.floor_suite?.trim()) {
      if (formData.floor_suite.trim().length > 100) {
        newErrors.floor_suite = "Floor/Suite must be less than 100 characters";
      }
    }

    if (formData.tenant?.trim()) {
      if (formData.tenant.trim().length < 2) {
        newErrors.tenant =
          "Tenant name must be at least 2 characters if provided";
      } else if (formData.tenant.trim().length > 100) {
        newErrors.tenant = "Tenant name must be less than 100 characters";
      }
    }

    if (formData.broker?.trim()) {
      if (formData.broker.trim().length < 2) {
        newErrors.broker =
          "Broker name must be at least 2 characters if provided";
      } else if (formData.broker.trim().length > 100) {
        newErrors.broker = "Broker name must be less than 100 characters";
      }
    }

    if (formData.notes?.trim()) {
      if (formData.notes.trim().length > 1000) {
        newErrors.notes = "Notes must be less than 1000 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      date: "",
      building: "",
      floor_suite: "",
      tenant: "",
      broker: "",
      notes: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        date: formData.date,
        building: formData.building.trim(),
        floor_suite: formData.floor_suite?.trim() || null,
        tenant: formData.tenant?.trim() || null,
        broker: formData.broker?.trim() || null,
        notes: formData.notes?.trim() || null,
      };

      await dispatch(toursCreateSubmit(payload)).unwrap();

      resetForm();
    } catch (error) {
      console.error("Error creating tour:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 shadow-sm border-0">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
                className="py-2"

              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Building <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter building name"
                name="building"
                value={formData.building}
                onChange={handleChange}
                isInvalid={!!errors.building}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.building}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Floor / Suite</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 5th Floor, Suite 510"
                name="floor_suite"
                value={formData.floor_suite}
                onChange={handleChange}
                isInvalid={!!errors.floor_suite}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.floor_suite}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tenant</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tenant name"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                isInvalid={!!errors.tenant}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.tenant}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Broker</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter broker name"
                name="broker"
                value={formData.broker}
                onChange={handleChange}
                isInvalid={!!errors.broker}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.broker}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Additional notes about the tour (e.g., special requirements, parking instructions, etc.)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                isInvalid={!!errors.notes}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.notes}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Optional: Max 1000 characters
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2 mt-3">
          <Button
            type="submit"
            variant="success"
            disabled={loading}
            className="px-4 py-2 fw-semibold"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Tour"
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
