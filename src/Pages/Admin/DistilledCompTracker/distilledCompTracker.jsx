"use client";

import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { distilledCompTracker } from "../../../Networking/Admin/APIs/distilledCompTrackerApi";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";
import { toast } from "react-toastify";

export const DestilledCompTracker = () => {
  const dispatch = useDispatch();

  const [addressAnon, setAddressAnon] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [sfRounded, setSfRounded] = useState("");
  const [submarket, setSubmarket] = useState("");
  const [buildingClass, setBuildingClass] = useState("A");
  const [floorSegment, setFloorSegment] = useState("Base");
  const [tenantEntity, setTenantEntity] = useState("");
  const [dealType, setDealType] = useState("New Deal");
  const [guaranteeType, setGuaranteeType] = useState("Corporate");
  const [termMonths, setTermMonths] = useState("");
  const [lightAndViews, setLightAndViews] = useState("");
  const [rentSchedule, setRentSchedule] = useState([
    { rent: 0, start_y: 1, end_y: 1 },
  ]);
  const [escalationType, setEscalationType] = useState("Fixed");
  const [escalationValue, setEscalationValue] = useState("");
  const [freeRentMonths, setFreeRentMonths] = useState("");
  const [tiAllowanceRange, setTiAllowanceRange] = useState("");
  const [securityDepMonths, setSecurityDepMonths] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const LIGHT_AND_VIEWS_OPTIONS = [1, 2, 3, 4, 5];

  const TENANT_ENTITY_OPTIONS = [
    "Public Company",
    "LLP",
    "LLC",
    "Startup < 3yr",
    "SPE",
  ];

  const BUILDING_CLASS_OPTIONS = ["A", "B", "C"];

  const FLOOR_SEGMENT_OPTIONS = ["Base", "Middies", "Tower"];

  const DEAL_TYPE_OPTIONS = ["New Deal", "Renewal", "Renewal Expansion"];

  const GUARANTEE_TYPE_OPTIONS = ["Corporate", "Personal", "Good Guy", "None"];

  const ESCALATION_TYPE_OPTIONS = ["Fixed", "Percent"];

  const TI_ALLOWANCE_OPTIONS = [
    "$30-$50",
    "$60-$80",
    "$90-$120",
    "$140-$180",
    "$200+",
  ];

  const validateSfRounded = (value) => {
    if (value === "" || value === 0) return false;
    return Number(value) % 1000 === 0;
  };

  const addRentPeriod = () => {
    setRentSchedule([...rentSchedule, { rent: 0, start_y: 1, end_y: 1 }]);
  };

  const removeRentPeriod = (index) => {
    if (rentSchedule.length > 1) {
      setRentSchedule(rentSchedule.filter((_, i) => i !== index));
    }
  };

  const updateRentPeriod = (index, field, value) => {
    const updated = [...rentSchedule];
    updated[index][field] = value;
    setRentSchedule(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!addressAnon.trim()) {
      newErrors.address_anon = "Anonymous address is required";
    } else if (addressAnon.trim().length < 5) {
      newErrors.address_anon =
        "Anonymous address must be at least 5 characters";
    }

    if (!sfRounded || sfRounded === "") {
      newErrors.sf_rounded = "SF Rounded is required";
    } else if (Number(sfRounded) <= 0) {
      newErrors.sf_rounded = "SF Rounded must be greater than 0";
    } else if (!validateSfRounded(sfRounded)) {
      newErrors.sf_rounded = "SF Rounded must be a multiple of 1000";
    }

    if (!submarket.trim()) {
      newErrors.submarket = "Submarket is required";
    }

    if (!tenantEntity) {
      newErrors.tenant_entity = "Please select a tenant entity";
    }

    if (!termMonths || termMonths === "") {
      newErrors.term_months = "Term months is required";
    } else if (Number(termMonths) < 1) {
      newErrors.term_months = "Term months must be at least 1 month";
    }

    if (!escalationValue && escalationValue !== 0) {
      newErrors.escalation_value = "Escalation value is required";
    } else if (Number(escalationValue) <= 0) {
      newErrors.escalation_value = "Escalation value must be greater than 0";
    }

    if (
      lightAndViews &&
      !LIGHT_AND_VIEWS_OPTIONS.includes(Number(lightAndViews))
    ) {
      newErrors.light_and_views = "Light and Views must be between 1 and 5";
    }

    if (!rentSchedule.length) {
      newErrors.base_rent_schedule =
        "At least one base rent schedule entry is required";
    } else {
      rentSchedule.forEach((row, index) => {
        if (!row.rent || Number(row.rent) <= 0) {
          newErrors[`rent_${index}`] =
            `Rent PSF is required (Row ${index + 1})`;
        }
        if (!row.start_y || !row.end_y) {
          newErrors[`year_${index}`] = `Year range required (Row ${index + 1})`;
        }
        if (Number(row.start_y) > Number(row.end_y)) {
          newErrors[`year_logic_${index}`] =
            `Start year cannot exceed end year (Row ${index + 1})`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAddressAnon("");
    setBuildingAddress("");
    setSfRounded("");
    setSubmarket("");
    setBuildingClass("A");
    setFloorSegment("Base");
    setTenantEntity("");
    setDealType("New Deal");
    setGuaranteeType("Corporate");
    setTermMonths("");
    setLightAndViews("");
    setRentSchedule([{ rent: 0, start_y: 1, end_y: 1 }]);
    setEscalationType("Fixed");
    setEscalationValue("");
    setFreeRentMonths("");
    setTiAllowanceRange("");
    setSecurityDepMonths("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      address_anon: addressAnon.trim(),
      building_address: buildingAddress.trim() || null,
      sf_rounded: Number(sfRounded),
      submarket: submarket.trim(),
      building_class: buildingClass,
      floor_segment: floorSegment,
      tenant_entity: tenantEntity,
      deal_type: dealType || null,
      guarantee_type: guaranteeType,
      term_months: Number(termMonths),
      base_rent_schedule: rentSchedule.map(({ rent, start_y, end_y }) => ({
        rent: Number(rent),
        start_y: Number(start_y),
        end_y: Number(end_y),
      })),
      escalation_type: escalationType,
      escalation_value: Number(escalationValue),
      free_rent_months: Number(freeRentMonths) || 0,
      ti_allowance_psf: 0,
      ti_allowance_range: tiAllowanceRange || null,
      light_and_views: lightAndViews ? Number(lightAndViews) : null,
      security_dep_months: Number(securityDepMonths) || 0,
    };

    try {
      await dispatch(distilledCompTracker(payload)).unwrap();

      resetForm();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <PageHeader
        title="Distilled Comp Tracker (DCT) Submission"
        subtitle="Submit and manage office comp details for analysis"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card
          title="Building & Tenant Information"
          headerClass="bg-primary text-white text-center text-md-start"
          className="mb-4 border-0"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">
                Anonymous Address <span className="mu2-error">*</span>
              </label>
              <input
                type="text"
                value={addressAnon}
                onChange={(e) => {
                  setAddressAnon(e.target.value);
                  if (errors.address_anon)
                    setErrors({ ...errors, address_anon: "" });
                }}
                className={`form-control ${errors.address_anon ? "is-invalid" : ""}`}
                placeholder="e.g., Midtown Office Tower"
              />
              {errors.address_anon && (
                <div className="mu2-error small mt-1">
                  {errors.address_anon}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Building Address</label>
              <input
                type="text"
                value={buildingAddress}
                onChange={(e) => setBuildingAddress(e.target.value)}
                className="form-control"
                placeholder="e.g., 123 Main Street, New York"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                SF Rounded (multiple of 1000){" "}
                <span className="mu2-error">*</span>
              </label>
              <input
                type="number"
                value={sfRounded}
                onChange={(e) => {
                  setSfRounded(e.target.value ? Number(e.target.value) : "");
                  if (errors.sf_rounded)
                    setErrors({ ...errors, sf_rounded: "" });
                }}
                min="0"
                step="1000"
                className={`form-control ${errors.sf_rounded ? "is-invalid" : ""}`}
              />
              {errors.sf_rounded && (
                <div className="mu2-error small mt-1">{errors.sf_rounded}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Submarket <span className="mu2-error">*</span>
              </label>
              <input
                type="text"
                value={submarket}
                onChange={(e) => {
                  setSubmarket(e.target.value);
                  if (errors.submarket) setErrors({ ...errors, submarket: "" });
                }}
                className={`form-control ${errors.submarket ? "is-invalid" : ""}`}
              />
              {errors.submarket && (
                <div className="mu2-error small mt-1">{errors.submarket}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Building Class</label>
              <select
                value={buildingClass}
                onChange={(e) => setBuildingClass(e.target.value)}
                className="form-select"
              >
                {BUILDING_CLASS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Floor Segment</label>
              <select
                value={floorSegment}
                onChange={(e) => setFloorSegment(e.target.value)}
                className="form-select"
              >
                {FLOOR_SEGMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Tenant Entity <span className="mu2-error">*</span>
              </label>
              <select
                value={tenantEntity}
                onChange={(e) => {
                  setTenantEntity(e.target.value);
                  if (errors.tenant_entity)
                    setErrors({ ...errors, tenant_entity: "" });
                }}
                className={`form-select ${errors.tenant_entity ? "is-invalid" : ""}`}
              >
                <option value="">Select from list...</option>
                {TENANT_ENTITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.tenant_entity && (
                <div className="mu2-error small mt-1">
                  {errors.tenant_entity}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Light and Views</label>
              <select
                value={lightAndViews}
                onChange={(e) => {
                  setLightAndViews(e.target.value);
                  if (errors.light_and_views)
                    setErrors({ ...errors, light_and_views: "" });
                }}
                className={`form-select ${errors.light_and_views ? "is-invalid" : ""}`}
              >
                <option value="">Select Rating</option>
                {LIGHT_AND_VIEWS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.light_and_views && (
                <div className="mu2-error small mt-1">
                  {errors.light_and_views}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card
          title="Deal Details"
          headerClass="bg-success text-white text-center text-md-start"
          className="mb-4 border-0"
        >
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Deal Type</label>
              <select
                value={dealType}
                onChange={(e) => setDealType(e.target.value)}
                className="form-select"
              >
                {DEAL_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Guarantee Type</label>
              <select
                value={guaranteeType}
                onChange={(e) => setGuaranteeType(e.target.value)}
                className="form-select"
              >
                {GUARANTEE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Term (Months) <span className="mu2-error">*</span>
              </label>
              <input
                type="number"
                value={termMonths}
                onChange={(e) => {
                  setTermMonths(e.target.value ? Number(e.target.value) : "");
                  if (errors.term_months)
                    setErrors({ ...errors, term_months: "" });
                }}
                min="1"
                className={`form-control ${errors.term_months ? "is-invalid" : ""}`}
              />
              {errors.term_months && (
                <div className="mu2-error small mt-1">{errors.term_months}</div>
              )}
            </div>
          </div>
        </Card>

        <Card
          title="Base Rent Schedule ($/PSF)"
          headerClass="bg-primary text-white text-center text-md-start"
          className="mb-4 border-0"
        >
          {rentSchedule.map((period, index) => (
            <div key={index} className="row g-3 mb-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label">Rent PSF</label>
                <input
                  type="number"
                  step="0.01"
                  value={period.rent}
                  onChange={(e) => {
                    updateRentPeriod(
                      index,
                      "rent",
                      Number(e.target.value) || 0,
                    );
                    if (errors[`rent_${index}`]) {
                      const newErrors = { ...errors };
                      delete newErrors[`rent_${index}`];
                      setErrors(newErrors);
                    }
                  }}
                  className={`form-control ${errors[`rent_${index}`] ? "is-invalid" : ""}`}
                />
                {errors[`rent_${index}`] && (
                  <div className="mu2-error small mt-1">
                    {errors[`rent_${index}`]}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Start Year</label>
                <input
                  type="number"
                  min="1"
                  value={period.start_y}
                  onChange={(e) => {
                    updateRentPeriod(
                      index,
                      "start_y",
                      Number(e.target.value) || 1,
                    );
                    if (errors[`year_${index}`]) {
                      const newErrors = { ...errors };
                      delete newErrors[`year_${index}`];
                      setErrors(newErrors);
                    }
                    if (errors[`year_logic_${index}`]) {
                      const newErrors = { ...errors };
                      delete newErrors[`year_logic_${index}`];
                      setErrors(newErrors);
                    }
                  }}
                  className={`form-control ${errors[`year_${index}`] || errors[`year_logic_${index}`] ? "is-invalid" : ""}`}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">End Year</label>
                <input
                  type="number"
                  min="1"
                  value={period.end_y}
                  onChange={(e) => {
                    updateRentPeriod(
                      index,
                      "end_y",
                      Number(e.target.value) || 1,
                    );
                    if (errors[`year_${index}`]) {
                      const newErrors = { ...errors };
                      delete newErrors[`year_${index}`];
                      setErrors(newErrors);
                    }
                    if (errors[`year_logic_${index}`]) {
                      const newErrors = { ...errors };
                      delete newErrors[`year_logic_${index}`];
                      setErrors(newErrors);
                    }
                  }}
                  className={`form-control ${errors[`year_${index}`] || errors[`year_logic_${index}`] ? "is-invalid" : ""}`}
                />
                {(errors[`year_${index}`] || errors[`year_logic_${index}`]) && (
                  <div className="mu2-error small mt-1">
                    {errors[`year_${index}`] || errors[`year_logic_${index}`]}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-3">
                <button
                  type="button"
                  onClick={() => removeRentPeriod(index)}
                  disabled={rentSchedule.length === 1}
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRentPeriod}
            className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100"
          >
            <Plus size={18} />
            Add Rent Period
          </button>
        </Card>

        <Card
          title="Additional Terms"
          headerClass="bg-success text-white text-center text-md-start"
          className="mb-4 border-0"
        >
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">Escalation Type</label>
              <select
                value={escalationType}
                onChange={(e) => setEscalationType(e.target.value)}
                className="form-select"
              >
                {ESCALATION_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Escalation Value {escalationType === "Percent" ? "(%)" : "($)"}{" "}
                <span className="mu2-error">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={escalationValue}
                onChange={(e) => {
                  setEscalationValue(
                    e.target.value ? Number(e.target.value) : "",
                  );
                  if (errors.escalation_value)
                    setErrors({ ...errors, escalation_value: "" });
                }}
                className={`form-control ${errors.escalation_value ? "is-invalid" : ""}`}
              />
              {errors.escalation_value && (
                <div className="mu2-error small mt-1">
                  {errors.escalation_value}
                </div>
              )}
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">Free Rent Months</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={freeRentMonths}
                onChange={(e) =>
                  setFreeRentMonths(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="form-control"
              />
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">TI Allowance</label>
              <select
                value={tiAllowanceRange}
                onChange={(e) => setTiAllowanceRange(e.target.value)}
                className="form-select"
              >
                <option value="">Select TI Allowance</option>
                {TI_ALLOWANCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">Security Deposit (Months)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={securityDepMonths}
                onChange={(e) =>
                  setSecurityDepMonths(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="form-control"
              />
            </div>
          </div>
        </Card>

        <div className="d-flex flex-column align-items-center justify-content-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success btn-md px-4"
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              <>Submit to DCT</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
