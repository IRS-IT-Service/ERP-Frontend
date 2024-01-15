import React from "react";
import { Box, styled } from "@mui/material";
import AddBrandComponent from "./components/AddBrandComponent";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AddBrand = () => {
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
        <h2 style={{}}>Add Brand</h2>
      </Box>
      <AddBrandComponent />
    </Box>
  );
};

export default AddBrand;
