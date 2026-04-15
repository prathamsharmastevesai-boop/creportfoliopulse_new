import React, { useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { distilledExpenseTracker } from "../../../Networking/Admin/APIs/distilledExpenseTrackerApi";
import { useDispatch } from "react-redux";

import Card from "../../../Component/Card/Card";

const SUBMARKET_OPTIONS = [
  "Midtown",
  "Plaza District",
  "Midtown South",
  "Flatiron",
  "Downtown",
  "Financial District",
  "Northern New Jersey",
  "Westchester, Miami",
  "Palm Beach County",
  "Central New Jersey",
  "New Jersey Waterfront",
  "Brooklyn",
  "Downtown Brooklyn",
];
const SF_BAND_OPTIONS = [
  "50,000 SF",
  "100,000 SF",
  "250,000 SF",
  "500,000 SF",
  "1000,000 SF+",
];
const CLASS_OPTIONS = ["A", "B", "C", "D"];

export const DistilledExpenseTracker = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    building_sf_band: "",
    submarket_geo: "",
    building_class: "",

    realestate_taxes_psf: "",
    property_insurance_psf: "",
    electric_psf: "",
    gas_psf: "",
    water_psf: "",
    janitorial_cleaning_psf: "",
    property_mgmt_fees_psf: "",
    lobby_security_psf: "",
    security_monitoring_psf: "",
    accounting_psf: "",
    legal_psf: "",
    commissions_psf: "",
    interest_rates_psf: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number" && Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.building_sf_band) {
      newErrors.building_sf_band = "Building SF band is required";
    }

    if (!formData.submarket_geo) {
      newErrors.submarket_geo = "Submarket is required";
    }

    if (!formData.building_class) {
      newErrors.building_class = "Building class is required";
    }

    if (
      formData.realestate_taxes_psf === "" ||
      formData.realestate_taxes_psf === null
    ) {
      newErrors.realestate_taxes_psf = "Real Estate Taxes is required";
    } else if (Number(formData.realestate_taxes_psf) < 0) {
      newErrors.realestate_taxes_psf = "Real Estate Taxes cannot be negative";
    }

    if (
      formData.property_insurance_psf === "" ||
      formData.property_insurance_psf === null
    ) {
      newErrors.property_insurance_psf = "Property Insurance is required";
    } else if (Number(formData.property_insurance_psf) < 0) {
      newErrors.property_insurance_psf =
        "Property Insurance cannot be negative";
    }

    if (formData.electric_psf === "" || formData.electric_psf === null) {
      newErrors.electric_psf = "Electric is required";
    } else if (Number(formData.electric_psf) < 0) {
      newErrors.electric_psf = "Electric cannot be negative";
    }

    if (formData.gas_psf === "" || formData.gas_psf === null) {
      newErrors.gas_psf = "Gas is required";
    } else if (Number(formData.gas_psf) < 0) {
      newErrors.gas_psf = "Gas cannot be negative";
    }

    if (formData.water_psf === "" || formData.water_psf === null) {
      newErrors.water_psf = "Water is required";
    } else if (Number(formData.water_psf) < 0) {
      newErrors.water_psf = "Water cannot be negative";
    }

    if (
      formData.janitorial_cleaning_psf === "" ||
      formData.janitorial_cleaning_psf === null
    ) {
      newErrors.janitorial_cleaning_psf = "Janitorial Cleaning is required";
    } else if (Number(formData.janitorial_cleaning_psf) < 0) {
      newErrors.janitorial_cleaning_psf =
        "Janitorial Cleaning cannot be negative";
    }

    if (
      formData.property_mgmt_fees_psf === "" ||
      formData.property_mgmt_fees_psf === null
    ) {
      newErrors.property_mgmt_fees_psf = "Property Mgmt Fees is required";
    } else if (Number(formData.property_mgmt_fees_psf) < 0) {
      newErrors.property_mgmt_fees_psf =
        "Property Mgmt Fees cannot be negative";
    }

    if (
      formData.lobby_security_psf === "" ||
      formData.lobby_security_psf === null
    ) {
      newErrors.lobby_security_psf = "Lobby Security is required";
    } else if (Number(formData.lobby_security_psf) < 0) {
      newErrors.lobby_security_psf = "Lobby Security cannot be negative";
    }

    if (
      formData.security_monitoring_psf === "" ||
      formData.security_monitoring_psf === null
    ) {
      newErrors.security_monitoring_psf = "Security Monitoring is required";
    } else if (Number(formData.security_monitoring_psf) < 0) {
      newErrors.security_monitoring_psf =
        "Security Monitoring cannot be negative";
    }

    if (formData.accounting_psf === "" || formData.accounting_psf === null) {
      newErrors.accounting_psf = "Accounting is required";
    } else if (Number(formData.accounting_psf) < 0) {
      newErrors.accounting_psf = "Accounting cannot be negative";
    }

    if (formData.legal_psf === "" || formData.legal_psf === null) {
      newErrors.legal_psf = "Legal is required";
    } else if (Number(formData.legal_psf) < 0) {
      newErrors.legal_psf = "Legal cannot be negative";
    }

    if (formData.commissions_psf === "" || formData.commissions_psf === null) {
      newErrors.commissions_psf = "Commissions is required";
    } else if (Number(formData.commissions_psf) < 0) {
      newErrors.commissions_psf = "Commissions cannot be negative";
    }

    if (
      formData.interest_rates_psf === "" ||
      formData.interest_rates_psf === null
    ) {
      newErrors.interest_rates_psf = "Interest Rates is required";
    } else if (Number(formData.interest_rates_psf) < 0) {
      newErrors.interest_rates_psf = "Interest Rates cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      building_sf_band: "",
      submarket_geo: "",
      building_class: "",
      realestate_taxes_psf: "",
      property_insurance_psf: "",
      electric_psf: "",
      gas_psf: "",
      water_psf: "",
      janitorial_cleaning_psf: "",
      property_mgmt_fees_psf: "",
      lobby_security_psf: "",
      security_monitoring_psf: "",
      accounting_psf: "",
      legal_psf: "",
      commissions_psf: "",
      interest_rates_psf: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setLoading(true);

    const payload = {
      building_sf_band: formData.building_sf_band,
      submarket_geo: formData.submarket_geo,
      building_class: formData.building_class,
      realestate_taxes_psf: Number(formData.realestate_taxes_psf),
      property_insurance_psf: Number(formData.property_insurance_psf),
      electric_psf: Number(formData.electric_psf),
      gas_psf: Number(formData.gas_psf),
      water_psf: Number(formData.water_psf),
      janitorial_cleaning_psf: Number(formData.janitorial_cleaning_psf),
      property_mgmt_fees_psf: Number(formData.property_mgmt_fees_psf),
      lobby_security_psf: Number(formData.lobby_security_psf),
      security_monitoring_psf: Number(formData.security_monitoring_psf),
      accounting_psf: Number(formData.accounting_psf),
      legal_psf: Number(formData.legal_psf),
      commissions_psf: Number(formData.commissions_psf),
      interest_rates_psf: Number(formData.interest_rates_psf),
    };

    try {
      const resultAction = await dispatch(
        distilledExpenseTracker(payload),
      ).unwrap();

      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3 pt-0">
      <form onSubmit={handleSubmit}>
        <Card
          variant="elevated"
          className="mb-4 shadow-sm"
          title="Building Metadata"
          headerClass="bg-primary text-white text-center text-md-start"
        >
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">
                Building SF <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.building_sf_band ? "is-invalid" : ""}`}
                name="building_sf_band"
                value={formData.building_sf_band}
                onChange={handleChange}
              >
                <option value="">Select Building SF</option>
                {SF_BAND_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.building_sf_band && (
                <div className="text-danger small mt-1">
                  {errors.building_sf_band}
                </div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">
                Submarket <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.submarket_geo ? "is-invalid" : ""}`}
                name="submarket_geo"
                value={formData.submarket_geo}
                onChange={handleChange}
              >
                <option value="">Select Submarket</option>
                {SUBMARKET_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.submarket_geo && (
                <div className="text-danger small mt-1">
                  {errors.submarket_geo}
                </div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">
                Building Class <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.building_class ? "is-invalid" : ""}`}
                name="building_class"
                value={formData.building_class}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.building_class && (
                <div className="text-danger small mt-1">
                  {errors.building_class}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card
          variant="elevated"
          className="mb-4 shadow-sm"
          title="Expense Data ($/SF)"
          headerClass="bg-success text-white text-center text-md-start"
        >
          <div className="row g-3">
            {[
              { label: "Real Estate Taxes", key: "realestate_taxes_psf" },
              { label: "Property Insurance", key: "property_insurance_psf" },
              { label: "Electric", key: "electric_psf" },
              { label: "Gas", key: "gas_psf" },
              { label: "Water", key: "water_psf" },
              { label: "Janitorial Cleaning", key: "janitorial_cleaning_psf" },
              { label: "Property Mgmt Fees", key: "property_mgmt_fees_psf" },
              { label: "Lobby Security", key: "lobby_security_psf" },
              { label: "Security Monitoring", key: "security_monitoring_psf" },
              { label: "Accounting", key: "accounting_psf" },
              { label: "Legal", key: "legal_psf" },
              { label: "Commissions", key: "commissions_psf" },
              { label: "Interest Rates", key: "interest_rates_psf" },
            ].map((item) => (
              <div className="col-12 col-sm-6 col-lg-4" key={item.key}>
                <label className="form-label">
                  {item.label} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors[item.key] ? "is-invalid" : ""}`}
                  name={item.key}
                  value={formData[item.key]}
                  onChange={handleChange}
                  min="0"
                />
                {errors[item.key] && (
                  <div className="text-danger small mt-1">
                    {errors[item.key]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-success btn-md px-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              "Submit Expense"
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .text-danger {
          color: #e74c3c !important;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
