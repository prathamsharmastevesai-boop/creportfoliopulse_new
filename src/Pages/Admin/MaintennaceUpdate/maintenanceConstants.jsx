export const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.13)",
    dot: "#4ade80",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.13)",
    dot: "#fcd34d",
  },
  impaired: {
    label: "Impaired",
    color: "#eab308",
    bg: "rgba(234,179,8,0.13)",
    dot: "#facc15",
  },
  down: {
    label: "Down",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.13)",
    dot: "#f87171",
  },
  construction: {
    label: "Construction",
    color: "#f97316",
    bg: "rgba(249,115,22,0.13)",
    dot: "#fb923c",
  },
  completed: {
    label: "Completed",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.13)",
    dot: "#a78bfa",
  },
};

export const CATEGORIES = [
  "elevator",
  "hvac",
  "plumbing",
  "electrical",
  "lobby",
  "space_access",
  "maintenance",
];

export const CATEGORY_LABELS = {
  elevator: "Elevator",
  hvac: "HVAC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  lobby: "Lobby",
  space_access: "Space Access",
  maintenance: "maintenance",
};

export const CATEGORY_ICONS = {
  elevator: "⬆",
  hvac: "🌡",
  plumbing: "🔧",
  electrical: "⚡",
  lobby: "🏛",
  space_access: "🔑",
  maintenance: "🔑",
};

export const EMPTY_FORM = {
  category: "elevator",
  status: "pending",
  description: "",
  tour_impact: false,
  photo: null,
};

export const EMPTY_PULSE = {
  date: new Date().toISOString().split("T")[0],
  status: "draft",
  notes: "",
  occupancy_rate: "",
  new_leads: "",
  tours_completed: "",
  maintenance_issues: "",
};

export const hasAlarm = (items) =>
  items?.some((i) => i.status === "impaired" || i.status === "down");
