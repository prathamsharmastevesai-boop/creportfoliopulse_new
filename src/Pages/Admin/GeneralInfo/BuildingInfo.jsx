import DocumentManager from "../../../Component/DocumentManager";
import { useLocation } from "react-router-dom";

export const BuildingInfo = () => {
  const location = useLocation();
  const buildingId = location?.state?.buildingId;
  const category = location?.state?.category;

  return (
    <DocumentManager
      category={category}
      title={
        category == "floor_plan"
          ? "Plans / Photos / Flyers"
          : category == "building_info"
            ? "Building Info"
            : "Tenant Information"
      }
      description={`Upload and manage documents for ${category}`}
      building_Id={buildingId}
    />
  );
};
