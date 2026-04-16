import React from "react";
import "../forum.css";

export const EmptyFeed = ({ onCreatePost }) => (
  <div className="li-card text-center py-5">
    <div className="li-empty-icon">
      📝
    </div>
    <p className="li-empty-text-main">
      No posts found
    </p>
    <p className="li-empty-text-sub">
      Be the first to create a portfolio thread!
    </p>
    <button
      className="btn btn-sm mt-2 li-empty-create-btn"
      onClick={onCreatePost}
    >
      + Create Post
    </button>
  </div>
);
