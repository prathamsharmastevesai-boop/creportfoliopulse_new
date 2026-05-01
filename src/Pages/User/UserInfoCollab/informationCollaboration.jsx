import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FeedbackSubmit,
  fetchBuildings,
} from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const InformationCollaboration = () => {
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildingLoading, setBuildingLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const fieldsByCategory = {
    Comps: [
      { label: "Tenant", key: "tenant", type: "text", required: true },
      { label: "Address", key: "address", type: "text", required: true },
      { label: "Submarket", key: "submarket", type: "text", required: true },
      { label: "Industry", key: "industry", type: "text", required: true },
      { label: "Size (SF)", key: "size", type: "number", required: true },
      { label: "Floor", key: "floor", type: "text", required: true },
      {
        label: "Rent (PSF)",
        key: "rent",
        type: "number",
        required: true,
        step: "0.01",
      },
      {
        label: "Term (Yrs)",
        key: "term",
        type: "number",
        required: true,
        step: "0.1",
      },
      {
        label: "Free Rent (Mos)",
        key: "freeRent",
        type: "number",
        required: true,
      },
      { label: "Lease Type", key: "leaseType", type: "text", required: true },
      {
        label: "TI Value",
        key: "tiValue",
        type: "number",
        required: true,
        step: "0.01",
      },
      { label: "Broker Name", key: "broker", type: "text", required: true },
      { label: "Closed Date", key: "closedDate", type: "date", required: true },
    ],
    TenantMarket: [
      { label: "Tenant", key: "tenant", type: "text", required: true },
      { label: "Industry", key: "industry", type: "text", required: true },
      {
        label: "Current Building",
        key: "currentBuilding",
        type: "text",
        required: true,
      },
      { label: "Submarket", key: "submarket", type: "text", required: true },
      {
        label: "Tenant Requirement (SF)",
        key: "requirement",
        type: "number",
        required: true,
      },
      {
        label: "Tenant Representative",
        key: "broker",
        type: "text",
        required: true,
      },
      { label: "LXD", key: "lxd", type: "text", required: true },
      { label: "Status", key: "status", type: "text", required: true },
    ],
    contacts_hub: [
      { label: "Contact Name", key: "name", type: "text", required: true },
      { label: "Title", key: "title", type: "text", required: true },
      { label: "Email", key: "email", type: "email", required: true },
      { label: "Contact Number", key: "phone", type: "text", required: true },
    ],
    TenantInformation: [
      { label: "Tenant Name", key: "tenant", type: "text", required: true },
      { label: "Industry", key: "industry", type: "text", required: true },

      { label: "Lease Start", key: "start", type: "date", required: true },
      { label: "Lease End", key: "end", type: "date", required: true },
      {
        label: "Rent",
        key: "rent",
        type: "number",
        required: true,
        step: "0.01",
      },

      { label: "Floors Occupied", key: "floors", type: "text", required: true },
      { label: "Square Footage", key: "sf", type: "number", required: true },
      {
        label: "Lease Commencement",
        key: "leaseStart",
        type: "date",
        required: true,
      },
      {
        label: "Lease Expiration",
        key: "leaseEnd",
        type: "date",
        required: true,
      },
      {
        label: "Starting Rent",
        key: "startRent",
        type: "number",
        required: true,
        step: "0.01",
      },
      {
        label: "Escalated Rent",
        key: "currentRent",
        type: "number",
        required: true,
        step: "0.01",
      },
      {
        label: "Base Year Type",
        key: "baseYear",
        type: "text",
        required: true,
      },
      {
        label: "Security Deposit",
        key: "deposit",
        type: "number",
        required: true,
        step: "0.01",
      },
      { label: "Guaranty Type", key: "guaranty", type: "text", required: true },
      { label: "Tenant Broker", key: "broker", type: "text", required: true },
      {
        label: "Renewal Options",
        key: "renewal",
        type: "text",
        required: true,
      },
      {
        label: "Termination Options",
        key: "termination",
        type: "text",
        required: true,
      },
    ],
  };

  const handleCategoryChange = async (e) => {
    const value = e.target.value;
    setCategory(value);
    setFormData({});
    setErrors({});
    setSelectedBuilding("");
    setBuildings([]);

    if (!value) return;

    try {
      setBuildingLoading(true);
      const result = await dispatch(fetchBuildings(value)).unwrap();
      setBuildings(result?.data || result || []);
    } catch {
      setBuildings([]);
    } finally {
      setBuildingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (value && ["tenant", "address"].includes(field.key)) {
      if (value.trim().length < 3) {
        return `${field.label} must be at least 3 characters`;
      }
      if (value.trim().length > 100) {
        return `${field.label} must not exceed 100 characters`;
      }
    }

    if (value && field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    }

    if (value && field.type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Must be a valid number";
    }

    return "";
  };
  const validateForm = () => {
    const fields = fieldsByCategory[category];
    if (!fields) return true;

    const newErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.key]);
      if (error) newErrors[field.key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill correct details in the form");
      return;
    }

    const payload = {
      category,
      subcategory: null,
      form_data: formData,
    };
    if (selectedBuilding) payload.building_id = Number(selectedBuilding);

    try {
      setLoading(true);
      const resultAction = await dispatch(FeedbackSubmit(payload));
      if (FeedbackSubmit.fulfilled.match(resultAction)) {
        setCategory("");
        setSelectedBuilding("");
        setBuildings([]);
        setFormData({});
        setErrors({});
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryFields = () => {
    const fields = fieldsByCategory[category];
    if (!fields) return null;

    return (
      <div className="row g-3">
        {fields.map((field) => (
          <div key={field.key} className="col-md-6">
            <Form.Label className="fw-bold">
              {field.label}{" "}
              {field.required && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type={field.type === "number" ? "number" : field.type || "text"}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={handleInputChange}
              className={`border-primary ${errors[field.key] ? "is-invalid" : ""}`}
              step={field.step}
              min={field.type === "number" ? 0 : undefined}
            />
            {errors[field.key] && (
              <div className="invalid-feedback">{errors[field.key]}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid d-flex align-items-center">
      <div className="p-4 mt-2 shadow-sm rounded border position-relative w-100">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Select Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              className="border-primary"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">-- Select category --</option>
              <option value="Comps">Comps</option>
              <option value="TenantMarket">Tenants in The Market</option>
              {/* <option value="contacts_hub">Contact Hub</option> */}
              {/* <option value="TenantInformation">Tenant Info</option> */}
            </Form.Select>
          </Form.Group>

          {buildingLoading && (
            <div className="text-center mb-3">Loading buildings...</div>
          )}
          {!buildingLoading && buildings.length > 0 && (
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Select Building</Form.Label>
              <Form.Select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
              >
                <option value="">-- Select building (optional) --</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {category && renderCategoryFields()}

          {category && (
            <div className="text-center mt-4 pt-3">
              <Button
                type="submit"
                className="px-5 py-2 fw-semibold"
                style={{
                  borderRadius: "25px",
                  background: "#0dcaf0",
                  border: "none",
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};
