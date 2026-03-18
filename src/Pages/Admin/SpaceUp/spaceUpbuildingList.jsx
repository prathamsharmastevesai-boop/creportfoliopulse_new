import { useState } from "react";
import { BuildingList } from "../../../Component/BuildingList";
import { ListBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";
import { AssignUserModal } from "./AssignUserModal";

export const AdminSpaceUpBuildinglist = () => {
  const role = sessionStorage.getItem("role");

  const [showAssign, setShowAssign] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <>
      <BuildingList
        title="Space Up Building List"
        fetchAction={ListBuildingSubmit}
        selector={(state) => ({
          data: state.BuildingSlice.BuildingList,
          loading: state.BuildingSlice.loading,
        })}
        searchKey="address"
        navigateTo="/space-up"
        renderItem={(building) => (
          <div className="d-flex justify-content-between align-items-center">
            <div>{building.address}</div>

            {role === "admin" && (
              <button
                className="btn btn-sm btn-dark"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBuilding(building);
                  setShowAssign(true);
                }}
              >
                Assign
              </button>
            )}
          </div>
        )}
      />

      <AssignUserModal
        show={showAssign}
        onClose={() => setShowAssign(false)}
        buildingId={selectedBuilding?.id}
      />
    </>
  );
};
