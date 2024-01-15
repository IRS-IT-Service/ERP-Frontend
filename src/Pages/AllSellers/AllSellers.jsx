import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import AllSellersList from "./AllSellerComponent/AllSellersList";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: "Action",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/order_wholesale%20user%20list.png?updatedAt=1703062777429"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on 'Order,' you can check the saller user order list",
  },
  {
    name: "Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Profile_wholesale%20userlist.png?updatedAt=1703062777386"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the profile, you can check all information about the saller user",
  },
];

const AllSellers = () => {
  // infodialog state
  const description =
    "This is WholeSale User List you can view all saller user data";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Header
        Name={"WholeSale User List"}
        info={true}
        customOnClick={handleOpen}
      />

      <AllSellersList />
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default AllSellers;
