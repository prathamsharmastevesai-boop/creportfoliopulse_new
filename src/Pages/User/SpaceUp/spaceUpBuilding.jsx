import { BuildingList } from "../../../Component/BuildingList";
import { getSpaceUpAssginBuildings } from "../../../Networking/User/APIs/spaceUp/spaceUpApi";

export const SpaceUpBuildinglist = () => {
  return (
    <div>
      {/* <ChatBotModal category="spaceup_space" /> */}
      <BuildingList
        title="Broker Index Building List"
        fetchAction={getSpaceUpAssginBuildings}
        selector={(state) => ({
          data: state.BuildingSlice.BuildingList,
          loading: state.BuildingSlice.loading,
        })}
        searchKey="address"
        navigateTo="/broker-index"
        navigateStateMapper={(building) => ({
          office: {
            buildingId: building.id,
            address: building.address,
          },
        })}
      />
    </div>
  );
};
