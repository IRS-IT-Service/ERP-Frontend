import { React } from "react";
import { Box, styled } from "@mui/material";
import OverseasOrderBoxesCom from "./OverseasOrderBoxesCom";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverseasOrderBoxes = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box
        sx={{
          backgroundColor: "#80bfff",
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <h2 style={{}}>Overseas Orders Boxes</h2>
      </Box>
      <OverseasOrderBoxesCom />
    </Box>
  );
};

export default OverseasOrderBoxes;
