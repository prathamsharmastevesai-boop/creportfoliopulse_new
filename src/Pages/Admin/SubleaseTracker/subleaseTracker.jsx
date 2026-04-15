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
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";

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
        sublease_rent: form.complianceGuardrails.sublease_rent
          ? Number(form.complianceGuardrails.sublease_rent)
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
    if (role === "admin") navigate("/sublease-tracker-list");
    else navigate("/user-sublease-tracker-list");
  };

  return (
    <div className="container-fluid p-4">
      <PageHeader
        backButton={<BackButton />}
        title={`${subleaseId ? "Edit" : "New"} Sublease Tracker`}
        subtitle="Manage sublease identification, status updates, and compliance guardrails"
        actions={
          <Button
            onClick={MovetoList}
            variant="outline-secondary"
            size="sm"
            className="px-4"
          >
            Move to List
          </Button>
        }
      />

      <Card variant="elevated" title="Sublease Identification" className="mb-4">
        <Row className="g-3">
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
            <Col md={6} key={idx}>
              <Form.Label className="fw-semibold small">
                {field.label}
                {field.required && <span className="text-danger ms-1">*</span>}
              </Form.Label>
              <Form.Control
                type={field.type || "text"}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                isInvalid={!!errors[field.name]}
                className="py-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </Col>
          ))}
        </Row>
      </Card>

      <Card variant="elevated" title="Notes" className="mb-4">
        <Form.Control
          as="textarea"
          name="notes"
          rows={4}
          value={form.notes}
          onChange={handleChange}
          placeholder="Enter any additional notes here..."
          className="py-2"
        />
      </Card>

      <Card variant="elevated" title="Status Updates" className="mb-4">
        <Row className="g-4">
          {quarters.map((q) => (
            <Col lg={6} key={q}>
              <div className="p-3 rounded-3 border h-100">
                <h6 className="fw-bold mb-3 text-primary">{q} Status Update</h6>
                <Row className="g-3">
                  {[
                    { label: "Check In", field: "checkIn" },
                    { label: "Headcount Confirmation", field: "headcount" },
                    { label: "Building Update Note Sent", field: "noteSent" },
                    { label: "Holiday Gift", field: "holidayGift" },
                  ].map((item, idx) => (
                    <Col sm={6} key={idx}>
                      <Form.Check
                        type="switch"
                        label={item.label}
                        checked={form.statusUpdates?.[q]?.[item.field] || false}
                        onChange={() => handleToggle(q, item.field)}
                        className="small fw-medium"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Card variant="elevated" title="Consent Checklist" className="mb-4">
        <Row className="g-4">
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Final Term Sheet Uploaded"
              name="consentChecklist.finalTermSheetUploaded"
              checked={form.consentChecklist?.finalTermSheetUploaded || false}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Signed Sublease Uploaded"
              name="consentChecklist.signedSubleaseUploaded"
              checked={form.consentChecklist?.signedSubleaseUploaded || false}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Subtenant Financials Status
            </Form.Label>
            <Form.Select
              name="consentChecklist.subtenantFinancialsStatus"
              value={
                form.consentChecklist?.subtenantFinancialsStatus || "Pending"
              }
              onChange={handleChange}
              className="py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Subtenant Profile
            </Form.Label>
            <Form.Control
              type="text"
              name="consentChecklist.subtenantProfile"
              value={form.consentChecklist?.subtenantProfile || ""}
              onChange={handleChange}
              placeholder="e.g., Tech startup - AI SaaS"
              className="py-2"
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Landlord Review Fees ($)
            </Form.Label>
            <Form.Control
              type="number"
              name="consentChecklist.landlordReviewFees"
              value={form.consentChecklist?.landlordReviewFees || ""}
              onChange={handleChange}
              className="py-2"
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Landlord Review Fees Paid"
              name="consentChecklist.landlordReviewFeesPaid"
              checked={form.consentChecklist?.landlordReviewFeesPaid || false}
              onChange={handleChange}
              className="mt-2"
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Insurance Status
            </Form.Label>
            <Form.Select
              name="consentChecklist.insuranceStatus"
              value={form.consentChecklist?.insuranceStatus || "Pending"}
              onChange={handleChange}
              className="py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Not Required">Not Required</option>
            </Form.Select>
          </Col>
        </Row>
      </Card>

      <Card variant="elevated" title="Compliance Guardrails" className="mb-4">
        <Row className="g-4">
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Occupancy Check Passed"
              name="complianceGuardrails.occupancyCheck"
              checked={form.complianceGuardrails?.occupancyCheck || false}
              onChange={handleChange}
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Anti-Poaching Check Passed"
              name="complianceGuardrails.antiPoachingCheck"
              checked={form.complianceGuardrails?.antiPoachingCheck || false}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">Use Covenant</Form.Label>
            <Form.Control
              type="text"
              name="complianceGuardrails.useCovenant"
              value={form.complianceGuardrails?.useCovenant || ""}
              onChange={handleChange}
              placeholder="e.g., General Office"
              className="py-2"
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Master Rent ($/sf)
            </Form.Label>
            <Form.Control
              type="number"
              name="complianceGuardrails.masterRent"
              value={form.complianceGuardrails?.masterRent || ""}
              onChange={handleChange}
              className="py-2"
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Sublease Rent ($/sf)
            </Form.Label>
            <Form.Control
              type="number"
              name="complianceGuardrails.subleaseRent"
              value={form.complianceGuardrails?.subleaseRent || ""}
              onChange={handleChange}
              className="py-2"
            />
          </Col>
        </Row>
      </Card>

      <Card variant="elevated" title="Timeline Tracking" className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Label className="fw-semibold small">
              Consent Submission Date
            </Form.Label>
            <Form.Control
              type="date"
              name="timelineTracking.consentSubmissionDate"
              value={form.timelineTracking?.consentSubmissionDate || ""}
              onChange={handleChange}
              className="py-2"
            />
          </Col>
        </Row>
      </Card>

      <div className="d-flex justify-content-center gap-3 mb-5">
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="px-5 py-2 fw-bold"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" className="me-2" /> : null}
          {loading ? "Submitting..." : "Save Sublease"}
        </Button>
      </div>

      {subleaseId && (
        <Card variant="elevated" title="Documents" className="mb-4">
          <div className="d-flex align-items-center gap-3">
            <Form.Control
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="w-auto"
            />
            <Button
              variant="success"
              onClick={handleFileUpload}
              disabled={!selectedFile || uploadingFile}
              className="px-4"
            >
              {uploadingFile ? <Spinner size="sm" className="me-2" /> : null}
              {uploadingFile ? "Uploading..." : "Upload PDF"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
