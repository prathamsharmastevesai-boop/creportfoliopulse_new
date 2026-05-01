import React from "react";
import { Image, FileText, Video } from "lucide-react";
import { Avatar } from "./ForumAtoms";
import "../forum.css";

export const CreatePostBox = ({ userdata, onOpenModal }) => (
  <div className="li-card mb-3">
    <div className="d-flex gap-3 align-items-center">
      <Avatar name={userdata?.name} photo={userdata?.photo_url} size={40} />
      <button
        className="flex-grow-1 text-start px-4 rounded-pill border-0 li-create-post-trigger"
        onClick={onOpenModal}
      >
        Start a post or share a thread…
      </button>
    </div>
    <div className="d-flex gap-2 mt-3 pt-2 li-media-btns-row">
      <button className="li-media-btn" onClick={onOpenModal}>
        <Image size={18} className="text-primary me-2" /> Photo
      </button>
      <button className="li-media-btn" onClick={onOpenModal}>
        <FileText size={18} className="text-warning me-2" /> Document
      </button>
      {/* <button className="li-media-btn" onClick={onOpenModal}>
        <Video size={18} className="text-danger me-2" /> Thread
      </button> */}
    </div>
  </div>
);
