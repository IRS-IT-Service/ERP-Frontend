import React from 'react';

import { Box, styled } from '@mui/material';
import Testing from './Component/Testing';
import Testing2 from './Component/Testing2';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const TestingComponent = () => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 0,
        width: '100%',
        paddingTop: '20px',
        overflowY: 'auto',
      }}
    >
      <DrawerHeader />
      {/* <Testing /> */}
      <Testing2 />
    </Box>
  );
};

export default TestingComponent;
