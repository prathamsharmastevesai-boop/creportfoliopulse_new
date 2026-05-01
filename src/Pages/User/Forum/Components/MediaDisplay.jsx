import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Download, Globe } from "lucide-react";

const LinkPreview = ({ url }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.status === "success") {
          setPreviewData(data.data);
        }
      } catch (error) {
        console.error("Link preview error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className="li-link-skeleton d-flex align-items-center gap-3 p-3 rounded-3" style={{ marginTop: "16px" }}>
        <div className="li-skeleton-icon"></div>
        <div className="flex-grow-1">
          <div className="li-skeleton-line w-75 mb-2"></div>
          <div className="li-skeleton-line w-50"></div>
        </div>
      </div>
    );
  }

  if (!previewData) {
    const domain = new URL(url).hostname;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="li-link-thumbnail text-decoration-none d-flex align-items-center gap-3 p-3 rounded-3"
        style={{ marginTop: "16px" }}
      >
        <div className="li-link-icon-box">
          <ExternalLink size={24} />
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <div className="fw-semibold text-truncate" style={{ color: "var(--text-primary)" }}>
            {domain}
          </div>
          <div className="text-muted small text-truncate">{url}</div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="li-link-thumbnail-rich text-decoration-none d-block"
    >
      {previewData.image && (
        <div className="li-link-thumbnail-image-wrap">
          <img src={previewData.image.url} alt="Link Preview" />
        </div>
      )}
      <div className="p-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          {previewData.logo ? (
            <img src={previewData.logo.url} alt="" className="rounded-circle" style={{ width: 16, height: 16, objectFit: "contain" }} />
          ) : (
            <Globe size={12} className="text-muted" />
          )}
          <span className="text-muted small text-uppercase fw-bold" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
            {previewData.publisher || new URL(url).hostname}
          </span>
        </div>
        <div className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "var(--fs-body)" }}>
          {previewData.title}
        </div>
        {previewData.description && (
          <p className="text-muted small mb-0 li-link-desc line-clamp-2">
            {previewData.description}
          </p>
        )}
      </div>
    </a>
  );
};

export const MediaDisplay = ({ post, isComment = false }) => {
  const mediaUrl = post.media_url || post.file_url;
  const mediaName = post.media_name || post.file_name || "Attachment";
  const content = post.content || "";

  const urlRegex = /(https?:\/\/[^\s]+)/;
  const firstUrl = content.match(urlRegex)?.[0];

  const renderMedia = () => {
    if ((!post.has_media && !post.has_file) || !mediaUrl) return null;

    const getExt = (url) => {
      try {
        const path = new URL(url).pathname;
        return path.split(".").pop().toLowerCase();
      } catch (e) {
        return url.split(".").pop().toLowerCase().split("?")[0];
      }
    };

    const ext = getExt(mediaUrl);
    const isImage =
      ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ||
      mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i);
    const isPDF = ext === "pdf";
    const isVideo = ["mp4", "webm", "ogg"].includes(ext);
    const isAudio = ["mp3", "wav", "aac"].includes(ext);
    const isDoc = ["doc", "docx"].includes(ext);
    const isExcel = ["xls", "xlsx", "csv"].includes(ext);

    if (isImage) {
      return (
        <div className={isComment ? "" : "li-post-image-container"}>
          <img
            src={mediaUrl}
            alt={mediaName}
            className={isComment ? "li-comment-image-preview" : "li-post-image-preview"}
            onClick={() => window.open(mediaUrl, "_blank")}
            onError={(e) => {
              e.target.style.display = "none";
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="p-3 text-center text-muted small border rounded">Failed to load content</div>';
              }
            }}
          />
        </div>
      );
    }

    if (isPDF || isDoc || isExcel) {
      const previewUrl = isPDF
        ? mediaUrl
        : `https://docs.google.com/viewer?url=${encodeURIComponent(mediaUrl)}&embedded=true`;

      return (
        <div className="li-doc-preview-container">
          <div className="li-doc-preview-header d-flex align-items-center justify-content-between p-2 px-3">
            <div className="d-flex align-items-center gap-2">
              <FileText size={18} />
              <span className="small fw-medium text-truncate" style={{ maxWidth: "300px" }}>
                {mediaName}
              </span>
            </div>
            <button
              className="btn btn-sm btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
              onClick={() => window.open(mediaUrl, "_blank")}
            >
              <Download size={14} />
              <span className="small">Download</span>
            </button>
          </div>
          <iframe
            src={previewUrl}
            title="Document Preview"
            width="100%"
            height={isComment ? "300px" : "450px"}
            style={{ border: "none", background: "#f8f9fa" }}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="li-doc-preview-container">
          <video controls width="100%" className="d-block" style={{ maxHeight: "450px" }}>
            <source src={mediaUrl} type={`video/${ext}`} />
            Your browser does not support video.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="li-doc-preview-container p-3">
          <div className="fw-semibold mb-2">{mediaName}</div>
          <audio controls style={{ width: "100%" }}>
            <source src={mediaUrl} type={`audio/${ext}`} />
            Your browser does not support audio.
          </audio>
        </div>
      );
    }

    return (
      <a
        href={mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="li-link-thumbnail text-decoration-none d-flex align-items-center gap-2 p-3 rounded-3"
        style={{ marginTop: "16px" }}
      >
        <FileText size={24} />
        <div className="fw-semibold">{mediaName}</div>
      </a>
    );
  };

  const renderLinkPreviewFromUrl = () => {
    if (!firstUrl || post.has_media || post.has_file) return null;
    return <LinkPreview url={firstUrl} />;
  };

  return (
    <div className="li-media-display-standard-group">
      {renderMedia()}
      {renderLinkPreviewFromUrl()}
    </div>
  );
};
