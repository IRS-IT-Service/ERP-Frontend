import React from 'react';
import { Box, styled } from '@mui/material';
import RestockOrderListGrid from './component/RestockOrderListGrid';
import Header from "../../components/Common/Header";

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverseasOrder = () => {
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      <Header Name={"Restock Orders"}/>

      <RestockOrderListGrid />
    </Box>
  );
};

export default OverseasOrder;
