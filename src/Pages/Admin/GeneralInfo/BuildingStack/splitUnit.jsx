import React from "react";
import { Loader } from "lucide-react";

export const SplitUnitModal = ({
  splittingUnit,
  splitSquareFootage,
  onChangeSF,
  onConfirm,
  onCancel,
  isSplitting,
}) => {
  if (!splittingUnit) return null;

  const origSF = splittingUnit.unit.square_footage;
  const newSF = Number(splitSquareFootage);
  const previewValid = newSF > 0 && newSF < origSF;

  return (
    <div
      className="bs-modal-overlay"
      onClick={isSplitting ? undefined : onCancel}
    >
      <div className="bs-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="bs-modal__title">Split Unit</h3>

        <p className="bs-modal__subtitle">
          Original SF: <strong>{origSF.toLocaleString()}</strong>
          {splittingUnit.unit.tenant_name &&
            ` · ${splittingUnit.unit.tenant_name}`}
        </p>

        <label className="bs-modal__label">
          SF for the new (split-off) unit:
        </label>

        <input
          type="number"
          className="bs-input bs-modal__input"
          value={splitSquareFootage}
          onChange={(e) => onChangeSF(e.target.value)}
          placeholder={`1 – ${origSF - 1}`}
          autoFocus
          disabled={isSplitting}
        />

        {previewValid && (
          <p className="bs-modal__preview">
            Result: {(origSF - newSF).toLocaleString()} SF{" + "}
            {newSF.toLocaleString()} SF (new vacant)
          </p>
        )}

        <div className="bs-modal__actions d-flex gap-2 mt-1">
          <button
            className="bs-btn-save"
            onClick={onConfirm}
            disabled={!previewValid || isSplitting}
          >
            {isSplitting ? <Loader size={14} className="spin" /> : "Split"}
          </button>
          <button
            className="bs-btn-cancel"
            onClick={onCancel}
            disabled={isSplitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
