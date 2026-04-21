import React, { useEffect, useState } from "react";
import { Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { inviteUserApi } from "../../../Networking/Admin/APIs/UserManagement";
import { useradmindeleteapi } from "../../../Networking/Admin/APIs/LoginAPIs";
import { toggleUserFeaturesApi } from "../../../Networking/Admin/APIs/forumApi";
import { getAdminlistApi } from "../../../Networking/SuperAdmin/AdminSuperApi";
import { getProfileByEmailApi } from "../../../Networking/User/APIs/Profile/ProfileApi";

import Card from "../../../Component/Card/Card";
import RAGLoader from "../../../Component/Loader";
import PageHeader from "../../../Component/PageHeader/PageHeader";
import { capitalFunction } from "../../../Component/capitalLetter";

import BuildingPermissionsModal from "./buildingPermissionsModal";
import FeatureAccessModal from "./featureAccessModal";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";
import ForceInviteModal from "./ForceInviteModal";
import {
  getDefaultFeatures,
  mapUserFeatures,
  getFeatureMeta,
} from "./featureConfig";

export const UserManagement = () => {
  const dispatch = useDispatch();

  const owner = sessionStorage.getItem("is_owner") === "true";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [features, setFeatures] = useState(getDefaultFeatures());

  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [togglingFeature, setTogglingFeature] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("");

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForceInvite, setShowForceInvite] = useState(false);

  const [pendingInviteEmail, setPendingInviteEmail] = useState("");

  const [manageLoading, setManageLoading] = useState("");

  const [buildingModal, setBuildingModal] = useState({
    show: false,
    category: "",
    featureLabel: "",
  });

  const [is_owner_admin, setOwneradmin] = useState("");
  console.log(is_owner_admin, "is_owner_admin");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const roleIcon = (role) => {
    const icons = {
      admin: "bi-shield-check",
      user: "bi-person",
      superadmin: "bi-shield-fill-check",
    };
    return icons[(role ?? "").toLowerCase()] ?? "bi-person-badge";
  };

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
    const is_owner_admin = sessionStorage.getItem("is_owner_admin");
    setOwneradmin(is_owner_admin);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getAdminlistApi()).unwrap();
      setUsers(res || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!emailRegex.test(email)) return toast.error("Enter valid email");
    if (!role) return toast.error("Please select a role");

    try {
      setInviteLoading(true);
      const res = await dispatch(inviteUserApi({ email, role })).unwrap();

      if (res?.warning) {
        setPendingInviteEmail(res.email);
        setShowForceInvite(true);
        return;
      }

      setEmail("");
      setRole("");
      fetchUsers();
    } catch {
    } finally {
      setInviteLoading(false);
    }
  };

  const handleForceInvite = async () => {
    try {
      setInviteLoading(true);
      await dispatch(
        inviteUserApi({
          email: pendingInviteEmail,
          role,
          force_invite: true,
        }),
      ).unwrap();

      setShowForceInvite(false);
      setEmail("");
      setRole("");
      fetchUsers();
    } catch {
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(selectedEmail);
      await dispatch(
        useradmindeleteapi({
          email: selectedEmail,
          role: selectedUser?.role,
        }),
      ).unwrap();

      fetchUsers();
      setShowConfirm(false);
    } catch {
    } finally {
      setDeleteLoading("");
    }
  };

  const openFeatureModal = async (user) => {
    try {
      setManageLoading(user.email);
      const res = await dispatch(
        getProfileByEmailApi({ email: user.email }),
      ).unwrap();

      setSelectedUser(user);
      setFeatures(mapUserFeatures(res));
      setShowFeatureModal(true);
    } catch {
    } finally {
      setManageLoading("");
    }
  };

  const handleFeatureToggle = async (featureKey, checked) => {
    const meta = getFeatureMeta(featureKey);
    const updated = { ...features, [featureKey]: checked };

    setFeatures(updated);
    setTogglingFeature(featureKey);

    try {
      await dispatch(
        toggleUserFeaturesApi({
          email: selectedUser.email,
          features: updated,
        }),
      ).unwrap();

      if (checked && meta?.buildingCategory) {
        setBuildingModal({
          show: true,
          category: meta.buildingCategory,
          featureLabel: meta.label,
        });
      }
    } catch {
      setFeatures((prev) => ({ ...prev, [featureKey]: !checked }));
    } finally {
      setTogglingFeature("");
    }
  };

  return (
    <div className="container-fluid p-2 p-md-3">
      <PageHeader
        title="User Management"
        subtitle="Manage user access and feature configurations"
      />

      <Card variant="elevated" className="mb-4" title="Invite User">
        <Row className="g-3 align-items-end">
          <Col xs={12} md={5}>
            <Form.Label className="small fw-semibold">Email Address</Form.Label>
            <Form.Control
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="small fw-semibold">User Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={4}>
            <Button
              className="w-100 py-2"
              variant="primary"
              onClick={handleInviteUser}
              disabled={inviteLoading}
            >
              {inviteLoading ? <Spinner size="sm" /> : "Invite User"}
            </Button>
          </Col>
        </Row>
      </Card>

      <Card variant="elevated" noPadding title="Registered Users">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="table-light text-uppercase small fw-bold">
                <th className="ps-4">Email</th>
                <th>Company Name</th>
                <th>Status</th>
                <th>Role</th>
                <th>Created</th>
                {!is_owner_admin && <th>Features</th>}
                {owner == true && <th className="pe-4 text-end">Delete</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <RAGLoader />
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr key={user.email}>
                    <td className="ps-4 text-break">{user.email || "--"}</td>
                    <td>{capitalFunction(user.company_name || "—") || "--"}</td>
                    <td>
                      <span
                        className={`badge rounded-pill bg-${
                          user.status === "Active" ? "success" : "warning"
                        } bg-opacity-10 text-${
                          user.status === "Active" ? "success" : "warning"
                        }`}
                      >
                        {user.status || "--"}
                      </span>
                    </td>

                    <td>
                      <span className="d-flex align-items-center">
                        <i
                          className={`bi ${roleIcon(user.role)} text-secondary`}
                        />
                        {user.role ?? "—"}
                        <span className="text-danger">
                          {" "}
                          {user.role == "admin"
                            ? user.is_owner == true && "(owner)"
                            : null}
                        </span>
                      </span>
                    </td>
                    <td>
                      {user.created
                        ? new Date(user.created).toLocaleDateString()
                        : "--"}
                    </td>
                    {!is_owner_admin && (
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openFeatureModal(user)}
                          disabled={
                            manageLoading === user.email ||
                            user.role === "admin"
                          }
                        >
                          {manageLoading === user.email &&
                          user.role === "user" ? (
                            <>
                              <Spinner size="sm" className="me-1" />
                              Loading...
                            </>
                          ) : (
                            "Manage"
                          )}
                        </Button>
                      </td>
                    )}
                    {owner == true && (
                      <td className="pe-4 text-end">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setSelectedEmail(user.email);
                            setSelectedUser(user);
                            setShowConfirm(true);
                          }}
                          disabled={deleteLoading === user.email}
                        >
                          {deleteLoading === user.email ? (
                            <>
                              <Spinner size="sm" className="me-1" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showFeatureModal && selectedUser && (
        <FeatureAccessModal
          selectedUser={selectedUser}
          features={features}
          togglingFeature={togglingFeature}
          onClose={() => {
            setShowFeatureModal(false);
            fetchUsers();
          }}
          onToggleFeature={handleFeatureToggle}
          onOpenBuildingModal={(category, featureLabel) =>
            setBuildingModal({ show: true, category, featureLabel })
          }
        />
      )}

      {buildingModal.show && selectedUser && (
        <BuildingPermissionsModal
          userEmail={selectedUser.email}
          featureLabel={buildingModal.featureLabel}
          category={buildingModal.category}
          onClose={() =>
            setBuildingModal({ show: false, category: "", featureLabel: "" })
          }
        />
      )}

      <ConfirmDeleteModal
        show={showConfirm}
        selectedEmail={selectedEmail}
        deleteLoading={deleteLoading}
        onClose={() => setShowConfirm(false)}
        onDelete={handleDelete}
      />

      <ForceInviteModal
        show={showForceInvite}
        inviteLoading={inviteLoading}
        onClose={() => setShowForceInvite(false)}
        onConfirm={handleForceInvite}
      />
    </div>
  );
};
