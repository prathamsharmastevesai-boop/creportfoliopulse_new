import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTimsCategories,
  fetchTimsList,
  fetchCompsCategories,
  fetchCompsList,
  fetchDctSummary,
  fetchDetSummary,
} from "../../../Networking/Admin/APIs/OwnerDashboard/ownerDashboardApi";
import "./ownerDashboard.css";
import Card from "../../../Component/Card/Card";
import RAGLoader from "../../../Component/Loader";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CardChatBot } from "./cardChatBot";
import {
  BsBuilding,
  BsBarChartLine,
  BsCurrencyDollar,
  BsGear,
} from "react-icons/bs";
import { MessageCircle } from "lucide-react";
import { Benchmark } from "../../User/DistilledExpenseTracker/benchmark";
import { DistilledCompTrackerList } from "../../User/DistilledCompTracker/distilledCompTrackerList";
import Pagination from "../../../Component/pagination";

export const OwnerAdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    timsList,
    timsSummary,
    compsList,
    compsSummary,
    dctSummary,
    detSummary,
    timsLoading,
    compsLoading,
  } = useSelector((state) => state.ownerDashboardSlice);

  const SUBMARKETS = [
    "Chelsea",
    "Columbus Circle",
    "Financial District",
    "Gramercy/Flatiron",
    "Grand Central",
    "Hudson Square",
    "Plaza District",
    "Rockefeller Center",
    "Sixth Ave/Rock Ctr",
    "SoHo",
  ];

  const TIMS_STATUSES = [
    "All",
    "Early Stages",
    "Hired Broker",
    "Lease Out",
    "Negotiating",
    "On Hold",
    "TBD",
    "Touring",
  ];

  const [selectedTimsStatus, setSelectedTimsStatus] = useState(
    TIMS_STATUSES[0],
  );
  const [selectedSubmarket, setSelectedSubmarket] = useState(SUBMARKETS[0]);

  // Pagination state for TIMS
  const [timsPage, setTimsPage] = useState(1);
  const [timsPageSize, setTimsPageSize] = useState(10);

  // Pagination state for COMPs
  const [compsPage, setCompsPage] = useState(1);
  const [compsPageSize, setCompsPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchTimsCategories());
    dispatch(fetchCompsCategories());
    dispatch(fetchDctSummary());
    dispatch(fetchDetSummary());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTimsStatus) {
      dispatch(fetchTimsList(selectedTimsStatus));
      setTimsPage(1); // Reset page on status change
    }
  }, [selectedTimsStatus, dispatch]);

  useEffect(() => {
    if (selectedSubmarket) {
      dispatch(fetchCompsList(selectedSubmarket));
      setCompsPage(1); // Reset page on submarket change
    }
  }, [selectedSubmarket, dispatch]);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (num) => {
    if (num === undefined || num === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  // Local pagination logic
  const paginatedTims = timsList.slice(
    (timsPage - 1) * timsPageSize,
    timsPage * timsPageSize,
  );

  const paginatedComps = compsList.slice(
    (compsPage - 1) * compsPageSize,
    compsPage * compsPageSize,
  );

  return (
    <div className="owner-dashboard-container">
      <div className="owner-dashboard-grid">
        <Card
          className="dashboard-section-card"
          style={{ position: "relative" }}
        >
          <div className="section-header">
            <div>
              <h5 className="section-title text-uppercase">
                Tenants In The Market
              </h5>
              <p className="section-subtitle">
                Live feed for active requirements
              </p>
            </div>
            <select
              className="status-select"
              value={selectedTimsStatus}
              onChange={(e) => setSelectedTimsStatus(e.target.value)}
            >
              {TIMS_STATUSES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="table-responsive dashboard-table-wrapper">
            {timsLoading ? (
              <div className="inner-loader">
                <RAGLoader />
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Tenant / Industry</th>
                    <th>Size (SF)</th>
                    <th>Current Building</th>
                    <th>Broker</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTims.length > 0 ? (
                    paginatedTims.map((item, idx) => (
                      <tr key={idx}>
                        <td className="tenant-name">
                          <div>{item.tenant || "N/A"}</div>
                          <div className="small text-muted">
                            {item.industry || "N/A"}
                          </div>
                        </td>
                        <td>{formatNumber(item.requirement_sf)}</td>
                        <td>{item.current_building || "N/A"}</td>
                        <td>{item.broker || "N/A"}</td>
                        <td className="status-cell">
                          <span className="status-badge">
                            {item.status || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No data found for this status
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-auto pt-3">
            <Pagination
              totalItems={timsList.length}
              itemsPerPage={timsPageSize}
              currentPage={timsPage}
              onPageChange={setTimsPage}
              onItemsPerPageChange={(size) => {
                setTimsPageSize(size);
                setTimsPage(1);
              }}
            />
          </div>

          <CardChatBot
            category="tenants_market"
            label="Ask about Tenants"
            icon={<MessageCircle size={18} />}
          />
        </Card>

        <Card
          className="dashboard-section-card"
          style={{ position: "relative" }}
        >
          <div className="section-header">
            <div>
              <h5 className="section-title text-uppercase">
                COMPs (Comparables)
              </h5>
              <p className="section-subtitle">
                Recent comparable lease transactions
              </p>
            </div>
            <select
              className="status-select"
              value={selectedSubmarket}
              onChange={(e) => setSelectedSubmarket(e.target.value)}
            >
              {SUBMARKETS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="table-responsive dashboard-table-wrapper">
            {compsLoading ? (
              <div className="inner-loader">
                <RAGLoader />
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Property / Industry</th>
                    <th>Tenant</th>
                    <th>Size (SF)</th>
                    <th>Rent PSF</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComps.length > 0 ? (
                    paginatedComps.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.closed_date || "N/A"}</td>
                        <td className="property-name">
                          <div>{item.address || "N/A"}</div>
                          <div className="small text-muted">
                            {item.industry || "N/A"}
                          </div>
                        </td>
                        <td>{item.tenant || "N/A"}</td>
                        <td>{formatNumber(item.size_sf)}</td>
                        <td>{formatCurrency(item.rent_psf)}</td>
                        <td>
                          <span
                            className={`status-badge ${item.lease_type === "Sublease" ? "bg-info-subtle text-info" : ""}`}
                          >
                            {item.lease_type || "Direct"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No data found for this submarket
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-auto pt-3">
            <Pagination
              totalItems={compsList.length}
              itemsPerPage={compsPageSize}
              currentPage={compsPage}
              onPageChange={setCompsPage}
              onItemsPerPageChange={(size) => {
                setCompsPageSize(size);
                setCompsPage(1);
              }}
            />
          </div>

          <CardChatBot
            category="comps"
            label="Ask about COMPs"
            icon={<MessageCircle size={18} />}
          />
        </Card>

        <Card
          className="dashboard-section-card full-width-card"
          style={{ position: "relative" }}
        >
          <div className="section-header">
            <div className="section-header-text">
              <h4 className="section-title">DCT Benchmarking</h4>
              <p className="section-subtitle">Deal Consideration Trends</p>
            </div>
            <button
              className="btn btn-sm btn-secondary d-flex align-items-center justify-content-center gap-1"
              onClick={() =>
                navigation.navigate("/distilled-comp-tracker-form")
              }
            >
              + New DCT
            </button>
          </div>

          <div className="dct-list-wrapper">
            <DistilledCompTrackerList chat={false} />
          </div>
        </Card>

        <Card
          className="dashboard-section-card full-width-card p-0"
          style={{ position: "relative" }}
        >
          <Benchmark />
        </Card>
      </div>
    </div>
  );
};
