import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export const AddProspectModal = ({ show, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    broker_name: "",
    broker_contact: "",
    tenant_name: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setForm({
        broker_name: "",
        broker_contact: "",
        tenant_name: "",
      });
      setErrors({});
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!form.broker_name.trim()) {
      newErrors.broker_name = "Broker name is required.";
    }

    if (!form.broker_contact.trim()) {
      newErrors.broker_contact = "Broker contact is required.";
    } else if (!phoneRegex.test(form.broker_contact.trim())) {
      newErrors.broker_contact =
        "Enter valid phone number (10–15 digits, optional +).";
    }

    if (!form.tenant_name.trim()) {
      newErrors.tenant_name = "Tenant name is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      broker_name: form.broker_name.trim(),
      broker_contact: form.broker_contact.trim(),
      tenant_name: form.tenant_name.trim(),
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Prospect</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Broker Name</Form.Label>
            <Form.Control
              name="broker_name"
              value={form.broker_name}
              onChange={handleChange}
              isInvalid={!!errors.broker_name}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.broker_name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Broker Contact</Form.Label>
            <Form.Control
              name="broker_contact"
              value={form.broker_contact}
              onChange={(e) => {
                const value = e.target.value;

                if (/^\+?[0-9]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              isInvalid={!!errors.broker_contact}
              disabled={loading}
              placeholder="e.g. +1234567890"
            />
            <Form.Control.Feedback type="invalid">
              {errors.broker_contact}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Tenant Name</Form.Label>
            <Form.Control
              name="tenant_name"
              value={form.tenant_name}
              onChange={handleChange}
              isInvalid={!!errors.tenant_name}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tenant_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="dark" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
