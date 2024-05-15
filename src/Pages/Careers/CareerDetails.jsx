import React from "react";
import { Box, styled } from "@mui/material";
import CreateCareer from "./Components/CreateCareer";
import GetCareer from "./Components/GetCareer";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const CareerDetails = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <GetCareer/>
    </Box>
  );
};

export default CareerDetails;
