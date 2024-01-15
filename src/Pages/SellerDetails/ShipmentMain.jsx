import { React } from "react";
import { Box, styled } from "@mui/material";
import Shipment from "./components/Shipment";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ShipmentMain = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
    
      <Shipment />
    </Box>
  );
};

export default ShipmentMain;
