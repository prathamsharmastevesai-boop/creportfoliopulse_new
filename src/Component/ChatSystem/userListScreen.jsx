import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./chatSystem.css";
import { BackIcon, SearchIcon } from "../backButton";
import { getMessengerList } from "../../Networking/User/APIs/ChatSystem/chatSystemApi";

const AVATAR_COLORS = [
  "#1E6B5E",
  "#2C6E8A",
  "#6B3F8A",
  "#8A5C2E",
  "#2E6B3F",
  "#7A2E2E",
  "#2E517A",
  "#5C2E7A",
];
const avatarColor = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await dispatch(getMessengerList()).unwrap();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    if (user.conversation_id == null) {
      navigate(`/chat/new`, {
        state: {
          receiver_id: user.user_id,
          name: user.name,
        },
      });
    } else {
      navigate(`/chat/${user.conversation_id}`, {
        state: {
          receiver_id: user.user_id,
          name: user.name,
        },
      });
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="userlist-root">
        <div className="userlist-header">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            title="Back"
          >
            <BackIcon />
          </button>
          <span className="header-title">New Chat</span>
        </div>

        <div className="search-wrap">
          <div className="search-inner">
            <SearchIcon />
            <input
              className="search-input"
              placeholder="Search name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="section-label">
            Contacts on App &nbsp;·&nbsp; {filtered.length}
          </div>
        )}

        <div className="userlist-list">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div className="skel-item">
                <div className="skel-avatar" />
                <div className="skel-lines">
                  <div className="skel-line" style={{ width: "45%" }} />
                  <div className="skel-line" style={{ width: "65%" }} />
                </div>
              </div>
            ))}

          {!loading && filtered.length === 0 && (
            <div className="empty">
              <span className="empty-icon">🔍</span>
              <span className="empty-text">
                {search ? "No users match your search" : "No users available"}
              </span>
            </div>
          )}

          {!loading &&
            filtered.map((user, i) => (
              <button
                key={user.id ?? user.user_id}
                className="user-item"
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => handleUserClick(user)}
              >
                <div
                  className="avatar"
                  style={{ background: avatarColor(user.name) }}
                >
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="text-block">
                  <div className="name">{user.name}</div>
                  <div className="sub">Tap to start chat</div>
                </div>

                <span className="arrow">›</span>
              </button>
            ))}
        </div>
      </div>
    </>
  );
};
