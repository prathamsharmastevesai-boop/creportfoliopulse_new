import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchAdminAnalyticsApi,
  fetchAdminStatsApi,
  getCompanyMembersApi,
  transferOwnershipApi,
} from "../../Networking/SuperAdmin/AdminSuperApi";

export const AdminDetails = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const admin = state?.admin;

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (admin?.user_id) fetchAdminData();
    if (admin?.company_id) fetchMembers(admin.company_id);
  }, [admin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, analyticsData] = await Promise.all([
        dispatch(fetchAdminStatsApi(admin.company_id)).unwrap(),
        dispatch(
          fetchAdminAnalyticsApi({ company_id: admin.company_id, days: 7 }),
        ).unwrap(),
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (companyId) => {
    setMembersLoading(true);
    setMembersError(null);

    try {
      const data = await dispatch(getCompanyMembersApi(companyId)).unwrap();
      const membersList = Array.isArray(data) ? data : data?.members || [];
      setMembers(membersList);

      const currentOwner = membersList.find(
        (member) => member.is_owner === true,
      );
      if (currentOwner) {
        setSelectedOwner(currentOwner);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setMembersError(
        typeof err === "string"
          ? err
          : "Could not load members. Please try again.",
      );
    } finally {
      setMembersLoading(false);
    }
  };

  const handleTransferOwnership = async (member) => {
    if (!member || !member.email) {
      console.error("Invalid member selected:", member);
      return;
    }

    if (member.is_owner) {
      console.error("Cannot transfer to the current owner");
      return;
    }

    try {
      setTransferLoading(true);
      setShowDropdown(false);

      console.log("Transferring ownership to:", {
        company_id: admin.company_id,
        new_owner_email: member.email,
        member_id: member.id,
        member_name: member.display_name || member.name,
      });

      await dispatch(
        transferOwnershipApi({
          company_id: admin.company_id,
          new_owner_email: member.email,
        }),
      ).unwrap();

      await fetchMembers(admin.company_id);
    } catch (err) {
      console.error("Transfer failed:", err);
    } finally {
      setTransferLoading(false);
      setSelectedOwner(null);
    }
  };

  const getAvailableMembers = () => {
    return members.filter((member) => !member.is_owner && member.email);
  };

  if (!admin) {
    return <p className="text-danger">No admin selected</p>;
  }

  const MetricCard = ({ title, value, icon, color }) => (
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center gap-2">
          <div
            className={`bg-${color} bg-opacity-10 text-${color} rounded-circle d-flex align-items-center justify-content-center`}
            style={{ width: 42, height: 42 }}
          >
            <i className={`bi ${icon} fs-5`} />
          </div>
          <small className="text-muted">{title}</small>
          <div className="fw-bold fs-6">{value ?? "-"}</div>
        </div>
      </div>
    </div>
  );

  const MetricCardSkeleton = ({ color = "primary" }) => (
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center gap-2">
          <div
            className={`bg-${color} bg-opacity-10 rounded-circle placeholder`}
            style={{ width: 42, height: 42 }}
          />
          <div className="placeholder-glow" style={{ width: "60%" }}>
            <span
              className="placeholder col-12 rounded"
              style={{ height: 10 }}
            />
          </div>
          <div className="placeholder-glow" style={{ width: "40%" }}>
            <span
              className="placeholder col-12 rounded"
              style={{ height: 18 }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const statusBadge = (status) => {
    const map = {
      Verified: "success",
      Active: "success",
      Pending: "warning",
      Inactive: "secondary",
      Suspended: "danger",
    };
    const variant = map[status] ?? "secondary";
    return (
      <span
        className={`badge bg-${variant}-subtle text-${variant} rounded-pill`}
      >
        {status ?? "Unknown"}
      </span>
    );
  };

  const roleIcon = (role) => {
    const icons = {
      admin: "bi-shield-check",
      user: "bi-person",
      superadmin: "bi-shield-fill-check",
    };
    return icons[(role ?? "").toLowerCase()] ?? "bi-person-badge";
  };

  const availableMembers = getAvailableMembers();
  const currentOwner = members.find((member) => member.is_owner === true);

  return (
    <div className="container-fluid p-3">
      <h4 className="fw-bold">Admin Details</h4>
      <p className="text-muted">Detailed overview & analytics</p>

      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Body>
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 56, height: 56, fontSize: 20 }}
            >
              {(admin.display || admin.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0">{admin.display || admin.name}</h5>
                {statusBadge(admin.status)}
              </div>
              <div className="text-muted small mt-1">{admin.email}</div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="d-flex flex-wrap gap-4 text-muted small">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-calendar-event" />
              <span>
                Created on{" "}
                <strong className="text-dark">
                  {new Date(admin.created).toLocaleDateString()}
                </strong>
              </span>
            </div>
            {admin.company_name && (
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-building" />
                <span>
                  Company:{" "}
                  <strong className="text-dark">{admin.company_name}</strong>
                </span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="col-md-12">
          <h5 className="mb-3">Platform Stats</h5>
          <div className="row g-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} color="primary" />
            ))}
            <h5 className="mb-3 mt-4">Last 7 Days Analytics</h5>
            {[1, 2, 3, 4].map((i) => (
              <MetricCardSkeleton key={i} color="primary" />
            ))}
          </div>
        </div>
      ) : (
        <div className="col-md-12">
          <h5 className="mb-3">Platform Stats</h5>
          <div className="row g-3 mb-4">
            <MetricCard
              title="Chat Sessions"
              value={analytics?.chat_sessions}
              icon="bi-chat-dots"
              color="primary"
            />
            <MetricCard
              title="Active Users"
              value={analytics?.active_users}
              icon="bi-people"
              color="success"
            />
            <MetricCard
              title="Total Logins"
              value={analytics?.total_logins}
              icon="bi-box-arrow-in-right"
              color="warning"
            />
            <MetricCard
              title="Platform Users"
              value={analytics?.platform_users}
              icon="bi-diagram-3"
              color="dark"
            />
          </div>

          <h5 className="mb-3">Last 7 Days Analytics</h5>
          <div className="row g-3">
            <MetricCard
              title="Documents"
              value={stats?.total_documents}
              icon="bi-file-earmark-text"
              color="info"
            />
            <MetricCard
              title="Buildings"
              value={stats?.buildings}
              icon="bi-building"
              color="secondary"
            />
            <MetricCard
              title="Recent Uploads"
              value={stats?.recent_uploads}
              icon="bi-cloud-upload"
              color="primary"
            />
            <MetricCard
              title="AI Queries"
              value={stats?.AI_queries}
              icon="bi-cpu"
              color="danger"
            />
          </div>
        </div>
      )}

      <Card className="mt-4 border-0 shadow-sm rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="mb-0">
              <i className="bi bi-people me-2" />
              Company Members
            </h5>
            <div className="d-flex gap-2 align-items-center">
              {!membersLoading && (
                <span className="badge bg-dark">
                  {members.length} Member{members.length !== 1 ? "s" : ""}
                </span>
              )}

              {!membersLoading && availableMembers.length > 0 && (
                <Dropdown
                  show={showDropdown}
                  onToggle={setShowDropdown}
                  align="end"
                >
                  <Dropdown.Toggle
                    variant="outline-warning"
                    size="sm"
                    disabled={transferLoading}
                  >
                    {transferLoading ? (
                      <>
                        <Spinner size="sm" className="me-1" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-repeat me-1"></i>
                        Transfer Ownership
                      </>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>Select new owner</Dropdown.Header>
                    {availableMembers.map((member) => (
                      <Dropdown.Item
                        key={member.id || member.email}
                        onClick={() => handleTransferOwnership(member)}
                        disabled={transferLoading}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, fontSize: 12 }}
                          >
                            {(
                              member.display_name ||
                              member.name ||
                              member.email ||
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-medium small">
                              {member.display_name || member.name || "—"}
                            </div>
                            <div className="text-muted small">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>

          {membersLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" className="me-2" />
              <span className="text-muted">Loading members...</span>
            </div>
          ) : membersError ? (
            <div className="alert alert-danger py-2 small">{membersError}</div>
          ) : members.length === 0 ? (
            <p className="text-muted text-center py-3">
              No members found for this company.
            </p>
          ) : (
            <div className="table-responsive rounded">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr className="text-uppercase small fw-bold">
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member.id || member.email}>
                      <td className="text-muted small">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
                            style={{ width: 32, height: 32, fontSize: 13 }}
                          >
                            {(
                              member.display_name ||
                              member.name ||
                              member.email ||
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="fw-medium">
                            {member.display_name || member.name || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="text-muted small">{member.email}</td>

                      <td>
                        <span className="d-flex align-items-center gap-1 small">
                          <i
                            className={`bi ${roleIcon(member.role)} text-secondary`}
                          />
                          {member.role ?? "—"}
                        </span>
                      </td>

                      <td>{statusBadge(member.status)}</td>

                      <td className="small text-muted">
                        {member.created_at || member.created
                          ? new Date(
                              member.created_at ?? member.created,
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        {member.is_owner ? (
                          <span className="badge bg-success bg-opacity-10 text-success">
                            <i className="bi bi-crown me-1"></i>
                            Current Owner
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
