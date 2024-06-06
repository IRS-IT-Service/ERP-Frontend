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
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/inventoryApproval.png?updatedAt=1717392413962'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      'Whatsapp Event for Inventory Approval to assigned User getting Message',
  },
  {
    name: 'MRP Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/mrpApproval.png?updatedAt=1717392379211'
        height={'100%'}
        width={'100%'}
      />
    ),
    instruction:
      ' Whatsapp Event for MRP Approval to assigned User getting Message',
  },
  {
    name: 'SalesPrice Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesPrice.png?updatedAt=1717393847253'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      ' Whatsapp Event for SalesPrice Approval to assigned User getting Message',
  },
  {
    name: 'SellerPrice Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sellerPriceApproval.png?updatedAt=1717392452889'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      ' Whatsapp Event for SellerPrice Approval to assigned User getting Message',
  },
  {
    name: 'Cost Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/costApproval.png?updatedAt=1717392483961'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for Cost Approval to assigned User getting Message',
  },
  {
    name: 'OpenBox Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/openBoxApproval.png?updatedAt=1717392515068'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for OpenBox Approval to assigned User getting Message',
  },
  {
    name: 'New Product Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/newProductApproval.png?updatedAt=1717392549370'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      'Whatsapp Event for New Product Approval to assigned User getting Message',
  },
  {
    name: 'Product Changes Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/productChangesApproval.png?updatedAt=1717392590575'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      'Whatsapp Event for Product Changes Approval to assigned User getting Message',
  },
  {
    name: 'Stock Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/stockApproval.png?updatedAt=1717392625887'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      'Whatsapp Event for Stock Approval to assigned User getting Message',
  },
  {
    name: 'WholeSale SignUp',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/wholeSaleSignUp.png?updatedAt=1717392345016'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for WholeSale SignUp to assigned User getting Message',
  },
  {
    name: 'WholeSale Registration Form',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/wholesaleRegistrationFrom.png?updatedAt=1717393908318'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for WholeSale Registration Form to assigned User getting Message',
  },
  {
    name: 'WholeSale OTP',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/wholeSaleOtp.png?updatedAt=1717393978714'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for WholeSale OTP to assigned User getting Message',
  },
  {
    name: 'Shipment Event',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/shipmentEvent.png?updatedAt=1717394583791'
        height={'40%'}
        width={'40%'}
      />
    ),
    instruction:
      ' Whatsapp Event for Shipment Event to assigned User getting Message',
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
