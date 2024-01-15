import { React } from "react";
import { Box, styled } from "@mui/material";
import OverseasOrderGrid from "./Components/OverseasOrderGrid";
import Header from "../../components/Common/Header";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverseasOrder = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Header Name={"Overseas Orders"}/>
   
      <OverseasOrderGrid />
    </Box>
  );
};

export default OverseasOrder;
