import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow, format } from "date-fns";
import "./chatSystem.css";
import { BackIcon } from "../backButton";
import { useNavigate } from "react-router-dom";

export const ChatHeader = ({
  name,
  receiverId,
  onProfileClick,
  isGroup,
  participants,
  onSearchClick,
}) => {
  const navigate = useNavigate();

  const { typingUsers, activeConversation, userStatus } = useSelector(
    (state) => {
      return state.chatSystemSlice;
    },
  );

  const conversationId = activeConversation?.id;

  const receiverStatus = userStatus[receiverId] || {
    online: false,
    last_seen: null,
  };

  const isTyping = useMemo(() => {
    if (!conversationId || !receiverId) return false;

    const typingStatus = typingUsers?.[conversationId];
    if (!typingStatus) return false;

    if (isGroup) {
      return Object.values(typingStatus).some((status) => status === true);
    }

    return typingStatus[receiverId] === true;
  }, [typingUsers, conversationId, receiverId, isGroup]);

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "offline";

    try {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 5) return "just now";

      if (date.toDateString() === now.toDateString()) {
        return `last seen today at ${format(date, "h:mm a")}`;
      }

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `last seen yesterday at ${format(date, "h:mm a")}`;
      }

      return `last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
      console.error("Error formatting last seen:", error);
      return "offline";
    }
  };

  const getStatusInfo = () => {
    if (isGroup) {
      if (isTyping) {
        return { text: "someone is typing...", className: "typing" };
      }
      return {
        text: `${participants?.length || 0} participants`,
        className: "offline",
      };
    }

    if (isTyping) {
      return { text: "typing...", className: "typing" };
    }

    if (receiverStatus.online === true) {
      return { text: "online", className: "online" };
    }

    return {
      text: formatLastSeen(receiverStatus.last_seen),
      className: "offline",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="chat-header1">
      <button
        className="back-btn ms-4 mx-md-0"
        onClick={() => navigate(-1)}
        title="Back"
      >
        <BackIcon />
      </button>

      <div className="chat-user mr-4 mx-md-0" onClick={onProfileClick}>
        <div className="avatar">
          {!isGroup && receiverStatus.online === true && (
            <span className="status-dot online" />
          )}
          {name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="user-info">
          <div
            className="user-name"
            aria-label={`${name || "Unnamed User"} - ${statusInfo.text}`}
          >
            {name || "Unnamed User"}
          </div>

          <div className="user-status">
            <span className={statusInfo.className}>{statusInfo.text}</span>
          </div>
        </div>
      </div>

      <div className="chat-actions">
        <i className="ri-search-line" onClick={onSearchClick} />
        <i className="ri-more-2-fill" />
      </div>
    </div>
  );
};
