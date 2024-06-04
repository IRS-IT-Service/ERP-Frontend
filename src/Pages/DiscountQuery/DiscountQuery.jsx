import { React, useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import DiscountQueryGrid from './Components/DiscountQueryGrid';
import DiscountInfoDialogue from './Components/DiscountInfoDialog';
import InfoDialogBox from '../../components/Common/InfoDialogBox';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
import Header from '../../components/Common/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const infoDetail = [
  {
    name: 'Sort By Brand',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: 'Sort By Category',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: 'Sort By GST',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortByGst.png?updatedAt=1717242547125'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "If you click 'Sort by GST' and select a particular category, you can view listings for that specific product",
  },
  {
    name: 'Clear All Filter',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/ClearAllFilter.png?updatedAt=1717242379859'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      "The 'Clear all filters' button removes all applied filters, resetting the view to display all available data without any filtering criteria applied",
  },
  {
    name: 'Search',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582'
        height={'100%'}
        width={'100%'}
      />
    ),
    instruction:
      'If you click the search box, you can search for any product or brand here',
  },
  {
    name: 'CheckBox',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkBox.png?updatedAt=1717248300834'
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
    instruction: ``,
  },
  {
    name: 'Create Query',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/btnCreate.png?updatedAt=1717396267381'
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
    instruction: ``,
  },
];

const DiscountQuery = () => {
  const description = `Create Sales Query`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Create Sales Query`));
  }, []);
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />

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
