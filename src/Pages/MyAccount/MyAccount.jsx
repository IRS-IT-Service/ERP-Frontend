import React, { useState } from "react";
import { Box, styled, Grid } from "@mui/material";
import MyAccountDetails from "./MyAccountComponent/MyAccountDetails";
import { useSelector } from "react-redux";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  height: "100vh",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const MyAccount = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <DrawerHeader />

      <MyAccountDetails />
    </Box>
  );
};

export default MyAccount;
