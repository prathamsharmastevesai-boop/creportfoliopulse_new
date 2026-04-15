import React from "react";
import { Button, Spinner } from "react-bootstrap";

const ForceInviteModal = ({ show, inviteLoading, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 px-4 pt-4">
            <h5 className="fw-bold">User Already Exists</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body px-4">
            This user is already associated with another company.
            <br />
            Do you want to invite them to this company as well?
          </div>
          <div className="modal-footer border-0 px-4 pb-4">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              {inviteLoading ? <Spinner size="sm" /> : "Agree & Invite"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForceInviteModal;
