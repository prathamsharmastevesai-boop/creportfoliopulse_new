export const fmt = (n) => (n ? n.toLocaleString() + " SF" : "— SF");

export const formatLeaseDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatActivityMessage = (activity) => {
  const action = activity.action_type;
  const entity = activity.entity_type;
  const userName = activity.modified_by_name || "Unknown";
  const role = activity.modified_by_role || "user";

  if (entity === "floor") {
    if (action === "create")
      return `Created Floor ${activity.new_value?.floor_number}, RSF ${activity.new_value?.total_rsf?.toLocaleString()}`;
    if (action === "update")
      return ` Updated Floor ${activity.old_value?.floor_number} → ${activity.new_value?.floor_number}, RSF ${activity.new_value?.total_rsf?.toLocaleString()}`;
    if (action === "delete")
      return `Deleted Floor ${activity.old_value?.floor_number}`;
  }

  if (entity === "unit") {
    if (action === "create")
      return ` Added unit ${activity.new_value?.square_footage} SF to Floor ${activity.floor_number}`;
    if (action === "update")
      return `Updated unit on Floor ${activity.floor_number}`;
    if (action === "split")
      return ` Split unit on Floor ${activity.floor_number}`;
    if (action === "merge") return `Merged units`;
    if (action === "delete")
      return ` Deleted unit on Floor ${activity.floor_number}`;
  }

  if (entity === "building_update") {
    if (action === "note") {
      return ` ${activity.new_value?.note || "Added note"}`;
    }
    return ` ${action} building update`;
  }

  return `${action} ${entity}`;
};

export const EMPTY_UNIT = {
  tenant_name: "",
  square_footage: "",
  lease_expiration: "",
  status: "vacant",
  block_order: 0,
  company_website: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  latest_update: "",
};
