import React from "react";

const TABS = [
  { id: "overview", label: "Market Overview" },
  { id: "submarkets", label: "Submarkets" },
  { id: "transactions", label: "Top Transactions" },
  { id: "sources", label: "Report Sources" },
];

function TabBar({ active, onChange }) {
  return (
    <div className="tp-tab-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`tp-tab ${active === t.id ? "active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default TabBar;
