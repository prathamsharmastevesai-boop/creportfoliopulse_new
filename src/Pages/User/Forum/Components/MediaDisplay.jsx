import React from "react";
import "../forum.css";

export const MediaDisplay = ({ post }) => {
  const mediaUrl = post.media_url || post.file_url;
  const mediaName = post.media_name || post.file_name;

  if ((!post.has_media && !post.has_file) || !mediaUrl) return null;

  const isImage =
    mediaUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
    mediaName?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

  if (isImage) {
    return (
      <div className="mt-3 rounded-3 overflow-hidden">
        <img
          src={mediaUrl}
          alt={mediaName || "Post image"}
          className="li-post-image-preview"
          onClick={() => window.open(mediaUrl, "_blank")}
          onError={(e) => {
            e.target.style.display = "none";
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML =
                '<div class="p-3 text-center text-muted">Failed to load image</div>';
            }
          }}
        />
      </div>
    );
  }

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="d-flex align-items-center gap-2 mt-3 p-3 rounded-3 text-decoration-none li-file-preview"
    >
      <i className="bi bi-file-earmark fs-4" />
      <div>
        <div className="fw-semibold li-file-preview-text">
          {mediaName || "Attachment"}
        </div>
      </div>
    </a>
  );
};
