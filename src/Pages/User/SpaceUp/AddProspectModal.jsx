import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export const AddProspectModal = ({ show, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    broker_name: "",
    broker_contact: "",
    tenant_names: [""],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setForm({
        broker_name: "",
        broker_contact: "",
        tenant_names: [""],
      });
      setErrors({});
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTenantChange = (index, value) => {
    const updated = [...form.tenant_names];
    updated[index] = value;
    setForm((prev) => ({ ...prev, tenant_names: updated }));

    if (errors[`tenant_names_${index}`]) {
      setErrors((prev) => ({ ...prev, [`tenant_names_${index}`]: "" }));
    }
  };

  const addTenant = () => {
    setForm((prev) => ({ ...prev, tenant_names: [...prev.tenant_names, ""] }));
  };

  const removeTenant = (index) => {
    const updated = form.tenant_names.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, tenant_names: updated }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`tenant_names_${index}`];
      return newErrors;
    });
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

    form.tenant_names.forEach((name, index) => {
      if (!name.trim()) {
        newErrors[`tenant_names_${index}`] = "Tenant name is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      broker_name: form.broker_name.trim(),
      broker_contact: form.broker_contact.trim(),
      tenant_name: form.tenant_names
        .map((t) => t.trim())
        .filter(Boolean)
        .join(", "),
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
                if (/^\+?[0-9]*$/.test(value)) handleChange(e);
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
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0">Tenant Name(s)</Form.Label>
              <Button
                className="activity-log bg-secondary border-0"
                size="sm"
                onClick={addTenant}
                disabled={loading}
              >
                + Add Tenant
              </Button>
            </div>

            {form.tenant_names.map((tenant, index) => (
              <div key={index} className="d-flex gap-2 mb-2">
                <div className="flex-grow-1">
                  <Form.Control
                    value={tenant}
                    onChange={(e) => handleTenantChange(index, e.target.value)}
                    isInvalid={!!errors[`tenant_names_${index}`]}
                    disabled={loading}
                    placeholder={`Tenant ${index + 1}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[`tenant_names_${index}`]}
                  </Form.Control.Feedback>
                </div>

                {form.tenant_names.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeTenant(index)}
                    disabled={loading}
                    style={{ height: "38px" }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
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
