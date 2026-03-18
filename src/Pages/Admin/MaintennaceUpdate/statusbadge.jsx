import { STATUS_CONFIG } from "./maintenanceConstants";

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.operational;
  const pulse = status === "down" || status === "impaired";

  return (
    <span
      className="mu2-badge"
      style={{ "--bc": s.color, "--bb": s.bg, "--bd": s.dot }}
    >
      <span
        className={`mu2-badge__dot${pulse ? " mu2-badge__dot--pulse" : ""}`}
      />
      {s.label}
    </span>
  );
};

export default StatusBadge;
