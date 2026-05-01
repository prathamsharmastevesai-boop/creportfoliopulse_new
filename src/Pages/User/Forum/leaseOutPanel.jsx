import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus } from "lucide-react";

import {
  createLeaseOutApi,
  deleteLeaseOutApi,
  fetchLeaseOutApi,
  updateLeaseOutApi,
} from "../../../Networking/Admin/APIs/forumApi";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";
import { FormModal, StatusBadge, VerifiedIcon } from "./formModel";
import { Spinner } from "react-bootstrap";

const LEASE_STATUSES = [
  "Available",
  "Pending",
  "Leased",
  "Negotiating",
  "Hold",
  "Off Market",
];

const LEASE_FIELDS = [
  {
    key: "building_address",
    label: "Building Address",
    type: "text",
    placeholder: "e.g. 40 Wall Street",
    required: true,
  },
  {
    key: "floor_suite",
    label: "Floor / Suite",
    type: "text",
    placeholder: "e.g. 11th Floor",
    required: true,
  },
  {
    key: "sf",
    label: "Square Feet",
    type: "number",
    placeholder: "e.g. 12000",
    required: true,
  },
  { key: "status", label: "Status", type: "select", options: LEASE_STATUSES },
  {
    key: "verified",
    label: "Verified",
    type: "checkbox",
    checkLabel: "Mark as verified",
  },
];

export const LeaseOutPanel = () => {
  const dispatch = useDispatch();
  const { data: records, loading } = useSelector(
    (state) => state.ForumSlice.leaseOut,
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
    dispatch(fetchLeaseOutApi());
  }, [dispatch]);

  const reload = () => dispatch(fetchLeaseOutApi());

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
          updateLeaseOutApi({ id: editing.id, data: values }),
        ).unwrap();
      } else {
        await dispatch(createLeaseOutApi(values)).unwrap();
      }
      closeForm();
      reload();
    } catch (err) {
      console.error("Lease save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteLeaseOutApi({ id: deletingId })).unwrap();
      closeConfirm();
    } catch (err) {
      console.error("Lease delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="nyc-panel">
        <div className="nyc-panel-head">
          <div className="nyc-panel-head-left">
            <span className="nyc-panel-title">Lease Out Wire</span>
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
          <p className="nyc-empty">No lease records found.</p>
        ) : (
          <div className="nyc-scroll">
            <table className="nyc-tbl">
              <thead>
                <tr>
                  {[
                    "Date",
                    "Building / Address",
                    "Floor/Suite",
                    "SF",
                    "Status",
                    "Verified",
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
                  <tr key={r.id}>
                    <td>{r.date || r.created_at?.split("T")[0] || "—"}</td>
                    <td className="td-bold">{r.building_address}</td>
                    <td>{r.floor_suite}</td>
                    <td className="td-mono">{r.sf?.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="td-center">
                      <VerifiedIcon verified={r.verified} />
                    </td>
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
      </div>

      <FormModal
        show={showForm}
        title={editing ? "Edit Lease Record" : "Add Lease Out Wire"}
        fields={LEASE_FIELDS}
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
