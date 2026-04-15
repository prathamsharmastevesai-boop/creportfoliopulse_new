import React from "react";
import { useLocation } from "react-router-dom";
import { AdminBuildingManager } from "../../../Component/AdminBuildingManager";
import {
  DeleteBuilding,
  ListBuildingSubmit,
  CreateBuildingSubmit,
  UpdateBuildingSubmit,
} from "../../../Networking/Admin/APIs/BuildingApi";

const getCategoryFromPath = (pathname) => {
  if (pathname.startsWith("/project-management")) {
    return "workletter";
  }
  if (pathname.startsWith("/admin-lease-loi-building-list")) {
    return "Lease&Loi";
  }
  return "";
};

export const ListBuilding = () => {
  const location = useLocation();
  const category = getCategoryFromPath(location.pathname);
  console.log(category, "category");

  const navigateTo =
    category === "Lease&Loi" ? "/admin-select-lease-loi" : "/projects";

  const navigateStateMapper = (building) => {
    if (category === "Lease&Loi") {
      return { office: { buildingId: building.id } };
    }
    return { office: { buildingId: building.id, address: building.address } };
  };

  return (
    <AdminBuildingManager
      category={category}
      heading="Building List"
      fetchAction={ListBuildingSubmit}
      createAction={CreateBuildingSubmit}
      updateAction={UpdateBuildingSubmit}
      deleteAction={DeleteBuilding}
      navigateTo={navigateTo}
      navigateStateMapper={navigateStateMapper}
    />
  );
};
