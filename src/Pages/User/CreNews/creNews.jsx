import { useDispatch, useSelector } from "react-redux";
import { getProfileDetail } from "../../../Networking/User/APIs/Profile/ProfileApi";
import { useEffect } from "react";
import { BackButton } from "../../../Component/backButton";

export const CreNews = () => {
  const token = sessionStorage.getItem("access_token");
  const role = sessionStorage.getItem("role");
  console.log(role, "role");

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && role === "user") {
      dispatch(getProfileDetail());
    }
  }, [dispatch, token, role]);

  return (
    <div className="pt-5 pt-md-0" style={{ width: "100%", height: "100vh" }}>
      <div className="d-block d-md-none">
        <BackButton />
      </div>

      <iframe
        src="https://www.connectcre.com/new-york-tri-state/"
        title="Connect CRE News"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
};
