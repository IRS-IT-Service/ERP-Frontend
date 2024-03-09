import { React, useEffect, useState } from "react";
import {
  Box,
  styled,

} from '@mui/material';
import DiscountQueryGrid from "./Components/DiscountQueryGrid";
import DiscountInfoDialogue from "./Components/DiscountInfoDialog";
import InfoDialogBox from '../../components/Common/InfoDialogBox';



const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const infoDetail = [
  {
    name: 'Create Query',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesQuery.png?updatedAt=1702899124072'
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
    instruction: `When you click on Create Query, it will show you the selected product discount GUI`,
  },

  {
    name: 'Discount Card',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/discountGUI.png?updatedAt=1702900067460'
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
    instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
  },

  {
    name: 'Shipment Detail Tracking',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590'
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
    instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  },
];


const DiscountQuery = () => {
   const description = `The "Create Sales Query" functionality is utilized to compute
            discounts when a client requests a discount for multiple products.
            Additionally, you can save these discounts for future reference.
            Please note that you can only select products with recorded sales or
            MRP prices.`;

  
            const dispatch = useDispatch();

            const { isInfoOpen } = useSelector((state) => state.ui);
            const handleClose = () => {
              dispatch(setInfo(false));
            };
            
            useEffect(() => {
              dispatch(setHeader(`Sales Details`));
            }, []);
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header Name={'Sales Details'} info={true} customOnClick={handleOpen} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      {/* dialog box */}

      <DiscountQueryGrid />
    </Box>
  );
};


export default DiscountQuery;
