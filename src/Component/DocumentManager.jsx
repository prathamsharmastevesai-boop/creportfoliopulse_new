import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  GeneralInfoSubmit,
  UploadGeneralDocSubmit,
  UploadfloorStack,
  FloorPlanStackListSubmit,
  FloorPlanStackDeleteSubmit,
} from "../Networking/Admin/APIs/GeneralinfoApi";
import { DeleteDocSubmit } from "../Networking/Admin/APIs/UploadDocApi";
import { toast } from "react-toastify";
import RAGLoader from "./Loader";
import { BackButton } from "./backButton";
import Pagination from "./pagination";
import Card from "./Card/Card";
import PageHeader from "./PageHeader/PageHeader";
import ConfirmDeleteModal from "./confirmDeleteModal";

const DocumentManager = ({ category, title, description, building_Id }) => {
  const dispatch = useDispatch();
  const [docs, setDocs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [tag, setTag] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageLoader, setPageLoader] = useState(false);

  const indexOfLastDoc = currentPage * itemsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - itemsPerPage;

  const isFloorPlanCategory = ["floor_plan", "building_stack", "LOI"].includes(
    category,
  );

  const fetchData = async () => {
    setPageLoader(true);
    try {
      const res = await dispatch(
        isFloorPlanCategory
          ? FloorPlanStackListSubmit({ buildingId: building_Id, category })
          : GeneralInfoSubmit({ buildingId: building_Id, category }),
      ).unwrap();

      if (Array.isArray(res)) {
        setDocs(
          res.map((f) => ({
            file_id: f.file_id,
            name: f.original_file_name,
            tag: f.tag || "",
          })),
        );
      }
    } catch (err) {
      console.error(`Error fetching ${category} docs:`, err);
    } finally {
      setPageLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, category]);

  const uploadFile = async (file) => {
    if ((category === "floor_plan" || category === "LOI") && !tag?.trim()) {
      toast.error("Tag is required for Floor Plan/LOI uploads");
      return;
    }

    const isFloorPlanOrStack =
      category === "floor_plan" ||
      category === "building_stack" ||
      category === "LOI";

    const allowedTypes = isFloorPlanOrStack
      ? [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
      : [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        isFloorPlanOrStack
          ? "Only PDF, DOC/DOCX and image files (JPG, PNG, GIF, WEBP) are allowed for this category"
          : "Only PDF, DOCX, XLSX, and CSV files are allowed",
      );
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }

    setPageLoader(true);
    try {
      if (isFloorPlanOrStack) {
        await dispatch(
          UploadfloorStack({
            file,
            category,
            building_Id,
            tag:
              category === "floor_plan" || category === "LOI" ? tag : undefined,
          }),
        ).unwrap();
      } else {
        await dispatch(
          UploadGeneralDocSubmit({ file, category, building_Id }),
        ).unwrap();
      }
      setTag("");
      await fetchData();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setPageLoader(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
    e.target.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    setDeleteLoading(true);
    try {
      await dispatch(
        isFloorPlanCategory
          ? FloorPlanStackDeleteSubmit({ file_id: fileToDelete.file_id })
          : DeleteDocSubmit({ file_id: fileToDelete.file_id, category }),
      ).unwrap();
      await fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const filteredDocs = docs.filter((d) =>
    d.tag.toLowerCase().includes(tagSearch.toLowerCase()),
  );
  const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);

  return (
    <div className="container-fluid p-2 px-md-4 position-relative min-vh-100">
      <PageHeader
        backButton={<BackButton className="flex-shrink-0" />}
        title={title}
        subtitle={description}
      />

      {(category === "floor_plan" || category === "LOI") && (
        <div className="mb-3 d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder={
              category === "floor_plan"
                ? "Enter tag for Floor Plan"
                : "Enter tag by Suite Number"
            }
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
      )}

      <div
        className={`border border-2 rounded-3 p-3 text-center w-100 ${isDragging ? "border-primary" : "border-dashed"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i className="bi bi-upload fs-1 text-primary"></i>
        <h6 className="fw-semibold mt-3">Upload Documents</h6>
        <p className="text-muted mb-3">
          Drag and drop files here, or click to select files
        </p>

        <label className="btn btn-outline-primary">
          <i className="bi bi-file-earmark-arrow-up me-1"></i> Choose Files
          <input
            type="file"
            accept={
              category === "LOI"
                ? ".doc,.docx,.pdf"
                : category === "floor_plan" || category === "building_stack"
                  ? ".pdf,.jpg,.jpeg,.png,.gif,.webp"
                  : ".pdf,.csv,.docx,.xlsx"
            }
            onChange={handleFileChange}
            hidden
          />
        </label>

        <p className="small text-muted mt-2 text-wrap">
          Supports{" "}
          {category === "LOI"
            ? "DOC, DOCX, PDF"
            : category === "floor_plan" || category === "building_stack"
              ? "PDF and image files (JPG, PNG, GIF, WEBP)"
              : "PDF, DOCX, CSV, XLSX"}{" "}
          up to 30MB
        </p>
      </div>

      <Card
        className="mt-4"
        title="Uploaded Documents"
        variant="elevated"
        noPadding
        headerAction={
          (category === "floor_plan" || category === "LOI") && (
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: "300px" }}
              placeholder="Search by Tag Name"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
          )
        }
      >
        <ul className="list-group list-group-flush">
          {currentDocs.length === 0 && (
            <li className="list-group-item text-muted text-center py-4">
              No documents uploaded yet.
            </li>
          )}

          {currentDocs.map((file) => (
            <li
              key={file.file_id}
              className="list-group-item d-flex justify-content-between align-items-center py-3"
            >
              <div
                className="d-flex align-items-center text-truncate me-2"
                style={{ maxWidth: "80%" }}
              >
                <i className="bi bi-file-earmark-text text-primary fs-5 me-3"></i>
                <div className="d-flex flex-column min-w-0">
                  <span className="text-truncate fw-medium">{file.name}</span>
                  {file.tag && (
                    <span
                      className="badge text-secondary align-self-start mt-1"
                      style={{
                        fontSize: "0.7rem",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {file.tag}
                    </span>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-link text-danger p-0 border-0"
                  onClick={() => openDeleteModal(file)}
                  title="Delete document"
                >
                  <i className="bi bi-trash fs-5"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredDocs.length > 0 && (
          <div className="px-3 pb-2 pt-1 border-top">
            <Pagination
              totalItems={filteredDocs.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </Card>

      <ConfirmDeleteModal
        show={showDeleteModal}
        selectedEmail={fileToDelete?.name || "this document"}
        deleteLoading={deleteLoading}
        onClose={() => {
          setShowDeleteModal(false);
          setFileToDelete(null);
        }}
        onDelete={confirmDelete}
      />

      {pageLoader && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backdropFilter: "blur(2px)",
            background: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        >
          <RAGLoader />
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
