import React from "react";
import drone from "../../assets/droneB.png";
import { styled } from "@mui/system";
const MainPage = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "99%",
  height: "99%",
  display: "flex",
  justifyContent: "center", // Center horizontally
  alignItems: "center", // Center vertically
  zIndex: 1000,

  backgroundColor: "rgba(255, 255, 255, 0.8)",
});

const Loading = ({ loading }) => {
  return loading ? (
    <MainPage>
      <div className="PlainMode">
        <div className="plane">
          <img src={drone} alt="Plane" />
        </div>
      </div>
    </MainPage>
  ) : (
    ""
  );
};

export default Loading;
