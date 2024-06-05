import { React, useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import SellerVerificationList from './Component/SellerVerificationList';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: 'Action',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click View you can access the seller's personal information",
  },
  {
    name: 'Delete',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717231591201'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: "If you click Delete you can delete the seller's",
  },
];
const SellerVerification = () => {
  // infodialog state
  const description =
    'This is a wholesale request; you can view all the wholesaler requests';

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`WholeSale Requests`));
  }, []);
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header Name={"WholeSale Requests"}  info={true}
        customOnClick={handleOpen}/> */}

      <SellerVerificationList />
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default SellerVerification;
