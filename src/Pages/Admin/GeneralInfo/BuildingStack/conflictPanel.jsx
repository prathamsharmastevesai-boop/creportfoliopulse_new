import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";
import {
  fetchConflicts,
  resolveConflict,
} from "../../../../Networking/Admin/APIs/buildingStackApi";

export const ConflictPanel = ({ buildingId, onClose, onResolved }) => {
  const dispatch = useDispatch();
  const { conflicts, conflictsLoading, conflictsError } = useSelector(
    (state) => state.buildingStackSlice,
  );

  const [expandedId, setExpandedId] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolvedIds, setResolvedIds] = useState([]);

  useEffect(() => {
    if (buildingId) dispatch(fetchConflicts(buildingId));
  }, [dispatch, buildingId]);

  const handleResolve = async (conflictId, chosen) => {
    setResolvingId(conflictId);
    try {
      await dispatch(resolveConflict({ conflictId, chosen })).unwrap();
      setResolvedIds((prev) => [...prev, conflictId]);
      onResolved?.();
    } catch (err) {
      console.error("Failed to resolve conflict:", err);
    } finally {
      setResolvingId(null);
    }
  };

  const unresolvedConflicts = (conflicts || []).filter(
    (c) => !resolvedIds.includes(c.id),
  );

  return (
    <div
      className="cp-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cp-panel">
        <div className="cp-header">
          <div className="cp-header__left">
            <AlertTriangle size={16} className="cp-header__icon" />
            <span className="cp-header__title">CONFLICTS</span>
            {unresolvedConflicts.length > 0 && (
              <span className="cp-badge">{unresolvedConflicts.length}</span>
            )}
          </div>
          <button className="cp-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="cp-body">
          {conflictsLoading && (
            <div className="cp-state">
              <Loader size={20} className="cp-spinner" />
              <span>Loading conflicts…</span>
            </div>
          )}

          {conflictsError && !conflictsLoading && (
            <div className="cp-state cp-state--error">
              <AlertTriangle size={18} />
              <span>Failed to load conflicts</span>
              <button
                className="cp-retry"
                onClick={() => dispatch(fetchConflicts(buildingId))}
              >
                Retry
              </button>
            </div>
          )}

          {!conflictsLoading &&
            !conflictsError &&
            unresolvedConflicts.length === 0 && (
              <div className="cp-state cp-state--empty">
                <CheckCircle size={32} className="cp-state__check" />
                <span>No conflicts found</span>
                <p>All floors and units are in sync.</p>
              </div>
            )}

          {!conflictsLoading &&
            unresolvedConflicts.map((conflict) => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                isExpanded={expandedId === conflict.id}
                isResolving={resolvingId === conflict.id}
                onToggle={() =>
                  setExpandedId((prev) =>
                    prev === conflict.id ? null : conflict.id,
                  )
                }
                onResolve={(chosen) => handleResolve(conflict.id, chosen)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const ConflictCard = ({
  conflict,
  isExpanded,
  isResolving,
  onToggle,
  onResolve,
}) => {
  const typeLabel = conflict.conflict_type || conflict.type || "conflict";
  const entityLabel = conflict.entity_type
    ? `${conflict.entity_type} #${conflict.entity_id ?? conflict.id}`
    : `Conflict #${conflict.id}`;

  const versionA =
    conflict.version_a ?? conflict.current_value ?? conflict.a ?? null;
  const versionB =
    conflict.version_b ?? conflict.incoming_value ?? conflict.b ?? null;

  return (
    <div className={`cp-card ${isExpanded ? "cp-card--expanded" : ""}`}>
      <div className="cp-card__header" onClick={onToggle}>
        <div className="cp-card__meta">
          <span className="cp-card__type">{typeLabel.toUpperCase()}</span>
          <span className="cp-card__entity">{entityLabel}</span>
          {conflict.floor_number != null && (
            <span className="cp-card__floor">
              Floor {conflict.floor_number}
            </span>
          )}
        </div>
        <div className="cp-card__right">
          {conflict.created_at && (
            <span className="cp-card__time">
              {new Date(conflict.created_at).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {isExpanded && (
        <div className="cp-card__body">
          {conflict.description && (
            <p className="cp-card__desc">{conflict.description}</p>
          )}

          <div className="cp-versions">
            <VersionColumn
              label="VERSION A"
              sublabel={conflict.modified_by_a ?? "Current"}
              data={versionA}
              chosen="a"
              isResolving={isResolving}
              onChoose={() => onResolve("a")}
            />
            <div className="cp-versions__vs">VS</div>
            <VersionColumn
              label="VERSION B"
              sublabel={conflict.modified_by_b ?? "Incoming"}
              data={versionB}
              chosen="b"
              isResolving={isResolving}
              onChoose={() => onResolve("b")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const VersionColumn = ({ label, sublabel, data, isResolving, onChoose }) => (
  <div className="cp-version">
    <div className="cp-version__header">
      <span className="cp-version__label">{label}</span>
      {sublabel && <span className="cp-version__sub">{sublabel}</span>}
    </div>

    <div className="cp-version__data">
      {data ? (
        <DataFields data={data} />
      ) : (
        <span className="cp-version__empty">No data</span>
      )}
    </div>

    <button
      className="cp-version__btn"
      onClick={onChoose}
      disabled={isResolving}
    >
      {isResolving ? (
        <Loader size={12} className="cp-spinner cp-spinner--sm" />
      ) : (
        "Keep This Version"
      )}
    </button>
  </div>
);

const FIELD_LABELS = {
  floor_number: "Floor #",
  total_rsf: "Total RSF",
  tenant_name: "Tenant",
  square_footage: "Square Ft",
  lease_expiration: "Lease Exp.",
  status: "Status",
  block_order: "Block Order",
  version: "Version",
};

const formatValue = (key, val) => {
  if (val === null || val === undefined) return "—";
  if (key === "total_rsf" || key === "square_footage")
    return `${Number(val).toLocaleString()} SF`;
  if (key === "lease_expiration" && val)
    return new Date(val).getFullYear().toString();
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const DataFields = ({ data }) => {
  if (typeof data !== "object" || data === null)
    return <span className="cp-version__scalar">{String(data)}</span>;

  const entries = Object.entries(data).filter(
    ([k]) => !["id", "created_at", "updated_at", "building_id"].includes(k),
  );

  return (
    <table className="cp-fields">
      <tbody>
        {entries.map(([key, val]) => (
          <tr key={key} className="cp-fields__row">
            <td className="cp-fields__key">
              {FIELD_LABELS[key] ?? key.replace(/_/g, " ")}
            </td>
            <td className="cp-fields__val">{formatValue(key, val)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
