import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createThread,
  get_Threads_Api,
  updateThreadApi,
} from "../../../Networking/Admin/APIs/forumApi";
import { toast } from "react-toastify";

export const CreateThread = ({ onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title === "undefined" ? "" : (initialData?.title || ""));
  const [content, setContent] = useState(initialData?.content === "undefined" ? "" : (initialData?.content || ""));
  const [postType, setPostType] = useState(initialData?.post_type || "update");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a thread title");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        const payload = {
          title: title.trim(),
          content: content.trim(),
          post_type: postType,
        };

        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("content", payload.content);
        formData.append("post_type", payload.post_type);
        if (file) {
          formData.append("file", file);
        } else if (removeFile) {
          formData.append("remove_file", "true");
        } else {
          formData.append("keep_existing_file", "true");
        }

        await dispatch(
          updateThreadApi({
            thread_id: initialData.id,
            data: formData,
          }),
        ).unwrap();

      } else {
        await dispatch(
          createThread({
            title,
            content,
            post_type: postType,
            file,
          }),
        ).unwrap();

      }

      await dispatch(get_Threads_Api()).unwrap();
      if (onClose) onClose();
    } catch (err) {

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
          <option value="offmarket">OFF Market</option>
          <option value="question">Questions</option>
          <option value="event">Event</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload File</Form.Label>
        {isEdit && initialData?.media_url && !removeFile && (
          <div className="d-flex align-items-center gap-2 mb-2 p-2 border rounded">
            <span className="text-truncate small flex-grow-1">
              {initialData.media_name || "Existing File"}
            </span>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setRemoveFile(true)}
            >
              Remove
            </Button>
          </div>
        )}
        {(!isEdit || !initialData?.media_url || removeFile) && (
          <Form.Control
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setRemoveFile(false);
            }}
          />
        )}
      </Form.Group>

      <Button
        variant="primary"
        className="w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Post" : "+ Create Thread")}
      </Button>
    </div>
  );
};
