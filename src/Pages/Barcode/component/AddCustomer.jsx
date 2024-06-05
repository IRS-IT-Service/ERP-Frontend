import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, styled } from '@mui/material';
import {
  useAddCustomerMutation,
  useGetCustomerQuery,
} from '../../../features/api/barcodeApiSlice';
import { toast } from 'react-toastify';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'; // Import DataGrid
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerInfo } from '../../../features/slice/productSlice';
import Header from '../../../components/Common/Header';
import InfoDialogBox from '../../../components/Common/InfoDialogBox';
import { setHeader, setInfo } from '../../../features/slice/uiSlice';

const infoDetail = [
  {
    name: 'Add Details',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/detailsAdd.png?updatedAt=1717395706359'
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
    instruction: `Here You Can add Customer with their Details  `,
  },

  {
    name: 'Filter Details',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/filterDetails.png?updatedAt=1717395763987'
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
    instruction: `Here You Can Filter Customer Details and Find the Customer Details and Direct Dispatch the Products`,
  },
];

const AddCustomer = () => {
  const description = `Adding Customer Details`;

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Add Customer Details`));
  }, []);
  /// initialization
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();

  /// local state
  const [value, setValue] = useState({
    name: '',
    company: '',
    email: '',
    mobile: '',
  });
  const [rows, setRows] = useState([]);

  /// RTK query
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const { data: getAllCustomer, refetch } = useGetCustomerQuery();

  /// useEffects
  useEffect(() => {
    if (getAllCustomer?.status === 'success') {
      const newRows = (getAllCustomer?.data || []).map((item, index) => ({
        id: item._id,
        ...item,
      }));
      setRows(newRows);
    }
  }, [getAllCustomer]);

  /// handlers
  const handleOnChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue({ ...value, [name]: inputValue });
  };

  const handleSubmit = async () => {
    try {
      if (!value.name || !value.mobile) {
        return toast.error('Please complete the form');
      }
      const result = await addCustomer(value);
      if (result.data.status === 'success') {
        toast.success('Customer added successfully');
        setValue({
          name: '',
          company: '',
          email: '',
          mobile: '',
        });
        refetch();
      }
      setValue({
        name: '',
        company: '',
        email: '',
        mobile: '',
      });
    } catch (error) {
      toast.error(error.message);
      setValue({
        name: '',
        company: '',
        email: '',
        mobile: '',
      });
    }
  };

  const handleDispatchClick = (result) => {
    dispatch(setCustomerInfo(result));
    navigate('/dispatch_Return');
  };

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };
  /// columns
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      align: 'center',
      headerAlign: 'center', // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>{params.row.name}</div>
      ),
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      align: 'center',
      headerAlign: 'center', // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>{params.row.company}</div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      align: 'center',
      headerAlign: 'center', // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>{params.row.email}</div>
      ),
    },
    {
      field: 'mobileNo',
      headerName: 'Mobile',
      flex: 1,
      align: 'center',
      headerAlign: 'center', // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>{params.row.mobileNo}</div>
      ),
    },
    {
      field: 'dispatch',
      headerName: 'Dispatch',
      flex: 1,
      align: 'center',
      headerAlign: 'center', // Center header text
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>
          <i
            className='fa-solid fa-share-from-square'
            onClick={() => {
              const result = {
                CustomerName: params.row.name,
                MobileNo: params.row.mobileNo,
              };
              handleDispatchClick(result);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: '90vw',
          marginX: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '7rem',
          gap: '1rem',
          flexDirection: 'column',
        }}
      >
        {/* <Header
          Name={'Add Customer Details'}
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: '.6rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
              flexBasis: '30%',
            }}
          >
            <TextField
              variant='outlined'
              label='Enter Name'
              name='name'
              value={value.name}
              onChange={handleOnChange}
            />
            <TextField
              variant='outlined'
              label='Enter Company Name'
              name='company'
              value={value.company}
              onChange={handleOnChange}
            />
            <TextField
              variant='outlined'
              label='Enter Email Address'
              name='email'
              value={value.email}
              onChange={handleOnChange}
            />
            <TextField
              variant='outlined'
              label='Enter Mobile Number'
              name='mobile'
              value={value.mobile}
              onChange={handleOnChange}
            />
            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Loading..' : 'Submit'}
            </Button>
          </Box>
          <Box
            sx={{
              flexBasis: '70%',
              height: '7 0vh',
              overflow: 'auto',
              marginTop: '12px',
            }}
          >
            <TextField
              sx={{ marginBottom: '5px' }}
              placeholder='Search by Name'
              onChange={(e) => {
                handleFilterChange('name', 'contains', e.target.value);
              }}
            />
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              apiRef={apiRef}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddCustomer;
