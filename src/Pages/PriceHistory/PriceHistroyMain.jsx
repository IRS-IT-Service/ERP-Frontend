import { React, useState } from "react";
import { Box, styled } from "@mui/material";
import PriceHistroy from "./Component/PriceHistroy";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: "Sort By Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
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
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Search-Product",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search-product_ProductRemoval.png?updatedAt=1703144447246"
        height={"60%"}
        width={"90%"}
      />  
    ),
    instruction:
      "If you click the search product, you can search for any product or brand here",
  },  {
    name: "Search-SKU",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Sku_productRemoval.png?updatedAt=1703144412883"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click search SKU, you can search for any product or brand by SKU number here ",
  },  {
    name: "check",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkbox_priceHistory.png?updatedAt=1703224608533"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you check this, you can select a particular list",
  }, {
    name: "Price History",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/pricehistory_PriceHistory.png?updatedAt=1703224608892"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "When you select a particular list, the 'Price History' button becomes enabled. If you click on 'Price History,' you can check the history of that specific price",
  }, 
  
];
const PriceHistroyMain = () => {
   // infodialog state
   const description =
   "This is the Price History. You can view a particular price ";

 const [infoOpen, setInfoOpen] = useState(false);
 const handleClose = () => {
   setInfoOpen(!infoOpen);
 };
 const handleOpen = () => {
   setInfoOpen(true);
 };
  /// local state

  const [openHistory, setOpenHistory] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  /// rtk query

  /// handlers
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      <Header Name={"Price History"}  info={true} customOnClick={handleOpen}/>
  
      <PriceHistroy />
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

export default PriceHistroyMain;
