import React, { useState, useEffect, useRef } from "react";
import { ThumbsUp } from "lucide-react";
import { REACTIONS } from "./ForumAtoms";
import { toast } from "react-toastify";

export const ReactionButton = ({
  postId,
  userReaction = null,
  reactionCounts = {},
  onReact,
}) => {
  const [selectedReaction, setSelectedReaction] = useState(userReaction);
  const [localCounts, setLocalCounts] = useState(reactionCounts);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setSelectedReaction(userReaction);
    setLocalCounts(reactionCounts);
  }, [userReaction, reactionCounts]);

  const totalReactions = Object.values(localCounts).reduce((a, b) => a + b, 0);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setHovered(true), 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setTimeout(() => setHovered(false), 200);
  };

  const handleReaction = async (reactionKey) => {
    if (loading) return;
    setLoading(true);
    setHovered(false);

    const isSame = selectedReaction === reactionKey;

    setSelectedReaction(isSame ? null : reactionKey);
    setLocalCounts((prev) => {
      const newCounts = { ...prev };
      if (isSame) {
        newCounts[reactionKey] = Math.max(0, (newCounts[reactionKey] || 0) - 1);
      } else {
        newCounts[reactionKey] = (newCounts[reactionKey] || 0) + 1;
        if (selectedReaction) {
          newCounts[selectedReaction] = Math.max(
            0,
            (newCounts[selectedReaction] || 0) - 1,
          );
        }
      }
      return newCounts;
    });

    try {
      await onReact(reactionKey);
    } catch (error) {
      setSelectedReaction(selectedReaction);
      setLocalCounts(reactionCounts);
      toast.error("Failed to add reaction");
    } finally {
      setLoading(false);
    }
  };

  const selectedReactionObj = REACTIONS.find(
    (r) => r.apiKey === selectedReaction,
  );
  const topReactions = REACTIONS.filter((r) => (localCounts[r.apiKey] || 0) > 0)
    .sort((a, b) => (localCounts[b.apiKey] || 0) - (localCounts[a.apiKey] || 0))
    .slice(0, 3);

  return (
    <div
      className="position-relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hovered && (
        <div className="position-absolute bottom-100 start-0 mb-2 d-flex gap-1 p-2 rounded-4 shadow-lg li-reaction-popup">
          {REACTIONS.map((r) => (
            <button
              key={r.apiKey}
              title={r.label}
              onClick={() => handleReaction(r.apiKey)}
              className="li-reaction-option-btn"
            >
              <r.icon size={24} color={r.color} />
              {(localCounts[r.apiKey] || 0) > 0 && (
                <span className="li-reaction-small-count">
                  {localCounts[r.apiKey]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        className={`li-action-btn ${selectedReaction ? "li-action-btn-active" : ""}`}
        onClick={() => handleReaction("like")}
        disabled={loading}
      >
        <span className="me-2">
          {selectedReactionObj ? (
            <selectedReactionObj.icon
              size={18}
              color={selectedReactionObj.color}
            />
          ) : (
            <ThumbsUp size={18} />
          )}
        </span>
        {selectedReactionObj ? selectedReactionObj.label : "Like"}
        {totalReactions > 0 && (
          <span className="ms-1 badge rounded-pill li-count-badge">
            {totalReactions}
          </span>
        )}
      </button>

      {topReactions.length > 0 && totalReactions > 1 && (
        <span className="ms-2 d-inline-flex align-items-center gap-1">
          {topReactions.map((r) => (
            <span
              key={r.apiKey}
              title={`${r.label}: ${localCounts[r.apiKey]}`}
              className="cursor-default"
            >
              <r.icon size={13} color={r.color} />
            </span>
          ))}
        </span>
      )}
    </div>
  );
};
