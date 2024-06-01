import { React, useEffect, useState } from 'react';
import './Home_Page.css';
import { Box, styled } from '@mui/material';
import ProductHistory from './Components/ProductHistory';
import Content from './Components/Content';
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
      "If you click 'Sort by Category' you can view listings for that specific GST",
  },
  {
    name: 'Sort By GST',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717226676944'
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
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717240595434'
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
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction:
      'If you click the search box, you can search for any product or brand here',
  },
];

const Home_Page = () => {
  // infodialog state
  const description =
    'This is the product list, where you can view all the product listings';

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader('Product List'));
  }, []);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'hidden' }}
    >
      <DrawerHeader />
      {/* <Header Name={"Product List"}
      info={true}
      customOnClick={handleOpen}/> */}

      <Content />

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

export default Home_Page;
