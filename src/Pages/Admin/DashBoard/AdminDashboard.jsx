import {
  FileText,
  Building2,
  Upload,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  CalendarClock,
  BarChart3,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getComplianceLogsApi,
  getComplianceStatsApi,
  getdashboardApi,
} from "../../../Networking/Admin/APIs/dashboardApi";
import { useNavigate } from "react-router-dom";

function Sparkline({
  data = [4, 7, 5, 9, 6, 11, 8, 14, 10, 16],
  color = "#22c55e",
  fill = "rgba(34,197,94,0.15)",
}) {
  const W = 80,
    H = 28,
    pad = 2;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (W - pad * 2),
    H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2),
  ]);
  const line = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <path d={area} fill={fill} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

const CARD_META = {
  documents: {
    spark: [30, 42, 38, 55, 48, 62, 58, 74, 68, 84],
    sparkColor: "#3b82f6",
    sparkFill: "rgba(59,130,246,0.12)",
  },
  buildings: {
    spark: [20, 22, 21, 25, 24, 28, 27, 30, 29, 47],
    sparkColor: "#22c55e",
    sparkFill: "rgba(34,197,94,0.12)",
  },
  uploads: {
    spark: [5, 9, 7, 12, 10, 14, 11, 18, 15, 23],
    sparkColor: "#f59e0b",
    sparkFill: "rgba(245,158,11,0.12)",
  },
  queries: {
    spark: [400, 620, 530, 780, 690, 910, 840, 1100, 980, 1200],
    sparkColor: "#a855f7",
    sparkFill: "rgba(168,85,247,0.12)",
  },
};

function StatCard({ title, value, icon: Icon, accentClass, meta, delay = 0 }) {
  const [counted, setCounted] = useState(0);
  const target = typeof value === "number" ? value : 0;

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCounted(target);
        clearInterval(timer);
      } else setCounted(start);
    }, 18);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div
      className={`adb-stat-card adb-stat-card--${accentClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="adb-stat-card__top">
        <div
          className={`adb-stat-card__icon-wrap adb-stat-card__icon-wrap--${accentClass}`}
        >
          <Icon size={18} />
        </div>
      </div>

      <div className="adb-stat-card__value-row">
        <div className="adb-stat-card__value">
          {typeof value === "string" ? value : counted.toLocaleString()}
        </div>

        <div className="adb-stat-card__spark">
          <Sparkline
            data={meta.spark}
            color={meta.sparkColor}
            fill={meta.sparkFill}
          />
        </div>
      </div>

      <div className="adb-stat-card__label">{title}</div>
    </div>
  );
}

function ComplianceCard({ title, value, icon: Icon, variant, delay = 0 }) {
  return (
    <div
      className={`adb-comp-card adb-comp-card--${variant}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`adb-comp-card__icon adb-comp-card__icon--${variant}`}>
        <Icon size={16} />
      </div>
      <div className="adb-comp-card__value">{value}</div>
      <div className="adb-comp-card__label">{title}</div>
    </div>
  );
}

