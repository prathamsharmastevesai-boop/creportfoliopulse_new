import { useLocation } from "react-router-dom";
import DocumentManager from "../../../Component/DocumentManager";

export const Lease = () => {
  const location = useLocation();
  const { buildingId } = location.state || {};

  return (
    <DocumentManager
      category={"Lease"}
      title="Lease Documents"
      description={"Upload and manage Lease documents"}
      building_Id={buildingId}
    />
  );
};
