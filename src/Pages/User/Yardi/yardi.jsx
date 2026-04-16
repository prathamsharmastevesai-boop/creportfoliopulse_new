import React from "react";
import yardiImage from "../../../../public/yardiImage.jpg";

export const Yardi = () => {
  return (
    <div className="yardi-container">
      <div className="px-3 py-3">
        <h5 className=" m-0 mx-4 text-center text-md-start">Yardi</h5>
      </div>

      <div className="yardi-image-wrapper p-2">
        <img
          src={yardiImage}
          alt="Yardi Placeholder"
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
};
