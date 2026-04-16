import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createThread,
  get_Threads_Api,
} from "../../../Networking/Admin/APIs/forumApi";
import { toast } from "react-toastify";

export const CreateThread = ({ onClose }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("update");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a thread title");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createThread({
          title,
          content,
          post_type: postType,
          file,
        })
      ).unwrap();

      await dispatch(get_Threads_Api()).unwrap();

      setTitle("");
      setContent("");
      setFile(null);

      if (onClose) onClose();
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Thread Title</Form.Label>
        <Form.Control
          placeholder="Enter thread title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Post Type</Form.Label>
        <Form.Select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option value="update">Update</option>
          <option value="discussion">Discussion</option>
          <option value="announcement">Announcement</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload File</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>

      <Button
        variant="primary"
        className="w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "+ Create Thread"}
      </Button>
    </div>
  );
};