import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../forum.css";

export const ConfirmModal = ({ show, onHide, title, body, onConfirm, loading }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header
      closeButton
      className="li-modal-header-custom"
    >
      <Modal.Title className="li-modal-title-custom">
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="li-modal-body-custom">
      {body}
    </Modal.Body>
    <Modal.Footer className="li-modal-footer-custom">
      <button
        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
        onClick={onHide}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="btn btn-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading && <Spinner size="sm" animation="border" />}
        Confirm Delete
      </button>
    </Modal.Footer>
  </Modal>
);
