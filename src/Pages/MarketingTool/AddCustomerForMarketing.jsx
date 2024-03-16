import React, { useEffect, useState } from 'react';
import {
  Box,
  styled,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@mui/material';
import Header from '../../components/Common/Header';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import BASEURL from '../../constants/BaseApi';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { useAddCustomerNumberMutation } from '../../features/api/whatsAppApiSlice';
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setHeader, setInfo } from '../../features/slice/uiSlice';
// import { IoMdArrowBack } from 'react-icons/io';


const columns = [
  {
    field: 'Sno',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    flex: 0.3,
    headerName: 'Sno',
    width: 100,
  },
  {
    field: 'CustomerName',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    flex: 0.3,
    headerName: 'Customer Name',
    width: 350,
  },
  {
    field: 'CompanyName',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    flex: 0.3,
    headerName: 'Company Name',
    width: 250,
  },

  {
    field: 'CustomerNumber',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    flex: 0.3,
    headerName: 'Mobile No',
    width: 250,
  },
  {
    field: 'Address',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    flex: 0.3,
    headerName: 'Address',
    width: 250,
  },
];

const AddCustomerForMarketing = () => {
  //rtk for adding customer
  const [addCustomerNumberData] = useAddCustomerNumberMutation();

  const [data, setData] = useState([
    {
      Sno: 1,
      id: 1,
      CustomerName: '',
      CustomerNumber: '',
      CompanyName: '',
      Address: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [submitData, setSubmitData] = useState([]);
  const navigate = useNavigate();
  const { themeColor } = useSelector((state) => state.ui);
   const color = themeColor.sideBarColor1;
  // const handle change for data input

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...data];
    list[index][name] = value;
    setData(list);
  };

  // for handeling add buttons
  const handleAddData = () => {
    const updatedData = data.map((item, idx) => ({
      ...item,
      Sno: idx + 1,
      id: idx + 1,
    }));
    const updatedSubmitData = [...submitData];

    updatedData.forEach((item) => {
      const existingSno = updatedSubmitData.find(
        (dataItem) => dataItem.Sno === item.Sno
      );
      if (existingSno) {
        item.Sno = updatedSubmitData.length + 1;
        item.id = updatedSubmitData.length + 1;
      }
    });

    setSubmitData([...updatedSubmitData, ...updatedData]);

    // to clear the input
    setData([
      {
        Sno: updatedSubmitData.length + 1,
        CustomerName: '',
        CustomerNumber: '',
        CompanyName: '',
        Address: '',
      },
    ]);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Remove white spaces from the header row
      const headerRow = jsonData.shift().map((item) => item.trim());
      const processedHeaderRow = headerRow.map((item) =>
        item.startsWith('Name')
          ? item.replace(' (its not required for reference only)', '').trim()
          : item
      );

      const excelObjects = jsonData.map((row, index) =>
        row.reduce(
          (obj, value, columnIndex) => {
            // Remove white spaces from the cell values
            const trimmedValue =
              typeof value === 'string' ? value.trim() : value;
            return {
              ...obj,
              [processedHeaderRow[columnIndex]]: trimmedValue,
            };
          },
          {
            Sno: index + 1,
            id: index + 1,
          }
        )
      );
      setExcelData(excelObjects);
    };
    reader.readAsArrayBuffer(file);
  };

  const donwnloadExcelSample = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/Sample/CustomersSample.xlsx`,
        {
          responseType: 'blob',
        }
      );

      // Create a temporary link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CustomersSample.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading sample:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (submitData.length === 0 && excelData.length === 0) {
     return toast.error('add customer detail first')
    }
     const info = { data: submitData.length > 0 ? submitData : excelData };
     console.log('hi from info');

     try {
       const res = await addCustomerNumberData(info).unwrap();
       toast.success('Customer added Successfully');
     } catch (error) {
       toast.error(error);
     }
     setSubmitData([])
     navigate('/BulkMessage');
  };

  const handleNavigation = () => {
    navigate('/BulkMessage');
  };


  const dispatch = useDispatch();

    const { isInfoOpen } = useSelector((state) => state.ui);
    const handleClose = () => {
      dispatch(setInfo(false));
    };
  
    useEffect(() => {
      dispatch(setHeader(`Bulk Add Customer`));
    }, []);
  
  return (
    <>
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
      >
        <DrawerHeader />
        {/* <Header Name={'Bulk Add Product'} /> */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginY: '5px',
          }}
        >
          <Button
            variant='contained'
            size='small'
            sx={{ background: color }}
            onClick={handleNavigation}
          >
            {/* <IoMdArrowBack /> */}
            back to Bulk Message
          </Button>
          <Box>
            <input
              type='file'
              accept='.xls, .xlsx'
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id='file-upload'
              disabled={submitData.length > 0 ? true : false}
            />
            <label htmlFor='file-upload'>
              <Button
                sx={{
                  backgroundColor: color,
                }}
                variant='contained'
                component='span'
                disabled={submitData.length > 0 ? true : false}
              >
                Upload Excel File
              </Button>
            </label>
          </Box>
          <Button
            variant='contained'
            sx={{
              backgroundColor: color,
            }}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <CircularProgress
                sx={{
                  color: 'white',
                }}
              />
            ) : (
              'Submit'
            )}
          </Button>
          <Button
            variant='contained'
            sx={{
              backgroundColor: color,
            }}
            onClick={donwnloadExcelSample}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: 'white',
                }}
              />
            ) : (
              ' Download Sample Excel'
            )}
          </Button>
        </Box>
        <Box>
          {data?.map((item, index) => (
            <Grid
              container
              spacing={1}
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid item sm={1}>
                <TextField
                  label='Sno'
                  fullWidth
                  name='Sno'
                  value={item.Sno}
                  disabled
                />
              </Grid>
              <Grid item sm={2}>
                <TextField
                  label='Customer Name'
                  fullWidth
                  name='CustomerName'
                  value={item.CustomerName}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={3}>
                <TextField
                  label='Company Name'
                  fullWidth
                  name='CompanyName'
                  value={item.CompanyName}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={2}>
                <TextField
                  label='Mobile Number'
                  fullWidth
                  name='CustomerNumber'
                  value={item.CustomerNumber}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>
              <Grid item sm={3}>
                <TextField
                  label='Address'
                  fullWidth
                  name='Address'
                  value={item.Address}
                  onChange={(e) => handleChange(e, index)}
                />
              </Grid>

              <Grid item sm={1}>
                <Button
                  disabled={excelData.length > 0 ? true : false}
                  variant='contained'
                  sx={{background: color}}
                  onClick={() => handleAddData()}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '75vh',
            overflowY: 'auto',
            '& .super-app-theme--header': {
              background: '#eee',
              color: 'black',
              textAlign: 'center',
            },
            '& .vertical-lines .MuiDataGrid-cell': {
              borderRight: '1px solid #e0e0e0',
            },
            '& .supercursor-app-theme--cell:hover': {
              background:
                'linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)',
              color: 'white',
              cursor: 'pointer',
            },
          }}
        >
          <DataGrid
            rows={submitData.length > 0 ? submitData : excelData}
            columns={columns}
          />
        </Box>
      </Box>
    </>
  );
};

export default AddCustomerForMarketing;
