import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Activity, Send, Plus, X } from "lucide-react";
import { formatActivityMessage } from "./helper";
import {
  postBuildingUpdate,
  fetchActivityLog,
} from "../../../../Networking/Admin/APIs/buildingStackApi";

export const ActivityLog = ({ buildingId, activities }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        postBuildingUpdate({ buildingId, note: note.trim() }),
      ).unwrap();
      setNote("");
      setShowInput(false);

      await dispatch(fetchActivityLog({ buildingId })).unwrap();
    } catch (err) {
      console.error("Failed to post update:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setNote("");
  };

  return (
    <div className="bs-log-col col-12">
      <div className="bs-log-header d-flex justify-content-between align-items-center">
        <span className="d-flex align-items-center bs-log-time">
          <Activity size={14} className="me-1 text-danger" />
          ACTIVITY LOG
        </span>

        <div className="d-flex">
          <button
            type="button"
            onClick={() => setShowInput((prev) => !prev)}
            className="bs-log-toggle-btn"
            disabled={isSubmitting}
          >
            <Plus size={16} />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bs-log-cancel"
            disabled={isSubmitting}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {showInput && (
        <form onSubmit={handleSubmit} className="bs-log-add-form">
          <input
            type="text"
            placeholder="Add an update..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
            className="form-control bs-log-input"
          />

          <button
            type="submit"
            disabled={isSubmitting || !note.trim()}
            className="btn btn-sm bs-log-submit"
          >
            <Send size={14} />
          </button>
        </form>
      )}

      {activities?.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="bs-log-entry">
            <span className="bs-log-time d-block">
              {new Date(activity.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <span className="activity-log d-block">
              {formatActivityMessage(activity)}
            </span>

            <span className="bs-log-user d-block text-muted">
              {activity.modified_by_name} ({activity.modified_by_role})
            </span>
          </div>
        ))
      ) : (
        <div className="bs-log-entry text-center">No recent activity</div>
      )}
    </div>
  );
};
