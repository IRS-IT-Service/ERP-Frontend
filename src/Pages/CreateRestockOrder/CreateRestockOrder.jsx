import { React, useEffect } from "react";
import { Box, styled } from "@mui/material";
import RestockGrid from "./Component/RestockGrid";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

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
  },
  {
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
  },
];

const RestockOrder = () => {
  const description =
    "This is the Product Status you can check product details  ";

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Create Restock Order`));
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",

        // overflowY: 'auto',
      }}
    >
      <DrawerHeader />
      {/* <Header Name={"Create Restock Order"}/> */}

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      <RestockGrid />
    </Box>
  );
};

export default RestockOrder;
