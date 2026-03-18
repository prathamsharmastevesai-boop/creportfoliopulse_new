import React from "react";
import { Edit2, Trash2, Save, X, Plus, Merge, Loader } from "lucide-react";
import { fmt } from "./helper";
import { UnitBlock } from "./unitBlock";
import { UnitFormInline } from "./unitforminline";

export const FloorRow = ({
  floor,
  editMode,
  mergeMode,
  selectedUnitIds,
  isEditingFloor,
  editingFloorData,
  onFloorEditChange,
  onSaveFloor,
  onCancelFloor,
  onStartEditFloor,
  onDeleteFloor,
  editingUnit,
  onUnitEditChange,
  onSaveUnit,
  onCancelUnit,
  onStartEditUnit,
  onDeleteUnit,
  onStartSplitUnit,
  onToggleUnitSelect,
  addingUnitForFloor,
  newUnit,
  onNewUnitChange,
  onSaveNewUnit,
  onCancelNewUnit,
  onStartAddUnit,
  onStartMerge,
  isAddingFloor,
  isUpdatingFloorId,
  isDeletingFloorId,
  isAddingUnitFloorId,
  isUpdatingUnitId,
  isDeletingUnitId,
  isSplittingUnitId,
  isMerging,
}) => {
  const sortedUnits = [...(floor.units || [])].sort(
    (a, b) => (a.block_order || 0) - (b.block_order || 0),
  );
  const isLoadingFloor =
    isUpdatingFloorId === floor.id || isDeletingFloorId === floor.id;

  return (
    <div className="bs-floor-row">
      <div className="bs-floor-badge flex-shrink-0">
        {isEditingFloor ? (
          <input
            className="bs-input text-center fw-bold"
            style={{ width: 48, fontSize: 18 }}
            value={editingFloorData.floor_number}
            onChange={(e) => onFloorEditChange("floor_number", e.target.value)}
            disabled={isLoadingFloor}
          />
        ) : (
          <span className="bs-floor-num">{floor.floor_number}</span>
        )}
      </div>

      <div className="bs-floor-meta flex-shrink-0 d-none d-sm-flex">
        <span className="bs-floor-meta__label">FLOOR {floor.floor_number}</span>
        <span className="bs-floor-meta__sub">
          {isEditingFloor ? (
            <input
              className="bs-input"
              style={{ width: 90 }}
              type="number"
              value={editingFloorData.total_rsf}
              onChange={(e) => onFloorEditChange("total_rsf", e.target.value)}
              disabled={isLoadingFloor}
            />
          ) : (
            `RSF: ${fmt(floor.total_rsf)}`
          )}
        </span>
      </div>

      <div className="bs-units-area flex-grow-1 min-w-0">
        {sortedUnits.length > 0 ? (
          sortedUnits.map((unit) => (
            <UnitBlock
              key={unit.id}
              unit={unit}
              editMode={editMode}
              mergeMode={mergeMode}
              isSelected={selectedUnitIds.includes(unit.id)}
              isEditing={editingUnit?.unit.id === unit.id}
              editingUnitData={
                editingUnit?.unit.id === unit.id ? editingUnit.unit : unit
              }
              onEditChange={onUnitEditChange}
              onSaveEdit={onSaveUnit}
              onCancelEdit={onCancelUnit}
              onStartEdit={() => onStartEditUnit(unit, floor.id)}
              onDelete={() => onDeleteUnit(unit.id)}
              onStartSplit={() => onStartSplitUnit(unit, floor.id)}
              onToggleSelect={() => onToggleUnitSelect(unit.id)}
              isUpdatingUnitId={isUpdatingUnitId}
              isDeletingUnitId={isDeletingUnitId}
              isSplittingUnitId={isSplittingUnitId}
            />
          ))
        ) : (
          <div className="bs-unit-block bs-unit-block--no-units">
            <div className="bs-unit-vacant-label">NO UNITS</div>
            <div className="bs-unit-detail">
              Total RSF: {floor.total_rsf?.toLocaleString()} SF
            </div>
          </div>
        )}

        {editMode && addingUnitForFloor === floor.id && (
          <UnitFormInline
            unit={newUnit}
            onChange={onNewUnitChange}
            onSave={() => onSaveNewUnit(floor.id)}
            onCancel={onCancelNewUnit}
            isSaving={isAddingUnitFloorId === floor.id}
          />
        )}
      </div>

      {editMode && (
        <div className="bs-floor-actions flex-shrink-0">
          {isEditingFloor ? (
            <>
              <button
                className="bs-btn-save"
                onClick={onSaveFloor}
                disabled={isLoadingFloor || isAddingFloor}
                title="Save floor"
              >
                {isLoadingFloor ? (
                  <Loader size={14} className="spin" />
                ) : (
                  <Save size={14} />
                )}
              </button>
              <button
                className="bs-btn-cancel"
                onClick={onCancelFloor}
                disabled={isLoadingFloor}
                title="Cancel"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                className="bs-btn-edit"
                onClick={onStartEditFloor}
                disabled={isLoadingFloor}
                title="Edit floor"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="bs-btn-delete"
                onClick={onDeleteFloor}
                disabled={isDeletingFloorId === floor.id}
                title="Delete floor"
              >
                {isDeletingFloorId === floor.id ? (
                  <Loader size={14} className="spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </>
          )}

          {!mergeMode && addingUnitForFloor !== floor.id && (
            <button
              className="bs-btn-add-unit"
              title="Add unit"
              onClick={() => onStartAddUnit(floor.id)}
              disabled={isAddingUnitFloorId === floor.id}
            >
              {isAddingUnitFloorId === floor.id ? (
                <Loader size={14} className="spin" />
              ) : (
                <Plus size={14} />
              )}
            </button>
          )}

          {!mergeMode && (
            <button
              className="bs-btn-merge"
              title="Merge units"
              onClick={onStartMerge}
              disabled={isMerging}
            >
              {isMerging ? (
                <Loader size={14} className="spin" />
              ) : (
                <Merge size={14} />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
