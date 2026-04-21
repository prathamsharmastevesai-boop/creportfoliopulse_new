export const SECTIONS = [
  "kpi",
  "leasing_trends",
  "availability_trends",
  "submarkets",
  "industry",
  "transactions",
  "sources",
];

export const SEC_LABELS = {
  kpi: "KPI",
  leasing_trends: "Leasing Trends",
  availability_trends: "Availability Trends",
  submarkets: "Submarkets",
  industry: "Industry",
  transactions: "Transactions",
  sources: "Sources",
};

export const SEC_SCHEMA = {
  kpi: "[{firm_id, asking_rent, availability_rate, leasing_sf, net_absorption}]",
  leasing_trends:
    "[{firm_id, period_label, period_year, period_quarter, leasing_sf}]",
  availability_trends:
    "[{firm_id, period_label, period_year, period_quarter, rate}]",
  submarkets: "[{firm_id, submarket_name, vacancy_rate, asking_rent}]",
  industry: "[{industry_name, percentage}]",
  transactions: "[{tenant, address, sf, deal_type, submarket}]",
  sources: "[{firm_id, report_title, source_url, highlight_quote}]",
};

export const SEC_DEFAULTS = {
  kpi: [
    {
      firm_id: 1,
      asking_rent: 85.5,
      availability_rate: 12.3,
      leasing_sf: 125000,
      net_absorption: -5000,
    },
  ],
  leasing_trends: [
    {
      firm_id: 1,
      period_label: "Q1 2025",
      period_year: 2025,
      period_quarter: "Q1",
      leasing_sf: 230000,
    },
  ],
  availability_trends: [
    {
      firm_id: 1,
      period_label: "Q1 2025",
      period_year: 2025,
      period_quarter: "Q1",
      rate: 12.3,
    },
  ],
  submarkets: [
    {
      firm_id: 1,
      submarket_name: "Midtown",
      vacancy_rate: 11.5,
      asking_rent: 88.0,
    },
  ],
  industry: [{ industry_name: "Finance", percentage: 38.5 }],
  transactions: [
    {
      tenant: "Acme Corp",
      address: "350 Fifth Ave",
      sf: 45000,
      deal_type: "New Lease",
      submarket: "Midtown",
    },
  ],
  sources: [
    {
      firm_id: 1,
      report_title: "Q1 2025 Manhattan Office Report",
      source_url: "https://example.com/report",
      highlight_quote: "Market continues to stabilize",
    },
  ],
};

export const NAV_TABS = [
  { id: "firms", label: "Firms" },
  { id: "quarters", label: "Quarters" },
  { id: "ingest", label: "Ingest Data" },
];
