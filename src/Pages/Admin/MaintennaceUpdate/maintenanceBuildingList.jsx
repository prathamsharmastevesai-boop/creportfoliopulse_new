import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BuildingList } from "../../../Component/BuildingList";
import {
  ListBuildingSubmit,
  ListuserBuildingSubmit,
} from "../../../Networking/Admin/APIs/BuildingApi";
import {
  createSubscription,
  fetchSubscriptions,
} from "../../../Networking/User/APIs/Maintennace/maintenanceApi";

export const MaintenanceBuildinglist = () => {
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");
  console.log(role, "role");

  const [subscriptions, setSubscriptions] = useState([]);

  const loadSubscriptions = async () => {
    try {
      const data = await dispatch(fetchSubscriptions()).unwrap();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [dispatch]);

  const handleSubscribe = async (buildingId) => {
    try {
      await dispatch(
        createSubscription({
          building_id: buildingId,
          section: "Maintenance",
        }),
      ).unwrap();

      loadSubscriptions();
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };

  return (
    <BuildingList
      title="Maintenance Building List"
      fetchAction={
        role == "admin" ? ListBuildingSubmit : ListuserBuildingSubmit
      }
      category="maintenance_updates"
      selector={(state) => ({
        data: state.BuildingSlice.BuildingList,
        loading: state.BuildingSlice.loading,
      })}
      searchKey="address"
      navigateTo={
        role === "admin" ? "/admin-maintenance-update" : "/maintenance-update"
      }
      navigateStateMapper={(building) => ({
        buildingId: building.id,
        address: building.address,
      })}
      subscriptions={subscriptions}
      onSubscribe={handleSubscribe}
    />
  );
};
