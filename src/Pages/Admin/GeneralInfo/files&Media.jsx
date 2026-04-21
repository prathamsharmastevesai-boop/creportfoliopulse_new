import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FloorPlanStackDeleteSubmit,
  UploadfloorStack,
  FloorPlanStackListSubmit,
} from "../../../Networking/Admin/APIs/GeneralinfoApi";
import { ListuserBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import {
  FolderOpen,
  FileText,
  Building2,
  UploadCloud,
  Trash2,
  X,
} from "lucide-react";
import PageHeader from "../../../Component/PageHeader/PageHeader";

const formatBytes = (bytes) => {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString("en-US");
};

const FileCard = ({ file, onDelete }) => (
  <div className="files-media-file-card">
    <button
      className="files-media-delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(file);
      }}
      title="Delete"
    >
      <X size={16} />
    </button>

    <div className="files-media-file-icon-wrap">
      <FileText size={28} strokeWidth={2} />
    </div>

    <div className="files-media-file-name">{file.name}</div>

    <div className="files-media-file-meta">
      {file.size ? `${formatBytes(file.size)} • ` : ""}
      {formatDate(file.uploaded_at || file.date)}
    </div>

    {file.tag && <span className="files-media-file-tag">{file.tag}</span>}
  </div>
);
const UploadModal = ({ onClose, onUpload, loading }) => {
  const [tag, setTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    if (!tag.trim()) {
      toast.error("Tag is required for Floor Plan uploads");
      return;
    }
    onUpload(selectedFile, tag);
  };

  return (
    <div className="files-media-modal-overlay" onClick={onClose}>
      <div className="files-media-modal" onClick={(e) => e.stopPropagation()}>
        <div className="files-media-modal-title">Upload Floor Plan</div>

        <input
          type="text"
          className="files-media-input"
          placeholder="Enter tag (e.g. Floor 3, Suite 200)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />

        <div
          className={`files-media-dropzone${isDragging ? " dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ marginBottom: 8 }}>
            <UploadCloud size={30} strokeWidth={2} />
          </div>
          {selectedFile ? (
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
              {selectedFile.name}
            </p>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                Drag & drop or click to choose
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12 }}>
                PDF, JPG, PNG, GIF, WEBP — up to 30MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            hidden
            onChange={(e) => {
              if (e.target.files[0]) setSelectedFile(e.target.files[0]);
              e.target.value = null;
            }}
          />
        </div>

        <div className="files-media-modal-actions">
          <button className="files-media-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="files-media-confirm-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="files-media-spinner" />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ file, onClose, onConfirm, loading }) => (
  <div className="files-media-modal-overlay" onClick={onClose}>
    <div
      className="files-media-modal"
      style={{ maxWidth: 380 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="files-media-modal-title">Delete File</div>
      <p style={{ fontSize: 14, marginBottom: 24 }}>
        Are you sure you want to delete <strong>{file?.name}</strong>? This
        action cannot be undone.
      </p>
      <div className="files-media-modal-actions">
        <button className="files-media-cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button
          className="files-media-danger-btn"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="files-media-spinner" />
              Deleting…
            </>
          ) : (
            <>
              <Trash2 size={16} style={{ marginRight: 6 }} />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

export const FilesMedia = () => {
  const dispatch = useDispatch();
  const { BuildingList } = useSelector((state) => state.BuildingSlice);

  const [docs, setDocs] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [buildingLoading, setBuildingLoading] = useState(true);
  const category = "floor_plan";

  useEffect(() => {
    const fetchBuildings = async () => {
      setBuildingLoading(true);
      try {
        await dispatch(ListuserBuildingSubmit("building_info")).unwrap();
      } catch (err) {
        console.error("Error fetching buildings:", err);
      } finally {
        setBuildingLoading(false);
      }
    };

    fetchBuildings();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedBuildingId) {
      setDocs([]);
      return;
    }
    fetchData(selectedBuildingId);
  }, [selectedBuildingId]);

  const fetchData = async (buildingId) => {
    setListLoading(true);
    try {
      const res = await dispatch(
        FloorPlanStackListSubmit({ buildingId, category }),
      ).unwrap();
      if (Array.isArray(res)) {
        setDocs(
          res.map((f) => ({
            file_id: f.file_id,
            name: f.original_file_name,
            tag: f.tag || "",
            size: f.file_size,
            uploaded_at: f.uploaded_at || f.created_at,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching floor plan docs:", err);
    } finally {
      setListLoading(false);
    }
  };

  const handleUpload = async (file, tag) => {
    if (file.size > 30 * 1024 * 1024) {
      toast.error("File size must be under 30MB");
      return;
    }
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and image files (JPG, PNG, GIF, WEBP) are allowed");
      return;
    }
    setUploadLoading(true);
    try {
      await dispatch(
        UploadfloorStack({
          file,
          category,
          building_Id: selectedBuildingId,
          tag,
        }),
      ).unwrap();

      setShowUploadModal(false);
      await fetchData(selectedBuildingId);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    setDeleteLoading(true);
    try {
      await dispatch(
        FloorPlanStackDeleteSubmit({ file_id: fileToDelete.file_id }),
      ).unwrap();

      await fetchData(selectedBuildingId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const activeBuilding = (BuildingList || []).find(
    (b) => String(b.id) === String(selectedBuildingId),
  );

  return (
    <>
      <PageHeader
        title="Files & Media"
        className="p-2"
        subtitle="Manage flyers, floor plans, and photos for all portfolio buildings"
        actions={
          <div className="files-media-card-controls p-0 border-0 m-0 shadow-none">
            <select
              className="files-media-select m-0"
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              disabled={buildingLoading}
            >
              {buildingLoading ? (
                <option value="">Loading buildings...</option>
              ) : (BuildingList || []).length === 0 ? (
                <option value="">No buildings available</option>
              ) : (
                <>
                  <option value="">Select Building</option>
                  {(BuildingList || []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.address || `Building #${b.id}`}
                    </option>
                  ))}
                </>
              )}
            </select>

            <button
              className={`files-media-upload-btn m-0${!selectedBuildingId || buildingLoading ? " disabled" : ""}`}
              disabled={!selectedBuildingId || buildingLoading}
              onClick={() => setShowUploadModal(true)}
            >
              <span style={{ fontSize: 16 }}>+</span> Upload Files
            </button>
          </div>
        }
      />
      <div className="files-media-page">
        <div className="files-media-card">
          <div className="files-media-card-header">
            <div className="files-media-card-title-row">
              <FolderOpen size={24} strokeWidth={2} />
              <h2 className="files-media-card-title">Document Repository</h2>
              {selectedBuildingId && (
                <span className="files-media-badge">{docs.length} files</span>
              )}
            </div>
          </div>

          {!selectedBuildingId ? (
            <div className="files-media-select-prompt">
              <div style={{ marginBottom: 10 }}>
                <Building2 size={38} strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
                Select a building to view its files
              </p>
              <p style={{ fontSize: 13, marginTop: 6 }}>
                Use the dropdown above to choose a building
              </p>
            </div>
          ) : listLoading ? (
            <div className="files-media-empty-state">
              <p>Loading files…</p>
            </div>
          ) : docs.length === 0 ? (
            <div className="files-media-empty-state">
              <div style={{ marginBottom: 8 }}>
                <FolderOpen size={36} strokeWidth={2} />
              </div>
              <p style={{ margin: 0, fontWeight: 500 }}>
                No files uploaded yet
              </p>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                Click "Upload Files" to add floor plans for this building
              </p>
            </div>
          ) : (
            <div className="files-media-grid">
              {docs.map((file) => (
                <FileCard
                  key={file.file_id}
                  file={file}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          )}
        </div>

        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
            loading={uploadLoading}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            file={fileToDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setFileToDelete(null);
            }}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        )}
      </div>
    </>
  );
};

export default FilesMedia;
