import { useEffect, useState } from "react";
import { BsPlusLg, BsChevronUp, BsChevronDown, BsTrash } from "react-icons/bs";
import {
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaClipboardCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { AddSpaceModal } from "./addSpace";
import { AddProspectModal } from "./AddProspectModal";
import { ActivityModal } from "./ActivityModal";
import { MilestoneModal } from "./milestoneModal";
import { DeleteConfirmModal } from "./deleteModel";

import {
  getSpacesByBuilding,
  getProspectsBySpace,
  deleteProspect,
  deleteSpace,
  addActivity,
  deleteActivity,
  addMilestone,
  addProspect,
} from "../../../Networking/User/APIs/spaceUp/spaceUpApi";

export const SpaceUp = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const buildingId = location.state?.office?.buildingId;
  const address = location.state?.office?.address || "Space Up - Building";
  const deletingSpaceId = useSelector((s) => s.spaceUpSlice.deletingSpaceId);

  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [openSpaceId, setOpenSpaceId] = useState(null);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeProspectId, setActiveProspectId] = useState(null);
  const [activityType, setActivityType] = useState(null);
  const [addingActivity, setAddingActivity] = useState(false);

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [activeProspectIdForMilestone, setActiveProspectIdForMilestone] =
    useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [updatingMilestone, setUpdatingMilestone] = useState(false);

  const [addingProspect, setAddingProspect] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({
    id: null,
    type: "",
    name: "",
    onConfirm: null,
  });

  const { spaces, spacesLoading, prospectsBySpace, prospectsLoading } =
    useSelector((state) => state.spaceUpSlice);

  useEffect(() => {
    if (buildingId) {
      dispatch(getSpacesByBuilding(buildingId));
    }
  }, [buildingId, dispatch]);

  const toggleAccordion = (spaceId) => {
    if (openSpaceId === spaceId) {
      setOpenSpaceId(null);
      return;
    }
    setOpenSpaceId(spaceId);
    if (!prospectsBySpace?.[spaceId]) {
      dispatch(getProspectsBySpace(spaceId));
    }
  };

  const handleAddProspect = (spaceId) => {
    setSelectedSpaceId(spaceId);
    setShowProspectModal(true);
  };

  const handleSaveProspect = async (formData) => {
    if (!selectedSpaceId) return;
    setAddingProspect(true);
    try {
      await dispatch(
        addProspect({ spaceId: selectedSpaceId, payload: formData }),
      ).unwrap();
      toast.success("Prospect added");
      setShowProspectModal(false);

      if (openSpaceId) dispatch(getProspectsBySpace(openSpaceId));
    } catch (err) {
      toast.error(err?.message || "Failed to add prospect");
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
        addActivity({
          prospectId: activeProspectId,
          activityType,
          notes,
        }),
      ).unwrap();
      toast.success("Activity added");
      if (openSpaceId) dispatch(getProspectsBySpace(openSpaceId));
    } catch (err) {
      toast.error(err?.message || "Failed to add activity");
    } finally {
      setAddingActivity(false);
      setShowActivityModal(false);
      setActiveProspectId(null);
      setActivityType(null);
    }
  };

  const handleDeleteActivity = (activityId, prospectId) => {
    openDeleteModal(activityId, "activity", "this activity", async () => {
      await dispatch(deleteActivity(activityId)).unwrap();
      if (openSpaceId) dispatch(getProspectsBySpace(openSpaceId));
    });
  };

  const handleOpenMilestoneModal = (prospectId, milestone, currentValue) => {
    if (currentValue) {
      toast.info("This milestone is already completed.");
      return;
    }
    setActiveProspectIdForMilestone(prospectId);
    setActiveMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleSaveMilestone = async (notes) => {
    if (!activeProspectIdForMilestone || !activeMilestone) return;
    setUpdatingMilestone(true);
    try {
      await dispatch(
        addMilestone({
          prospectId: activeProspectIdForMilestone,
          milestone: activeMilestone,
          notes,
        }),
      ).unwrap();
      toast.success("Milestone updated");
      if (openSpaceId) dispatch(getProspectsBySpace(openSpaceId));
    } catch (err) {
      toast.error(err?.message || "Failed to update milestone");
    } finally {
      setUpdatingMilestone(false);
      setShowMilestoneModal(false);
      setActiveProspectIdForMilestone(null);
      setActiveMilestone(null);
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
        } catch (err) {
          console.error("Delete failed:", err);
        } finally {
          setIsDeleting(false);
        }
      },
    });

    setShowDeleteModal(true);
  };
  const handleDeleteSpace = (spaceId, suiteNumber) => {
    openDeleteModal(spaceId, "space", `Suite ${suiteNumber}`, async () => {
      await dispatch(deleteSpace(spaceId)).unwrap();
    });
  };

  const handleDeleteProspect = (prospectId, brokerName) => {
    openDeleteModal(
      prospectId,
      "prospect",
      brokerName || "this prospect",
      async () => {
        await dispatch(deleteProspect(prospectId)).unwrap();
        if (openSpaceId) dispatch(getProspectsBySpace(openSpaceId));
      },
    );
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
        <h4 className="mb-2 mb-sm-0 text-light me-3">
          {address || "Space Up"}
        </h4>
        <button
          className="btn btn-secondary"
          onClick={() => setShowSpaceModal(true)}
        >
          <BsPlusLg className="me-2" />
          Add Space
        </button>
      </div>

      <div className="container-fluid py-4 px-2 px-md-3">
        {spacesLoading ? (
          <div className="row g-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="col-12">
                <div className="card shadow-sm p-4 placeholder-glow">
                  <span className="placeholder col-5 mb-2 d-block" />
                  <span className="placeholder col-3 mb-3 d-block" />
                  <span className="placeholder col-8 d-block" />
                </div>
              </div>
            ))}
          </div>
        ) : !spaces?.length ? (
          <div className="alert alert-info text-center py-3">
            No vacant spaces found in this building.
          </div>
        ) : (
          spaces.map((space) => {
            const prospects = prospectsBySpace?.[space.id] || [];
            const loading = prospectsLoading?.[space.id];

            return (
              <div
                key={space.id}
                className="card mb-4 shadow border-0 rounded-4"
              >
                <div
                  className="card-header d-flex flex-wrap justify-content-between align-items-center p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleAccordion(space.id)}
                >
                  <div className="mb-2 mb-sm-0">
                    <h5 className="mb-1 fw-semibold">
                      Suite {space.suite_number} • Floor {space.floor}
                    </h5>
                    <small className="text-muted text-break">{address}</small>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-md-3">
                    <span className="badge border px-3 py-2 text-dark">
                      <FaUserFriends size={14} className="me-1" />
                      {prospects.length} prospects
                    </span>
                    <div>
                      <BsTrash
                        className={`fs-4 ${
                          deletingSpaceId === space.id
                            ? "text-secondary"
                            : "text-danger"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (deletingSpaceId !== space.id) {
                            handleDeleteSpace(space.id, space.suite_number);
                          }
                        }}
                      />

                      {openSpaceId === space.id ? (
                        <BsChevronUp className="fs-5" />
                      ) : (
                        <BsChevronDown className="fs-5" />
                      )}
                    </div>
                  </div>
                </div>

                {openSpaceId === space.id && (
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                      <h5 className="fw-semibold mb-2 mb-sm-0">Prospects</h5>
                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProspect(space.id);
                        }}
                      >
                        <BsPlusLg size={14} />
                        Add Prospect
                      </button>
                    </div>

                    {loading ? (
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
                                <h6 className="fw-bold mb-1">
                                  {p.broker_name}
                                </h6>
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
                                onClick={() =>
                                  handleDeleteProspect(
                                    p.id,
                                    p.broker_name || "this prospect",
                                  )
                                }
                                title="Delete this prospect"
                              />
                            </div>

                            <div className="mb-4">
                              <h6 className="fw-semibold mb-2">Activity Log</h6>
                              <div className="list-group list-group-flush border rounded">
                                <div className="list-group-item">
                                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                      <FaEnvelope className="text-primary" />
                                      <span>Email Outreaches</span>
                                      <span className="badge border ms-1">
                                        {emailActivities.length}
                                      </span>
                                    </div>
                                    <button
                                      className="btn btn-link btn-sm text-primary p-0"
                                      onClick={() =>
                                        handleOpenActivityModal(
                                          p.id,
                                          "email_outreach",
                                        )
                                      }
                                      disabled={addingActivity}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                  {emailActivities.length > 0 && (
                                    <ul className="mt-2 list-unstyled">
                                      {emailActivities.map((act) => (
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
                                            onClick={() =>
                                              handleDeleteActivity(act.id, p.id)
                                            }
                                          />
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                <div className="list-group-item">
                                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                      <FaPhone className="text-success" />
                                      <span>Phone Conversations</span>
                                      <span className="badge border ms-1">
                                        {phoneActivities.length}
                                      </span>
                                    </div>
                                    <button
                                      className="btn btn-link btn-sm text-primary p-0"
                                      onClick={() =>
                                        handleOpenActivityModal(
                                          p.id,
                                          "phone_call",
                                        )
                                      }
                                      disabled={addingActivity}
                                    >
                                      + Add
                                    </button>
                                  </div>
                                  {phoneActivities.length > 0 && (
                                    <ul className="mt-2 list-unstyled">
                                      {phoneActivities.map((act) => (
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
                                            onClick={() =>
                                              handleDeleteActivity(act.id, p.id)
                                            }
                                          />
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
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
                                      const milestone =
                                        p.milestones?.[item.key] || {};
                                      const done = milestone.done || false;
                                      const doneAt = milestone.done_at;
                                      const notes = milestone.notes || "";

                                      return (
                                        <tr key={item.key}>
                                          <td className="ps-0 align-middle">
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
                                              disabled={
                                                done || updatingMilestone
                                              }
                                            />
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
                                              disabled
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
                )}
              </div>
            );
          })
        )}
      </div>

      <AddSpaceModal
        show={showSpaceModal}
        onClose={() => setShowSpaceModal(false)}
        buildingId={buildingId}
      />

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

      <MilestoneModal
        show={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        onSave={handleSaveMilestone}
        milestone={activeMilestone}
        loading={updatingMilestone}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteConfig.onConfirm}
        title={`Delete ${deleteConfig.type}`}
        message={`Are you sure you want to delete ${deleteConfig.name}?`}
        loading={isDeleting}
      />
    </>
  );
};
