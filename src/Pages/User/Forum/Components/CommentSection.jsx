import React from "react";
import { Spinner } from "react-bootstrap";
import { Paperclip, X, Send } from "lucide-react";
import { Avatar, AdminBadge, TimeStamp } from "./ForumAtoms";
import { MediaDisplay } from "./MediaDisplay";
import { capitalFunction } from "../../../../Component/capitalLetter";
import "../forum.css";

export const FileAttachPreview = ({ preview, onRemove }) => {
  if (!preview) return null;
  return (
    <div className="d-flex align-items-center gap-2 mb-2 p-2 rounded-3 li-file-preview">
      <Paperclip size={14} className="text-muted" />
      <span className="flex-grow-1 text-truncate li-file-preview-text">
        {preview.name}
      </span>
      <button
        className="btn btn-link p-0 text-danger li-comment-action-links"
        onClick={onRemove}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const CommentInput = ({
  userdata,
  commentText,
  setCommentText,
  selectedFile,
  selectedFilePreview,
  isExistingFile,
  editingId,
  sending,
  onSend,
  onFileSelect,
  onRemoveFile,
  onCancelEdit,
  fileInputRef,
}) => (
  <div className="d-flex gap-2 mt-2 align-items-start">
    <Avatar name={userdata?.name || "Me"} size={36} />
    <div className="flex-grow-1">
      <FileAttachPreview
        preview={selectedFilePreview}
        onRemove={onRemoveFile}
      />
      <div className="d-flex align-items-center gap-2">
        <div className="flex-grow-1 d-flex align-items-center rounded-pill px-3 li-comment-input-wrap">
          <input
            className="flex-grow-1 border-0 li-comment-input-field"
            placeholder={editingId ? "Editing comment…" : "Add a comment…"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <label
            className="ms-1 li-comment-attach-icon"
            title="Attach file"
          >
            <Paperclip size={16} />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*,.pdf,.doc,.docx"
              onChange={onFileSelect}
            />
          </label>
        </div>

        {(commentText.trim() || selectedFile || isExistingFile) && (
          <button
            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center li-send-btn"
            onClick={onSend}
            disabled={sending}
          >
            {sending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Send size={14} />
            )}
          </button>
        )}
      </div>

      {editingId && (
        <button
          className="btn btn-link p-0 text-muted mt-1 li-comment-action-links"
          onClick={onCancelEdit}
        >
          Cancel editing
        </button>
      )}
    </div>
  </div>
);

export const CommentItem = ({
  msg,
  userdata,
  selectedThread,
  onEdit,
  onDelete,
  loadingId,
}) => {
  const canAct =
    sessionStorage.getItem("role");

  if (msg.deleted) {
    return (
      <div className="d-flex gap-2 mb-3">
        <Avatar name="?" size={32} />
        <p className="text-danger fst-italic mb-0 li-no-comments-text">
          This comment was deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex gap-2 mb-3">
      <Avatar name={msg.author_name} size={32} />
      <div className="flex-grow-1">
        <div className="p-2 px-3 rounded-3 li-comment-bubble">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-semibold li-comment-bubble-name">
              {capitalFunction(msg.author_name || "Unknown")}
            </span>
            {msg.author_role === "admin" && <AdminBadge />}
          </div>
          <p className="mb-0 li-comment-bubble-text">
            {msg.content}
          </p>
          <MediaDisplay post={msg} />
        </div>

        <div className="d-flex align-items-center gap-3 mt-1 ps-1">
          <TimeStamp dateString={msg.created_at} />
          {canAct == "admin" && (
            <>
              <button
                className="btn btn-link p-0 text-muted li-comment-action-links"
                onClick={() => onEdit(msg.id, msg.content, msg)}
              >
                Edit
              </button>
              <button
                className="btn btn-link p-0 text-danger li-comment-action-links"
                onClick={() => onDelete(selectedThread.id, msg.id)}
                disabled={loadingId === msg.id}
              >
                {loadingId === msg.id ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Delete"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
