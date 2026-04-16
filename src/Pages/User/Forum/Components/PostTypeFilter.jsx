import React from "react";
import { Filter } from "lucide-react";
import { POST_TYPES } from "./ForumAtoms";
import "../forum.css";

export const PostTypeFilter = ({ active, onChange }) => (
  <div className="d-flex gap-2 flex-wrap mb-3">
    <Filter
      size={20}
      className="text-muted me-1"
    />
    {POST_TYPES.map((type) => (
      <button
        key={type.value}
        className={`btn btn-sm rounded-pill li-filter-btn ${
          active === type.value
            ? "btn-secondary text-white"
            : "btn-outline-secondary text-muted"
        }`}
        onClick={() => onChange(type.value)}
      >
        {type.label}
      </button>
    ))}
  </div>
);
