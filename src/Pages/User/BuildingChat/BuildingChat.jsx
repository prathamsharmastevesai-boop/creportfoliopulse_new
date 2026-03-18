import { useLocation } from "react-router-dom";
import { ChatWindow } from "../../../Component/ChatWindow";

export const BuildingChat = () => {
  const location = useLocation();

  const buildingId = location?.state?.buildingId;
  const category = location?.state?.category;

  return (
    <ChatWindow
      category={category}
      heading={
        category == "floor_plan"
          ? "Plans / Photos / Flyers"
          : category == "building_info"
            ? "Building Info"
            : "Tenant Information"
      }
      building_id={buildingId}
    />
  );
};
