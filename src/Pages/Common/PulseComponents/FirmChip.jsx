import React from "react";

function FirmChip({ firm, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="tp-chip"
      style={{
        background: firm.color,
        border: selected ? `2px solid ${firm.color}` : "2px solid transparent",
        opacity: selected ? 1 : 0.6,
        color: "#fff",
        borderRadius: "8px",
        padding: "5px 12px",
        height: "36px",
        minWidth: "80px",
      }}
    >
      <strong style={{ fontSize: 12 }}>{firm.short_name}</strong>
    </button>
  );
}

export default FirmChip;
