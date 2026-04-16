import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Wrench, Clipboard, AlertTriangle, X, Loader2 } from "lucide-react";

import {
  fetchMaintenanceItems,
  createMaintenanceItem,
  updateMaintenanceItem,
  deleteMaintenanceItem,
  fetchMaintenanceHistory,
  fetchPulseReports,
  createPulseReport,
  updatePulseReport,
} from "../../../Networking/User/APIs/Maintennace/maintenanceApi";

import { hasAlarm, EMPTY_FORM, EMPTY_PULSE } from "./maintenanceConstants";
import MaintenanceTable from "./maintenanceTable";
import MaintenanceForm from "./maintenanceForm";
import HistoryModal from "./historyModel";
import PulseReportList from "./pulseReportList";
import PulseReportForm from "./pulseReportForm";
import PulseReportView from "./pulseReportView";
import { BackButton } from "../../../Component/backButton";
import PageHeader from "../../../Component/PageHeader/PageHeader";

const Spin = ({ size = 14 }) => (
  <Loader2 size={size} className="mu2-spin" style={{ flexShrink: 0 }} />
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="mu2-table">
    <div className="mu2-skel-header">
      {[90, 110, 999, 70, 55, 90].map((w, i) => (
        <div
          key={i}
          className="mu2-skel"
          style={{
            width: w === 999 ? undefined : w,
            flex: w === 999 ? 1 : undefined,
            height: 8,
          }}
        />
      ))}
    </div>

    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="mu2-skel-row" style={{ opacity: 1 - i * 0.16 }}>
        <div className="mu2-skel" style={{ width: 90, height: 12 }} />
        <div className="mu2-skel" style={{ width: 110, height: 12 }} />
        <div className="mu2-skel" style={{ flex: 1, height: 12 }} />
        <div className="mu2-skel" style={{ width: 70, height: 12 }} />
        <div className="mu2-skel" style={{ width: 55, height: 12 }} />
        <div
          className="mu2-skel"
          style={{ width: 90, height: 24, borderRadius: 2 }}
        />
      </div>
    ))}
  </div>
);

