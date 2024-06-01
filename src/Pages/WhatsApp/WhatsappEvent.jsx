import { Box, Button, Grid, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WhastsAppDial from './components/WhastsAppDial';
import Header from '../../components/Common/Header';
import { setHeader, setInfo } from '../../features/slice/uiSlice';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const approvalItems = [
  {
    name: 'Inventory Approval',
    icon: 'fa-solid fa-warehouse',
  },
  {
    name: 'MRP Approval',
    icon: 'fa-solid fa-dollar-sign',
  },
  {
    name: 'SalesPrice Approval',
    icon: 'fa-solid fa-universal-access',
  },
  {
    name: 'SellerPrice Approval',
    icon: 'fa-solid fa-hand-holding-dollar',
  },
  {
    name: 'Cost Approval',
    icon: 'fa-solid fa-check-to-slot',
  },
  {
    name: 'Open Box Approval',
    icon: 'fa-solid fa-box-open',
  },
  {
    name: 'New Product Approval',
    icon: 'fa-brands fa-product-hunt',
  },
  {
    name: 'Product Changes Approval',
    icon: 'fa-solid fa-fa-solid fa-arrow-right-arrow-left',
  },
  {
    name: 'Stock Approval',
    icon: 'fa-solid fa-fa-solid fa-arrow-right-arrow-left',
  },
  {
    name: 'Whole Sale Signup',
    icon: 'fa-solid fa-right-to-bracket',
  },
  {
    name: 'Whole Sale Registration Form',
    icon: 'fa-solid fa-address-card',
  },
  {
    name: 'Whole Sale Otp',
    icon: 'fa-solid fa-key',
  },
  {
    name: 'Shipment Event',
    icon: 'fa-solid fa-key',
  },
];

// infoDialog box data
const infoDetail = [
  {
    name: 'Inventory Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(12).png?updatedAt=1717236400231'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'Whatsapp Event for Inventory Approval to assigned User getting Message',
  },
  {
    name: 'MRP Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(11).png?updatedAt=1717236399528'
        height={'100%'}
        width={'100%'}
      />
    ),
    instruction: " Whatsapp Event for MRP Approval to assigned User getting Message",
  },
  {
    name: 'SalesPrice Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717236511929'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: " Whatsapp Event for SalesPrice Approval to assigned User getting Message",
  },
  {
    name: 'SellerPrice Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(10).png?updatedAt=1717236397627'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: " Whatsapp Event for SellerPrice Approval to assigned User getting Message",
  },
  {
    name: 'Cost Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(9).png?updatedAt=1717236397838'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for Cost Approval to assigned User getting Message",
  },
  {
    name: 'OpenBox Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(8).png?updatedAt=1717236397739'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for OpenBox Approval to assigned User getting Message",
  },
  {
    name: 'New Product Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(7).png?updatedAt=1717236397601'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: 'Whatsapp Event for New Product Approval to assigned User getting Message',
  },
  {
    name: 'Product Changes Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(6).png?updatedAt=1717236397690'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: 'Whatsapp Event for Product Changes Approval to assigned User getting Message',
  },
  {
    name: 'Stock Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(5).png?updatedAt=1717236397619'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: 'Whatsapp Event for Stock Approval to assigned User getting Message',
  },
  {
    name: 'WholeSale SignUp',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(4).png?updatedAt=1717236397586'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for WholeSale SignUp to assigned User getting Message",
  },
  {
    name: 'WholeSale Registration Form',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(3).png?updatedAt=1717236397612'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for WholeSale Registration Form to assigned User getting Message",
  },
  {
    name: 'WholeSale OTP',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(1).png?updatedAt=1717236396983'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for WholeSale OTP to assigned User getting Message",
  },
  {
    name: 'Shipment Event',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717236992292'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction: " Whatsapp Event for Shipment Event to assigned User getting Message",
  },
];
const WhatsappEvent = () => {
  // local state
  const [openDial, setOpenDial] = useState(false);
  const [name, setName] = useState('');
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor2;

  const handleOnclickButton = (item, index) => {
    setOpenDial(!openDial);
    setName(item.item.name);
  };

  // infodialog state
  const description =
    'This is Company Assets you can add assets and download assets details';

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`WhatsApp Event`));
  }, []);

  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 0,
        width: '100%',
        overflowY: 'auto',

        // border: "2px solid red",
      }}
    >
      <DrawerHeader />
      {/* <Header Name={"WhatsApp Event"} info={true} customOnClick={handleOpen} /> */}
      <Box sx={{ marginTop: '2rem' }}>
        <Grid
          container
          spacing={2}
          sx={{
            // border: "2px solid green",
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {approvalItems.map((item, index) => (
            <Grid
              key={index}
              item
              xs={4}
              sx={{
                // marginTop: "15px",
                background: color,
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '20px',
                paddingBottom: 1,
                boxShadow:
                  '-6px -6px 14px rgba(255, 255, 255, 0.7), -6px -6px 10px rgba(255, 255, 255, 0.5), 6px 6px 8px rgba(255, 255, 255, 0.075), 6px 6px 10px rgba(0, 0, 0, 0.15)',
                borderRadius: '10px',
                '&:hover': {
                  boxShadow:
                    'inset -2px -2px 6px rgba(255, 255, 255, .7),inset -2px -2px 4px rgba(255, 255, 255, .5),inset 2px 2px 2px rgba(255, 255, 255, .075),inset 2px 2px 4px rgba(0, 0, 0, .15)',
                },
              }}
            >
              <i className={`${item.icon}`} />
              <Button
                sx={{ borderRadius: '8px' }}
                onClick={() => handleOnclickButton({ item, index })}
              >
                {item.name}
              </Button>
            </Grid>
          ))}
        </Grid>
        {/* infoDialog table */}
        <InfoDialogBox
          infoDetails={infoDetail}
          description={description}
          open={isInfoOpen}
          close={handleClose}
        />
      </Box>

      {openDial && (
        <WhastsAppDial
          open={openDial}
          setOpen={setOpenDial}
          name={name}
          color={color}
        />
      )}
    </Box>
  );
};

export default WhatsappEvent;
