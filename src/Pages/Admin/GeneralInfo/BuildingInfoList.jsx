import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  DeleteBuilding,
  ListBuildingSubmit,
  CreateBuildingSubmit,
  UpdateBuildingSubmit,
} from "../../../Networking/Admin/APIs/BuildingApi";
import { useDispatch, useSelector } from "react-redux";
import RAGLoader from "../../../Component/Loader";

const DeleteModal = ({ building, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(building.id);
    setDeleting(false);
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-3">
          <i
            className="bi bi-exclamation-triangle-fill text-danger"
            style={{ fontSize: "2.5rem" }}
          ></i>
        </div>
        <h5 className="text-center fw-semibold mb-1">Delete Building?</h5>
        <p className="text-center text-muted small mb-4">
          <strong>{building.address}</strong> will be permanently removed. This
          action cannot be undone.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-secondary btn-sm px-4"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger btn-sm px-4"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BuildingCard = ({
  building,
  cardRef,
  isEditing,
  editAddress,
  editOccupancy,
  editSaving,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onSetEditAddress,
  onSetEditOccupancy,
  onSetEditFile,
  onGoToChat,
  onDeleteClick,
}) => {
  const rawUrl = building.photos?.find((p) => p?.url)?.url;
  const imageUrl = rawUrl || "https://via.placeholder.com/80x80?text=Building";

  const occupancy = Math.min(Math.max(building.current_occupancy || 0, 0), 100);

  const getOccupancyClass = () => {
    if (occupancy > 80) return "occupancy-high";
    if (occupancy > 50) return "occupancy-medium";
    return "occupancy-low";
  };

  return (
    <div ref={cardRef} className="building-card p-3 mb-3 shadow-sm">
      <div className="d-flex gap-3 align-items-start">
        <div className="mobile-col-3">
          <img
            src={imageUrl}
            alt="building"
            className="img-fluid building-img"
          />
          <h6 className="mb-1">{building?.address}</h6>
        </div>

        <div className="flex-grow-1 d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column align-items-center">
            <div className={`occupancy-circle ${getOccupancyClass()}`}>
              {occupancy}%
            </div>
          </div>

          <div className="ms-3 flex-grow-1">
            <div className="building-meta">
              <div className="my-2">
                Square Footage: {building.square_feet || "N/A"}
              </div>
              <div className="my-2">Tenants: {building.tenants || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 border-top pt-3 d-flex flex-wrap gap-2">
          <input
            className="form-control form-control-sm flex-grow-1"
            style={{ minWidth: "160px" }}
            placeholder="Address"
            value={editAddress}
            onChange={(e) => onSetEditAddress(e.target.value)}
          />
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: "110px" }}
            placeholder="Occupancy %"
            min="0"
            max="100"
            value={editOccupancy}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || (Number(v) >= 0 && Number(v) <= 100)) {
                onSetEditOccupancy(v);
              }
            }}
          />
          <input
            type="file"
            className="form-control form-control-sm"
            style={{ maxWidth: "200px" }}
            onChange={(e) => onSetEditFile(e.target.files[0])}
          />
        </div>
      )}

      <div className="d-flex gap-2 mt-3 justify-content-end">
        {isEditing ? (
          <>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onSaveEdit(building.id)}
              disabled={editSaving}
            >
              {editSaving ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <i className="bi bi-check"></i>
              )}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onCancelEdit}
              disabled={editSaving}
            >
              <i className="bi bi-x"></i>
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-light btn-sm"
              onClick={() => onGoToChat(building.id, "floor_plan")}
            >
              <i className="bi bi-image"></i>
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => onGoToChat(building.id, "building_stack")}
            >
              <i className="bi bi-stack"></i>
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => onGoToChat(building.id, "building_info")}
            >
              <i className="bi bi-info-circle"></i>
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => onGoToChat(building.id, "tenant_info")}
            >
              <i className="bi bi-people"></i>
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onStartEdit(building)}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteClick(building)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const BuildingInfoList = () => {
  const { BuildingList } = useSelector((state) => state.BuildingSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [currentOccupancy, setCurrentOccupancy] = useState("");
  const [file, setFile] = useState(null);

  const [editBuildingId, setEditBuildingId] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editOccupancy, setEditOccupancy] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [deleteBuilding, setDeleteBuilding] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      await dispatch(ListBuildingSubmit("BuildingInfo"));
      setLoading(false);
    };
    fetchBuildings();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          card.classList.remove("visible");
          setTimeout(() => {
            card.classList.add("visible");
          }, i * 150);
        }
      });
    }
  }, [BuildingList, searchTerm, loading]);

  const goToChat = (buildingId, category) => {
    if (category === "tenant_info") {
      navigate("/tenant-info-upload", { state: { buildingId, category } });
    } else if (category === "building_stack") {
      navigate("/building-stack-floor", { state: { buildingId, category } });
    } else {
      navigate("/building-info-upload", { state: { buildingId, category } });
    }
  };

  const startEdit = (building) => {
    setEditBuildingId(building.id);
    setEditAddress(building.address || "");
    setEditOccupancy(building.current_occupancy ?? "");
    setEditFile(null);
  };

  const cancelEdit = () => setEditBuildingId(null);

  const handleEditSave = async (buildingId) => {
    if (!editAddress.trim()) return;
    if (
      editOccupancy !== "" &&
      (Number(editOccupancy) < 0 || Number(editOccupancy) > 100)
    ) {
      alert("Occupancy must be between 0 and 100");
      return;
    }
    setEditSaving(true);
    try {
      await dispatch(
        UpdateBuildingSubmit({
          building_id: buildingId,
          address: editAddress,
          category: "BuildingInfo",
          current_occupancy: Number(editOccupancy || 0),
          file: editFile,
        }),
      ).unwrap();
      await dispatch(ListBuildingSubmit("BuildingInfo"));
      setEditBuildingId(null);
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteConfirm = async (buildingId) => {
    try {
      await dispatch(DeleteBuilding(buildingId));
      await dispatch(ListBuildingSubmit("BuildingInfo"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    try {
      await dispatch(
        CreateBuildingSubmit({
          address,
          category: "BuildingInfo",
          current_occupancy: Number(currentOccupancy),
          file,
        }),
      ).unwrap();
      await dispatch(ListBuildingSubmit("BuildingInfo"));
      setAddress("");
      setCurrentOccupancy("");
      setFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuildings = BuildingList.filter((building) => {
    const term = searchTerm.toLowerCase();
    return (
      building.address?.toLowerCase().includes(term) ||
      building.building_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container p-3">
      <h4 className="text-center mb-3">Building Info List</h4>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form onSubmit={handleAddSubmit} className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Occupancy %"
            value={currentOccupancy}
            min="0"
            max="100"
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (Number(value) >= 0 && Number(value) <= 100)
              ) {
                setCurrentOccupancy(value);
              }
            }}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100">Add</button>
        </div>
      </form>

      {loading ? (
        <RAGLoader />
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredBuildings.map((building, index) => (
            <BuildingCard
              key={building.id}
              building={building}
              cardRef={(el) => (cardsRef.current[index] = el)}
              isEditing={editBuildingId === building.id}
              editAddress={editAddress}
              editOccupancy={editOccupancy}
              editSaving={editSaving}
              onStartEdit={startEdit}
              onCancelEdit={cancelEdit}
              onSaveEdit={handleEditSave}
              onSetEditAddress={setEditAddress}
              onSetEditOccupancy={setEditOccupancy}
              onSetEditFile={setEditFile}
              onGoToChat={goToChat}
              onDeleteClick={setDeleteBuilding}
            />
          ))}
        </div>
      )}

      {deleteBuilding && (
        <DeleteModal
          building={deleteBuilding}
          onClose={() => setDeleteBuilding(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};
