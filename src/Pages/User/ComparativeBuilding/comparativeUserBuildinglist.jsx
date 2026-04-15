import { BuildingList } from "../../../Component/BuildingList";
import { ListuserBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";

export const ComparativeUserBuildinglist = () => {
  return (
    <BuildingList
      title="Comparative Building List"
      fetchAction={ListuserBuildingSubmit}
      category="comparative_building_data"
      selector={(state) => ({
        data: state.BuildingSlice.BuildingList,
        loading: state.BuildingSlice.loading,
      })}
      searchKey="address"
      navigateTo="/comparative-building-chat"
      navigateStateMapper={(building) => ({
        office: { buildingId: building.id },
      })}
    />
  );
};
