import React from "react";
import SellerProfile from "../../components/Profile/SellerProfile";
import { Box ,styled} from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Profile = () => {
  return (
    <Box
      component="main"
      sx={{flexGrow:1, p: 0, overflow: "hidden" ,width: "100%"}}
    >
      <DrawerHeader />

      <SellerProfile />
    </Box>
  );
};

export default Profile;
