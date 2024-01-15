import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import BarcodeGenerateGrid from './component/BarcodeGenerateGrid';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Generate Barcode',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/generateBarcode.png?updatedAt=1702978365135'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction:
      'The "Generate" button will generate a new barcode for the selected products.',
  },

  {
    name: 'Buttons for Generate & Download Barcode',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadBarcode.png?updatedAt=1702978364929'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction:
      'When you click on the download button, it will download the generated barcode in Excel format.',
  },

  {
    name: 'View Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/barcodeView.png?updatedAt=1703134934128'
        height={'100%'}
        width={'100%'}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction:
      'When you click on the View Button, it will show you barcode for specific selected product.',
  },
];

function BarcodeGenerate() {
  const description = `The Barcode Generation function is  designed to create barcodes for
          products. This is accomplished by selecting the product, clicking on
          the "Generate" button, which will yield a new barcode. To obtain the
          barcode, click on "Download." If you wish to view the barcode, you can
          do so by clicking on "View."`;

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      <Header Name={'Barcode Generate'} info={true} customOnClick={handleOpen} />

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
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
