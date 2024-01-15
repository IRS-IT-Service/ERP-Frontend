import { React } from "react";
import { Box, styled } from "@mui/material";
import DscRepair from "./Components/DscRepair";
import DScForm from "./Components/DScForm";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const RepairForm = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <DScForm />
    </Box>
  );
};

export default RepairForm;