const SkeletonCards = ({ count = 3 }) => (
  <div className="mu2-skel-cards">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mu2-skel-card" style={{ opacity: 1 - i * 0.22 }}>
        <div className="mu2-skel mu2-skel-icon" />
        <div className="mu2-skel-text-group">
          <div className="mu2-skel mu2-skel-line" style={{ width: "55%" }} />
          <div
            className="mu2-skel mu2-skel-line"
            style={{ width: "80%", height: 9 }}
          />
        </div>
        <div className="mu2-skel mu2-skel-meta" />
      </div>
    ))}
  </div>
);

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="mu2-overlay" onClick={onClose}>
      <div className="mu2-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="mu2-dialog__header">
          <h3 className="mu2-dialog__title">Delete Entry</h3>
          <button
            className="mu2-icon-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>
        <div className="mu2-dialog__body">
          <p>Are you sure you want to delete this maintenance entry?</p>
        </div>
        <div className="mu2-dialog__footer">
          <button
            className="mu2-btn mu2-btn--ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="mu2-btn mu2-btn--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <>Deleting…</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MaintenanceUpdate = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const BUILDING_ID = location.state?.buildingId;
  console.log(BUILDING_ID, "BUILDING_ID");

  const Address = location.state?.address;

  const [activeTab, setActiveTab] = useState("maintenance");

  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [pulseReports, setPulseReports] = useState([]);
  const [error, setError] = useState(null);

  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [submittingPulse, setSubmittingPulse] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [historyItem, setHistoryItem] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const [showPulseForm, setShowPulseForm] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [pulseForm, setPulseForm] = useState(EMPTY_PULSE);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadMaintenance = async () => {
    setLoadingMaintenance(true);
    const r = await dispatch(fetchMaintenanceItems(BUILDING_ID));
    if (fetchMaintenanceItems.fulfilled.match(r))
      setMaintenanceItems(r.payload);
    else setError("Failed to load maintenance data.");
    setLoadingMaintenance(false);
  };

  const loadPulseReports = async () => {
    setLoadingPulse(true);
    const r = await dispatch(fetchPulseReports(BUILDING_ID));
    if (fetchPulseReports.fulfilled.match(r)) setPulseReports(r.payload);
    else setError("Failed to load pulse reports.");
    setLoadingPulse(false);
  };

  useEffect(() => {
    if (BUILDING_ID) {
      loadMaintenance();
      loadPulseReports();
    }
  }, [BUILDING_ID]);

  const handleSubmit = async () => {
    setSubmitting(true);
    if (editItem) {
      const r = await dispatch(
        updateMaintenanceItem({
          id: editItem.id,
          payload: {
            category: form.category,
            status: form.status,
            description: form.description,
            tour_impact: form.tour_impact,
          },
        }),
      );
      if (updateMaintenanceItem.rejected.match(r)) {
        setError("Failed to update.");
        setSubmitting(false);
        return;
      }
    } else {
      const fd = new FormData();
      fd.append("building_id", BUILDING_ID);
      fd.append("category", form.category);
      fd.append("status", form.status);
      fd.append("description", form.description);
      fd.append("tour_impact", form.tour_impact);
      if (form.photo) fd.append("photo", form.photo);
      const r = await dispatch(createMaintenanceItem(fd));
      if (createMaintenanceItem.rejected.match(r)) {
        setError("Failed to create.");
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
    setShowForm(false);
    setEditItem(null);
    setForm(EMPTY_FORM);
    loadMaintenance();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(deleteId);
    const r = await dispatch(deleteMaintenanceItem(deleteId));
    if (deleteMaintenanceItem.rejected.match(r)) {
      setError("Failed to delete.");
    } else {
      await loadMaintenance();
    }
    setDeleting(null);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleOpenEdit = (item) => {
    setForm({
      category: item.category || "elevator",
      status: item.status || "pending",
      description: item.description || "",
      tour_impact: item.tour_impact || false,
      photo: null,
    });
    setEditItem(item);
    setShowForm(true);
  };

  const handleOpenHistory = async (item) => {
    setLoadingHistory(item.id);
    try {
      const r = await dispatch(fetchMaintenanceHistory(item.id)).unwrap();
      setHistoryData(r);
      setHistoryItem(item);
    } catch {
      setError("Failed to load history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePulseSubmit = async () => {
    setSubmittingPulse(true);
    const content = {
      notes: pulseForm.notes,
      occupancy_rate: Number(pulseForm.occupancy_rate) || undefined,
      new_leads: Number(pulseForm.new_leads) || undefined,
      tours_completed: Number(pulseForm.tours_completed) || undefined,
      maintenance_issues: Number(pulseForm.maintenance_issues) || undefined,
    };
    if (editReport) {
      const r = await dispatch(
        updatePulseReport({
          id: editReport.id,
          building_id: BUILDING_ID,
          payload: { status: pulseForm.status, content },
        }),
      );
      if (updatePulseReport.rejected.match(r)) {
        setError("Failed.");
        setSubmittingPulse(false);
        return;
      }
    } else {
      const r = await dispatch(
        createPulseReport({
          building_id: BUILDING_ID,
          date: pulseForm.date,
          status: pulseForm.status,
          content,
        }),
      );
      if (createPulseReport.rejected.match(r)) {
        setError("Failed.");
        setSubmittingPulse(false);
        return;
      }
    }
    setSubmittingPulse(false);
    setShowPulseForm(false);
    setEditReport(null);
    loadPulseReports();
  };

  const handleOpenEditReport = (r) => {
    setPulseForm({
      date: r.date || new Date().toISOString().split("T")[0],
      status: r.status || "draft",
      notes: r.content?.notes || r.content?.summary || "",
      occupancy_rate: r.content?.occupancy_rate || "",
      new_leads: r.content?.new_leads || "",
      tours_completed: r.content?.tours_completed || "",
      maintenance_issues:
        r.content?.maintenance_issues || r.content?.maintenance_alerts || "",
    });
    setEditReport(r);
    setViewReport(null);
    setShowPulseForm(true);
  };

  const alarmActive = hasAlarm(maintenanceItems);
  const tabs = [
    { key: "maintenance", label: "Maintenance", alarm: alarmActive },
    { key: "pulse", label: "Pulse Reports" },
  ];

  const areaLoading =
    activeTab === "maintenance" ? loadingMaintenance : loadingPulse;

  return (
    <div className="mu2-page">
      <PageHeader
        backButton={<BackButton />}
        title={Address}
        subtitle={
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-secondary">BUILDING #{Address}</span>
            {alarmActive && (
              <span className="badge bg-danger d-flex align-items-center gap-1">
                <span className="mu2-alert-chip__dot" /> CRITICAL ALERT
              </span>
            )}
          </div>
        }
        actions={
          <nav className="mu2-tabs">
            {tabs.map((t) => {
              const isThisLoading =
                t.key === "maintenance" ? loadingMaintenance : loadingPulse;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`mu2-tab${activeTab === t.key ? " mu2-tab--active" : ""}`}
                >
                  {isThisLoading ? (
                    <Spin size={13} />
                  ) : t.key === "maintenance" ? (
                    <Wrench size={13} />
                  ) : (
                    <Clipboard size={13} />
                  )}
                  {t.label}
                  {t.alarm && <span className="mu2-tab__alarm" />}
                </button>
              );
            })}
          </nav>
        }
      />

      <main className="mu2-content">
        {error && (
          <div className="mu2-error-bar">
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={14} /> {error}
            </span>
            <button
              onClick={() => setError(null)}
              style={{ display: "flex", alignItems: "center" }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {activeTab === "maintenance" && (
          <section className="mu2-section">
            {loadingMaintenance ? (
              <SkeletonTable rows={5} />
            ) : (
              <MaintenanceTable
                items={maintenanceItems}
                loading={false}
                deleting={deleting}
                loadingHistory={loadingHistory}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteClick}
                onHistory={handleOpenHistory}
                onNewEntry={() => {
                  setEditItem(null);
                  setForm(EMPTY_FORM);
                  setShowForm(true);
                }}
              />
            )}
          </section>
        )}

        {activeTab === "pulse" && (
          <section className="mu2-section">
            {loadingPulse ? (
              <SkeletonCards count={3} />
            ) : (
              <PulseReportList
                reports={pulseReports}
                loading={false}
                onView={setViewReport}
                onEdit={handleOpenEditReport}
                onNewReport={() => {
                  setEditReport(null);
                  setPulseForm(EMPTY_PULSE);
                  setShowPulseForm(true);
                }}
              />
            )}
          </section>
        )}
      </main>

      {showForm && (
        <MaintenanceForm
          form={form}
          setForm={setForm}
          editItem={editItem}
          isLoading={submitting}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {showPulseForm && (
        <PulseReportForm
          pulseForm={pulseForm}
          setPulseForm={setPulseForm}
          editReport={editReport}
          submitting={submittingPulse}
          buildingId={BUILDING_ID}
          onSubmit={handlePulseSubmit}
          onClose={() => setShowPulseForm(false)}
        />
      )}

      {historyItem && (
        <HistoryModal
          item={historyItem}
          data={historyData}
          onClose={() => setHistoryItem(null)}
        />
      )}

      {viewReport && (
        <PulseReportView
          report={viewReport}
          onClose={() => setViewReport(null)}
          onEdit={() => handleOpenEditReport(viewReport)}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting === deleteId}
      />
    </div>
  );
};

export default MaintenanceUpdate;
