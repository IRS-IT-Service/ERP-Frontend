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
    name: 'Select Value',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/brandFilter.png?updatedAt=1717243576733'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Add Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addButton.png?updatedAt=1717243525476'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Save',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/save.png?updatedAt=1717243500118'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Search Brand',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/brand.png?updatedAt=1717243462272'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Search Category',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/category.png?updatedAt=1717243438672'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Search Sub Category',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/subCategoryFilter.png?updatedAt=1717243415440'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Delete Icon',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/deleteIcon.png?updatedAt=1717243287098'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
  },
  {
    name: 'Gallery',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/galleryIcon.png?updatedAt=1717244062686'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: '',
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
