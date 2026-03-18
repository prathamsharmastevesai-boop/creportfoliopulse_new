import DocumentManager from "../../../Component/DocumentManager";
import { useLocation } from "react-router-dom";

export const FloorPlanUpload = () => {
  const location = useLocation();
  const buildingId = location?.state?.buildingId;
  const category = location?.state?.category;

  return (
    <DocumentManager
      category={"floor_plan"}
      title={"Plans / Photos / Flyers"}
      description={"Upload and manage documents for Plans / Photos / Flyers"}
      building_Id={buildingId}
    />
  );
};
