import { React, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import AddViewAssets from "./components/AddViewAssets";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader } from "../../features/slice/uiSlice";
import { useDispatch } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));


// infoDialog box data
const infoDetail = [
  {
    name: "Add Assets",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addassets_companyassets.png?updatedAt=1703058228325"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click to add assets so you can add product with all the information for that If you click to add assets, you can easily input all the necessary information for the product, streamlining the process of adding a new asset to your inventory",
  },
  {
    name: "Download",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadCode_CompanyAssets.png?updatedAt=1703226924367"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you click 'Download Code,' you can download an Excel file",
  },
  {
    name: "Receipt",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/receipt_companyassets.png?updatedAt=1703058228260"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the receipt logo, you can effortlessly view the product receipt in PDF format and download it for your convenience",
  },
  {
    name: "Product Image",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/product-image_Companyassets.png?updatedAt=1703058228441"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the product-image logo, you can view the product PDF and download it for your convenience",
  },{
    name: "Delete",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
];
const AssetsMain = () => {

  const dispatch = useDispatch()
  // infodialog state
const description = "This is Company Assets you can add assets and download assets details"

useEffect(()=>{
  dispatch(setHeader({
    Name:"Company Assets",
    handleClick:handleOpen
  }))
},[])

const [infoOpen, setInfoOpen] = useState(false);
const handleClose = () => {
  setInfoOpen(!infoOpen);
};
const handleOpen = ()=>{
 setInfoOpen(true);
}


  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Company Assets"}
        info={true}
        customOnClick={handleOpen}
      /> */}
      <Box>
        <AddViewAssets />
      </Box>
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

export default AssetsMain;
