import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Spinner, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  fetchBuildings,
  UpdateFeedback,
} from "../../../Networking/User/APIs/Feedback/feedbackApi";

export const EditInformationCollaboration = ({ data, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildingLoading, setBuildingLoading] = useState(false);

  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);

  const isNumberField = (key) => /phone|mobile|number|contact/i.test(key);
  const isEmailField = (key) => /email|mail/i.test(key);

  useEffect(() => {
    if (!data) return;

    setCategory(data.category || "");
    setSelectedBuilding(data.building_id ? String(data.building_id) : "");

    if (data.form_data) {
      const arr = Object.entries(data.form_data).map(([k, v]) => ({
        key: k,
        value: v,
      }));
      setFields(arr.length ? arr : [{ key: "", value: "" }]);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.building_id) return;
    if (!buildings.length) return;

    setSelectedBuilding(String(data.building_id));
  }, [buildings]);

  useEffect(() => {
    if (!category) return;

    const loadBuildings = async () => {
      try {
        setBuildingLoading(true);
        const res = await dispatch(fetchBuildings(category)).unwrap();
        setBuildings(res?.data || res || []);
      } catch (err) {
        console.log(err);
        setBuildings([]);
      } finally {
        setBuildingLoading(false);
      }
    };

    loadBuildings();
  }, [category, dispatch]);

  const handleFieldChange = (index, name, value) => {
    const updated = [...fields];
    const currentKey = updated[index].key;

    if (name === "value") {
      if (isNumberField(currentKey)) {
        value = value.replace(/[^0-9]/g, "");
      }

      if (isEmailField(currentKey)) {
        value = value.toLowerCase();
      }
    }

    updated[index][name] = value;
    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const validateFields = () => {
    for (let field of fields) {
      const key = field.key?.trim();
      const value = field.value;

      if (!key) continue;

      if (isEmailField(key)) {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!valid) {
          return `${key} must be a valid email`;
        }
      }

      if (isNumberField(key)) {
        if (!/^\d+$/.test(value)) {
          return `${key} must contain only numbers`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) return toast.error("Select category");
    if (!selectedBuilding && buildings.length > 0)
      return toast.error("Select building");

    const validationError = validateFields();
    if (validationError) return toast.error(validationError);

    const obj = {};
    fields.forEach((f) => {
      if (f.key?.trim()) obj[f.key.trim()] = f.value ?? "";
    });

    try {
      setLoading(true);

      await dispatch(
        UpdateFeedback({
          id: data.id,
          category,
          ...(selectedBuilding && { building_id: selectedBuilding }),
          form_data: obj,
        }),
      ).unwrap();

      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          className="disabled-input"
          value={
            {
              TenantMarket: "Tenant Market",
              Comps: "Comps",
              TenantInformation: "Tenant Info",
              ThirdParty: "Third Party",
              Colleague: "Employee",
              BuildingInfo: "Building Info",
              ComparativeBuilding: "Comparative Building",
              FireSafety: "Fire Safety",
              "Lease&Loi": "Lease & LOI",
              Gemini: "Gemini",
              portfolio: "Portfolio",
            }[category] || ""
          }
          disabled
        />
      </Form.Group>

      {buildingLoading && (
        <div className="text-center mb-3">
          <Spinner size="sm" />
        </div>
      )}

      {!buildingLoading && buildings.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Building</Form.Label>
          <Form.Select value={selectedBuilding} disabled>
            <option value="">Select building</option>
            {buildings.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      <Form.Label>Extra Details</Form.Label>

      {fields.map((field, index) => {
        const isNumber = isNumberField(field.key);
        const isEmail = isEmailField(field.key);
        const emailInvalid =
          isEmail &&
          field.value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);

        return (
          <div key={index} className="d-flex gap-2 mb-2 align-items-start">
            <Form.Control
              placeholder="Key"
              value={field.key}
              onChange={(e) => handleFieldChange(index, "key", e.target.value)}
            />

            <div style={{ width: "100%" }}>
              <Form.Control
                placeholder={
                  isNumber
                    ? "Only numbers allowed"
                    : isEmail
                      ? "Enter valid email"
                      : "Value"
                }
                value={field.value}
                type={isEmail ? "email" : "text"}
                isInvalid={emailInvalid}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
              />

              {emailInvalid && (
                <Form.Control.Feedback type="invalid">
                  Invalid email format
                </Form.Control.Feedback>
              )}
            </div>

            {fields.length > 1 && (
              <Button variant="danger" onClick={() => removeField(index)}>
                −
              </Button>
            )}
          </div>
        );
      })}

      <Button size="sm" variant="secondary" onClick={addField}>
        + Add Field
      </Button>

      <div className="text-center mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Update"}
        </Button>
      </div>
    </Form>
  );
};
