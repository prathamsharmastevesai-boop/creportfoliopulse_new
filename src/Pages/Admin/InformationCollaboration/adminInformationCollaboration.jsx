import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getadminfeedbacksubmit } from "../../../Networking/Admin/APIs/feedbackApi";
import { Modal, Button, Form } from "react-bootstrap";
import RAGLoader from "../../../Component/Loader";
import Pagination from "../../../Component/pagination";
import {
  DeleteFeedbackSubmit,
  ReviewInformationCollaboration,
} from "../../../Networking/User/APIs/Feedback/feedbackApi";
import { EditInformationCollaboration } from "../../User/UserInformationCollaboration/editInformationCollaboration";

export const AdminInformationCollaboration = () => {
  const dispatch = useDispatch();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchSubmissions = async () => {
    try {
      const data = await dispatch(getadminfeedbacksubmit()).unwrap();
      setSubmissions(data.entries || []);
      setRole(data.current_user_role);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentSubmissions = submissions
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(indexOfFirstItem, indexOfLastItem);

  const openEditModal = (submission) => {
    setSelectedSubmission({ ...submission });
    setEditModal(true);
  };

  const openViewModal = (submission) => {
    setSelectedSubmission(submission);
    setViewModal(true);
  };

  const openDeleteModal = (id) => setDeleteId(id);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(DeleteFeedbackSubmit(deleteId)).unwrap();
      setSubmissions((prev) => prev.filter((item) => item.id !== deleteId));
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (updatingStatusId) return;

    setUpdatingStatusId(id);
    try {
      await dispatch(
        ReviewInformationCollaboration({
          id,
          decision: newStatus,
        }),
      ).unwrap();

      fetchSubmissions();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatLabel = (key) => {
    return key
      .trim()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div
        className="d-flex p-1 justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <RAGLoader />
      </div>
    );
  }

  return (
    <div className="collab-wrapper p-3">
      {submissions.length === 0 ? (
        <div className="text-center py-5">
          <h5>No submissions found</h5>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubmissions.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.user_name}</td>
                    <td>{item.category}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      {updatingStatusId === item.id ? (
                        "Updating..."
                      ) : role !== "admin" ? (
                        <span
                          className={`badge rounded-pill ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      ) : (
                        <Form.Select
                          size="sm"
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className={`border-0 rounded-pill ${getStatusBadge(item.status)}`}
                        >
                          <option disabled value="pending">
                            Pending
                          </option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </Form.Select>
                      )}
                    </td>
                    <td className="text-center table-icons">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle me-2"
                        onClick={() => openViewModal(item)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            className="btn btn-outline-warning btn-sm rounded-circle me-2"
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            onClick={() => openDeleteModal(item.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={submissions.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      <Modal
        show={viewModal}
        onHide={() => setViewModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Submission Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <>
              <p>
                <strong>User:</strong> {selectedSubmission.user_name}
              </p>
              <p>
                <strong>Category:</strong> {selectedSubmission.category}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubmission.status}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(selectedSubmission.created_at).toLocaleString()}
              </p>

              <hr />
              <h6>Submitted Information</h6>

              <div className="border rounded p-3">
                {selectedSubmission.form_data &&
                  Object.entries(selectedSubmission.form_data).map(
                    ([key, value]) => (
                      <p key={key}>
                        <strong>{formatLabel(key)}:</strong> {value?.toString()}
                      </p>
                    ),
                  )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editModal}
        onHide={() => setEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <EditInformationCollaboration
              key={selectedSubmission.id}
              data={selectedSubmission}
              onClose={() => setEditModal(false)}
              onSuccess={fetchSubmissions}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this submission?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
