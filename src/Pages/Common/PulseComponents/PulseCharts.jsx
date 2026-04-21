import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartAxisStyle = { fontSize: 10, fill: "#888" };

export function LeasingTrendChart({ data, firms }) {
  const normalised = data.map((row) => {
    const entry = { quarter: row.period_label };
    firms.forEach((f) => {
      const val = row[f.short_name];
      entry[f.short_name] =
        val != null ? parseFloat((val / 1_000_000).toFixed(2)) : undefined;
    });
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={normalised}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="quarter" tick={chartAxisStyle} />
        <YAxis
          tick={chartAxisStyle}
          tickFormatter={(v) => `${v}M`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          formatter={(v) => [`${v}M SF`]}
          contentStyle={{
            fontSize: 11,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
            boxShadow: "var(--border-box)",
          }}
          itemStyle={{ padding: 0, color: "var(--text-primary)" }}
        />
        {firms.map((f) => (
          <Line
            key={f.short_name}
            type="monotone"
            dataKey={f.short_name}
            stroke={f.color}
            strokeWidth={1.5}
            dot={{ r: 2.5 }}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AvailabilityTrendChart({ data, firms }) {
  const normalised = data.map((row) => {
    const entry = { quarter: row.period_label };
    firms.forEach((f) => {
      const val = row[f.short_name];
      entry[f.short_name] = val != null ? parseFloat(val) : undefined;
    });
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={normalised}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="quarter" tick={chartAxisStyle} />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={chartAxisStyle}
          domain={["auto", "auto"]}
        />
        <Tooltip
          formatter={(v, name) => [`${v}%`, name]}
          contentStyle={{
            fontSize: 11,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
            boxShadow: "var(--border-box)",
          }}
          itemStyle={{ padding: 0, color: "var(--text-primary)" }}
        />
        {firms.map((f) => (
          <Line
            key={f.short_name}
            type="monotone"
            dataKey={f.short_name}
            stroke={f.color}
            strokeWidth={1.5}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function IndustryChart({ data }) {
  const chartData = data.map((d) => ({
    sector: d.industry_name,
    pct: d.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 160, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(0,0,0,0.06)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tickFormatter={(v) => `${v}%`}
          tick={chartAxisStyle}
        />
        <YAxis
          type="category"
          dataKey="sector"
          tick={{ ...chartAxisStyle, width: 160 }}
          width={160}
        />
        <Tooltip
          formatter={(v) => [`${v}%`]}
          contentStyle={{
            fontSize: 11,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--card-bg)",
            color: "var(--text-primary)",
            boxShadow: "var(--border-box)",
          }}
          itemStyle={{ color: "var(--text-primary)" }}
        />
        <Bar dataKey="pct" fill="#0072CE" radius={[0, 3, 3, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}
