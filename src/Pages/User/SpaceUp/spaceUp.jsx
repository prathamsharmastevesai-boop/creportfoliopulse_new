import { useEffect, useState } from "react";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import {
  FaEnvelope,
  FaPhone,
  FaClipboardCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { AddProspectModal } from "./AddProspectModal";
import { ActivityModal } from "./ActivityModal";
import { DeleteConfirmModal } from "./deleteModel";
import { MilestoneModal } from "./milestoneModal";

import {
  getProspectsBySpace,
  deleteProspect,
  addActivity,
  deleteActivity,
  addMilestone,
  addProspect,
} from "../../../Networking/User/APIs/spaceUp/spaceUpApi";

export const SpaceUp = () => {
  const dispatch = useDispatch();

  const [showProspectModal, setShowProspectModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [activeNotesMilestone, setActiveNotesMilestone] = useState({
    prospectId: null,
    key: null,
  });
  const [savingNotes, setSavingNotes] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeProspectId, setActiveProspectId] = useState(null);
  const [activityType, setActivityType] = useState(null);
  const [addingActivity, setAddingActivity] = useState(false);
  const [updatingMilestones, setUpdatingMilestones] = useState({});
  const [addingProspect, setAddingProspect] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    id: null,
    type: "",
    name: "",
    onConfirm: null,
  });

  const { prospects, prospectsLoading } = useSelector(
    (state) => state.spaceUpSlice,
  );

  useEffect(() => {
    dispatch(getProspectsBySpace());
  }, []);

  const refreshProspects = () => dispatch(getProspectsBySpace());

  const handleAddProspect = () => setShowProspectModal(true);

  const handleOpenNotesModal = (prospectId, milestoneKey) => {
    setActiveNotesMilestone({ prospectId, key: milestoneKey });
    setShowNotesModal(true);
  };

  const handleSaveNotes = async (notes) => {
    const { prospectId, key } = activeNotesMilestone;
    if (!prospectId || !key) return;
    setSavingNotes(true);
    try {
      await dispatch(
        addMilestone({ prospectId, milestone: key, notes }),
      ).unwrap();
      setShowNotesModal(false);
      refreshProspects();
    } catch (err) {
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveProspect = async (formData) => {
    setAddingProspect(true);
    try {
      const payload = {
        broker_name: formData.broker_name,
        broker_contact: formData.broker_contact,
        tenant_name: formData.tenant_name
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean),
      };

      dispatch(addProspect(payload));

      setShowProspectModal(false);
      refreshProspects();
    } finally {
      setAddingProspect(false);
    }
  };

  const handleOpenActivityModal = (prospectId, type) => {
    setActiveProspectId(prospectId);
    setActivityType(type);
    setShowActivityModal(true);
  };

  const handleSaveActivity = async (notes) => {
    if (!activeProspectId || !activityType) return;
    setAddingActivity(true);
    try {
      await dispatch(
        addActivity({ prospectId: activeProspectId, activityType, notes }),
      ).unwrap();
      refreshProspects();
    } finally {
      setAddingActivity(false);
      setShowActivityModal(false);
      setActiveProspectId(null);
      setActivityType(null);
    }
  };

  const handleOpenMilestoneModal = async (
    prospectId,
    milestone,
    currentValue,
  ) => {
    if (currentValue) {
      toast.info("This milestone is already completed.");
      return;
    }

    const key = `${prospectId}-${milestone}`;
    setUpdatingMilestones((prev) => ({ ...prev, [key]: true }));
    try {
      await dispatch(
        addMilestone({ prospectId, milestone, notes: null }),
      ).unwrap();
      refreshProspects();
    } finally {
      setUpdatingMilestones((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const openDeleteModal = (id, type, name, confirmFn) => {
    setDeleteConfig({
      id,
      type,
      name,
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          await confirmFn();
          setShowDeleteModal(false);
        } finally {
          setIsDeleting(false);
        }
      },
    });
    setShowDeleteModal(true);
  };

  const handleDeleteProspect = (prospectId, brokerName) => {
    openDeleteModal(
      prospectId,
      "prospect",
      brokerName || "this prospect",
      async () => {
        await dispatch(deleteProspect(prospectId)).unwrap();
        refreshProspects();
      },
    );
  };

  const handleDeleteActivity = (activityId) => {
    openDeleteModal(activityId, "activity", "this activity", async () => {
      await dispatch(deleteActivity(activityId)).unwrap();
      refreshProspects();
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const milestoneConfig = [
    {
      key: "email_outreach",
      label: "Email Outreach Done",
      icon: <FaEnvelope className="me-2 text-primary" />,
    },
    {
      key: "phone_call",
      label: "Phone Call Done",
      icon: <FaPhone className="me-2 text-success" />,
    },
    {
      key: "requirement_confirmed",
      label: "Requirement Confirmed",
      icon: <FaClipboardCheck className="me-2 text-info" />,
    },
    {
      key: "tour_requested",
      label: "Tour Requested",
      icon: <FaCalendarAlt className="me-2 text-warning" />,
    },
  ];

  return (
    <>
      <div className="header-bg d-flex flex-wrap justify-content-between align-items-center px-3 py-2 sticky-header">
        <h4 className="mb-2 activity-log mb-sm-0 me-3">Broker Index</h4>
      </div>

      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <h5 className="fw-semibold mb-2 mb-sm-0">Prospects</h5>
          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              handleAddProspect();
            }}
          >
            <BsPlusLg size={14} />
            Add Prospect
          </button>
        </div>

        {prospectsLoading ? (
          <div className="text-center py-5 text-muted">
            Loading prospects...
          </div>
        ) : prospects.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No prospects added for this space yet.
          </div>
        ) : (
          prospects.map((p) => {
            const activities = p.activities || [];
            const emailActivities = activities.filter(
              (a) => a.activity_type === "email_outreach",
            );
            const phoneActivities = activities.filter(
              (a) => a.activity_type === "phone_call",
            );

            return (
              <div
                key={p.id}
                className="border rounded-4 p-3 p-md-4 mb-4 shadow-sm position-relative"
              >
                <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
                  <div className="pe-3">
                    <h6 className="fw-bold mb-1">{p.broker_name}</h6>
                    <small className="text-muted d-block mb-1">
                      {p.broker_contact}
                    </small>
                    <small>
                      Tenant:{" "}
                      <span className="text-primary fw-medium">
                        {p.tenant_name || "Not specified"}
                      </span>
                    </small>
                  </div>
                  <BsTrash
                    className="text-danger fs-5 mt-1"
                    role="button"
                    onClick={() => handleDeleteProspect(p.id, p.broker_name)}
                    title="Delete this prospect"
                  />
                </div>

                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">Activity Log</h6>
                  <div className="list-group list-group-flush border rounded">
                    {[
                      {
                        type: "email_outreach",
                        label: "Email Outreaches",
                        icon: <FaEnvelope className="text-primary" />,
                        list: emailActivities,
                      },
                      {
                        type: "phone_call",
                        label: "Phone Conversations",
                        icon: <FaPhone className="text-success" />,
                        list: phoneActivities,
                      },
                    ].map(({ type, label, icon, list }) => (
                      <div key={type} className="list-group-item">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                          <div className="d-flex align-items-center flex-wrap gap-2">
                            {icon}
                            <span>{label}</span>
                            <span className="badge border ms-1">
                              {list.length}
                            </span>
                          </div>
                          <button
                            className="btn btn-link btn-sm text-primary p-0"
                            onClick={() => handleOpenActivityModal(p.id, type)}
                            disabled={addingActivity}
                          >
                            + Add
                          </button>
                        </div>
                        {list.length > 0 && (
                          <ul className="mt-2 list-unstyled">
                            {list.map((act) => (
                              <li
                                key={act.id}
                                className="d-flex justify-content-between align-items-start mb-1"
                              >
                                <small className="text-break me-2">
                                  {act.notes}{" "}
                                  <span className="text-muted text-nowrap">
                                    ({formatDate(act.created_at)})
                                  </span>
                                </small>
                                <BsTrash
                                  className="text-danger flex-shrink-0"
                                  role="button"
                                  size={12}
                                  onClick={() => handleDeleteActivity(act.id)}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="fw-semibold mb-2">Milestones</h6>
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm mb-0">
                      <thead className="border-bottom">
                        <tr>
                          <th className="ps-0">Done</th>
                          <th>Task</th>
                          <th>Notes</th>
                          <th className="text-end">Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {milestoneConfig.map((item) => {
                          const milestone = p.milestones?.[item.key] || {};
                          const done = milestone.done || false;
                          const doneAt = milestone.done_at;
                          const notes = milestone.notes || "";
                          const isUpdating =
                            updatingMilestones[`${p.id}-${item.key}`];

                          return (
                            <tr key={item.key}>
                              <td className="ps-0 align-middle">
                                {isUpdating ? (
                                  <span
                                    className="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={done}
                                    onChange={() =>
                                      handleOpenMilestoneModal(
                                        p.id,
                                        item.key,
                                        done,
                                      )
                                    }
                                    disabled={done || isUpdating}
                                  />
                                )}
                              </td>
                              <td className="align-middle text-nowrap">
                                {item.icon}
                                {item.label}
                              </td>
                              <td className="w-50">
                                <input
                                  className="form-control form-control-sm"
                                  placeholder="Add notes..."
                                  value={notes}
                                  onClick={() =>
                                    handleOpenNotesModal(p.id, item.key)
                                  }
                                  readOnly
                                />
                              </td>
                              <td className="text-muted text-end align-middle text-nowrap">
                                {doneAt ? formatDate(doneAt) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <small className="text-muted d-block mt-3">
                  Added on {formatDate(p.created_at)}
                </small>
              </div>
            );
          })
        )}
      </div>

      <AddProspectModal
        show={showProspectModal}
        onClose={() => setShowProspectModal(false)}
        onSave={handleSaveProspect}
        loading={addingProspect}
      />
      <ActivityModal
        show={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSave={handleSaveActivity}
        type={activityType}
        loading={addingActivity}
      />
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteConfig.onConfirm}
        title={`Delete ${deleteConfig.type}`}
        message={`Are you sure you want to delete ${deleteConfig.name}?`}
        loading={isDeleting}
      />
      <MilestoneModal
        show={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSave={handleSaveNotes}
        milestone={activeNotesMilestone.key}
        title="Add Notes"
        loading={savingNotes}
      />
    </>
  );
};
