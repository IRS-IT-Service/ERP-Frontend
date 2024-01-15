import React from "react";

import TextField from "@mui/material/TextField";
import { Box, Container, styled } from "@mui/material";
import ToggleNav from "../../components/Common/Togglenav";
import LandingComponent from "./Component/LandingComponent";
import LandingPage from "../../components/Common/LandingPage";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  display: "flex",
  gap: "5px",
  overflow: "hidden",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Verify = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* <LandingComponent /> */}
        <LandingPage />
      </Box>
    </Box>
  );
};

export default Verify;
