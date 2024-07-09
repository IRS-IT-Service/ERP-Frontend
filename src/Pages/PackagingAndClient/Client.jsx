import { Box ,styled} from "@mui/material";
import React from "react";
import AddClient from "./Components/AddClient";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Client = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden"  }}
    >
      <DrawerHeader />
      <AddClient/>
    </Box>
  );
};

export default Client;
