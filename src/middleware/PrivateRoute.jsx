import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { Box, styled, Button } from "@mui/material";
import ToggleNav from "../components/Common/Togglenav";
import Dropup from "../components/Dropup/Dropup";

import NotificationDrop from "../components/Common/NotificationDrop";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
   

}));

const PrivateRoute = ({ nav }) => {
  const { userInfo, isAdmin } = useSelector((state) => state.auth);


  if (nav) {
    return userInfo ? (
      <Box sx={{ display: "flex", gap: "10px",width:"100%",overflow: 'hidden', }}>
        {" "}
        <ToggleNav /> <Outlet />{" "}
      </Box>
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return userInfo ? (
    <Box sx={{ display: "flex", gap: "10px",width:"100%",overflow: 'hidden', }}>
      {isAdmin ?<><Dropup /><NotificationDrop /> </> :<NotificationDrop />}
    
      <ToggleNav />
      
      <Outlet  />
      </Box>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
