import React from "react";
import { Button, Spinner } from "react-bootstrap";

const ConfirmDeleteModal = ({
  show,
  selectedEmail,
  deleteLoading,
  onClose,
  onDelete,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 px-4 pt-4">
            <h5 className="fw-bold">Confirm Delete</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body px-4">
            Are you sure you want to delete <strong>{selectedEmail}</strong>?
          </div>
          <div className="modal-footer border-0 px-4 pb-4">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDelete}>
              {deleteLoading ? <Spinner size="sm" /> : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
