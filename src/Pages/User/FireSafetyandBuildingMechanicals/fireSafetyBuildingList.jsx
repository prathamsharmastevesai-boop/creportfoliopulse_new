import { BuildingList } from "../../../Component/BuildingList";
import { ListuserBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";

export const FireSafetyandBuildingList = () => {
  return (
    <BuildingList
      title="Fire Safety and Building Mechanicals"
      category="fire_safety"
      fetchAction={ListuserBuildingSubmit}
      selector={(state) => ({
        data: state.BuildingSlice.BuildingList,
        loading: state.BuildingSlice.loading,
      })}
      searchKey="address"
      navigateTo="/user-fire-safety-building-mechanicals"
      navigateStateMapper={(building) => ({
        office: { buildingId: building.id },
      })}
    />
  );
};
