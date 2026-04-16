import React, { useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-toastify";
import {
  getThreadhistory,
  reactToThreadApi,
  deleteThoughtApi,
  updateThoughtApi,
  createThoughtApi,
} from "../../../../Networking/Admin/APIs/forumApi";
import { capitalFunction } from "../../../../Component/capitalLetter";
import {
  Avatar,
  AdminBadge,
  PostTypeBadge,
  TimeStamp,
  REACTIONS,
} from "./ForumAtoms";
import { MediaDisplay } from "./MediaDisplay";
import { ReactionButton } from "./ReactionButton";
import { CommentItem, CommentInput } from "./CommentSection";
import { ConfirmModal } from "./ConfirmModal";
import "../forum.css";

export const PostCard = ({
  thread,
  userdata,
  onDelete,
  deletingId,
  onThreadUpdate,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [isExistingFile, setIsExistingFile] = useState(false);
  const [showDeleteThoughtModal, setShowDeleteThoughtModal] = useState(false);
  const [thoughtToDelete, setThoughtToDelete] = useState(null);

  const [localReaction, setLocalReaction] = useState(
    thread.user_reaction || null,
  );
  const [localReactionCounts, setLocalReactionCounts] = useState(
    thread.reactions || { like: 0, insightful: 0, celebrate: 0 },
  );

  const reactionTotal = Object.values(localReactionCounts).reduce(
    (a, b) => a + b,
    0,
  );
  const commentCount = thread.thought_count || 0;

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await dispatch(getThreadhistory(thread.id)).unwrap();
      setComments(response.thoughts || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      setShowComments(true);
      fetchComments();
    } else {
      setShowComments(false);
    }
  };

  const handleReact = useCallback(
    async (reaction) => {
      try {
        await dispatch(
          reactToThreadApi({ thread_id: thread.id, reaction }),
        ).unwrap();

        setLocalReaction((prev) => (prev === reaction ? null : reaction));
        setLocalReactionCounts((prev) => {
          const newCounts = { ...prev };
          const isSame = localReaction === reaction;

          if (isSame) {
            newCounts[reaction] = Math.max(0, (newCounts[reaction] || 0) - 1);
          } else {
            newCounts[reaction] = (newCounts[reaction] || 0) + 1;
            if (localReaction) {
              newCounts[localReaction] = Math.max(
                0,
                (newCounts[localReaction] || 0) - 1,
              );
            }
          }
          return newCounts;
        });
      } catch (error) {
        toast.error("Failed to add reaction");
      }
    },
    [dispatch, thread.id, localReaction, onThreadUpdate],
  );

  const handleEdit = (id, content, thought) => {
    setEditingId(id);
    setCommentText(content || "");
    if (thought?.has_media || thought?.has_file) {
      setIsExistingFile(true);
      setSelectedFile(null);
      setSelectedFilePreview({
        name: thought.media_name || thought.file_name,
        url: thought.media_url || thought.file_url,
      });
    } else {
      setIsExistingFile(false);
      setSelectedFile(null);
      setSelectedFilePreview(null);
    }
    setShowComments(true);
  };

  const handleDeleteThought = (threadId, thoughtId) => {
    setThoughtToDelete({ threadId, thoughtId });
    setShowDeleteThoughtModal(true);
  };

  const confirmDeleteThought = async () => {
    const { threadId, thoughtId } = thoughtToDelete;
    setLoadingId(thoughtId);
    setShowDeleteThoughtModal(false);
    try {
      await dispatch(
        deleteThoughtApi({ thread_id: threadId, thought_id: thoughtId }),
      ).unwrap();
      setComments((prev) => prev.filter((c) => c.id !== thoughtId));
      if (editingId === thoughtId) {
        setEditingId(null);
        setCommentText("");
        setSelectedFile(null);
        setSelectedFilePreview(null);
        setIsExistingFile(false);
      }
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setLoadingId(null);
      setThoughtToDelete(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Only images, PDFs, and Word documents are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
    setSelectedFilePreview({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
    });
    e.target.value = null;
  };

  const handleSendComment = async () => {
    if (!commentText.trim() && !selectedFile && !isExistingFile) return;
    setSending(true);
    try {
      const formData = new FormData();
      if (commentText.trim()) formData.append("content", commentText.trim());
      if (selectedFile) formData.append("file", selectedFile);
      if (isExistingFile && !selectedFile)
        formData.append("keep_existing_file", "true");

      if (editingId) {
        await dispatch(
          updateThoughtApi({
            thread_id: thread.id,
            thought_id: editingId,
            data: formData,
          }),
        ).unwrap();
        toast.success("Comment updated");
      } else {
        await dispatch(
          createThoughtApi({ thread_id: thread.id, data: formData }),
        ).unwrap();
        toast.success("Comment added");
      }

      setCommentText("");
      setSelectedFile(null);
      setSelectedFilePreview(null);
      setIsExistingFile(false);
      setEditingId(null);
      await fetchComments();
      setShowComments(true);
    } catch (error) {
      toast.error(
        editingId ? "Failed to update comment" : "Failed to add comment",
      );
    } finally {
      setSending(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCommentText("");
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setIsExistingFile(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setIsExistingFile(false);
  };

  const displayTitle =
    thread.title === "undefined" ? "Untitled Post" : thread.title;
  const displayContent = thread.content === "undefined" ? "" : thread.content;
  const displayPostType =
    thread.post_type === "undefined" ? null : thread.post_type;

  return (
    <>
      <div className="li-card mb-3">
        <div className="d-flex align-items-start gap-3 mb-3">
          <Avatar name={thread.author_name} size={48} />
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center flex-wrap gap-1">
              <span className="fw-semibold li-card-author-name">
                {capitalFunction(thread.author_name || "Unknown")}
              </span>
              {thread.author_role === "admin" && <AdminBadge />}
              <PostTypeBadge postType={displayPostType} />
            </div>
            <TimeStamp dateString={thread.created_at} />
          </div>

          {(userdata?.role === "admin" ||
            Number(thread.author_uid) === userdata?.id) && (
            <button
              className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle li-card-delete-btn"
              onClick={() => onDelete(thread.id)}
              title="Delete post"
            >
              {deletingId === thread.id ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <MoreHorizontal size={18} />
              )}
            </button>
          )}
        </div>

        <div className="mb-3">
          <div className="li-card-body-text">
            <strong>{displayTitle}</strong>

            {displayContent && (
              <div className="li-card-content-wrap li-markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children, ...props }) => <p {...props}>{children}</p>,
                    strong: ({ children, ...props }) => (
                      <strong {...props}>{children}</strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em {...props}>{children}</em>
                    ),
                    h1: ({ children, ...props }) => (
                      <h1 {...props}>{children}</h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 {...props}>{children}</h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 {...props}>{children}</h3>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul {...props}>{children}</ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol {...props}>{children}</ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li {...props}>{children}</li>
                    ),
                    a: ({ href, children, ...props }) => (
                      <a
                        {...props}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ inline, children, ...props }) =>
                      inline ? (
                        <code {...props} className="li-inline-code">
                          {children}
                        </code>
                      ) : (
                        <code {...props}>{children}</code>
                      ),
                    pre: ({ children, ...props }) => (
                      <pre {...props}>{children}</pre>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote {...props}>{children}</blockquote>
                    ),
                    table: ({ children, ...props }) => (
                      <table {...props}>{children}</table>
                    ),
                    th: ({ children, ...props }) => (
                      <th {...props}>{children}</th>
                    ),
                    td: ({ children, ...props }) => (
                      <td {...props}>{children}</td>
                    ),
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <MediaDisplay post={thread} />
        </div>

        {(reactionTotal > 0 || commentCount > 0) && (
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 li-reaction-count-bar">
            <span className="d-flex align-items-center gap-1">
              {REACTIONS.filter((r) => (localReactionCounts[r.apiKey] || 0) > 0)
                .slice(0, 3)
                .map((r) => (
                  <r.icon key={r.apiKey} size={14} color={r.color} />
                ))}
              {reactionTotal > 0 && (
                <span className="ms-1">{reactionTotal}</span>
              )}
            </span>
            {commentCount > 0 && (
              <button
                className="btn btn-link p-0 li-comment-count-btn"
                onClick={toggleComments}
              >
                {commentCount} comment{commentCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        <div
          className={`d-flex gap-1 li-action-row ${reactionTotal > 0 || commentCount > 0 ? "border-top-0" : "border-top"}`}
        >
          <ReactionButton
            postId={thread.id}
            userReaction={localReaction}
            reactionCounts={localReactionCounts}
            onReact={handleReact}
          />
          <button className="li-action-btn" onClick={toggleComments}>
            <MessageSquare size={18} className="me-1" />
            Comment
          </button>
        </div>

        {showComments && (
          <div className="mt-3 li-comments-section-wrap">
            {loadingComments ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" variant="secondary" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center li-no-comments-text">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((c) => (
                <CommentItem
                  key={c.id}
                  msg={c}
                  userdata={userdata}
                  selectedThread={thread}
                  onEdit={handleEdit}
                  onDelete={handleDeleteThought}
                  loadingId={loadingId}
                />
              ))
            )}
            <CommentInput
              userdata={userdata}
              commentText={commentText}
              setCommentText={setCommentText}
              selectedFile={selectedFile}
              selectedFilePreview={selectedFilePreview}
              isExistingFile={isExistingFile}
              editingId={editingId}
              sending={sending}
              onSend={handleSendComment}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onCancelEdit={handleCancelEdit}
              fileInputRef={fileInputRef}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        show={showDeleteThoughtModal}
        onHide={() => setShowDeleteThoughtModal(false)}
        title="Delete Comment"
        body="Are you sure you want to delete this comment?"
        onConfirm={confirmDeleteThought}
        loading={loadingId === thoughtToDelete?.thoughtId}
      />
    </>
  );
};
