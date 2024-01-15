import React, { useState} from "react";
import VerifyComponent from "./component/VerifyComponent";
import { Box, styled } from "@mui/material";
import ToggleNav from "../../components/Common/Togglenav";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infodialog  box

const infoDetail = [
  {
    name: 'Barcode Scan',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/scanBarcode.png?updatedAt=1703064155543'
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
    instruction: `You can either scan the barcode or manually enter the barcode number into the designated input field.`,
  },
];

const Verify = () => {
  // InfoDialogBox

  const description = `The "barcode stick module" is designed for products; when you scan a product's barcode, it provides details such as SKU, creation date, barcode number, and brand name.`;

   const [infoOpen, setInfoOpen] = useState(false);
   const handleClose = () => {
     setInfoOpen(!infoOpen);
   };
   const handleOpen = ()=>{
    setInfoOpen(true);
   }
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      
      <Header Name={'Barcode Stick'} info={true} customOnClick={handleOpen} />

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />

      <VerifyComponent />
    </Box>
  );
};

export default Verify;



