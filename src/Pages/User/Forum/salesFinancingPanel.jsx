import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createSalesFinancingApi,
  deleteSalesFinancingApi,
  fetchSalesFinancingApi,
  updateSalesFinancingApi,
} from "../../../Networking/Admin/APIs/forumApi";
import { FormModal } from "./formModel";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";
import { Spinner } from "react-bootstrap";

const TRANSACTION_TYPES = [
  "SALE",
  "DEBT",
  "REFI",
  "DISTRESS",
  "ACQUISITION",
  "FORECLOSURE",
  "BRIDGE LOAN",
  "CONSTRUCTION LOAN",
];

const TYPE_COLORS = {
  SALE: { bg: "#d1e7dd", color: "#0a3622", border: "#a3cfbb" },
  DEBT: { bg: "#cfe2ff", color: "#052c65", border: "#9ec5fe" },
  REFI: { bg: "#e2d9f3", color: "#2c1a6b", border: "#c5b3e6" },
  DISTRESS: { bg: "#fff3cd", color: "#664d03", border: "#ffe69c" },
  ACQUISITION: { bg: "#d1ecf1", color: "#0c5460", border: "#9eeaf9" },
  FORECLOSURE: { bg: "#f8d7da", color: "#58151c", border: "#f1aeb5" },
  "BRIDGE LOAN": { bg: "#fef3cd", color: "#533f03", border: "#ffe69c" },
  "CONSTRUCTION LOAN": { bg: "#e2e3e5", color: "#383d41", border: "#c4c8cb" },
};

const TypeBadge = ({ type }) => {
  const s = TYPE_COLORS[type] || {
    bg: "#e9ecef",
    color: "#495057",
    border: "#ced4da",
  };
  return (
    <span
      className="nyc-type-badge"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {type}
    </span>
  );
};

const salesFields = [
  {
    key: "property",
    label: "Property",
    type: "text",
    placeholder: "e.g. 450 Park Avenue",
    required: true,
  },
  {
    key: "transaction_type",
    label: "Transaction Type",
    type: "select",
    options: TRANSACTION_TYPES,
    required: true,
  },
  {
    key: "price_amount",
    label: "Price / Amount",
    type: "text",
    placeholder: "e.g. $56.0M",
    required: true,
  },
  {
    key: "key_metric",
    label: "Key Metric",
    type: "text",
    placeholder: "e.g. $565/SF",
  },
  {
    key: "note",
    label: "Note",
    type: "text",
    placeholder: "e.g. Closed in Q2",
  },
  {
    key: "source",
    label: "Source",
    type: "text",
    placeholder: "e.g. NYC ACRIS / Public Record",
  },
  {
    key: "is_alert",
    label: "Alert",
    type: "checkbox",
    checkLabel: "Mark as distress alert",
  },
];

export const SalesFinancingPanel = () => {
  const dispatch = useDispatch();
  const { data: records, loading } = useSelector(
    (state) => state.ForumSlice.salesFinancing,
  );

  const [role, setRole] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("role");
    setRole(isAdmin);
  }, []);

  useEffect(() => {
    dispatch(fetchSalesFinancingApi());
  }, [dispatch]);

  const reload = () => dispatch(fetchSalesFinancingApi());

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };
  const openDel = (id) => {
    setDeletingId(id);
    setShowConfirm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };
  const closeConfirm = () => {
    setShowConfirm(false);
    setDeletingId(null);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await dispatch(
          updateSalesFinancingApi({ id: editing.id, data: values }),
        ).unwrap();
      } else {
        await dispatch(createSalesFinancingApi(values)).unwrap();
      }
      closeForm();
      reload();
    } catch (err) {
      console.error("Sales save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteSalesFinancingApi({ id: deletingId })).unwrap();
      closeConfirm();
    } catch (err) {
      console.error("Sales delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="nyc-panel">
        <div className="nyc-panel-head">
          <div>
            <div className="nyc-panel-title">NYC Sales & Financing Log</div>
            <div className="nyc-panel-subtitle">
              Source: NYC ACRIS / Public Record
            </div>
          </div>
          {role == "admin" && (
            <button
              onClick={openAdd}
              className="nyc-btn nyc-btn--primary nyc-btn--sm"
            >
              <Plus size={13} strokeWidth={2.5} /> Add
            </button>
          )}
        </div>

        {loading ? (
          <div className="nyc-spinner-wrap">
            <Spinner />
          </div>
        ) : !records?.length ? (
          <p className="nyc-empty">No sales/financing records found.</p>
        ) : (
          <div className="nyc-scroll">
            <table className="nyc-tbl">
              <thead>
                <tr>
                  {[
                    "Date",
                    "Property",
                    "Type",
                    "Price/Amount",
                    "Key Metric",
                    role == "admin" && "Actions",
                  ]
                    .filter(Boolean)
                    .map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className={r.is_alert ? "nyc-row-alert" : ""}>
                    <td>{r.date || r.created_at?.split("T")[0] || "—"}</td>
                    <td className="td-bold">
                      {r.property}
                      {r.is_alert && (
                        <span className="nyc-alert-pill">Alert</span>
                      )}
                    </td>
                    <td>
                      <TypeBadge type={r.transaction_type} />
                    </td>
                    <td className="td-amount">{r.price_amount}</td>
                    <td className="td-muted">{r.key_metric || "—"}</td>
                    {role == "admin" && (
                      <td className="td-nowrap">
                        <button
                          onClick={() => openEdit(r)}
                          className="nyc-icon-btn"
                          title="Edit"
                        >
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => openDel(r.id)}
                          className="nyc-icon-btn nyc-icon-btn--danger"
                          title="Delete"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="nyc-footnote">*Estimated/Reported</div>
      </div>

      <FormModal
        show={showForm}
        title={editing ? "Edit Sales Record" : "Add NYC Sales/Financing"}
        fields={salesFields}
        initialValues={editing || {}}
        onSubmit={handleSave}
        onHide={closeForm}
        loading={saving}
      />
      <ConfirmDeleteModal
        show={showConfirm}
        selectedEmail="this record"
        deleteLoading={deleting}
        onDelete={handleDelete}
        onClose={closeConfirm}
      />
    </>
  );
};
