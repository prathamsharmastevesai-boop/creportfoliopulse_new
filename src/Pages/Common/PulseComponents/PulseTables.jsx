import React from "react";

export function badgeClass(type) {
  switch (type?.toLowerCase()) {
    case "new lease":
    case "new":
      return "new";
    case "renewal":
      return "renewal";
    case "expansion":
      return "expansion";
    case "sublease":
      return "sublease";
    default:
      return "default";
  }
}

export function TransactionTable({ transactions }) {
  return (
    <div className="tp-table-wrap">
      <table className="tp-table">
        <thead>
          <tr>
            {["Tenant", "Address", "Submarket", "SF", "Type"].map((h) => (
              <th key={h} className="tp-th">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="tp-tr">
              <td className="tp-td">{tx.tenant}</td>
              <td className="tp-td" style={{ color: "var(--text-secondary)" }}>
                {tx.address}
              </td>
              <td className="tp-td" style={{ color: "var(--text-secondary)" }}>
                {tx.submarket}
              </td>
              <td
                className="tp-td"
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Number(tx.sf).toLocaleString()}
              </td>
              <td className="tp-td">
                <span className={`tp-badge ${badgeClass(tx.deal_type)}`}>
                  {tx.deal_type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubmarketTable({ submarketData }) {
  return (
    <div className="tp-table-wrap">
      <table className="tp-table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            {["Firm", "Vacancy Rate", "Asking Rent"].map((h) => (
              <th key={h} className="tp-th">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submarketData.firms.map((f) => (
            <tr key={f.firm_id} className="tp-tr">
              <td className="tp-td">
                <span className="tp-firm-left">
                  <span className="tp-dot" style={{ background: f.color }} />
                  <span>{f.firm}</span>
                </span>
              </td>
              <td className="tp-td" style={{ textAlign: "right" }}>
                {f.vacancy_rate}%
              </td>
              <td className="tp-td" style={{ textAlign: "right" }}>
                ${parseFloat(f.asking_rent).toFixed(2)}/SF
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
