import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { fetchAdminDashboardDealsApi } from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import RAGLoader from "../../../../Component/Loader";

const AllDealsSection = () => {
  const dispatch = useDispatch();
  const { allDeals, dashboardStats, dashboardDealsLoading } = useSelector(
    (state) => state.adminLoiAudit,
  );
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const params = statusFilter === "All" ? {} : { status: statusFilter };
    dispatch(fetchAdminDashboardDealsApi(params));
  }, [dispatch, statusFilter]);

  return (
    <div className="loi-section-grid a4-grid">
      <div className="loi-column full-width-col">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-num">{dashboardStats.total || 0}</div>
            <div className="stat-label">Total Deals</div>
          </div>
          <div className="stat-card">
            <div className="stat-num text-warning">
              {dashboardStats.submitted || 0}
            </div>
            <div className="stat-label">Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-num text-success">
              {dashboardStats.counterSent || 0}
            </div>
            <div className="stat-label">Counter Sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-num text-info">
              {dashboardStats.vectorized || 0}
            </div>
            <div className="stat-label">Vectorized</div>
          </div>
        </div>

        <div className="deals-dashboard m-2">
          <div className="dashboard-header">
            <span className="section-title">ALL DEALS DASHBOARD </span>
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Extracted">Extracted</option>
              <option value="Counter Sent">Counter Sent</option>
            </select>
          </div>

          <div className="deals-list-master mt-3">
            {dashboardDealsLoading ? (
              <div className="text-center py-5">
                <RAGLoader />
                <p className="text-muted small">Loading all deals...</p>
              </div>
            ) : allDeals.length > 0 ? (
              allDeals.map((deal) => (
                <div key={deal.deal_id} className="master-deal-row">
                  <div className="deal-main-info">
                    <div className="deal-name">{deal.tenant_name}</div>
                    <div className="deal-sub">
                      {deal.building} · {deal.broker_company} · V
                      {deal.current_version || 1} · Updated{" "}
                      {new Date(deal.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="deal-actions">
                    <span
                      className={`status-pill ${deal.status?.toLowerCase().replace(" ", "-") || "submitted"}`}
                    >
                      {deal.status || "SUBMITTED"}
                    </span>
                    {deal.is_vectorized && (
                      <span className="rag-pill">RAG ✓</span>
                    )}
                    <button
                      className="go-btn"
                      onClick={() =>
                        (window.location.href = `#A1?dealId=${deal.deal_id}`)
                      }
                    >
                      → A1
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-muted">No deals found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDealsSection;
