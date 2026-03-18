import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  SubleaseTrackerSubmit,
  uploadSubleaseFile,
  fetchSubleaseFiles,
} from "../../../Networking/Admin/APIs/subleaseTrackerApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../Component/backButton";

export const SubleaseTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => initializeForm());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [subleaseId, setSubleaseId] = useState();

  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const role = sessionStorage.getItem("role");

  function initializeForm(initialData) {
    const defaultStatus = {
      checkIn: false,
      headcount: false,
      noteSent: false,
      holidayGift: false,
    };
    return {
      subTenantName: initialData?.sub_tenant_name || "",
      buildingAddress: initialData?.building_address || "",
      floor: initialData?.floor_suite || "",
      commencementDate:
        initialData?.sublease_commencement_date?.split("T")[0] || "",
      expirationDate:
        initialData?.sublease_expiration_date?.split("T")[0] || "",
      subtenantHeadcount: initialData?.subtenant_headcount || "",
      // tenantNoticeDate:
      //   initialData?.direct_tenant_notice_of_renewal_date?.split("T")[0] || "",
      subtenantRent: initialData?.subtenant_current_rent || "",
      directTenantRent: initialData?.direct_tenant_current_rent || "",
      subtenantContact: initialData?.subtenant_contact_info || "",
      directTenantContact: initialData?.direct_tenant_contact_info || "",
      notes: initialData?.notes || "",
      statusUpdates: {
        Q1: initialData?.q1
          ? mapBackendToFrontendStatus(initialData.q1)
          : { ...defaultStatus },
        Q2: initialData?.q2
          ? mapBackendToFrontendStatus(initialData.q2)
          : { ...defaultStatus },
        Q3: initialData?.q3
          ? mapBackendToFrontendStatus(initialData.q3)
          : { ...defaultStatus },
        Q4: initialData?.q4
          ? mapBackendToFrontendStatus(initialData.q4)
          : { ...defaultStatus },
      },
      consentChecklist: {
        finalTermSheetUploaded:
          initialData?.consent_checklist?.final_term_sheet_uploaded || false,
        signedSubleaseUploaded:
          initialData?.consent_checklist?.signed_sublease_uploaded || false,
        subtenantFinancialsStatus:
          initialData?.consent_checklist?.subtenant_financials_status ||
          "Pending",
        subtenantProfile:
          initialData?.consent_checklist?.subtenant_profile || "",
        landlordReviewFees:
          initialData?.consent_checklist?.landlord_review_fees || "",
        landlordReviewFeesPaid:
          initialData?.consent_checklist?.landlord_review_fees_paid || false,
        insuranceStatus:
          initialData?.consent_checklist?.insurance_status || "Pending",
      },
      complianceGuardrails: {
        occupancyCheck:
          initialData?.compliance_guardrails?.occupancy_check || false,
        antiPoachingCheck:
          initialData?.compliance_guardrails?.anti_poaching_check || false,
        useCovenant: initialData?.compliance_guardrails?.use_covenant || "",
        masterRent: initialData?.compliance_guardrails?.master_rent || "",
        subleaseRent: initialData?.compliance_guardrails?.sublease_rent || "",
      },
      timelineTracking: {
        consentSubmissionDate:
          initialData?.timeline_tracking?.consent_submission_date?.split(
            "T",
          )[0] || "",
      },
    };
  }

  function mapBackendToFrontendStatus(q) {
    return {
      checkIn: q.check_in || false,
      headcount: q.headcount_confirmation || false,
      noteSent: q.building_update_note_sent || false,
      holidayGift: q.holiday_gift || false,
    };
  }

  useEffect(() => {
    if (subleaseId) {
      loadFiles(subleaseId);
    }
  }, [subleaseId]);

  const loadFiles = async (id) => {
    try {
      const result = await dispatch(fetchSubleaseFiles(id)).unwrap();
      setFiles(result);
    } catch (error) {
      console.error("Failed to load files", error);
    }
  };

  const handleToggle = (q, field) => {
    setForm((prev) => ({
      ...prev,
      statusUpdates: {
        ...prev.statusUpdates,
        [q]: {
          ...prev.statusUpdates[q],
          [field]: !prev.statusUpdates[q][field],
        },
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (type === "checkbox") {
      const keys = name.split(".");
      if (keys.length === 2) {
        setForm((prev) => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: checked,
          },
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      const keys = name.split(".");
      if (keys.length === 2) {
        setForm((prev) => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.subTenantName?.trim())
      newErrors.subTenantName = "Sub-Tenant Name is required";
    if (!form.buildingAddress?.trim())
      newErrors.buildingAddress = "Building Address is required";
    if (!form.floor?.trim()) newErrors.floor = "Floor/Suite is required";
    if (!form.commencementDate)
      newErrors.commencementDate = "Commencement Date is required";
    if (!form.expirationDate)
      newErrors.expirationDate = "Expiration Date is required";
    if (!form.subtenantHeadcount) {
      newErrors.subtenantHeadcount = "Headcount is required";
    } else if (
      isNaN(form.subtenantHeadcount) ||
      Number(form.subtenantHeadcount) <= 0
    ) {
      newErrors.subtenantHeadcount = "Headcount must be a positive number";
    }
    if (!form.subtenantRent?.trim())
      newErrors.subtenantRent = "Subtenant Rent is required";
    if (!form.directTenantRent?.trim())
      newErrors.directTenantRent = "Direct Tenant Rent is required";
    if (!form.subtenantContact?.trim())
      newErrors.subtenantContact = "Subtenant Contact is required";
    if (!form.directTenantContact?.trim())
      newErrors.directTenantContact = "Direct Tenant Contact is required";

    if (form.commencementDate && form.expirationDate) {
      const start = new Date(form.commencementDate);
      const end = new Date(form.expirationDate);
      if (start >= end) {
        newErrors.expirationDate =
          "Expiration date must be after commencement date";
      }
    }

    if (form.consentChecklist.landlordReviewFees) {
      const fees = Number(form.consentChecklist.landlordReviewFees);
      if (isNaN(fees) || fees < 0) {
        newErrors["consentChecklist.landlordReviewFees"] =
          "Must be a valid non-negative number";
      }
    }
    if (form.complianceGuardrails.masterRent) {
      const rent = Number(form.complianceGuardrails.masterRent);
      if (isNaN(rent) || rent < 0) {
        newErrors["complianceGuardrails.masterRent"] =
          "Must be a valid non-negative number";
      }
    }
    if (form.complianceGuardrails.subleaseRent) {
      const rent = Number(form.complianceGuardrails.subleaseRent);
      if (isNaN(rent) || rent < 0) {
        newErrors["complianceGuardrails.subleaseRent"] =
          "Must be a valid non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill correct detail in the form");
      return;
    }

    setLoading(true);

    const formatDate = (dateStr) => (dateStr ? `${dateStr}T00:00:00` : null);

    const payload = {
      sub_tenant_name: form.subTenantName.trim(),
      building_address: form.buildingAddress.trim(),
      floor_suite: form.floor.trim(),
      sublease_commencement_date: formatDate(form.commencementDate),
      sublease_expiration_date: formatDate(form.expirationDate),
      subtenant_headcount: Number(form.subtenantHeadcount),
      // direct_tenant_notice_of_renewal_date: formatDate(form.tenantNoticeDate),
      subtenant_current_rent: form.subtenantRent.trim(),
      direct_tenant_current_rent: form.directTenantRent.trim(),
      subtenant_contact_info: form.subtenantContact.trim(),
      direct_tenant_contact_info: form.directTenantContact.trim(),
      notes: form.notes.trim() || null,
      q1: mapFrontendToBackendStatus(form.statusUpdates.Q1),
      q2: mapFrontendToBackendStatus(form.statusUpdates.Q2),
      q3: mapFrontendToBackendStatus(form.statusUpdates.Q3),
      q4: mapFrontendToBackendStatus(form.statusUpdates.Q4),
      consent_checklist: {
        final_term_sheet_uploaded: form.consentChecklist.finalTermSheetUploaded,
        signed_sublease_uploaded: form.consentChecklist.signedSubleaseUploaded,
        subtenant_financials_status:
          form.consentChecklist.subtenantFinancialsStatus || null,
        subtenant_profile: form.consentChecklist.subtenantProfile || null,
        landlord_review_fees: form.consentChecklist.landlordReviewFees
          ? Number(form.consentChecklist.landlordReviewFees)
          : null,
        landlord_review_fees_paid: form.consentChecklist.landlordReviewFeesPaid,
        insurance_status: form.consentChecklist.insuranceStatus || null,
      },
      compliance_guardrails: {
        occupancy_check: form.complianceGuardrails.occupancyCheck,
        anti_poaching_check: form.complianceGuardrails.antiPoachingCheck,
        use_covenant: form.complianceGuardrails.useCovenant || null,
        master_rent: form.complianceGuardrails.masterRent
          ? Number(form.complianceGuardrails.masterRent)
          : null,
        sublease_rent: form.complianceGuardrails.subleaseRent
          ? Number(form.complianceGuardrails.subleaseRent)
          : null,
      },
      timeline_tracking: {
        consent_submission_date: formatDate(
          form.timelineTracking.consentSubmissionDate,
        ),
      },
    };

    try {
      const result = await dispatch(SubleaseTrackerSubmit(payload)).unwrap();
      toast.success("Sublease saved successfully!");
      setSubleaseId(result?.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save sublease.");
    } finally {
      setLoading(false);
    }
  };

  function mapFrontendToBackendStatus(status) {
    return {
      check_in: status.checkIn,
      headcount_confirmation: status.headcount,
      building_update_note_sent: status.noteSent,
      holiday_gift: status.holidayGift || null,
    };
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        e.target.value = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !subleaseId) return;
    setUploadingFile(true);
    try {
      await dispatch(
        uploadSubleaseFile({ id: subleaseId, file: selectedFile }),
      ).unwrap();
      toast.success("File uploaded");
      setSelectedFile(null);

      document.getElementById("fileInput").value = "";
      loadFiles(subleaseId);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  const MovetoList = () => {
    if (role === "admin") {
      navigate("/sublease-tracker-list");
    } else {
      navigate("/user-sublease-tracker-list");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center my-2">
        <BackButton />
        <h2 className="fw-bold ms-2">
          {subleaseId ? "Edit" : "New"} Sublease Tracker
        </h2>
      </div>

      <div className="p-4 shadow-sm rounded border position-relative">
        <h5 className="fw-bold pb-2 border-bottom mb-3">
          Sublease Identification <span className="text-danger">*</span>
        </h5>
        <div className="row g-3">
          {[
            { label: "Sub-Tenant Name", name: "subTenantName", required: true },
            {
              label: "Building Address",
              name: "buildingAddress",
              required: true,
            },
            { label: "Floor/Suite", name: "floor", required: true },
            {
              label: "Sublease Commencement Date",
              name: "commencementDate",
              type: "date",
              required: true,
            },
            {
              label: "Sublease Expiration Date",
              name: "expirationDate",
              type: "date",
              required: true,
            },
            {
              label: "Subtenant Headcount",
              name: "subtenantHeadcount",
              type: "number",
              required: true,
            },
            // {
            //   label: "Direct Tenant Notice of Renewal Date",
            //   name: "tenantNoticeDate",
            //   type: "date",
            // },
            {
              label: "Subtenant Current Rent",
              name: "subtenantRent",
              required: true,
            },
            {
              label: "Direct Tenant Current Rent",
              name: "directTenantRent",
              required: true,
            },
            {
              label: "Subtenant Contact Info",
              name: "subtenantContact",
              placeholder: "Name, Phone, Email",
              required: true,
            },
            {
              label: "Direct Tenant Contact Info",
              name: "directTenantContact",
              placeholder: "Name, Phone, Email",
              required: true,
            },
          ].map((field, idx) => (
            <div key={idx} className="col-md-6 col-12">
              <label className="fw-bold form-label">
                {field.label}
                {field.required && <span className="text-danger ms-1">*</span>}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className={`form-control border-primary ${errors[field.name] ? "is-invalid" : ""}`}
              />
              {errors[field.name] && (
                <div className="invalid-feedback">{errors[field.name]}</div>
              )}
            </div>
          ))}
        </div>

        <h5 className="fw-bold pb-2 border-bottom my-3">Notes</h5>
        <textarea
          name="notes"
          rows="4"
          value={form.notes}
          onChange={handleChange}
          className="form-control border-primary"
          placeholder="Enter any additional notes here..."
        />

        <h5 className="fw-bold pb-2 border-bottom my-3">
          Lease & Tenant Details <span className="text-danger">*</span>
        </h5>
        {quarters.map((q) => (
          <div key={q}>
            <h5 className="mb-3">{q} Status Update</h5>
            <div
              className="card p-3 mb-3"
              style={{ backgroundColor: "#e9eef6" }}
            >
              <div className="row">
                {[
                  { label: "Check In", field: "checkIn" },
                  { label: "Headcount Confirmation", field: "headcount" },
                  { label: "Building Update Note Sent", field: "noteSent" },
                  { label: "Holiday Gift", field: "holidayGift" },
                ].map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.statusUpdates?.[q]?.[item.field] || false}
                        onChange={() => handleToggle(q, item.field)}
                      />
                      <label className="form-check-label">{item.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <h5 className="fw-bold pb-2 border-bottom my-3">Consent Checklist</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="consentChecklist.finalTermSheetUploaded"
                checked={form.consentChecklist?.finalTermSheetUploaded || false}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Final Term Sheet Uploaded
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="consentChecklist.signedSubleaseUploaded"
                checked={form.consentChecklist?.signedSubleaseUploaded || false}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Signed Sublease Uploaded
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">
              Subtenant Financials Status
            </label>
            <select
              name="consentChecklist.subtenantFinancialsStatus"
              value={
                form.consentChecklist?.subtenantFinancialsStatus || "Pending"
              }
              onChange={handleChange}
              className="form-select border-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">Subtenant Profile</label>
            <input
              type="text"
              name="consentChecklist.subtenantProfile"
              value={form.consentChecklist?.subtenantProfile || ""}
              onChange={handleChange}
              className="form-control border-primary"
              placeholder="e.g., Tech startup - AI SaaS"
            />
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">
              Landlord Review Fees ($)
            </label>
            <input
              type="number"
              name="consentChecklist.landlordReviewFees"
              value={form.consentChecklist?.landlordReviewFees || ""}
              onChange={handleChange}
              className={`form-control border-primary ${errors["consentChecklist.landlordReviewFees"] ? "is-invalid" : ""}`}
            />
            {errors["consentChecklist.landlordReviewFees"] && (
              <div className="invalid-feedback">
                {errors["consentChecklist.landlordReviewFees"]}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="consentChecklist.landlordReviewFeesPaid"
                checked={form.consentChecklist?.landlordReviewFeesPaid || false}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Landlord Review Fees Paid
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">Insurance Status</label>
            <select
              name="consentChecklist.insuranceStatus"
              value={form.consentChecklist?.insuranceStatus || "Pending"}
              onChange={handleChange}
              className="form-select border-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Not Required">Not Required</option>
            </select>
          </div>
        </div>

        <h5 className="fw-bold pb-2 border-bottom my-3">
          Compliance Guardrails
        </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="complianceGuardrails.occupancyCheck"
                checked={form.complianceGuardrails?.occupancyCheck || false}
                onChange={handleChange}
              />
              <label className="form-check-label">Occupancy Check Passed</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="complianceGuardrails.antiPoachingCheck"
                checked={form.complianceGuardrails?.antiPoachingCheck || false}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Anti-Poaching Check Passed
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">Use Covenant</label>
            <input
              type="text"
              name="complianceGuardrails.useCovenant"
              value={form.complianceGuardrails?.useCovenant || ""}
              onChange={handleChange}
              className="form-control border-primary"
              placeholder="e.g., General Office"
            />
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">Master Rent ($/sf)</label>
            <input
              type="number"
              name="complianceGuardrails.masterRent"
              value={form.complianceGuardrails?.masterRent || ""}
              onChange={handleChange}
              className={`form-control border-primary ${errors["complianceGuardrails.masterRent"] ? "is-invalid" : ""}`}
            />
            {errors["complianceGuardrails.masterRent"] && (
              <div className="invalid-feedback">
                {errors["complianceGuardrails.masterRent"]}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="fw-bold form-label">Sublease Rent ($/sf)</label>
            <input
              type="number"
              name="complianceGuardrails.subleaseRent"
              value={form.complianceGuardrails?.subleaseRent || ""}
              onChange={handleChange}
              className={`form-control border-primary ${errors["complianceGuardrails.subleaseRent"] ? "is-invalid" : ""}`}
            />
            {errors["complianceGuardrails.subleaseRent"] && (
              <div className="invalid-feedback">
                {errors["complianceGuardrails.subleaseRent"]}
              </div>
            )}
          </div>
        </div>

        <h5 className="fw-bold pb-2 border-bottom my-3">Timeline Tracking</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="fw-bold form-label">
              Consent Submission Date
            </label>
            <input
              type="date"
              name="timelineTracking.consentSubmissionDate"
              value={form.timelineTracking?.consentSubmissionDate || ""}
              onChange={handleChange}
              className="form-control border-primary"
            />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3">
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {subleaseId && (
        <div className="mt-5 p-4 shadow-sm rounded border">
          <h5 className="fw-bold pb-2 border-bottom mb-3">Documents</h5>
          <div className="mb-3 d-flex align-items-center gap-2">
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="form-control w-auto"
            />
            <button
              className="btn btn-success"
              onClick={handleFileUpload}
              disabled={!selectedFile || uploadingFile}
            >
              {uploadingFile ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
        </div>
      )}
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3 border-top">
        <button onClick={MovetoList} className="btn btn-secondary">
          Move to List
        </button>
      </div>
    </div>
  );
};
