import React from "react";
import { Edit2, Trash2, Save, X, Split, Loader } from "lucide-react";
import { formatLeaseDate } from "./helper";

export const UnitBlock = ({
  unit,
  editMode,
  mergeMode,
  isSelected,
  isEditing,
  editingUnitData,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onStartSplit,
  onToggleSelect,
  isUpdatingUnitId,
  isDeletingUnitId,
  isSplittingUnitId,
}) => {
  const isOccupied = unit.status === "occupied";
  const isLoading =
    isUpdatingUnitId === unit.id ||
    isDeletingUnitId === unit.id ||
    isSplittingUnitId === unit.id;

  let blockClass = "bs-unit-block";
  if (isOccupied) blockClass += " bs-unit-block--occupied";
  else blockClass += " bs-unit-block--vacant";
  if (mergeMode && isSelected) blockClass += " bs-unit-block--merge-selected";
  else if (mergeMode) blockClass += " bs-unit-block--merge-mode";

  return (
    <div
      className={blockClass}
      style={{ flex: unit.square_footage }}
      onClick={() => mergeMode && !isEditing && onToggleSelect()}
    >
      {isEditing ? (
        <div className="bs-unit-edit-form">
          <input
            className="bs-input"
            placeholder="Tenant name"
            value={editingUnitData.tenant_name || ""}
            onChange={(e) => onEditChange("tenant_name", e.target.value)}
            disabled={isLoading}
          />
          <input
            className="bs-input"
            type="number"
            placeholder="SF"
            value={editingUnitData.square_footage}
            onChange={(e) => onEditChange("square_footage", e.target.value)}
            disabled={isLoading}
          />
          <input
            className="bs-input"
            type="date"
            value={editingUnitData.lease_expiration || ""}
            onChange={(e) => onEditChange("lease_expiration", e.target.value)}
            disabled={isLoading}
          />
          <select
            className="bs-input"
            value={editingUnitData.status}
            onChange={(e) => onEditChange("status", e.target.value)}
            disabled={isLoading}
          >
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>

          <div className="bs-unit-edit-form__row d-flex gap-1 mt-1">
            <button
              className="bs-btn-save"
              onClick={onSaveEdit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size={12} className="spin" />
              ) : (
                <Save size={12} />
              )}
            </button>
            <button
              className="bs-btn-cancel"
              onClick={onCancelEdit}
              disabled={isLoading}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {mergeMode && isSelected && (
            <div className="bs-merge-checkmark">✓</div>
          )}

          {isOccupied ? (
            <>
              <div className="bs-unit-tenant">
                {unit.tenant_name || "Unknown Tenant"}
              </div>
              <div className="bs-unit-detail">
                SF: {unit.square_footage?.toLocaleString()}
                {unit.lease_expiration &&
                  ` | LXD: ${formatLeaseDate(unit.lease_expiration)}`}
              </div>
            </>
          ) : (
            <>
              <div className="bs-unit-vacant-label">VACANT</div>
              {unit.square_footage && (
                <div className="bs-unit-detail">
                  SF: {unit.square_footage.toLocaleString()}
                </div>
              )}
            </>
          )}

          {editMode && !mergeMode && (
            <div
              className="bs-unit-actions"
              role="group"
              aria-label="Unit actions"
            >
              <button
                className="bs-btn-unit-action"
                title="Edit unit"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit();
                }}
                disabled={isLoading}
              >
                <Edit2 size={10} />
              </button>
              <button
                className="bs-btn-unit-action"
                title="Split unit"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartSplit();
                }}
                disabled={isSplittingUnitId === unit.id}
              >
                {isSplittingUnitId === unit.id ? (
                  <Loader size={10} className="spin" />
                ) : (
                  <Split size={10} />
                )}
              </button>
              <button
                className="bs-btn-unit-action bs-btn-unit-action--delete"
                title="Delete unit"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeletingUnitId === unit.id}
              >
                {isDeletingUnitId === unit.id ? (
                  <Loader size={10} className="spin" />
                ) : (
                  <Trash2 size={10} />
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
