import React from "react";
import { styled ,Box} from "@mui/material";
import CustomerShipmentList from "./Components/CustomerShipmentList";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ShipmentList = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <CustomerShipmentList/>
    </Box>
  );
};

export default ShipmentList;
