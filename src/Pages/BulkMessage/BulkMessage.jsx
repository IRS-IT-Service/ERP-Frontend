import { React, useEffect, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import BulkMessageTable from "./Components/BulkMessageTable";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Add Customer",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'ADD CUSTOMER' then You Can Upload Bulk Customer Details with Excel File and Download Sample File",
  },
  {
    name: "Send Text Message with Media",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "Here You can send Text Message with Media to Customer",
  },
  {
    name: "Cusormer Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "Here You can See Customer Details with Customer Name, Company Name, Mobile No., Address",
  },
];
const BulkMessage = () => {
  // infodialog state
  const description =
    "This is the Customer Details & Bulk Message Section ";

    const dispatch = useDispatch();

    const { isInfoOpen } = useSelector((state) => state.ui);
    const handleClose = () => {
      dispatch(setInfo(false));
    };
  
    useEffect(() => {
      dispatch(setHeader(`Bulk Message`));
    }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Bulk Message"} info={true} customOnClick={handleOpen} /> */}

      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      <BulkMessageTable />
    </Box>
  );
};

export default BulkMessage;
