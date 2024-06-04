import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import BarcodeGenerateGrid from './component/BarcodeGenerateGrid';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

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
    name: 'CheckBox',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkBox.png?updatedAt=1717248300834'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: "If you click the checkbox, it will be selected or deselected for the particular product and download the selected products",
  },
  {
    name: 'Download',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadBlue.png?updatedAt=1717395221560'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'If you click the download button, it will download the selected products',
  },
  {
    name: 'View Red',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/viewRed.png?updatedAt=1717395200137'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'If you click the view red button, it will show you the selected products in red color which is show Less than 50% Sticked',
  },
  {
    name: 'View Green',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/viewGreen.png?updatedAt=1717395177517'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: "If you click the view green button, it will show you the selected products in green color which is show More than 100% Sticked",
  },
  {
    name: 'View Blue',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/viewBlue.png?updatedAt=1717395158199'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: "If you click the view blue button, it will show you the selected products in blue color which is show No Barcode",
  },
];

function BarcodeGenerate() {
  const description = `Barcode Generate`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Barcode Generate`));
  }, []);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Barcode Generate"}
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
      <BarcodeGenerateGrid />
    </Box>
  );
}

export default BarcodeGenerate;

// const infoDetail = [
//   {
//     name: 'Open Query',
//     screenshot: (
//       <img
//         src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/open%20query.png?updatedAt=1702962275516'
//         height={'100%'}
//         width={'100%'}
//         style={
//           {
//             // width: '10vw',
//             // height: '10vh'
//           }
//         }
//       />
//     ),
//     instruction:
//       'When you click on Open Query, it will show you the column of Status like "pending" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order',
//   },

//   {
//     name: 'Closed Query',
//     screenshot: (
//       <img
//         src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/closed%20query.png?updatedAt=1702962740744'
//         height={'100%'}
//         width={'100%'}
//         style={
//           {
//             // width: '10vw',
//             // height: '10vh'
//           }
//         }
//       />
//     ),
//     instruction: `When you click on Close Query, it will show you the column of Status like "close" "reject" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`,
//   },

//   {
//     name: 'Sold Query',
//     screenshot: (
//       <img
//         src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sold%20query.png?updatedAt=1702962761484'
//         height={'100%'}
//         width={'100%'}
//         style={
//           {
//             // width: '10vw',
//             // height: '10vh'
//           }
//         }
//       />
//     ),
//     instruction: `When you click on Close Query, it will show you the column of Status like "close" "reject" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`,
//   },
// ];

// const description = `The Barcode Generation function is  designed to create barcodes for
//           products. This is accomplished by selecting the product, clicking on
//           the "Generate" button, which will yield a new barcode. To obtain the
//           barcode, click on "Download." If you wish to view the barcode, you can
//           do so by clicking on "View."`;

// const [isClicked, setIsClicked] = useState(false);

// const [infoOpen, setInfoOpen] = useState(false);
// const handleClose1 = () => {
//   setInfoOpen(!infoOpen);
// };
// const handleOpen1 = () => {
//   setInfoOpen(true);
// };
//   return (
//     <Box sx={{ width: '100%', minHeight: '93vh', overflowY: 'auto' }}>
//       <DrawerHeader />
//       <Header Name={'Barcode Stick'} info={true} customOnClick={handleOpen1} />

//       {/* Dialog info Box */}
//       <InfoDialogBox
//         infoDetails={infoDetail}
//         description={description}
//         open={infoOpen}
//         close={handleClose1}
//       />

// const rws = [
//   createData(
//     1,
//     'Open Query',
//     <img
//       src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/open%20query.png?updatedAt=1702962275516'
//       height={'100%'}
//       width={'100%'}
//       style={
//         {
//           // width: '10vw',
//           // height: '10vh'
//         }
//       }
//     />,
//     `When you click on Open Query, it will show you the column of Status like "pending" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order `
//   ),

//   createData(
//     2,
//     'Closed Query',
//     <img
//       src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/closed%20query.png?updatedAt=1702962740744'
//       height={'100%'}
//       width={'100%'}
//       style={
//         {
//           // width: '10vw',
//           // height: '10vh'
//         }
//       }
//     />,
//     `When you click on Close Query, it will show you the column of Status like "close" "reject" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`
//   ),

//   createData(
//     3,
//     'Sold Query',
//     <img
//       src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sold%20query.png?updatedAt=1702962761484'
//       height={'100%'}
//       width={'100%'}
//       style={
//         {
//           // width: '10vw',
//           // height: '10vh'
//         }
//       }
//     />,
//     `When you click on Sold Query, it will show you the column of Status like "sold" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`
//   ),
// ];
