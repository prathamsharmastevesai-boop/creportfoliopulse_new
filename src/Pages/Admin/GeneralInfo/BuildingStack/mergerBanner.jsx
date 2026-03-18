import React from "react";
import { Merge, X, Loader } from "lucide-react";

export const MergeBanner = ({
  selectedCount,
  onConfirm,
  onCancel,
  isMerging,
}) => (
  <div className="bs-merge-banner mb-2">
    <span>Select two units to merge ({selectedCount}/2 selected)</span>

    <div className="bs-merge-banner__actions d-flex align-items-center gap-2">
      <button
        className="bs-btn-save"
        style={{ opacity: selectedCount === 2 ? 1 : 0.5 }}
        onClick={onConfirm}
        disabled={selectedCount !== 2 || isMerging}
      >
        {isMerging ? (
          <Loader size={13} className="spin me-1" />
        ) : (
          <Merge size={13} className="me-1" />
        )}
        Confirm Merge
      </button>

      <button className="bs-btn-cancel" onClick={onCancel} disabled={isMerging}>
        <X size={13} />
      </button>
    </div>
  </div>
);
