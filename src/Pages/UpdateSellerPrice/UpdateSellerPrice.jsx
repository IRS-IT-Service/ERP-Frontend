import { React, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import ProductHistory from "../Home_Page/Components/ProductHistory";
import UpdatePriceGrid from "./components/UpdatePriceGrid";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: 'Sort By Brand',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: 'Sort By Category',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: 'Sort By GST',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortByGst.png?updatedAt=1717242547125'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by GST' and select a particular category, you can view listings for that specific product",
  },
  {
    name: 'Clear All Filter',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/ClearAllFilter.png?updatedAt=1717242379859'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "The 'Clear all filters' button removes all applied filters, resetting the view to display all available data without any filtering criteria applied",
  },
  {
    name: 'Search',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      'If you click the search box, you can search for any product or brand here',
  },
  {
    name: 'Bulk Update',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/bulkupdate_updateproduct.png?updatedAt=17031364375822'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: "If you click 'Bulk Update,' you can update products in bulk",
  },
  {
    name: 'Hiddin Column',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Hiddincol_updateProduct.png?updatedAt=1703136437592'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click the 'Hidden' button, you can select what you want to hide from the list",
  },
  {
    name: 'Column summary',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/colsummery_updateproduct.png?updatedAt=1703141954319'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click the 'Column Summary' button, you can view details about the columns",
  },
  {
    name: 'Orange color',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/orangeclr_updateproduct.png?updatedAt=17031364377602'
        height={'10%'}
        width={'10%'}
      />
    ),
    instruction:
      'If any content in the list has an orange background color, it means it is awaiting approval',
  },
  {
    name: 'Red color',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/redclr_updateproduct.png?updatedAt=1703136437653'
        height={'10%'}
        width={'10%'}
      />
    ),
    instruction:
      'If any content in the list has a red background color, it means the update has been rejected',
  },
  {
    name: 'Green color',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/greenclr_updateproduct.png?updatedAt=1703136437783'
        height={'10%'}
        width={'10%'}
      />
    ),
    instruction:
      'If any content in the list has a green background color, it indicates an issue in the Sales Columns',
  },
  {
    name: 'Purple color',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/purpleclr_updateproduct.png?updatedAt=1703136437796'
        height={'10%'}
        width={'10%'}
      />
    ),
    instruction:
      'If any content in the list has a purple background color, it indicates an issue in the Seller Columns',
  },
];

const UpdateSellerPrice = () => {
  // infodialog state
  const description =
    "This is the Update product you can upload product";

  /// local state

  const [openHistory, setOpenHistory] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  /// rtk query

  /// handlers
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };
  
 const params = useParams().SalesPrice

 const dispatch = useDispatch();

 const { isInfoOpen } = useSelector((state) => state.ui);
 const handleClose = () => {
   dispatch(setInfo(false));
 };

 useEffect(() => {
   dispatch(setHeader(`Update ${params}`));
 }, [params]);


  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={`Update ${params}`} info={true} customOnClick={handleOpen} /> */}
      <UpdatePriceGrid
        setOpenHistory={setOpenHistory}
        setProductDetails={setProductDetails}
        condition={params}
      />
      <ProductHistory
        openHistory={openHistory}
        setOpenHistory={setOpenHistory}
        handleCloseHistory={handleCloseHistory}
        productDetails={productDetails}
        condition= {params}
      />
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
        condition={params}
      />
    </Box>
  );
};

export default UpdateSellerPrice;
