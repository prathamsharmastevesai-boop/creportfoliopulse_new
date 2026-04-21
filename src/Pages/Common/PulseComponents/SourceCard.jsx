import React from "react";
import SectionCard from "./SectionCard";

function SourceCard({ source }) {
  return (
    <SectionCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          className="tp-dot"
          style={{
            width: 10,
            height: 10,
            background: source.firm_color ?? "var(--text-secondary)",
          }}
        />
        <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
          {source.firm_name}
        </strong>
      </div>
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        {source.report_title}
      </p>

      {source.highlight_quote && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            borderLeft: `2px solid ${source.firm_color ?? "var(--border-color)"}`,
            paddingLeft: 8,
            fontStyle: "italic",
            marginTop: "4px",
          }}
        >
          "{source.highlight_quote}"
        </p>
      )}

      {source.source_url && (
        <a
          href={source.source_url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 11,
            color: "var(--accent-color)",
            marginTop: 8,
            display: "inline-block",
            textDecoration: "underline",
          }}
        >
          View report →
        </a>
      )}
    </SectionCard>
  );
}

export default SourceCard;
