import { React, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import UploadImageGrid from "./component/UploadImageGrid";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useDispatch, useSelector } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infodialog  box

const infoDetail = [
  {
    name: "Sort By Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: "Sort By Category",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Search",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you click the search box, you can search for any product or brand here",
  },{

 
  name: 'Preview', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/preview_uploadImage.png?updatedAt=1703134399991"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click 'preview' you can preview the product image and set the default image to be displayed first", 
 
},{
 
  name: 'Upload', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/upload_uploadImage.png?updatedAt=1703134400162"
    height={"60%"}
    width={"60%"}
  />),
  instruction:"If you click the 'Upload Image' icon you can upload new images for that product",
  
},{
 
  name: 'Product Edit', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/productedit_uploadImage.png?updatedAt=1703134400011"
    height={"60%"}
    width={"60%"}
  />),
  instruction: "If you click the edit icon, you can edit your fot that product", 
  
},{
 
  name: 'Orange Color', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/orangecolor_uploadImage.png?updatedAt=1703135092187"
    height={"60%"}
    width={"40%"}
  />),
  instruction: "If this section has any background color orange for listed content, it denotes that the product is edited and pending approval. Further edits are not allowed in this state", 
  
}]

const UploadImageCom = () => {
  const description = 'This is for uploading and editing products. You can upload images and edit product details'
  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader("Upload Image / Edit Product"));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />

      {/* <Header Name={"Upload Image / Edit Product"}
       info={true}
       customOnClick={handleOpen} /> */}
      <InfoDialogBox
       infoDetails={infoDetail}
       description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      
      <UploadImageGrid />
    </Box>
  );
};

export default UploadImageCom;
