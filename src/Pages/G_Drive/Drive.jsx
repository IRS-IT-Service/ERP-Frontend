import { React, useEffect, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import DriveFolder from "./Components/DriveFolder";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Drive = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      
      <DriveFolder />
    </Box>
  );
};

export default Drive;
