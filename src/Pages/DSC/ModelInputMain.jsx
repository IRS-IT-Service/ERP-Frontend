import React from "react";
import DsCModelInput from "./Components/DsCModelInput";
import { Box, styled } from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ModelInputMain = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <DsCModelInput />
    </Box>
  );
};

export default ModelInputMain;
