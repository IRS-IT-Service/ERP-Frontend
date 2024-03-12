import React, { useEffect, useState } from "react";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { Box, styled } from "@mui/material";
import SellerDetailsGrid from "./components/SellerDetailsGrid";
import Shipment from "./components/Shipment";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Barcode Number",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/barcode-no.png?updatedAt=1702964422158"
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
    instruction: `When you click on "View," it will display the product details. `,
  },

  {
    name: "Shipment Detail",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/ship-detail.png?updatedAt=1702964422051"
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
    instruction: `When you click on "Open," it will show you the tracking GUI, as mentioned in the next row.`,
  },

  {
    name: "Shipment Detail Tracking",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590"
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
    instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  },
];

const SellerDetails = () => {
  const description = `In the Sales Details Module Description, you can access comprehensive
          information related to sales, such as customer name, mobile number,
          purchase date, and more. Clicking on the "View" option in the Barcode
          Number column allows you to retrieve all product details associated
          with the respective barcode.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Sales Details`));
  }, []);
  
  return (
    <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
      <DrawerHeader />
      {/* <Header Name={'Sales Details'} info={true} customOnClick={handleOpen} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <SellerDetailsGrid />
    </Box>
  );
};

export default SellerDetails;
