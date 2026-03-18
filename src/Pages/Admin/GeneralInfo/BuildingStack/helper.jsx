export const fmt = (n) => (n ? n.toLocaleString() + " SF" : "— SF");

export const formatLeaseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).getFullYear().toString();
};

export const formatActivityMessage = (activity) => {
  const action = activity.action_type;
  const entity = activity.entity_type;
  const userName = activity.modified_by_name || "Unknown";
  const role = activity.modified_by_role || "user";

  if (entity === "floor") {
    if (action === "create")
      return `${role.toUpperCase()} '${userName}': Created Floor ${activity.new_value?.floor_number}, RSF ${activity.new_value?.total_rsf?.toLocaleString()}`;
    if (action === "update")
      return `${role.toUpperCase()} '${userName}': Updated Floor ${activity.old_value?.floor_number} → ${activity.new_value?.floor_number}, RSF ${activity.new_value?.total_rsf?.toLocaleString()}`;
    if (action === "delete")
      return `${role.toUpperCase()} '${userName}': Deleted Floor ${activity.old_value?.floor_number}`;
  }

  if (entity === "unit") {
    if (action === "create")
      return `${role.toUpperCase()} '${userName}': Added unit ${activity.new_value?.square_footage} SF to Floor ${activity.floor_id}`;
    if (action === "update")
      return `${role.toUpperCase()} '${userName}': Updated unit on Floor ${activity.floor_id}`;
    if (action === "split")
      return `${role.toUpperCase()} '${userName}': Split unit on Floor ${activity.floor_id}`;
    if (action === "merge")
      return `${role.toUpperCase()} '${userName}': Merged units`;
    if (action === "delete")
      return `${role.toUpperCase()} '${userName}': Deleted unit on Floor ${activity.floor_id}`;
  }

  if (entity === "building_update") {
    if (action === "note") {
      return `${role.toUpperCase()} '${userName}':  ${activity.new_value?.note || "Added note"}`;
    }
    return `${role.toUpperCase()} '${userName}': ${action} building update`;
  }

  return `${role.toUpperCase()} '${userName}': ${action} ${entity}`;
};

export const EMPTY_UNIT = {
  tenant_name: "",
  square_footage: "",
  lease_expiration: "",
  status: "vacant",
  block_order: 0,
};
