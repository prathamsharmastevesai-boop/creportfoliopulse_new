import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Download, Save, X, Loader } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  fetchBuildingDetail,
  addFloor,
  updateFloor,
  deleteFloor,
  addUnit,
  updateUnit,
  deleteUnit,
  splitUnit,
  mergeUnits,
  fetchActivityLog,
  fetchBuildingSummary,
  fetchConflicts,
  exportBuildingPDF,
} from "../../../../Networking/Admin/APIs/buildingStackApi";

import { EMPTY_UNIT } from "./helper";
import { FloorRow } from "./floorRow";
import { ActivityLog } from "./activityLog";
import { SummaryBar } from "./summeryBar";
import { MergeBanner } from "./mergerBanner";
import { SplitUnitModal } from "./splitUnit";
import { ConflictPanel } from "./conflictPanel";
import { BackButton } from "../../../../Component/backButton";
import { ChatBotModal } from "../../../../Component/chatbotModel";
import { toast } from "react-toastify";

export const FloorList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { buildingId } = location.state || {};

  const role = sessionStorage.getItem("role");

  const {
    buildingDetail,
    floors,
    activities,
    summary,
    loading,
    error,
    conflicts,
  } = useSelector((state) => state.buildingStackSlice);

  const [editMode, setEditMode] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState(null);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [addingFloor, setAddingFloor] = useState(false);
  const [updatingFloorId, setUpdatingFloorId] = useState(null);
  const [deletingFloorId, setDeletingFloorId] = useState(null);
  const [addingUnitFloorId, setAddingUnitFloorId] = useState(null);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [deletingUnitId, setDeletingUnitId] = useState(null);
  const [splittingUnitId, setSplittingUnitId] = useState(null);
  const [merging, setMerging] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFloor, setNewFloor] = useState({ floor_number: "", total_rsf: "" });
  const [editingFloor, setEditingFloor] = useState(null);
  const [addingUnitForFloor, setAddingUnitForFloor] = useState(null);
  const [newUnit, setNewUnit] = useState(EMPTY_UNIT);
  const [editingUnit, setEditingUnit] = useState(null);
  const [splittingUnit, setSplittingUnit] = useState(null);
  const [splitSquareFootage, setSplitSquareFootage] = useState("");
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedUnitIds, setSelectedUnitIds] = useState([]);

  useEffect(() => {
    if (buildingId) {
      dispatch(fetchBuildingDetail(buildingId));
      dispatch(fetchActivityLog({ buildingId }));
      dispatch(fetchBuildingSummary(buildingId));
      if (role === "admin") dispatch(fetchConflicts(buildingId));
    }
  }, [dispatch, buildingId]);

  const refreshData = () => {
    dispatch(fetchBuildingDetail(buildingId));
    dispatch(fetchActivityLog({ buildingId }));
    dispatch(fetchBuildingSummary(buildingId));
    if (role === "admin") dispatch(fetchConflicts(buildingId));
  };

  const buildingName = buildingDetail?.address || "BUILDING";

  const displaySummary = summary || {
    total_rsf:
      buildingDetail?.floors?.reduce((s, f) => s + (f.total_rsf || 0), 0) || 0,
    occupied_rsf:
      buildingDetail?.floors?.reduce(
        (s, f) =>
          s +
          (f.units
            ?.filter((u) => u.status === "occupied")
            .reduce((a, u) => a + (u.square_footage || 0), 0) || 0),
        0,
      ) || 0,
  };

  const totalRSF = displaySummary.total_rsf || 0;
  const totalOccupied = displaySummary.occupied_rsf || 0;
  const totalVacant = displaySummary.vacant_rsf ?? totalRSF - totalOccupied;
  const occupancy =
    displaySummary.occupancy_percentage ??
    (totalRSF ? Math.round((totalOccupied / totalRSF) * 100) : 0);
  const conflictCount = Array.isArray(conflicts) ? conflicts.length : 0;

  const handleExportPDF = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const result = await dispatch(exportBuildingPDF(buildingId)).unwrap();
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleAddFloor = async () => {
    if (!newFloor.floor_number || !newFloor.total_rsf) return;
    setAddingFloor(true);
    try {
      await dispatch(
        addFloor({
          buildingId,
          floorData: {
            floor_number: Number(newFloor.floor_number),
            total_rsf: Number(newFloor.total_rsf),
          },
        }),
      ).unwrap();
      refreshData();
      setNewFloor({ floor_number: "", total_rsf: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingFloor(false);
    }
  };

  const handleUpdateFloor = async () => {
    if (!editingFloor) return;
    setUpdatingFloorId(editingFloor.id);
    try {
      await dispatch(
        updateFloor({
          buildingId,
          floorId: editingFloor.id,
          floorData: {
            floor_number: Number(editingFloor.floor_number),
            total_rsf: Number(editingFloor.total_rsf),
            version: editingFloor.version,
          },
        }),
      ).unwrap();
      refreshData();
      setEditingFloor(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingFloorId(null);
    }
  };

  const handleFloorEditChange = (field, value) =>
    setEditingFloor((prev) => ({ ...prev, [field]: value }));

  const handleDeleteFloor = (floor) => setFloorToDelete(floor);
  const confirmDeleteFloor = async () => {
    if (!floorToDelete) return;
    setDeletingFloorId(floorToDelete.id);
    try {
      await dispatch(
        deleteFloor({ buildingId, floorId: floorToDelete.id }),
      ).unwrap();
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingFloorId(null);
      setFloorToDelete(null);
    }
  };

  const validateUnitData = (unit) => {
    const errors = {};

    if (
      unit.contact_name &&
      !/^[a-zA-Z\s'-]{2,50}$/.test(unit.contact_name.trim())
    ) {
      errors.contact_name = "Name must be 2–50 characters (letters only).";
    }

    if (
      unit.contact_phone &&
      !/^\+?[\d\s\-().]{7,15}$/.test(unit.contact_phone.trim())
    ) {
      errors.contact_phone = "Enter a valid phone number (7–15 digits).";
    }

    if (
      unit.company_website &&
      !/^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/.test(
        unit.company_website.trim(),
      )
    ) {
      errors.company_website = "Enter a valid website URL.";
    }

    return errors;
  };

  const handleAddUnit = async (floorId) => {
    if (!newUnit.square_footage) return;

    const errors = validateUnitData(newUnit);
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors).join("\n"));
      return;
    }

    setAddingUnitFloorId(floorId);
    try {
      await dispatch(
        addUnit({
          floorId,
          unitData: {
            tenant_name: newUnit.tenant_name || "",
            square_footage: Number(newUnit.square_footage),
            lease_expiration: newUnit.lease_expiration || null,
            status: newUnit.status,
            block_order: Number(newUnit.block_order) || 0,
            company_website: newUnit.company_website || "",
            contact_name: newUnit.contact_name || "",
            contact_email: newUnit.contact_email || "",
            contact_phone: newUnit.contact_phone || "",
            latest_update: newUnit.latest_update || "",
          },
        }),
      ).unwrap();
      refreshData();
      setAddingUnitForFloor(null);
      setNewUnit(EMPTY_UNIT);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingUnitFloorId(null);
    }
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;

    const errors = validateUnitData(editingUnit.unit);
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors).join("\n"));
      return;
    }

    setUpdatingUnitId(editingUnit.unit.id);
    try {
      await dispatch(
        updateUnit({
          unitId: editingUnit.unit.id,
          unitData: {
            tenant_name: editingUnit.unit.tenant_name || "",
            square_footage: Number(editingUnit.unit.square_footage),
            lease_expiration: editingUnit.unit.lease_expiration || null,
            status: editingUnit.unit.status,
            block_order: Number(editingUnit.unit.block_order) || 0,
            version: editingUnit.unit.version,
            company_website: editingUnit.unit.company_website || "",
            contact_name: editingUnit.unit.contact_name || "",
            contact_email: editingUnit.unit.contact_email || "",
            contact_phone: editingUnit.unit.contact_phone || "",
            latest_update: editingUnit.unit.latest_update || "",
          },
        }),
      ).unwrap();
      refreshData();
      setEditingUnit(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingUnitId(null);
    }
  };

  const handleUnitEditChange = (field, value) =>
    setEditingUnit((prev) => ({
      ...prev,
      unit: { ...prev.unit, [field]: value },
    }));
  const handleDeleteUnit = (unitId) => setUnitToDelete(unitId);

  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;
    setDeletingUnitId(unitToDelete);
    try {
      await dispatch(deleteUnit({ unitId: unitToDelete })).unwrap();
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingUnitId(null);
      setUnitToDelete(null);
    }
  };

  const handleNewUnitChange = (field, value) =>
    setNewUnit((prev) => ({ ...prev, [field]: value }));

  const handleSplitUnit = async () => {
    if (!splittingUnit || !splitSquareFootage) return;

    const sfA = Number(splitSquareFootage);
    const total = splittingUnit.unit.square_footage;
    const sfB = total - sfA;

    if (!sfA || sfA <= 0 || sfA >= total) return;

    setSplittingUnitId(splittingUnit.unit.id);

    try {
      await dispatch(
        splitUnit({
          unitId: splittingUnit.unit.id,
          splitData: {
            sf_a: sfA,
            sf_b: sfB,
          },
        }),
      ).unwrap();

      refreshData();
      setSplittingUnit(null);
      setSplitSquareFootage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSplittingUnitId(null);
    }
  };

  const toggleUnitSelection = (unitId) => {
    setSelectedUnitIds((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : prev.length < 2
          ? [...prev, unitId]
          : prev,
    );
  };

  const handleConfirmMerge = async () => {
    if (selectedUnitIds.length !== 2) return;
    setMerging(true);
    try {
      await dispatch(
        mergeUnits({
          unit_id_a: selectedUnitIds[0],
          unit_id_b: selectedUnitIds[1],
        }),
      ).unwrap();
      refreshData();
      setMergeMode(false);
      setSelectedUnitIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <header className="bs-topbar d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2">
          <div className="d-flex align-items-center">
            <BackButton />
          </div>
        </header>
        <div className="bs-loading">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <header className="bs-topbar d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2">
          <BackButton />
        </header>
        <div className="bs-error">Error loading building data.</div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bs-topbar d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2">
        <div className="d-flex align-items-center">
          <BackButton />
          <h1 className="bs-topbar__title">{buildingName}</h1>
        </div>
        <ChatBotModal buildingId={buildingId} />
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div className="bs-toggle-group">
            <span className="bs-toggle-label">
              {editMode ? "EDIT" : "VIEW"}
            </span>
            <button
              className={`bs-toggle ${editMode ? "bs-edit-mode" : ""}`}
              onClick={() => {
                setEditMode((m) => !m);
                setMergeMode(false);
                setSelectedUnitIds([]);
              }}
              aria-label="Toggle edit mode"
            >
              <span
                className="bs-toggle__knob"
                style={{ left: editMode ? 25 : 3 }}
              />
            </button>
          </div>

          {editMode && (
            <button className="bs-btn-edit-changes">SAVE CHANGES</button>
          )}

          {role === "admin" && (
            <button
              className={`bs-btn-conflicts ${showConflicts ? "bs-btn-conflicts--active" : ""}`}
              onClick={() => setShowConflicts((v) => !v)}
            >
              <span className="bs-btn-conflicts__text">CONFLICTS</span>
              {conflictCount > 0 && (
                <span className="bs-btn-conflicts__badge">{conflictCount}</span>
              )}
            </button>
          )}

          <button
            className="bs-btn-export"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? (
              <Loader size={14} className="spin" />
            ) : (
              <Download size={14} />
            )}
            <span className="bs-btn-export-text ms-1">EXPORT</span>
          </button>
        </div>
      </header>

      <div className="flex-grow-1 px-3 px-md-4 py-3">
        <div className="row g-3 align-items-start">
          <div className="col-12 col-lg-9">
            {mergeMode && (
              <MergeBanner
                selectedCount={selectedUnitIds.length}
                onConfirm={handleConfirmMerge}
                onCancel={() => {
                  setMergeMode(false);
                  setSelectedUnitIds([]);
                }}
                isMerging={merging}
              />
            )}

            {editMode && (
              <div className="mb-3">
                {!showAddForm ? (
                  <button
                    className="bs-btn-add-floor"
                    onClick={() => setShowAddForm(true)}
                    disabled={addingFloor}
                  >
                    {addingFloor ? (
                      <Loader size={14} className="spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Add Floor
                  </button>
                ) : (
                  <div className="bs-add-card">
                    <input
                      className="bs-input"
                      type="number"
                      placeholder="Floor Number"
                      value={newFloor.floor_number}
                      onChange={(e) =>
                        setNewFloor((p) => ({
                          ...p,
                          floor_number: e.target.value,
                        }))
                      }
                      disabled={addingFloor}
                    />
                    <input
                      className="bs-input"
                      type="number"
                      placeholder="Total RSF"
                      value={newFloor.total_rsf}
                      onChange={(e) =>
                        setNewFloor((p) => ({
                          ...p,
                          total_rsf: e.target.value,
                        }))
                      }
                      disabled={addingFloor}
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="bs-btn-save"
                        onClick={handleAddFloor}
                        disabled={addingFloor}
                      >
                        {addingFloor ? (
                          <Loader size={14} className="spin" />
                        ) : (
                          <Save size={14} />
                        )}
                      </button>
                      <button
                        className="bs-btn-cancel"
                        onClick={() => setShowAddForm(false)}
                        disabled={addingFloor}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {floors?.map((floor) => (
              <FloorRow
                key={floor.id}
                floor={floor}
                editMode={editMode}
                mergeMode={mergeMode}
                selectedUnitIds={selectedUnitIds}
                isEditingFloor={editingFloor?.id === floor.id}
                editingFloorData={
                  editingFloor?.id === floor.id ? editingFloor : floor
                }
                onFloorEditChange={handleFloorEditChange}
                onSaveFloor={handleUpdateFloor}
                onCancelFloor={() => setEditingFloor(null)}
                onStartEditFloor={() => setEditingFloor({ ...floor })}
                onDeleteFloor={() => handleDeleteFloor(floor)}
                editingUnit={
                  editingUnit?.floorId === floor.id ? editingUnit : null
                }
                onUnitEditChange={handleUnitEditChange}
                onSaveUnit={handleUpdateUnit}
                onCancelUnit={() => setEditingUnit(null)}
                onStartEditUnit={(unit, floorId) =>
                  setEditingUnit({ unit: { ...unit }, floorId })
                }
                onDeleteUnit={handleDeleteUnit}
                onStartSplitUnit={(unit, floorId) => {
                  setSplittingUnit({ unit, floorId });
                  setSplitSquareFootage("");
                }}
                onToggleUnitSelect={toggleUnitSelection}
                addingUnitForFloor={addingUnitForFloor}
                newUnit={newUnit}
                onNewUnitChange={handleNewUnitChange}
                onSaveNewUnit={handleAddUnit}
                onCancelNewUnit={() => {
                  setAddingUnitForFloor(null);
                  setNewUnit(EMPTY_UNIT);
                }}
                onStartAddUnit={setAddingUnitForFloor}
                onStartMerge={() => {
                  setMergeMode(true);
                  setSelectedUnitIds([]);
                }}
                isAddingFloor={addingFloor}
                isUpdatingFloorId={updatingFloorId}
                isDeletingFloorId={deletingFloorId}
                isAddingUnitFloorId={addingUnitFloorId}
                isUpdatingUnitId={updatingUnitId}
                isDeletingUnitId={deletingUnitId}
                isSplittingUnitId={splittingUnitId}
                isMerging={merging}
              />
            ))}
          </div>

          <div className="col-12 col-lg-3">
            <ActivityLog activities={activities} buildingId={buildingId} />
          </div>
        </div>
      </div>

      <SummaryBar
        totalRSF={totalRSF}
        totalOccupied={totalOccupied}
        totalVacant={totalVacant}
        occupancy={occupancy}
      />

      <SplitUnitModal
        splittingUnit={splittingUnit}
        splitSquareFootage={splitSquareFootage}
        onChangeSF={setSplitSquareFootage}
        onConfirm={handleSplitUnit}
        onCancel={() => {
          setSplittingUnit(null);
          setSplitSquareFootage("");
        }}
        isSplitting={splittingUnitId !== null}
      />

      {showConflicts && (
        <ConflictPanel
          buildingId={buildingId}
          onClose={() => setShowConflicts(false)}
          onResolved={refreshData}
        />
      )}

      {floorToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "var(--bs-modal-bg)",
                border: "1px solid var(--bs-modal-border)",
                color: "var(--text-primary)",
              }}
            >
              <div
                className="modal-header"
                style={{ borderColor: "var(--border-color)" }}
              >
                <h5 className="modal-title">Delete Floor</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setFloorToDelete(null)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete Floor{" "}
                {floorToDelete.floor_number}?
              </div>
              <div
                className="modal-footer"
                style={{ borderColor: "var(--border-color)" }}
              >
                <button
                  className="bs-btn-cancel"
                  onClick={() => setFloorToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="bs-btn-delete"
                  onClick={confirmDeleteFloor}
                  disabled={deletingFloorId === floorToDelete.id}
                >
                  {deletingFloorId === floorToDelete.id ? (
                    <Loader size={14} className="spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {unitToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "var(--bs-modal-bg)",
                border: "1px solid var(--bs-modal-border)",
                color: "var(--text-primary)",
              }}
            >
              <div
                className="modal-header"
                style={{ borderColor: "var(--border-color)" }}
              >
                <h5 className="modal-title">Delete Unit</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setUnitToDelete(null)}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete this unit?
              </div>
              <div
                className="modal-footer"
                style={{ borderColor: "var(--border-color)" }}
              >
                <button
                  className="bs-btn-cancel"
                  onClick={() => setUnitToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="bs-btn-delete"
                  onClick={confirmDeleteUnit}
                  disabled={deletingUnitId === unitToDelete}
                >
                  {deletingUnitId === unitToDelete ? (
                    <Loader size={14} className="spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
