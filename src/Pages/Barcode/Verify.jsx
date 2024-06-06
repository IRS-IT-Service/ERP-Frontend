import React, { useEffect, useState} from "react";
import VerifyComponent from "./component/VerifyComponent";
import { Box, styled } from "@mui/material";
import ToggleNav from "../../components/Common/Togglenav";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

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

  const description = `Barcode Stick`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Barcode Stick`));
  }, []);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      
      {/* <Header Name={'Barcode Stick'} info={true} customOnClick={handleOpen} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <VerifyComponent />
    </Box>
  );
};

export default Verify;



