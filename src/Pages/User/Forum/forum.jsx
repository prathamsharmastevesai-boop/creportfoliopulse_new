import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteThreadsApi,
  get_Threads_Api,
} from "../../../Networking/Admin/APIs/forumApi";
import { CreateThread } from "./createThread";
import { toast } from "react-toastify";
import { getProfileDetail } from "../../../Networking/User/APIs/Profile/ProfileApi";
import { capitalFunction } from "../../../Component/capitalLetter";
import PageHeader from "../../../Component/PageHeader/PageHeader";

import { Avatar } from "./Components/ForumAtoms";
import { PostCard } from "./Components/PostCard";
import { CreatePostBox } from "./Components/CreatePostBox";
import { EmptyFeed } from "./Components/EmptyFeed";
import { PostTypeFilter } from "./Components/PostTypeFilter";
import { ConfirmModal } from "./Components/ConfirmModal";
import "./forum.css";
import LiveNYCWire from "./livenycWire";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";

export const PortfolioForum = () => {
  const dispatch = useDispatch();
  const { ThreadList } = useSelector((state) => state.ForumSlice);
  const { userdata } = useSelector((state) => state.ProfileSlice);

  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingThread, setEditingThread] = useState(null);

  useEffect(() => {
    dispatch(getProfileDetail());
    fetchThreads();
  }, []);

  useEffect(() => {
    if (ThreadList && Array.isArray(ThreadList)) {
      const transformedThreads = ThreadList.map((thread) => ({
        ...thread,
        thought_count: thread.thought_count || thread.comment_count || 0,
        reactions: thread.reactions ||
          thread.reaction_counts || { like: 0, insightful: 0, celebrate: 0 },
        user_reaction: thread.user_reaction || thread.my_reaction || null,
        has_media: !!(thread.media_url || thread.file_url),
        media_url: thread.media_url || thread.file_url,
        media_name: thread.media_name || thread.file_name,
      }));
      setThreads(transformedThreads);
    }
  }, [ThreadList]);

  const fetchThreads = async () => {
    setLoadingThreads(true);
    try {
      await dispatch(get_Threads_Api(activeType)).unwrap();
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoadingThreads(false);
    }
  };

  const handleTypeChange = (value) => {
    setActiveType(value);
    setLoadingThreads(true);
    dispatch(get_Threads_Api(value))
      .unwrap()
      .catch((error) => {
        console.error("Error filtering threads:", error);
      })
      .finally(() => setLoadingThreads(false));
  };

  const filteredThreads = threads.filter((t) => {
    if (!t.title || (t.title === "undefined" && !t.content)) return false;
    const matchesSearch =
      (t.title &&
        t.title !== "undefined" &&
        t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.author_name &&
        t.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const deleteThread = async (id) => {
    try {
      setDeletingId(id);
      await dispatch(deleteThreadsApi({ thread_id: id })).unwrap();
      await fetchThreads();
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditThread = (thread) => {
    setEditingThread(thread);
    setShowCreateModal(true);
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    setEditingThread(null);
    fetchThreads();
  };

  const refreshThread = () => {
    fetchThreads();
  };

  return (
    <>
      <div className="container-fluid p-2 p-md-3 li-forum-container">
        <PageHeader title="Pulse Forum" />
        <div className="li-forum-wrapper">
          <div className="li-feed-layout">
            <div className="mb-3">
              <input
                className="form-control li-search w-100 li-search-input"
                placeholder="🔍 Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* <PostTypeFilter active={activeType} onChange={handleTypeChange} /> */}

            {userdata && (
              <CreatePostBox
                userdata={userdata}
                onOpenModal={() => setShowCreateModal(true)}
              />
            )}

            {loadingThreads ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="secondary" />
                <p className="li-loading-text">Loading posts...</p>
              </div>
            ) : filteredThreads.length === 0 ? (
              <EmptyFeed onCreatePost={() => setShowCreateModal(true)} />
            ) : (
              filteredThreads.map((t) => (
                <PostCard
                  key={t.id}
                  thread={t}
                  userdata={userdata}
                  onDelete={deleteThread}
                  onEdit={handleEditThread}
                  deletingId={deletingId}
                  onThreadUpdate={refreshThread}
                />
              ))
            )}
          </div>
          <div className="li-wire-sidebar">
            <LiveNYCWire isAdmin={userdata?.role === "admin"} />
          </div>
        </div>
      </div>

      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="li-modal-header-custom">
          <div className="d-flex align-items-center gap-3">
            <Avatar
              name={userdata?.name || "Me"}
              photo={userdata?.photo_url}
              size={44}
            />
            <div>
              <div className="fw-semibold li-modal-title-custom">
                {editingThread
                  ? "Edit Post"
                  : capitalFunction(userdata?.name || "Create Post")}
              </div>
              <div className="text-muted small">Share with your network</div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4 li-modal-body-custom">
          <CreateThread
            onClose={handlePostCreated}
            initialData={editingThread}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
