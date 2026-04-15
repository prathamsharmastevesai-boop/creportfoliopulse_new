import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { diffWords } from "diff";
import RAGLoader from "../../../Component/Loader";
import { useDispatch } from "react-redux";
import {
  DeleteDrafingDoc,
  getMetaData,
  getTextData,
  getTextViewData,
  ListDraftingLeaseDoc,
  UpdateDraftingtext,
  UploadDraftingLeaseDoc,
} from "../../../Networking/Admin/APIs/AiAbstractLeaseAPi";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";
import { capitalFunction } from "../../../Component/capitalLetter";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";

export const LeaseDraftingUpload = () => {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const [updateloading, setUpadteLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState("");

  const [previewLoader, setPreviewLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [metadata, setMetadata] = useState({
    tenant_name: "",
    landlord_name: "",
    property_address: "",
    lease_term: "",
    rent_amount: "",
    square_footage: "",
    commencement_date: "",
    expiration_date: "",
    security_deposit: "",
    use_clause: "",
    tenant_improvements: "",
    additional_terms: "",
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiDraft, submittedFeedback]);

  const fetchDocs = () => {
    setPageLoader(true);

    dispatch(ListDraftingLeaseDoc({ category: "lease_gen" }))
      .unwrap()
      .then((res) => {
        setDocs(res?.files || []);
      })
      .catch((err) => {
        console.error("Failed to fetch lease docs:", err);
      })
      .finally(() => setPageLoader(false));
  };

  useEffect(() => {
    fetchDocs();
  }, [dispatch]);

  const validateAndUploadFile = (file) => {
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      toast.error("Only PDF, DOC, or DOCX files are allowed");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File must be under 30MB");
      return;
    }

    const payload = { file, category: "lease_gen" };
    setPageLoader(true);
    dispatch(UploadDraftingLeaseDoc(payload))
      .unwrap()
      .then(() => fetchDocs())
      .catch((err) => console.error("Upload failed:", err))
      .finally(() => setPageLoader(false));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const handlefilePreview = async (fileId) => {
    try {
      setPreviewLoader(true);

      const data = await dispatch(getTextViewData(fileId)).unwrap();

      setPreviewData(data);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch preview data:", error);
    } finally {
      setPreviewLoader(false);
    }
  };

  const handleDelete = (fileId) => {
    setDeleteId(fileId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      await dispatch(DeleteDrafingDoc({ fileId: deleteId })).unwrap();
      await fetchDocs();

      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGenerateDraft = async (id) => {
    if (!selectedDoc) {
      toast.error("Please select a document first");
      return;
    }

    setLoading(true);
    try {
      const [Metadata, Textdata] = await Promise.all([
        dispatch(getMetaData(id)).unwrap(),
        dispatch(getTextData(id)).unwrap(),
      ]);
      setTimeout(() => {
        setMetadata({
          tenant_name: Metadata.structured_metadata.tenant_name || "",
          landlord_name: Metadata.structured_metadata.landlord_name || "",
          property_address: Metadata.structured_metadata.property_address || "",
          lease_term: Metadata.structured_metadata.lease_term || "",
          rent_amount: Metadata.structured_metadata.rent_amount || "",
          square_footage: Metadata.structured_metadata.square_footage || "",
          commencement_date:
            Metadata.structured_metadata.commencement_date || "",
          expiration_date: Metadata.structured_metadata.expiration_date || "",
          security_deposit: Metadata.structured_metadata.security_deposit || "",
          use_clause: Metadata.structured_metadata.use_clause || "",
          tenant_improvements:
            Metadata.structured_metadata.tenant_improvements || "",
          additional_terms: Metadata.structured_metadata.additional_terms || "",
        });

        setAiDraft(Textdata);
        setEditedDraft(Textdata);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);
    }
  };

  const handleSaveDraft = async (id) => {
    setUpadteLoading(true);
    try {
      const json = {
        file_id: id,
        text: editedDraft,
      };
      await dispatch(UpdateDraftingtext(json)).unwrap();
      setAiDraft(editedDraft);
      setIsEditing(false);
      setShowDiff(false);
    } finally {
      setUpadteLoading(false);
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback) {
      toast.error("Please select thumb before submitting feedback.");
      return;
    }
    setSubmittedFeedback(true);
  };

  const handleDownloadDraft = () => {
    const textToDownload = isEditing ? editedDraft : aiDraft;
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedDoc
      ? `${selectedDoc.original_file_name.replace(/\.[^/.]+$/, "")}_draft.txt`
      : "lease_draft.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDiff = () => {
    const diff = diffWords(aiDraft, editedDraft);
    return (
      <div className="row">
        <div
          className="col-6 border-end pe-3"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <h6 className="fw-semibold text-muted">Original Draft</h6>
          {diff.map((part, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: part.removed ? "#f8d7da" : "transparent",
                textDecoration: part.removed ? "line-through" : "none",
                color: part.removed ? "red" : "inherit",
                padding: "0 2px",
              }}
            >
              {part.removed || !part.added ? part.value : ""}
            </span>
          ))}
        </div>
        <div className="col-6 ps-3" style={{ whiteSpace: "pre-wrap" }}>
          <h6 className="fw-semibold text-muted">Edited Draft</h6>
          {diff.map((part, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: part.added ? "#d4edda" : "transparent",
                color: part.added ? "green" : "inherit",
                padding: "0 2px",
              }}
            >
              {part.added || !part.removed ? part.value : ""}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fuild p-3 position-relative">
      <PageHeader
        title="AI Lease Drafting"
        subtitle="Upload an LOI, review extracted terms, and generate a draft lease automatically"
      />

      <div className="border border-2 rounded-3 py-5 text-center mb-4">
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h6 className="fw-semibold mt-3">Upload Letter of Intent</h6>
        <p className="text-muted mb-3">
          Drag and drop Letter of Intent file here, or click to select file
        </p>
        <label className="btn btn-outline-primary">
          <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose File
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>

      <Card
        className="mb-4"
        title="Uploaded LOI Documents"
        variant="elevated"
        noPadding
      >
        <ul className="list-group list-group-flush">
          {docs.length === 0 && (
            <li className="list-group-item text-muted">
              No documents uploaded yet.
            </li>
          )}
          {docs.map((doc) => (
            <li
              key={doc.file_id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <input
                  type="radio"
                  name="selectedDoc"
                  checked={selectedDoc?.file_id === doc.file_id}
                  onChange={() => setSelectedDoc(doc)}
                  className="me-2"
                />
                {capitalFunction(doc.original_file_name)}{" "}
              </div>
              <div className="d-flex gap-3 align-items-center">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-info"
                  onClick={() => handlefilePreview(doc.file_id)}
                >
                  Preview Draft
                </a>
                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(doc.file_id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
        }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Document Preview</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body" style={{ whiteSpace: "pre-wrap" }}>
              {previewData ? (
                <p>{previewData}</p>
              ) : (
                <p>No preview data available.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary mb-4 d-flex align-items-center justify-content-center gap-2"
        onClick={() => handleGenerateDraft(selectedDoc?.file_id)}
        disabled={!selectedDoc || loading}
        style={{ minWidth: "180px", height: "45px" }}
      >
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cpu fs-5"></i>
            <span className="ai-loader">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>Generating Draft...</span>
          </div>
        ) : (
          <>
            <i className="bi bi-stars fs-5"></i>
            <span>Generate Lease Draft</span>
          </>
        )}
      </button>

      {aiDraft && (
        <Card
          variant="elevated"
          title="AI Drafted Lease"
          headerAction={
            !isEditing ? (
              <i
                className="bi bi-pencil-square text-primary"
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                onClick={() => setIsEditing(true)}
              />
            ) : (
              <div className="d-flex gap-2">
                <i
                  className="bi bi-eye text-info"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  title="Toggle Redline View"
                  onClick={() => setShowDiff(!showDiff)}
                />
                {updateloading ? (
                  <div
                    className="spinner-border spinner-border-sm text-success"
                    role="status"
                  />
                ) : (
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => handleSaveDraft(selectedDoc?.file_id)}
                  />
                )}
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={() => {
                    setIsEditing(false);
                    setShowDiff(false);
                  }}
                />
              </div>
            )
          }
          footer={
            !isEditing && !submittedFeedback ? (
              <>
                <h6 className="fw-semibold mb-2">Provide Feedback</h6>
                <div className="d-flex gap-3 align-items-center mb-3">
                  <i
                    className={`bi bi-hand-thumbs-up-fill ${
                      feedback === "up" ? "text-success" : "text-muted"
                    }`}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() => setFeedback("up")}
                  />
                  <i
                    className={`bi bi-hand-thumbs-down-fill ${
                      feedback === "down" ? "text-danger" : "text-muted"
                    }`}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() => setFeedback("down")}
                  />
                </div>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="Add optional feedback..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={handleSubmitFeedback}
                >
                  Submit Feedback
                </button>
              </>
            ) : submittedFeedback ? (
              <div className="text-success fw-semibold">
                Thank you for your feedback!
              </div>
            ) : null
          }
        >
          <div className="card-body">
            {isEditing ? (
              showDiff ? (
                renderDiff()
              ) : (
                <textarea
                  className="form-control"
                  rows={10}
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                />
              )
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{aiDraft}</div>
            )}
          </div>
          <div ref={bottomRef}></div>
        </Card>
      )}
      {(pageLoader || previewLoader) && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
          style={{
            backdropFilter: "blur(2px)",
            background: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        >
          <RAGLoader />
        </div>
      )}
      <ConfirmDeleteModal
        show={showDeleteModal}
        selectedEmail={selectedDoc?.original_file_name || "this document"}
        deleteLoading={deleteLoading}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        onDelete={confirmDelete}
      />
    </div>
  );
};
