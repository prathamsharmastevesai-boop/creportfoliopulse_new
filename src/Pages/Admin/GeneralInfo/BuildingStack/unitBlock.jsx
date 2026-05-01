import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Split, Check, Loader } from "lucide-react";
import { fmt } from "./helper";
import { capitalFunction } from "../../../../Component/capitalLetter";

function useBreakpoint() {
  const getBreakpoint = (w) => {
    if (w < 576) return "xs";
    if (w < 768) return "sm";
    if (w < 992) return "md";
    if (w < 1200) return "lg";
    return "xl";
  };

  const [bp, setBp] = useState(() =>
    typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "xl",
  );

  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
}

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

  const bp = useBreakpoint();

  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";
  const isDesktop = bp === "lg" || bp === "xl";

  const showFullHoverCard = isDesktop;
  const showTrimmedHoverCard = isTablet;

  const iconSize = isMobile ? 9 : 10;

  const editFormStyle = isMobile
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }
    : {};

  const tenantStyle = isMobile
    ? {
        fontSize: "11px",
        fontWeight: 700,
        color: "#ffffff",
        whiteSpace: "nowrap",
        maxWidth: "90px",
      }
    : {};

  return (
    <div
      className={`bs-unit-block
        ${isOccupied ? "bs-unit-block--occupied" : "bs-unit-block--vacant"}
        ${isSelected ? "bs-unit-block--merge-selected" : ""}
        ${mergeMode ? "bs-unit-block--merge-mode" : ""}
        ${isEditing ? "bs-unit-block--editing" : ""}
      `}
      onClick={mergeMode ? onToggleSelect : undefined}
    >
      <div className="bs-unit-block__top" />
      <div className="bs-unit-block__side" />
      <div className="bs-unit-block__glow" />

      <div className="bs-unit-block__front">
        {isLoading ? (
          <Loader
            size={isMobile ? 12 : 14}
            className="spin"
            style={{ color: "#fff", margin: "auto" }}
          />
        ) : !isEditing ? (
          <>
            {isOccupied ? (
              <>
                <div className="bs-unit-tenant" style={tenantStyle}>
                  {capitalFunction(unit.tenant_name || "—")}
                </div>

                <div className="bs-unit-detail">
                  {unit.suite ? `Suite ${unit.suite}` : "Unit"}&bull;{" "}
                  {(unit.square_footage || unit.rsf || 0).toLocaleString()} SF
                </div>
              </>
            ) : (
              <>
                <div
                  className="bs-unit-vacant-label"
                  style={
                    isMobile
                      ? { fontSize: "11px", letterSpacing: "0.05em" }
                      : {}
                  }
                >
                  VACANT
                </div>
                <div className="bs-unit-detail">
                  {(unit.square_footage || unit.rsf || 0).toLocaleString()} SF
                </div>
              </>
            )}
          </>
        ) : (
          <div className="bs-unit-edit-form">
            <div style={editFormStyle}>
              <input
                className="bs-input"
                placeholder="Tenant name"
                value={editingUnitData?.tenant_name || ""}
                onChange={(e) => onEditChange("tenant_name", e.target.value)}
                style={isMobile ? { fontSize: "11px", padding: "4px 6px" } : {}}
              />
              <input
                className="bs-input"
                type="number"
                placeholder="Sq. ft."
                value={editingUnitData?.square_footage || ""}
                onChange={(e) => onEditChange("square_footage", e.target.value)}
                style={isMobile ? { fontSize: "11px", padding: "4px 6px" } : {}}
              />
            </div>

            <input
              className="bs-input"
              type="date"
              placeholder="Lease expiration"
              value={editingUnitData?.lease_expiration || ""}
              onChange={(e) => onEditChange("lease_expiration", e.target.value)}
              style={isMobile ? { fontSize: "11px", padding: "4px 6px" } : {}}
            />
            <select
              className="bs-input"
              value={editingUnitData?.status || "vacant"}
              onChange={(e) => onEditChange("status", e.target.value)}
              style={isMobile ? { fontSize: "11px", padding: "4px 6px" } : {}}
            >
              <option value="occupied">Occupied</option>
              <option value="vacant">Vacant</option>
            </select>

            <div className="bs-unit-edit-form__row">
              <button
                className="bs-btn-save"
                onClick={onSaveEdit}
                disabled={isUpdatingUnitId === unit.id}
                style={isMobile ? { padding: "4px 8px", fontSize: "11px" } : {}}
              >
                {isUpdatingUnitId === unit.id ? (
                  <Loader size={isMobile ? 10 : 12} className="spin" />
                ) : (
                  <Check size={isMobile ? 10 : 12} />
                )}
              </button>
              <button
                className="bs-btn-cancel"
                onClick={onCancelEdit}
                style={isMobile ? { padding: "4px 8px", fontSize: "11px" } : {}}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div
          className="bs-merge-checkmark"
          style={
            isMobile
              ? { width: "18px", height: "18px", top: "-4px", left: "-4px" }
              : {}
          }
        >
          <Check size={isMobile ? 8 : 10} />
        </div>
      )}

      {editMode && !isEditing && !mergeMode && (
        <div
          className="bs-unit-actions"
          style={
            isMobile || isTablet ? { opacity: 1, pointerEvents: "all" } : {}
          }
        >
          <button
            className="bs-btn-unit-action"
            title={isDesktop ? "Edit" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit(unit);
            }}
          >
            <Edit2 size={iconSize} />
          </button>

          {!(bp === "xs") && (
            <button
              className="bs-btn-unit-action"
              title={isDesktop ? "Split" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                onStartSplit(unit);
              }}
            >
              <Split size={iconSize} />
            </button>
          )}

          <button
            className="bs-btn-unit-action bs-btn-unit-action--delete"
            title={isDesktop ? "Delete" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(unit.id);
            }}
            disabled={isDeletingUnitId === unit.id}
          >
            {isDeletingUnitId === unit.id ? (
              <Loader size={iconSize} className="spin" />
            ) : (
              <Trash2 size={iconSize} />
            )}
          </button>
        </div>
      )}

      {!isEditing && (
        <div className="bs-unit-hover-card">
          <div className="bs-unit-hover-title">
            {unit.tenant_name || "Vacant Unit"}
          </div>
          <div className="bs-unit-hover-grid">
            <div>
              <span>Status</span>
              <strong style={{ color: isOccupied ? "#16a34a" : "#f59e0b" }}>
                {(unit.status || "vacant").toUpperCase()}
              </strong>
            </div>
            <div>
              <span>Square Footage</span>
              <strong>
                {(unit.square_footage || unit.rsf || 0).toLocaleString()} SF
              </strong>
            </div>
            {unit.suite && (
              <div>
                <span>Suite</span>
                <strong>{unit.suite}</strong>
              </div>
            )}
            {unit.lease_expiration && (
              <div>
                <span>Lease Expiration</span>
                <strong>{unit.lease_expiration}</strong>
              </div>
            )}

            {(showFullHoverCard || showTrimmedHoverCard) &&
              unit.contact_name && (
                <div>
                  <span>Contact</span>
                  <strong>{unit.contact_name}</strong>
                </div>
              )}
            {showFullHoverCard && unit.contact_email && (
              <div>
                <span>Email</span>
                <strong>{unit.contact_email}</strong>
              </div>
            )}
            {showFullHoverCard && unit.contact_phone && (
              <div>
                <span>Phone</span>
                <strong>{unit.contact_phone}</strong>
              </div>
            )}
            {showFullHoverCard && unit.company_website && (
              <div>
                <span>Website</span>
                <strong>{unit.company_website}</strong>
              </div>
            )}
            {(showFullHoverCard || showTrimmedHoverCard) &&
              unit.latest_update && (
                <div>
                  <span>Last Update</span>
                  <strong>{unit.latest_update}</strong>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
