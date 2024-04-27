import React from "react";
import { Box, styled } from "@mui/material";
import CreateCareer from "./Components/CreateCareer";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Careers = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <CreateCareer />
    </Box>
  );
};

export default Careers;
