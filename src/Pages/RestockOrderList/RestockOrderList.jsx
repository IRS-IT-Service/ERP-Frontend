import React, { useEffect } from 'react';
import { Box, styled } from '@mui/material';
import RestockOrderListGrid from './component/RestockOrderListGrid';
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverseasOrder = () => {
  
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

      <RestockOrderListGrid />
    </Box>
  );
};

export default OverseasOrder;
