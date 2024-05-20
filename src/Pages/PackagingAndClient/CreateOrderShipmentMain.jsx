import { Box ,styled} from "@mui/material";
import React from "react";
import CreateOrdershipment from "../../Pages/PackagingAndClient/createOrderShipment/CreateOrdershipment";


const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const CreateOrderShipmentMain = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <CreateOrdershipment/>
    </Box>
  );
};

export default CreateOrderShipmentMain;
