import React, { useEffect, useState } from "react";
import Dispatch_Return_Grid from "./component/Dispatch_Return_Grid";
import { Box, styled } from "@mui/material";
import AddCustomer from "./component/AddCustomer";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Customer Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/customerdetail.png?updatedAt=1703066749550"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `The customer detail popup contains information about the customer, which you can view by clicking the submit button.`,
  },

  {
    name: "Select Button",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/selectDropdown.png?updatedAt=1703067502463"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `
This select dropdown offers options, and upon making a selection, it will display the chosen result.`,
  },
];

const Dispatch_Return = () => {
  const description = `Barcode Dispatch Return`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Barcode Dispatch Return`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Barcode Dispatch Return"}
        info={true}
        customOnClick={handleOpen}
      /> */}
      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <Dispatch_Return_Grid />
      {/* <AddCustomer/> */}
    </Box>
  );
};

export default Dispatch_Return;
