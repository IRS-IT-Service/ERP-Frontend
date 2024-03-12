import { React, useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import CreateBoxOpen from "./Components/CreateBoxOpen";
import Header from "../../components/Common/Header";
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Scan Barcode Input',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/scanBarcodeComponent.png?updatedAt=1703074163650'
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
    instruction: `Enter the barcode here to input all the data.`,
  },
];

const OpenBox = () => {

  const description = `In the Box Open section, you are required to scan the barcode of the product component. Afterward, you need to fill in data such as status and action.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Box open section`));
  }, []);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={'Box open section'}
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

      <CreateBoxOpen />
    </Box>
  );
};

export default OpenBox;
