import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSubleaseTrackerList,
  GetSubleaseById,
  DeleteSubleaseById,
  UpdateSubleaseById,
  fetchSubleaseFiles,
  deleteSubleaseFile,
} from "../../../Networking/Admin/APIs/subleaseTrackerApi";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsPlusLg, BsFilePdf, BsTrash } from "react-icons/bs";
import RAGLoader from "../../../Component/Loader";
import { ChatBotModal } from "../../../Component/chatbotModel";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";

export const SubleaseTrackerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, list } = useSelector((state) => state.subleaseSlice);

  const role = sessionStorage.getItem("role");
  const Role = role;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [detail, setDetail] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null,
    name: "",
    loading: false,
  });

  const [deleteFileModal, setDeleteFileModal] = useState({
    show: false,
    fileId: null,
    fileName: "",
    subleaseId: null,
    loading: false,
  });

  const [detailLoading, setDetailLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedList = useMemo(() => {
    if (!list) return [];

    let sortable = [...list];

    if (!sortConfig.key) return sortable;

    sortable.sort((a, b) => {
      let valA = a.data[sortConfig.key];
      let valB = b.data[sortConfig.key];

      if (
        sortConfig.key.includes("date") ||
        sortConfig.key === "sublease_commencement_date" ||
        sortConfig.key === "sublease_expiration_date" ||
        sortConfig.key === "direct_tenant_notice_of_renewal_date"
      ) {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (
        sortConfig.key === "subtenant_headcount" ||
        sortConfig.key === "days_in_review"
      ) {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortable;
  }, [list, sortConfig]);

  const confirmDelete = (id, name) => {
    setDeleteModal({
      show: true,
      id,
      name,
      loading: false,
    });
  };

  const confirmDeleteFile = (fileId, fileName, subleaseId) => {
    setDeleteFileModal({
      show: true,
      fileId,
      fileName,
      subleaseId,
      loading: false,
    });
  };

  useEffect(() => {
    dispatch(GetSubleaseTrackerList());
  }, [dispatch]);

  const loadFiles = async (id) => {
    setLoadingFiles(true);
    try {
      const result = await dispatch(fetchSubleaseFiles(id)).unwrap();
      setFiles(result || []);
    } catch (error) {
      console.error("Failed to load files", error);
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!deleteFileModal.fileId) return;

    setDeleteFileModal((prev) => ({ ...prev, loading: true }));

    try {
      await dispatch(deleteSubleaseFile(deleteFileModal.fileId)).unwrap();

      if (deleteFileModal.subleaseId) {
        await loadFiles(deleteFileModal.subleaseId);
      }

      setDeleteFileModal({
        show: false,
        fileId: null,
        fileName: "",
        subleaseId: null,
        loading: false,
      });
    } catch (error) {
      console.error("Error deleting file:", error);

      setDeleteFileModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const openDetailModal = async (id, edit = false) => {
    setShowModal(true);
    setIsEdit(edit);
    setDetailLoading(true);
    setFiles([]);

    try {
      const data = await dispatch(GetSubleaseById(id)).unwrap();

      const initializedData = {
        ...data?.data,
        q1: {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: false,
          ...(data?.data?.q1 || {}),
        },
        q2: {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: false,
          ...(data?.data?.q2 || {}),
        },
        q3: {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: false,
          ...(data?.data?.q3 || {}),
        },
        q4: {
          check_in: false,
          headcount_confirmation: false,
          building_update_note_sent: false,
          holiday_gift: false,
          ...(data?.data?.q4 || {}),
        },
        consent_checklist: {
          final_term_sheet_uploaded: false,
          signed_sublease_uploaded: false,
          subtenant_financials_status: "Pending",
          subtenant_profile: "",
          landlord_review_fees: 0,
          landlord_review_fees_paid: false,
          insurance_status: "Pending",
          ...(data?.data?.consent_checklist || {}),
        },
        compliance_guardrails: {
          occupancy_check: false,
          anti_poaching_check: false,
          use_covenant: "",
          master_rent: 0,
          sublease_rent: 0,
          ...(data?.data?.compliance_guardrails || {}),
        },
        timeline_tracking: {
          consent_submission_date: "",
          ...(data?.data?.timeline_tracking || {}),
        },
        notes: data?.data?.notes || "",
        days_in_review: data?.data?.days_in_review || 0,
      };

      setDetail({
        ...data,
        data: initializedData,
      });

      await loadFiles(id);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNavigate = () => {
    Role === "admin"
      ? navigate("/sublease-tracker-form")
      : navigate("/user-sublease-tracker");
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      await dispatch(DeleteSubleaseById(deleteModal.id)).unwrap();
      dispatch(GetSubleaseTrackerList());

      setDeleteModal({ show: false, id: null, name: "", loading: false });
    } catch (error) {
      console.error("Error deleting sublease:", error);

      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setDetail((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [parent]: {
            ...prev.data[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        },
      }));
    } else {
      setDetail((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    }
  };

  const handleSave = async () => {
    if (!detail?.id) return;

    setIsSaving(true);
    try {
      const updateData = {
        sub_tenant_name: detail.data.sub_tenant_name,
        building_address: detail.data.building_address,
        floor_suite: detail.data.floor_suite,
        sublease_commencement_date: detail.data.sublease_commencement_date,
        sublease_expiration_date: detail.data.sublease_expiration_date,
        subtenant_headcount: detail.data.subtenant_headcount,
        direct_tenant_notice_of_renewal_date:
          detail.data.direct_tenant_notice_of_renewal_date,
        subtenant_current_rent: detail.data.subtenant_current_rent,
        direct_tenant_current_rent: detail.data.direct_tenant_current_rent,
        subtenant_contact_info: detail.data.subtenant_contact_info,
        direct_tenant_contact_info: detail.data.direct_tenant_contact_info,
        notes: detail.data.notes || "",
        q1: detail.data.q1,
        q2: detail.data.q2,
        q3: detail.data.q3,
        q4: detail.data.q4,
        consent_checklist: detail.data.consent_checklist,
        compliance_guardrails: detail.data.compliance_guardrails,
        timeline_tracking: detail.data.timeline_tracking,
      };

      await dispatch(
        UpdateSubleaseById({
          tracker_id: detail.id,
          data: updateData,
        }),
      ).unwrap();

      dispatch(GetSubleaseTrackerList());
      setShowModal(false);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating sublease:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return `$${Number(value).toFixed(2)}`;
  };

  const renderQuarterSection = (quarter, quarterName) => (
    <Card key={quarter} className="mb-3" variant="bordered" title={quarterName}>
      <div className="row">
        <div className="col-md-6">
          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.check_in`}
                checked={detail?.data?.[quarter]?.check_in || false}
                onChange={handleChange}
                id={`${quarter}-checkin`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={detail?.data?.[quarter]?.check_in || false}
                disabled
                readOnly
              />
            )}
            <label className="form-check-label" htmlFor={`${quarter}-checkin`}>
              Check In
            </label>
          </div>

          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.headcount_confirmation`}
                checked={
                  detail?.data?.[quarter]?.headcount_confirmation || false
                }
                onChange={handleChange}
                id={`${quarter}-headcount`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={
                  detail?.data?.[quarter]?.headcount_confirmation || false
                }
                disabled
                readOnly
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-headcount`}
            >
              Headcount Confirmation
            </label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.building_update_note_sent`}
                checked={
                  detail?.data?.[quarter]?.building_update_note_sent || false
                }
                onChange={handleChange}
                id={`${quarter}-note-sent`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={
                  detail?.data?.[quarter]?.building_update_note_sent || false
                }
                disabled
                readOnly
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-note-sent`}
            >
              Building Update Note Sent
            </label>
          </div>

          <div className="form-check mb-2">
            {isEdit ? (
              <input
                type="checkbox"
                className="form-check-input"
                name={`${quarter}.holiday_gift`}
                checked={detail?.data?.[quarter]?.holiday_gift || false}
                onChange={handleChange}
                id={`${quarter}-holiday-gift`}
              />
            ) : (
              <input
                type="checkbox"
                className="form-check-input"
                checked={detail?.data?.[quarter]?.holiday_gift || false}
                disabled
                readOnly
              />
            )}
            <label
              className="form-check-label"
              htmlFor={`${quarter}-holiday-gift`}
            >
              Holiday Gift
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderConsentChecklist = () => (
    <div className="col-12 mt-4">
      <Card variant="bordered" title="Consent Checklist">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-check">
              {isEdit ? (
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="consent_checklist.final_term_sheet_uploaded"
                  checked={
                    detail?.data?.consent_checklist
                      ?.final_term_sheet_uploaded || false
                  }
                  onChange={handleChange}
                  id="finalTermSheet"
                />
              ) : (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    detail?.data?.consent_checklist
                      ?.final_term_sheet_uploaded || false
                  }
                  disabled
                  readOnly
                />
              )}
              <label className="form-check-label" htmlFor="finalTermSheet">
                Final Term Sheet Uploaded
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-check">
              {isEdit ? (
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="consent_checklist.signed_sublease_uploaded"
                  checked={
                    detail?.data?.consent_checklist?.signed_sublease_uploaded ||
                    false
                  }
                  onChange={handleChange}
                  id="signedSublease"
                />
              ) : (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    detail?.data?.consent_checklist?.signed_sublease_uploaded ||
                    false
                  }
                  disabled
                  readOnly
                />
              )}
              <label className="form-check-label" htmlFor="signedSublease">
                Signed Sublease Uploaded
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">
              Subtenant Financials Status
            </label>
            {isEdit ? (
              <select
                className="form-select"
                name="consent_checklist.subtenant_financials_status"
                value={
                  detail?.data?.consent_checklist
                    ?.subtenant_financials_status || "Pending"
                }
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <p className="mb-0">
                {detail?.data?.consent_checklist?.subtenant_financials_status ||
                  "N/A"}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Subtenant Profile</label>
            {isEdit ? (
              <input
                type="text"
                className="form-control"
                name="consent_checklist.subtenant_profile"
                value={detail?.data?.consent_checklist?.subtenant_profile || ""}
                onChange={handleChange}
                placeholder="e.g., Tech startup - AI SaaS"
              />
            ) : (
              <p className="mb-0">
                {detail?.data?.consent_checklist?.subtenant_profile || "N/A"}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">
              Landlord Review Fees ($)
            </label>
            {isEdit ? (
              <input
                type="number"
                className="form-control"
                name="consent_checklist.landlord_review_fees"
                value={
                  detail?.data?.consent_checklist?.landlord_review_fees || ""
                }
                onChange={handleChange}
                step="0.01"
              />
            ) : (
              <p className="mb-0">
                {formatCurrency(
                  detail?.data?.consent_checklist?.landlord_review_fees,
                )}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <div className="form-check mt-4">
              {isEdit ? (
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="consent_checklist.landlord_review_fees_paid"
                  checked={
                    detail?.data?.consent_checklist
                      ?.landlord_review_fees_paid || false
                  }
                  onChange={handleChange}
                  id="feesPaid"
                />
              ) : (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    detail?.data?.consent_checklist
                      ?.landlord_review_fees_paid || false
                  }
                  disabled
                  readOnly
                />
              )}
              <label className="form-check-label" htmlFor="feesPaid">
                Landlord Review Fees Paid
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Insurance Status</label>
            {isEdit ? (
              <select
                className="form-select"
                name="consent_checklist.insurance_status"
                value={
                  detail?.data?.consent_checklist?.insurance_status || "Pending"
                }
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Not Required">Not Required</option>
              </select>
            ) : (
              <p className="mb-0">
                {detail?.data?.consent_checklist?.insurance_status || "N/A"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderComplianceGuardrails = () => (
    <div className="col-12 mt-4">
      <Card variant="bordered" title="Compliance Guardrails">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-check">
              {isEdit ? (
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="compliance_guardrails.occupancy_check"
                  checked={
                    detail?.data?.compliance_guardrails?.occupancy_check ||
                    false
                  }
                  onChange={handleChange}
                  id="occupancyCheck"
                />
              ) : (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    detail?.data?.compliance_guardrails?.occupancy_check ||
                    false
                  }
                  disabled
                  readOnly
                />
              )}
              <label className="form-check-label" htmlFor="occupancyCheck">
                Occupancy Check Passed
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-check">
              {isEdit ? (
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="compliance_guardrails.anti_poaching_check"
                  checked={
                    detail?.data?.compliance_guardrails?.anti_poaching_check ||
                    false
                  }
                  onChange={handleChange}
                  id="antiPoachingCheck"
                />
              ) : (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    detail?.data?.compliance_guardrails?.anti_poaching_check ||
                    false
                  }
                  disabled
                  readOnly
                />
              )}
              <label className="form-check-label" htmlFor="antiPoachingCheck">
                Anti-Poaching Check Passed
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Use Covenant</label>
            {isEdit ? (
              <input
                type="text"
                className="form-control"
                name="compliance_guardrails.use_covenant"
                value={detail?.data?.compliance_guardrails?.use_covenant || ""}
                onChange={handleChange}
                placeholder="e.g., General Office"
              />
            ) : (
              <p className="mb-0">
                {detail?.data?.compliance_guardrails?.use_covenant || "N/A"}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Master Rent ($/sf)</label>
            {isEdit ? (
              <input
                type="number"
                className="form-control"
                name="compliance_guardrails.master_rent"
                value={detail?.data?.compliance_guardrails?.master_rent || ""}
                onChange={handleChange}
                step="0.01"
              />
            ) : (
              <p className="mb-0">
                {formatCurrency(
                  detail?.data?.compliance_guardrails?.master_rent,
                )}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Sublease Rent ($/sf)</label>
            {isEdit ? (
              <input
                type="number"
                className="form-control"
                name="compliance_guardrails.sublease_rent"
                value={detail?.data?.compliance_guardrails?.sublease_rent || ""}
                onChange={handleChange}
                step="0.01"
              />
            ) : (
              <p className="mb-0">
                {formatCurrency(
                  detail?.data?.compliance_guardrails?.sublease_rent,
                )}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTimelineTracking = () => (
    <div className="col-12 mt-4">
      <Card variant="bordered" title="Timeline Tracking">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Consent Submission Date
            </label>
            {isEdit ? (
              <input
                type="date"
                className="form-control"
                name="timeline_tracking.consent_submission_date"
                value={formatDateForInput(
                  detail?.data?.timeline_tracking?.consent_submission_date,
                )}
                onChange={handleChange}
              />
            ) : (
              <p className="mb-0">
                {formatDateForDisplay(
                  detail?.data?.timeline_tracking?.consent_submission_date,
                )}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Days in Review</label>
            <p className="mb-0 fw-bold text-primary">
              {detail?.data?.days_in_review || 0} days
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFilesSection = () => (
    <div className="col-12 mt-4">
      <Card variant="bordered" title="Documents">
        {loadingFiles ? (
          <div className="text-center py-3">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading files...</span>
          </div>
        ) : files.length > 0 ? (
          <div className="list-group list-group-flush">
            {files.map((file) => (
              <div
                key={file.id}
                className="list-group-item d-flex justify-content-between align-items-center px-0"
              >
                <div className="d-flex align-items-center">
                  <BsFilePdf className="text-danger me-2" size={20} />
                  <span>{file.file_name}</span>
                </div>
                <div>
                  <a
                    href={file.view_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-eye me-1"></i>
                    View
                  </a>
                  {isEdit && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        confirmDeleteFile(file.id, file.file_name, detail?.id)
                      }
                      title="Delete File"
                    >
                      <BsTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted fst-italic mb-0">No documents uploaded</p>
        )}
      </Card>
    </div>
  );

  return (
    <>
      <PageHeader
        className="p-2"
        title="Sublease Tracker List"
        subtitle="Monitor and manage active sublease agreements across the portfolio"
        actions={
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-dark btn-sm d-flex align-items-center gap-2"
              onClick={handleNavigate}
            >
              <BsPlusLg /> Add Sublease
            </button>
            <ChatBotModal category={"sublease"} />
          </div>
        }
      />

      <div className="container-fluid p-4">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <RAGLoader />
          </div>
        )}

        {!loading && (!list || list.length === 0) && (
          <div className="text-center my-5">
            <p className="text-muted fs-5">No entries found.</p>
          </div>
        )}

        {!loading && list?.length > 0 && (
          <Card noPadding variant="elevated">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="table-light text-uppercase small fw-bold">
                    <th className="px-4 py-3 text-nowrap">Sub-Tenant Name</th>
                    <th className="py-3 text-nowrap">Floor / Suite</th>
                    <th
                      role="button"
                      onClick={() => handleSort("sublease_commencement_date")}
                      style={{ cursor: "pointer" }}
                      className="py-3 text-nowrap"
                    >
                      Commencement Date{" "}
                      {sortConfig.key === "sublease_commencement_date" &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th
                      role="button"
                      onClick={() => handleSort("sublease_expiration_date")}
                      style={{ cursor: "pointer" }}
                      className="py-3 text-nowrap"
                    >
                      Expiration Date{" "}
                      {sortConfig.key === "sublease_expiration_date" &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th
                      role="button"
                      onClick={() => handleSort("subtenant_headcount")}
                      style={{ cursor: "pointer" }}
                      className="py-3 text-nowrap"
                    >
                      Headcount{" "}
                      {sortConfig.key === "subtenant_headcount" &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th
                      role="button"
                      onClick={() => handleSort("days_in_review")}
                      style={{ cursor: "pointer" }}
                      className="py-3 text-nowrap"
                    >
                      Days in Review{" "}
                      {sortConfig.key === "days_in_review" &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                    <th className="py-3 text-nowrap">Building Address</th>
                    <th className="py-3 text-nowrap">Last Edited By</th>
                    <th className="py-3 text-center text-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedList.map((item) => (
                    <tr key={item.id} className="border-bottom">
                      <td className="px-4 py-3">
                        {item?.data?.sub_tenant_name || "N/A"}
                      </td>
                      <td className="py-3">
                        {item?.data?.floor_suite || "N/A"}
                      </td>
                      <td className="py-3">
                        {formatDateForDisplay(
                          item?.data?.sublease_commencement_date,
                        )}
                      </td>
                      <td className="py-3">
                        {formatDateForDisplay(
                          item?.data?.sublease_expiration_date,
                        )}
                      </td>
                      <td className="py-3">
                        {item?.data?.subtenant_headcount || 0}
                      </td>
                      <td className="py-3">
                        <span className="badge bg-info">
                          {item?.data?.days_in_review || 0}
                        </span>
                      </td>
                      <td
                        className="py-3"
                        style={{
                          maxWidth: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={item?.data?.building_address}
                      >
                        {item?.data?.building_address || "N/A"}
                      </td>
                      <td className="py-3">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "100px" }}
                          title={item?.updated_by_email}
                        >
                          {item?.updated_by_email || "N/A"}
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm rounded-circle"
                            onClick={() => openDetailModal(item.id, false)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm rounded-circle"
                            onClick={() => openDetailModal(item.id, true)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            onClick={() =>
                              confirmDelete(
                                item.id,
                                item?.data?.sub_tenant_name,
                              )
                            }
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: deleteFileModal.show ? 1040 : 1050,
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {isEdit ? "Edit Sublease" : "Sublease Details"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setIsEdit(false);
                      setDetail(null);
                      setFiles([]);
                    }}
                    disabled={
                      isSaving || detailLoading || deleteFileModal.loading
                    }
                  ></button>
                </div>

                <div className="modal-body">
                  {detailLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <RAGLoader />
                    </div>
                  ) : (
                    <div className="row g-4">
                      <div className="col-12">
                        <Card variant="bordered" title="Basic Information">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Sub-Tenant Name:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="sub_tenant_name"
                                  value={detail?.data?.sub_tenant_name || ""}
                                  onChange={handleChange}
                                  placeholder="Enter sub-tenant name"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.sub_tenant_name || "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Floor / Suite:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="floor_suite"
                                  value={detail?.data?.floor_suite || ""}
                                  onChange={handleChange}
                                  placeholder="Enter floor/suite"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.floor_suite || "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Building Address:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="building_address"
                                  value={detail?.data?.building_address || ""}
                                  onChange={handleChange}
                                  placeholder="Enter building address"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.building_address || "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Headcount:
                              </label>
                              {isEdit ? (
                                <input
                                  type="number"
                                  className="form-control"
                                  name="subtenant_headcount"
                                  value={detail?.data?.subtenant_headcount || 0}
                                  onChange={handleChange}
                                  min="0"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.subtenant_headcount || 0}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Days in Review:
                              </label>
                              <p className="mb-0 fw-bold text-primary">
                                {detail?.data?.days_in_review || 0} days
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card variant="bordered" title="Dates">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <label className="form-label fw-bold">
                                Commencement Date:
                              </label>
                              {isEdit ? (
                                <input
                                  type="date"
                                  className="form-control"
                                  name="sublease_commencement_date"
                                  value={formatDateForInput(
                                    detail?.data?.sublease_commencement_date,
                                  )}
                                  onChange={handleChange}
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {formatDateForDisplay(
                                    detail?.data?.sublease_commencement_date,
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-bold">
                                Expiration Date:
                              </label>
                              {isEdit ? (
                                <input
                                  type="date"
                                  className="form-control"
                                  name="sublease_expiration_date"
                                  value={formatDateForInput(
                                    detail?.data?.sublease_expiration_date,
                                  )}
                                  onChange={handleChange}
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {formatDateForDisplay(
                                    detail?.data?.sublease_expiration_date,
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-bold">
                                Direct Tenant Notice Date:
                              </label>
                              {isEdit ? (
                                <input
                                  type="date"
                                  className="form-control"
                                  name="direct_tenant_notice_of_renewal_date"
                                  value={formatDateForInput(
                                    detail?.data
                                      ?.direct_tenant_notice_of_renewal_date,
                                  )}
                                  onChange={handleChange}
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {formatDateForDisplay(
                                    detail?.data
                                      ?.direct_tenant_notice_of_renewal_date,
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card variant="bordered" title="Rent Information">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Subtenant Current Rent:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="subtenant_current_rent"
                                  value={
                                    detail?.data?.subtenant_current_rent || ""
                                  }
                                  onChange={handleChange}
                                  placeholder="Enter rent amount"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.subtenant_current_rent ||
                                    "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Direct Tenant Current Rent:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="direct_tenant_current_rent"
                                  value={
                                    detail?.data?.direct_tenant_current_rent ||
                                    ""
                                  }
                                  onChange={handleChange}
                                  placeholder="Enter rent amount"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.direct_tenant_current_rent ||
                                    "N/A"}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card variant="bordered" title="Contact Information">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Subtenant Contact Info:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="subtenant_contact_info"
                                  value={
                                    detail?.data?.subtenant_contact_info || ""
                                  }
                                  onChange={handleChange}
                                  placeholder="Enter contact info"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.subtenant_contact_info ||
                                    "N/A"}
                                </p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Direct Tenant Contact Info:
                              </label>
                              {isEdit ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="direct_tenant_contact_info"
                                  value={
                                    detail?.data?.direct_tenant_contact_info ||
                                    ""
                                  }
                                  onChange={handleChange}
                                  placeholder="Enter contact info"
                                  disabled={deleteFileModal.loading}
                                />
                              ) : (
                                <p className="mb-0">
                                  {detail?.data?.direct_tenant_contact_info ||
                                    "N/A"}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>

                      <div className="col-12">
                        <Card variant="bordered" title="Notes">
                          {isEdit ? (
                            <textarea
                              className="form-control"
                              name="notes"
                              rows="4"
                              value={detail?.data?.notes || ""}
                              onChange={handleChange}
                              placeholder="Enter any additional notes here..."
                              disabled={deleteFileModal.loading}
                            />
                          ) : (
                            <div className="p-2 rounded">
                              {detail?.data?.notes || (
                                <span className="text-muted">
                                  No notes available
                                </span>
                              )}
                            </div>
                          )}
                        </Card>
                      </div>

                      <div className="col-12 mt-2">
                        <h5 className="fw-bold px-1 mb-0 text-primary">
                          Quarterly Checks
                        </h5>
                      </div>

                      {renderQuarterSection("q1", "Quarter 1 (Jan-Mar)")}
                      {renderQuarterSection("q2", "Quarter 2 (Apr-Jun)")}
                      {renderQuarterSection("q3", "Quarter 3 (Jul-Sep)")}
                      {renderQuarterSection("q4", "Quarter 4 (Oct-Dec)")}

                      {renderConsentChecklist()}

                      {renderComplianceGuardrails()}

                      {renderTimelineTracking()}

                      {renderFilesSection()}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setIsEdit(false);
                      setDetail(null);
                      setFiles([]);
                    }}
                    disabled={
                      isSaving || detailLoading || deleteFileModal.loading
                    }
                  >
                    {isEdit ? "Cancel" : "Close"}
                  </button>
                  {isEdit && !detailLoading && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={isSaving || deleteFileModal.loading}
                    >
                      {isSaving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteModal.show && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1060,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete Sublease</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        id: null,
                        name: "",
                        loading: false,
                      })
                    }
                    disabled={deleteModal.loading}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete{" "}
                  <strong>{deleteModal.name || "this sublease"}</strong>? This
                  action cannot be undone and will also delete all associated
                  files.
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setDeleteModal({
                        show: false,
                        id: null,
                        name: "",
                        loading: false,
                      })
                    }
                    disabled={deleteModal.loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteModal.loading}
                  >
                    {deleteModal.loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Sublease"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteFileModal.show && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1070,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete File</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setDeleteFileModal({
                        show: false,
                        fileId: null,
                        fileName: "",
                        subleaseId: null,
                        loading: false,
                      })
                    }
                    disabled={deleteFileModal.loading}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete file{" "}
                  <strong>{deleteFileModal.fileName}</strong>? This action
                  cannot be undone.
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setDeleteFileModal({
                        show: false,
                        fileId: null,
                        fileName: "",
                        subleaseId: null,
                        loading: false,
                      })
                    }
                    disabled={deleteFileModal.loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteFile}
                    disabled={deleteFileModal.loading}
                  >
                    {deleteFileModal.loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete File"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
