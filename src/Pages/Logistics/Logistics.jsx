import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import InwardLogistics from './Components/InwardLogistics';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Submit details',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/inwardLSubmit.png?updatedAt=1703224578665'
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
    instruction: `When you click on Submit Button, it will show you the added details to the portal`,
  },

  {
    name: 'Details Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/detailsGui.png?updatedAt=1703224870009'
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
    instruction: `When we click on Detail Button, Detail GUI open and you can view all detail for future `,
  },

  {
    name: 'View Button',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/boxView.png?updatedAt=1703225162573'
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
    instruction: `When we click on View Button, Image will Pop-up open and you can view images `,
  },
];

const Logistics = () => {
  const description = `"This inward logistics Module" is designed for tracking the logistics that are shipped to the IRS. After filling in all the details and clicking on the submit button, the system will save all the information and display it on the portal.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Inward Logistics`));
  }, []);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Inward Logistics"}
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

      <InwardLogistics />
    </Box>
  );
};

export default Logistics;
