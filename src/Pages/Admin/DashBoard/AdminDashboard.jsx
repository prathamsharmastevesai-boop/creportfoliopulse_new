import { FileText, Building2, Upload, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getComplianceLogsApi,
  getComplianceStatsApi,
  getdashboardApi,
} from "../../../Networking/Admin/APIs/dashboardApi";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [complianceStats, setComplianceStats] = useState({
    totalUsers: 0,
    compliant: 0,
    pending: 0,
    outdated: 0,
    complianceRate: 0,
    nextRecertification: "-",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dispatch(getdashboardApi()).unwrap();
        setDashboardData(res);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    const fetchComplianceLogs = async () => {
      try {
        const res = await dispatch(getComplianceLogsApi()).unwrap();

        setUsers(res.users || []);
      } catch (error) {
        console.error("Error fetching compliance logs:", error);
      }
    };

    fetchComplianceLogs();
    fetchDashboard();
  }, [dispatch]);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await dispatch(getComplianceStatsApi()).unwrap();
        setComplianceStats({
          totalUsers: res?.total_users ?? 0,
          compliant: res?.compliant_count ?? 0,
          pending: res?.pending_count ?? 0,
          outdated: res?.outdated_count ?? 0,
          complianceRate: res?.compliance_rate ?? 0,
          nextRecertification: res?.next_bulk_recertification
            ? new Date(res.next_bulk_recertification).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" },
              )
            : "-",
        });
      } catch (error) {
        console.error("Error fetching compliance stats:", error);
      }
    };

    fetchCompliance();
  }, [dispatch]);

  const handleAIAnalytics = () => navigate("/aianalytics");
  const handleBuilding = () => navigate("/admin-lease-loi-building-list");

  return (
    <div className="container-fluid p-3">
      <div className="mb-4 text-center text-md-start">
        <h4 className="fw-bold">Dashboard Overview</h4>
        <p className="text-muted">
          Manage your real estate portfolio data and AI system
        </p>
      </div>

      <div className="row g-3 mb-4">
        <DashboardCard
          title="Total Documents"
          value={dashboardData?.total_documents ?? 0}
          icon={<FileText size={20} />}
          color="primary"
        />
        <DashboardCard
          title="Buildings"
          value={dashboardData?.buildings ?? 0}
          icon={<Building2 size={20} />}
          color="success"
        />
        <DashboardCard
          title="Recent Uploads"
          value={dashboardData?.recent_uploads ?? 0}
          icon={<Upload size={20} />}
          color="info"
        />
        <DashboardCard
          title="AI Queries"
          value={dashboardData?.AI_queries ?? 0}
          icon={<TrendingUp size={20} />}
          color="success"
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Recent Activity</h5>
              <p className="text-muted mb-0">
                No recent activity <br />
                <small>Activity will appear here once data is uploaded</small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <button
                    className="btn btn-outline-secondary w-100 py-3"
                    onClick={handleAIAnalytics}
                  >
                    <TrendingUp size={20} className="me-2" />
                    AI Analytics
                  </button>
                </div>
                <div className="col-12 col-sm-6">
                  <button
                    className="btn btn-outline-success w-100 py-3"
                    onClick={handleBuilding}
                  >
                    <Building2 size={20} className="me-2" />
                    Add Building
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 text-center text-md-start">
        <h4 className="fw-bold">Compliance Overview</h4>
      </div>

      <div className="row g-3 mb-4">
        <DashboardCard
          title="Total Users"
          value={complianceStats.totalUsers}
          icon={<FileText size={20} />}
          color="primary"
        />
        <DashboardCard
          title="Compliant Count"
          value={complianceStats.compliant}
          icon={<Building2 size={20} />}
          color="success"
        />
        <DashboardCard
          title="Pending Count"
          value={complianceStats.pending}
          icon={<Upload size={20} />}
          color="info"
        />
        <DashboardCard
          title="Outdated Count"
          value={complianceStats.outdated}
          icon={<TrendingUp size={20} />}
          color="warning"
        />
        <DashboardCard
          title="Compliance Rate"
          value={`${complianceStats.complianceRate}%`}
          icon={<TrendingUp size={20} />}
          color="success"
        />
        <DashboardCard
          title="Next Bulk Recertification"
          value={complianceStats.nextRecertification}
          icon={<TrendingUp size={20} />}
          color="secondary"
        />
      </div>

      <div className="my-4">
        <ComplianceTable users={users} />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body d-flex align-items-center">
        <div
          className={`rounded-3 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center me-3`}
          style={{ width: "42px", height: "42px" }}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h5 className="fw-bold mb-0">{value}</h5>
        </div>
      </div>
    </div>
  </div>
);

const ComplianceTable = ({ users }) => {
  if (!users.length)
    return <p className="text-muted">No compliance logs available.</p>;

  return (
    <div className="table-responsive shadow-sm rounded">
      <table className="table align-middle">
        <thead>
          <tr className="table-light text-uppercase small fw-bold">
            <th>User Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>AUP Version</th>
            <th>Status</th>
            <th>Date Signed</th>
            <th>IP Address</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id} className="border-bottom">
                <td>{user.user_name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.organization || "N/A"}</td>
                <td>{user.aup_version_signed || "-"}</td>
                <td>{user.status || "N/A"}</td>
                <td>
                  {user.date_signed
                    ? new Date(user.date_signed).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td>
                  <div className="text-truncate" style={{ maxWidth: "120px" }}>
                    {user.ip_address || "-"}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
