import { React, useEffect, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import RoboProductTable from "./Components/RoboProductTable";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Select Value",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Select Value' and select a particular Value, you can add Data listings for that specific value",
  },
  {
    name: "Add Value",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you Put Any Value in 'Add Value' Field and Click Add Button Value set for particular Selected Category",
  },
  {
    name: "TextArea",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "Here you Can see All Value and Click on Save Button for Bulk Save in Database",
  },
  {
    name: "Search Field",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/right_productStatus.png?updatedAt=1703142361021"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "Here you can Enter Keyword for What you want to Search in Specific Section",
  },
  {
    name: "Delete",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/cross_productStatus.png?updatedAt=1703142361005"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction: "If Click Delete Icon You Can Delete Specific Data",
  },
  {
    name: "Upload",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/value_productStatus.png?updatedAt=1703142731023"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction: "Upload Logo for Related Brand",
  },
];
const AddRoboProductsValue = () => {
  // infodialog state
  const description =
    "This is the Product Status you can check product details  ";

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader("Add Robo Product Value"));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Add Robo Product Value"}
        info={true}
        customOnClick={handleOpen}
      /> */}

      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      <RoboProductTable />
    </Box>
  );
};

export default AddRoboProductsValue;
