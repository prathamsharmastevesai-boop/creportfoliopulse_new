import React from "react";
import { ThumbsUp, Lightbulb, PartyPopper } from "lucide-react";
import "../forum.css";

export const REACTIONS = [
  { icon: ThumbsUp, label: "Like", apiKey: "like", color: "#0A66C2" },
  {
    icon: Lightbulb,
    label: "Insightful",
    apiKey: "insightful",
    color: "#915907",
  },
  {
    icon: PartyPopper,
    label: "Celebrate",
    apiKey: "celebrate",
    color: "#2E7D32",
  },
];

export const POST_TYPES = [
  { value: null, label: "All" },
  { value: "update", label: "Updates" },
  { value: "off_market", label: "Off Market" },
  { value: "question", label: "Questions" },
  { value: "event", label: "Events" },
];

export const relativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 0) return "Just now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (weeks === 1) return "1 week ago";
  if (weeks < 4) return `${weeks}w ago`;
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months}mo ago`;
  if (years === 1) return "1 year ago";
  return `${years}y ago`;
};

export const Avatar = ({ name, size = 40, className = "" }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const palette = [
    "var(--accent-color)",
    "var(--bs-green-primary)",
    "var(--bs-btn-delete-bg)",
    "#7a3e9d",
    "#d4a017",
    "#1d6363",
  ];
  const bg = palette[initials.charCodeAt(0) % palette.length];
  return (
    <div
      className={`li-avatar-base ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
};

export const AdminBadge = () => (
  <span className="badge ty-badge li-admin-badge">Admin</span>
);

export const PostTypeBadge = ({ postType }) => {
  if (!postType || postType === "undefined") return null;
  const colors = {
    update: { bg: "#e8f4fd", color: "#1565c0" },
    off_market: { bg: "#fce4ec", color: "#880e4f" },
    question: { bg: "#f3e5f5", color: "#6a1b9a" },
    event: { bg: "#e8f5e9", color: "#1b5e20" },
  };
  const style = colors[postType] || { bg: "#f5f5f5", color: "#333" };
  return (
    <span
      className="badge ms-2 li-post-type-badge"
      style={{
        background: style.bg,
        color: style.color,
      }}
    >
      {postType.replace("_", " ")}
    </span>
  );
};

export const TimeStamp = ({ dateString }) => (
  <span className="ty-caption text-muted">{relativeTime(dateString)}</span>
);
