import { BuildingList } from "../../../Component/BuildingList";
import { ListuserBuildingSubmit } from "../../../Networking/Admin/APIs/BuildingApi";

export const UserBuildinglist = () => {
  return (
    <BuildingList
      title="Address"
      category="leases_agreement_data"
      fetchAction={ListuserBuildingSubmit}
      selector={(state) => ({
        data: state.BuildingSlice.BuildingList,
        loading: state.BuildingSlice.loading,
      })}
      searchKey="address"
      navigateTo="/user-select-lease-loi"
      navigateStateMapper={(building) => ({
        office: {
          buildingId: building.id,
          address: building.address,
        },
      })}
    />
  );
};
