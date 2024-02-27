import React from "react";
import UpdateProductBulk from "./components/UpdateProductBulk";

import { Box, styled } from "@mui/material";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const UpdateProductMain = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box>
        <UpdateProductBulk />
      </Box>
    </Box>
  );
};

export default UpdateProductMain;
