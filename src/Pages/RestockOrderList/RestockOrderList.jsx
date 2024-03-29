import React, { useEffect } from 'react';
import { Box, styled } from '@mui/material';
import RestockOrderListGrid from './component/RestockOrderListGrid';
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';
import InfoDialogBox from '../../components/Common/InfoDialogBox';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/details_wholesale%20order.png?updatedAt=1703064824324"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on Details you can view all the wholesale order details",
  },
];

const OverseasOrder = () => {
  const description =
    "This is the Order Restock here you can check Restock details  ";
  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
  
  useEffect(() => {
    dispatch(setHeader(`Restock Orders`));
  }, []);
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header Name={"Restock Orders"}/> */}

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      <RestockOrderListGrid />
    </Box>
  );
};

export default OverseasOrder;