function ComplianceDonut({ compliant, pending, outdated, total }) {
  const r = 44,
    cx = 52,
    cy = 52,
    stroke = 10;
  const circ = 2 * Math.PI * r;
  const pct = (n) => (n / (total || 1)) * circ;
  const segs = [
    { dash: pct(compliant), color: "#22c55e", offset: 0 },
    { dash: pct(pending), color: "#f59e0b", offset: -pct(compliant) },
    {
      dash: pct(outdated),
      color: "#ef4444",
      offset: -(pct(compliant) + pct(pending)),
    },
  ];
  const rate = total ? Math.round((compliant / total) * 100) : 0;

  return (
    <div className="adb-donut">
      <svg width="104" height="104" viewBox="0 0 104 104">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--bs-modal-border)"
          strokeWidth={stroke}
        />
        {segs.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={s.offset}
            transform="rotate(-90 52 52)"
            strokeLinecap="round"
          />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="16"
          fontWeight="700"
          fontFamily="inherit"
        >
          {rate}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="9"
          fontFamily="inherit"
        >
          COMPLIANT
        </text>
      </svg>
      <div className="adb-donut__legend">
        {[
          ["Compliant", "#22c55e", compliant],
          ["Pending", "#f59e0b", pending],
          ["Outdated", "#ef4444", outdated],
        ].map(([l, c, v]) => (
          <div key={l} className="adb-donut__leg-row">
            <span className="adb-donut__leg-dot" style={{ background: c }} />
            <span className="adb-donut__leg-label">{l}</span>
            <span className="adb-donut__leg-val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  compliant: {
    label: "Compliant",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
  },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  outdated: { label: "Outdated", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "var(--text-secondary)",
    bg: "var(--bs-badge-bg)",
  };
  return (
    <span
      className="adb-status-badge"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span
        className="adb-status-badge__dot"
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}

function ComplianceTable({ users, loading }) {
  if (loading) {
    return (
      <div className="adb-table-loading">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="adb-skeleton-row"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }
  if (!users.length) {
    return (
      <div className="adb-empty" style={{ padding: "32px 20px" }}>
        <Users size={28} style={{ opacity: 0.3 }} />
        <span>No compliance logs available</span>
      </div>
    );
  }
  return (
    <div className="adb-table-wrap">
      <table className="adb-table">
        <thead>
          <tr>
            {[
              "User",
              "Email",
              "AUP Version",
              "Status",
              "Date Signed",
              "IP Address",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.user_id} style={{ animationDelay: `${i * 60}ms` }}>
              <td>
                <div className="adb-table__user">
                  <div className="adb-table__avatar">
                    {(u.user_name || "?")[0].toUpperCase()}
                  </div>
                  <span>{u.user_name || "N/A"}</span>
                </div>
              </td>
              <td className="adb-table__muted">{u.email || "N/A"}</td>
              <td>
                <code className="adb-table__code">
                  {u.aup_version_signed || "—"}
                </code>
              </td>
              <td>
                <StatusBadge status={u.status} />
              </td>
              <td className="adb-table__muted">
                {u.date_signed
                  ? new Date(u.date_signed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </td>
              <td>
                <code className="adb-table__code">{u.ip_address || "—"}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="adb-section-hdr">
      <div>
        <h2 className="adb-section-hdr__title">{title}</h2>
        {subtitle && <p className="adb-section-hdr__sub">{subtitle}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="adb-stat-card adb-stat-card--skeleton">
      <div className="adb-skeleton adb-skeleton--icon" />
      <div className="adb-skeleton adb-skeleton--value" />
      <div className="adb-skeleton adb-skeleton--label" />
    </div>
  );
}

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [dashboardData, setDashboardData] = useState(null);
  const [complianceStats, setComplianceStats] = useState(null);
  const [users, setUsers] = useState([]);

  const [loadingDash, setLoadingDash] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dispatch(getdashboardApi()).unwrap();
        setDashboardData(res);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoadingDash(false);
      }
    };
    fetchDashboard();
  }, [dispatch]);

  useEffect(() => {
    const fetchComplianceStats = async () => {
      try {
        const res = await dispatch(getComplianceStatsApi()).unwrap();
        setComplianceStats({
          total_users: res?.total_users ?? 0,
          compliant_count: res?.compliant_count ?? 0,
          pending_count: res?.pending_count ?? 0,
          outdated_count: res?.outdated_count ?? 0,
          compliance_rate: res?.compliance_rate ?? 0,
          next_bulk_recertification: res?.next_bulk_recertification ?? null,
        });
      } catch (err) {
        console.error("Error fetching compliance stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchComplianceStats();
  }, [dispatch]);

  useEffect(() => {
    const fetchComplianceLogs = async () => {
      try {
        const res = await dispatch(getComplianceLogsApi()).unwrap();
        setUsers(res?.users ?? []);
      } catch (err) {
        console.error("Error fetching compliance logs:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchComplianceLogs();
  }, [dispatch]);

  const handleAIAnalytics = () => navigate("/aianalytics");
  const handleBuilding = () => navigate("/admin-lease-loi-building-list");

  const totalDocs = dashboardData?.total_documents ?? 0;
  const buildings = dashboardData?.buildings ?? 0;
  const recentUploads = dashboardData?.recent_uploads ?? 0;
  const aiQueries = dashboardData?.AI_queries ?? 0;

  const totalUsers = complianceStats?.total_users ?? 0;
  const compliant = complianceStats?.compliant_count ?? 0;
  const pending = complianceStats?.pending_count ?? 0;
  const outdated = complianceStats?.outdated_count ?? 0;
  const complianceRate = complianceStats?.compliance_rate ?? 0;
  const nextRecert = complianceStats?.next_bulk_recertification ?? null;

  const nextRecertLabel = nextRecert
    ? new Date(nextRecert).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="adb-root">
      <SectionHeader
        title="Dashboard"
        subtitle="Manage your real estate portfolio data and AI system"
      />

      <div className="adb-stat-grid">
        {loadingDash ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Documents"
              value={totalDocs}
              icon={FileText}
              accentClass="blue"
              meta={CARD_META.documents}
              delay={0}
            />
            <StatCard
              title="Buildings"
              value={buildings}
              icon={Building2}
              accentClass="green"
              meta={CARD_META.buildings}
              delay={80}
            />
            <StatCard
              title="Recent Uploads"
              value={recentUploads}
              icon={Upload}
              accentClass="amber"
              meta={CARD_META.uploads}
              delay={160}
            />
            <StatCard
              title="AI Queries"
              value={aiQueries}
              icon={TrendingUp}
              accentClass="purple"
              meta={CARD_META.queries}
              delay={240}
            />
          </>
        )}
      </div>

      <div className="adb-two-col">
        <div className="adb-panel">
          <p className="adb-panel__label">Recent Activity</p>
          <div className="adb-empty">
            <FileText size={28} style={{ opacity: 0.3 }} />
            <span>Activity will appear here once data is uploaded</span>
          </div>
        </div>

        <div className="adb-panel">
          <p className="adb-panel__label">Quick Actions</p>
          <div className="adb-actions">
            <button
              className="adb-action-btn adb-action-btn--primary"
              onClick={handleAIAnalytics}
            >
              <div className="adb-action-btn__icon">
                <BarChart3 size={18} />
              </div>
              <div>
                <div className="adb-action-btn__title">AI Analytics</div>
                <div className="adb-action-btn__sub">
                  View query performance
                </div>
              </div>
              <ArrowRight size={14} className="adb-action-btn__arrow" />
            </button>
            <button
              className="adb-action-btn adb-action-btn--green"
              onClick={handleBuilding}
            >
              <div className="adb-action-btn__icon">
                <Building2 size={18} />
              </div>
              <div>
                <div className="adb-action-btn__title">Add Building</div>
                <div className="adb-action-btn__sub">
                  Register a new property
                </div>
              </div>
              <ArrowRight size={14} className="adb-action-btn__arrow" />
            </button>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Compliance"
        title="Compliance Overview"
        subtitle="Monitor user certification status and AUP adherence"
      />

      {loadingStats ? (
        <div className="adb-compliance-layout">
          <div className="adb-panel adb-panel--donut">
            <div
              className="adb-skeleton"
              style={{ width: 104, height: 104, borderRadius: "50%" }}
            />
          </div>
          <div className="adb-comp-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="adb-comp-card">
                <div className="adb-skeleton adb-skeleton--icon" />
                <div className="adb-skeleton adb-skeleton--value" />
                <div className="adb-skeleton adb-skeleton--label" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="adb-compliance-layout">
          <div className="adb-panel adb-panel--donut">
            <p className="adb-panel__label">Status Breakdown</p>
            <ComplianceDonut
              compliant={compliant}
              pending={pending}
              outdated={outdated}
              total={totalUsers}
            />
            <div className="adb-next-cert">
              <CalendarClock size={14} style={{ color: "var(--bs-accent)" }} />
              <span>Next bulk recertification</span>
              <strong>{nextRecertLabel}</strong>
            </div>
          </div>

          <div className="adb-comp-grid">
            <ComplianceCard
              title="Total Users"
              value={totalUsers}
              icon={Users}
              variant="blue"
              delay={0}
            />
            <ComplianceCard
              title="Compliant"
              value={compliant}
              icon={CheckCircle2}
              variant="green"
              delay={60}
            />
            <ComplianceCard
              title="Pending"
              value={pending}
              icon={Clock}
              variant="amber"
              delay={120}
            />
            <ComplianceCard
              title="Outdated"
              value={outdated}
              icon={AlertTriangle}
              variant="red"
              delay={180}
            />
            <ComplianceCard
              title="Compliance Rate"
              value={`${complianceRate}%`}
              icon={TrendingUp}
              variant="green"
              delay={240}
            />
            <ComplianceCard
              title="Next Recertification"
              value={nextRecertLabel}
              icon={CalendarClock}
              variant="purple"
              delay={300}
            />
          </div>
        </div>
      )}

      <div className="adb-table-section">
        <div className="adb-table-header">
          <div>
            <p className="adb-panel__label">User Compliance Log</p>
            <p
              style={{
                fontSize: "var(--fs-body-xs)",
                color: "var(--text-secondary)",
                marginTop: 2,
              }}
            >
              {loadingUsers ? "Loading..." : `${users.length} users tracked`}
            </p>
          </div>
        </div>
        <ComplianceTable users={users} loading={loadingUsers} />
      </div>
    </div>
  );
};

export default AdminDashboard;
