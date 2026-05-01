import React from "react";
import { formatNumber } from "../../../Component/numberFormat";

function KPICard({
  label,
  consensus,
  trend,
  change,
  firms = {},
  firmList = [],
}) {
  const trendColor =
    trend === "up"
      ? "var(--bs-green-primary)"
      : trend === "down"
        ? "var(--bs-btn-delete-bg)"
        : "var(--text-secondary)";

  const colorFor = (shortName) =>
    firmList.find((f) => f.short_name === shortName)?.color ??
    "var(--text-secondary)";

  return (
    <div className="tp-kpi-card">
      <p className="tp-kpi-label">{label}</p>
      <p className="tp-kpi-value">{formatNumber(consensus) ?? "—"}</p>
      {change && (
        <p className="tp-kpi-sub" style={{ color: trendColor }}>
          {change}
        </p>
      )}
      <div className="tp-kpi-rows">
        {Object.entries(firms).map(([firmName, value]) => (
          <div key={firmName} className="tp-kpi-row">
            <span className="tp-firm-left">
              <span
                className="tp-dot"
                style={{ background: colorFor(firmName) }}
              />
              <span className="tp-firm-name">{firmName}</span>
            </span>
            <span className="tp-firm-val">
              {typeof value === "number" && value > 1000
                ? `${(value / 1_000_000).toFixed(1)}M`
                : typeof value === "number"
                  ? value.toFixed(1)
                  : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KPICard;
