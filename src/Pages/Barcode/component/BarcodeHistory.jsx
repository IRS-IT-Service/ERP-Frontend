import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Box } from '@mui/material';
import BarcodeHistoryDialog from './BarcodeHistoryDialog';
import FilterBar from '../../../components/Common/FilterBar';
import CartGrid from '../../../components/Common/CardGrid';
import Loading from '../../../components/Common/Loading';
import Header from '../../../components/Common/Header';
import {
  useGetBarcodesDispatchHistoryQuery,
  useGetBarcodesReturnHistoryQuery,
} from '../../../features/api/barcodeApiSlice';

import InfoDialogBox from '../../../components/Common/InfoDialogBox';
import { setHeader, setInfo } from '../../../features/slice/uiSlice';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: 'Barcode No',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/barcodeHistory.png?updatedAt=1703065501421'
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
    instruction: `When you click on View button under the Barcode No column's, it will show you the tracking details of product like it is dispatch or not `,
  },
];

const BarcodeHistory = () => {
  const description = `Barcode History`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Barcode History`));
  }, []);

  /// initialize
  const [search, setSearch] = useState('');
  // const apiRef = useGridApiRef();
  // const [filterData,setFilterData] = useState([]);

  const handleOnchange = (e) => {
    const { value } = e.target;

    setSearch(value);
  };

  const [openHistory, setOpenHistory] = useState(false);
  const [serialData, setSerialData] = useState({});
  const [hiddenColumns, setHiddenColumns] = useState({});

  // handlers
  const handleopenHistory = () => {
    setOpenHistory(!openHistory);
  };

  const [combineHistory, setcombineHistory] = useState([]);

  const {
    refetch: refetchDispath,
    data: DispatchHistory,
    isLoading: DisptachLoading,
  } = useGetBarcodesDispatchHistoryQuery();
  const {
    refetch: refetchReturn,
    data: ReturnHistory,
    isLoading: ReturnLoading,
  } = useGetBarcodesReturnHistoryQuery();

  useEffect(() => {
    if (
      DispatchHistory &&
      DispatchHistory?.data &&
      ReturnHistory?.data &&
      ReturnHistory
    ) {
      setcombineHistory([...ReturnHistory?.data, ...DispatchHistory?.data]);
    } else if (
      DispatchHistory &&
      DispatchHistory?.data &&
      !ReturnHistory?.data?.length > 0
    ) {
      setcombineHistory([...DispatchHistory?.data]);
    } else if (
      ReturnHistory &&
      ReturnHistory?.data &&
      !DispatchHistory?.data?.length > 0
    ) {
      setcombineHistory([...ReturnHistory?.data]);
    }
  }, [DispatchHistory, ReturnHistory]);

  useEffect(() => {
    refetchDispath();
    refetchReturn();
  }, []);

  const filteredData = useMemo(() => {
    if (search) {
      return combineHistory?.filter(
        (item) =>
          item.Name?.toLowerCase().includes(search?.toLowerCase()) ||
          item.SKU?.toLowerCase().includes(search?.toLowerCase()) ||
          item.Brand?.toLowerCase().includes(search?.toLowerCase())
      );
    } else {
      return combineHistory;
    }
  }, [combineHistory, search]);

  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.2,
      minWidth: 40,
      maxWidth: 50,
      align: 'center',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.2,
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.2,
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) =>
        params.row.type === 'Return' ? (
          <Typography color='error'>Return</Typography>
        ) : (
          <Typography color='green'>Dispatch</Typography>
        ),
    },
    {
      field: 'Name',
      headerName: 'Name',
      flex: 0.3,
      minWidth: 250,
      align: 'center',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Brand',
      headerName: 'Brand',
      flex: 0.2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',

      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'view',
      headerName: 'Barcode no',
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => {
        const handleViewClick = () => {
          setSerialData({
            SKU: params.row.SKU,
            Name: params.row.Name,
            SNo: params.row.SNo,
            Type: params.row.type,
          });

          handleopenHistory();
        };
        return (
          <>
            <Button onClick={handleViewClick}>view</Button>
            <BarcodeHistoryDialog
              open={openHistory}
              onClose={handleopenHistory}
              serialData={serialData}
            />
          </>
        );
      },
    },
  ];

  const rowss = (data) => {
    return data.map((item, index) => {
      return {
        id: item._id,
        Sno: index + 1,
        SKU: item.SKU,
        Name: item.Name,
        Brand: item.Brand,
        SNo: item.SNo,
        type: item.type ? item.type : 'Dispatch',
      };
    });
  };
  // editable rows
  const [editedValues, setEditedValues] = useState([]);

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflow: 'hidden' }}
    >
      <DrawerHeader />
      {/* <Header Name={"Barcode History"} info={true} customOnClick={handleOpen} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <Box
        sx={{
          height: '100%',
          width: '100%',
        }}
      >
        <input
          placeholder='search from SKU , Name , Brand'
          style={{
            width: '30rem',
            padding: '10px 25px',
            margin: '2px 0',
            borderRadius: '20px',
          }}
          name='search'
          onChange={handleOnchange}
          value={search}
        />
        <StyledBox>
          <Grid item xs={12} sx={{ mt: '7px' }}>
            <Box sx={{height:"84vh"}}>
            <DataGrid
              columns={columns}
              // apiRef={apiRef}
              rows={filteredData?.length > 0 ? rowss(filteredData) : []}
              // rowHeight={40}
              // Height={'74vh'}
              // hiddenColumns={hiddenColumns}
              // setHiddenColumns={setHiddenColumns}
            />
            </Box>
            <Loading loading={DisptachLoading || ReturnLoading} />
          
          </Grid>
        </StyledBox>
      </Box>
    </Box>
  );
};

export default BarcodeHistory;
