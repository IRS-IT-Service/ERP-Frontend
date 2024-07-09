import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom';
import AddSingleClientDial from './AddSingleClientDial';
import { useGetAllClientQuery } from '../../../features/api/clientAndShipmentApiSlice';
import { setHeader, setInfo } from '../../../features/slice/uiSlice';
import InfoDialogBox from '../../../components/Common/InfoDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { Portal } from "@mui/base/Portal";

// infoDialog box data
const infoDetail = [
  {
    name: 'Search',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/searchcompanyName.png?updatedAt=1717390231201'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction: `Search by Company Name`,
  },
  {
    name: 'Single Add',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addSingleClientBtn.png?updatedAt=1717390167592'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction: ` Here you can add single client details`,
  },
  {
    name: 'Bulk Add',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addBulkClient.png?updatedAt=1717390206424'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction: ` Here you can add bulk client details`,
  },
];

function MyCustomToolbar(prop) {
  return (
    <>
      <Portal container={() => document.getElementById("filter-panel")}>
       
      </Portal>
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '10px',
          padding:"2px 5px"
        
   
        }}
      >
    <GridToolbarQuickFilter  />
        <Button variant='outlined' onClick={() => navigate('/bulkAdd')}>
          Bulk Add Client
        </Button>
        <Button variant='outlined' onClick={() => setOpen(true)}>
          {' '}
          Add Single Client
        </Button>
      </Box>
   
   
    </>
  );
}

const AddClient = () => {
  // api calling
  const { data: getAllClient, refetch, isLoading } = useGetAllClientQuery();

  const apiRef = useGridApiRef();
  const dispatch = useDispatch();

  // local state
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const formatShippingAddress = (obj, keyOrder = []) => {
    if (!obj || typeof obj !== 'object') return '';

    const keys = keyOrder.length ? keyOrder : Object.keys(obj);

    const formattedString = keys
      .map((key) => obj[key] || '')
      .filter((value) => value)
      .join(', ');

    return formattedString;
  };

  ///search

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  useEffect(() => {
    if (getAllClient?.client) {
      const response = getAllClient.client.map((client, index) => {
        const keyOrder = ['Address', 'District', 'State', 'Country', 'Pincode'];
        const shippingAddress = formatShippingAddress(
          client.PermanentAddress,
          keyOrder
        );

        return {
          ...client,
          Sno: index + 1,
          id: client._id,
          CompanyName: client.CompanyName || 'N/A',
          GST: client.GSTIN,
          Address: shippingAddress,
          ContactNumber: client.ContactNumber,
          ContactName: client.ContactName,
          Email: client.Email,
        };
      });
      setRows(response);
    }
  }, [getAllClient]);

  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.1,
      minWidth: 10,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'ContactName',
      headerName: 'Contact Name',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'CompanyName',
      headerName: 'Company Name',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'GST',
      headerName: 'GST',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'ContactNumber',
      headerName: 'Contact',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'ClientType',
      headerName: 'Type',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Email',
      headerName: 'Email',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Address',
      headerName: 'Address ',
      flex: 0.3,
      minWidth: 250,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
  ];

  useEffect(() => {
    dispatch(setHeader(`Add Clients`));
  }, []);

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  return (
    <Box sx={{
     
      
    }}>
    

      <Box
        sx={{
          height: '80vh',
          marginTop:"10px",
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
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            background: '#eee',
          },
          position: 'relative',
        }}
      >
              <Box id="filter-panel2" />
        <DataGrid columns={columns} rows={rows} apiRef={apiRef} 
          slots={{
            toolbar: MyCustomToolbar,
          }}

     
             initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
              filter: {
                filterModel: {
                  items: ["Individual"],
                  quickFilterExcludeHiddenColumns: true,
                },
              },
            }}
            autoPageSize={true}
            pageSizeOptions={[50]}
        
        />
      </Box>
      {open && (
        <AddSingleClientDial open={open} setOpen={setOpen} refetch={refetch} />
      )}
      <InfoDialogBox
        infoDetails={infoDetail}
        // description={description1}
        open={isInfoOpen}
        close={handleClose1}
      />
    </Box>
  );
};

export default AddClient;
