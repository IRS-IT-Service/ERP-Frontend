import { React, useEffect } from 'react';
import { Box, styled, Button } from '@mui/material';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import AddProductBoxesDetails from './component/AddProductBoxesDetails';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader, setInfo } from '../../features/slice/uiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: 'Bulk Upload Products',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/bulk.png?updatedAt=1717241372076'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'In Bulk Upload Products, you can upload product here with Excel ',
  },
  {
    name: 'Add Alternate Name',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/add.png?updatedAt=1717241330237'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'In Add Alternate Name, you can add alternate name here for the product',
  },
  {
    name: 'Upload Image',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/uploadImage.png?updatedAt=1717242246860'
        height={'60%'}
        width={'90%'}
      />
    ),
    instruction: 'In Upload Image, you can upload image here for the product',
  },
];

const AddRoboProducts = () => {
  /// initialize
  const navigate = useNavigate();
  /// global state
  const { themeColor } = useSelector((state) => state.ui);

  // infodialog state
  const description = 'This is to add a product. You can add a product here';

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader('Add Product'));
  }, []);
  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />
      {/* <Header Name={"Add Product"} info={true} customOnClick={handleOpen} /> */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: '5px',
        }}
      >
        <Button
          variant='contained'
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            '&hover': {
              backgroundColor: 'black',
            },
          }}
          onClick={() => {
            navigate('/bulkAddProduct/addProduct');
          }}
        >
          Bulk Upload Product
        </Button>
        <Button
          variant='contained'
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            '&hover': {
              backgroundColor: 'black',
            },
          }}
          onClick={() => {
            navigate('/bulkAddProduct/addName');
          }}
        >
          Add Alternate Name
        </Button>
        <Button
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            '&hover': {
              backgroundColor: 'black',
            },
          }}
          variant='contained'
          onClick={() => {
            navigate('/uploadimage');
          }}
        >
          Upload Image
        </Button>
      </Box>

      <AddProductBoxesDetails />
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default AddRoboProducts;
