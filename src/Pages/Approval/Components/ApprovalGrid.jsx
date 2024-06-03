import { React, useEffect, useState, useContext } from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Nodata from '../../../assets/error.gif';
import FilterBar from '../../../components/Common/FilterBar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Grid, Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetUnApprovedProductQuery,
  useApproveProductsMutation,
  useGetUnApprovedCountQuery,
} from '../../../features/api/productApiSlice';
import Loading from '../../../components/Common/Loading';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../../CustomProvider/useWebSocket';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Common/Header';
import { useCreateUserHistoryMutation } from '../../../features/api/usersApiSlice';
import InfoDialogBox from '../../../components/Common/InfoDialogBox';
import { useSendMessageMutation } from '../../../features/api/whatsAppApiSlice';
import { DataSaverOff } from '@mui/icons-material';
import { setHeader, setInfo } from '../../../features/slice/uiSlice';

// infoDialog box data
const infoDetail = [
  {
    name: 'Status Quality Approval',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/StatusQualityApproval.png?updatedAt=1717398469919'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction: '',
  },
];

const ApprovalGrid = ({ setOpenHistory, setProductDetails }) => {
  const description = `"This is an Approval Module for mutual functionalities such as Stock, MRP, Sales Price, Seller Price, and Cost. In this module, you grant permission by selecting the products. Subsequently, ACCEPT ALL and REJECT ALL buttons appear, allowing you to approve or reject all selected products. You can navigate to the accept and reject columns, where icons enable you to perform the desired actions."`;

  /// initialization
  const socket = useSocket();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();

  // get query from url
  const { query } = useParams();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [rows, setRows] = useState([]);
  const [actualColumns, setActualColumns] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [skip, setSkip] = useState(true);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    isFetching,
    refetch,
  } = useGetUnApprovedProductQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const [approveProductApi, { isLoading: approvalLoading }] =
    useApproveProductsMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });

  const [createUserHistoryApi] = useCreateUserHistoryMutation();

  const [sendWhatsAppmessage] = useSendMessageMutation();
  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
  };

  const handleApproveClick = async (params, bool) => {
    try {
      setSkip(false);
      const data = {
        SKU: params.row.SKU,
        value: bool,
      };
      let approvalName =
        query === 'Quantity'
          ? 'Stock Approval'
          : query === 'MRP'
          ? 'MRP Approval'
          : query === 'SalesPrice'
          ? 'SalesPrice Approval'
          : query === 'SellerPrice'
          ? 'SellerPrice Approval'
          : query === 'LandingCost'
          ? 'Cost Approval'
          : null;
      const param = { query: query, body: { products: data } };
      const res = await approveProductApi(param).unwrap();
      if (res.ecwidUpdateTrack.length) {
        res.ecwidUpdateTrack.forEach((item) => {
          toast.success(item, {
            autoClose: 5000,
          });
        });
      }
      if (res.ecwidUpdateTrackFail.length) {
        res.ecwidUpdateTrackFail.forEach((item) => {
          toast.error(item, {
            position: 'top-right',
            autoClose: 5000,
          });
        });
      }
      const liveStatusData = {
        message: `${userInfo.name}   ${
          bool ? 'Approved' : 'Rejected'
        } ${query}  Update for ${params.row.Name}`,
        time: new Date(),
      };

      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: 'approval',
        by: 'user',
        reference: {
          product: [liveStatusData.message],
        },
      };
      const historyRes = await createUserHistoryApi(addProductHistory);
      const datas = {
        message: liveStatusData.message,
        approvalName,
      };

      refetch();
      refetchUnApprovedCount().then(() => {
        socket.emit('liveStatusServer', liveStatusData);
      });
      await sendWhatsAppmessage(datas).unwrap();
    } catch (error) {
      console.error(`An error occurred ${query} Approval:`, error);
    }
    setSkip(true);
  };

  const handleBulkApprove = async (bool) => {
    try {
      setSkip(false);
      const products = selectedItems.map((item) => {
        const findName = rows.find((data) => data.SKU === item);
        return { SKU: item, value: bool, name: findName.Name };
      });
      let approvalName =
        query === 'Quantity'
          ? 'Stock Approval'
          : query === 'MRP'
          ? 'MRP Approval'
          : query === 'SalesPrice'
          ? 'SalesPrice Approval'
          : query === 'SellerPrice'
          ? 'SellerPrice Approval'
          : query === 'LandingCost'
          ? 'Cost Approval'
          : null;
      const param = { query: query, body: { products: products } };
      const res = await approveProductApi(param).unwrap();
      const liveStatusData = {
        message: `${userInfo.name}   ${
          bool ? 'Approved' : 'Rejected'
        } ${query}  Update for Products ${products
          .map((item) => item.name)
          .join(', ')}`,
        time: new Date(),
      };
      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: 'approval',
        by: 'user',
        reference: {
          product: [liveStatusData.message],
        },
      };
      const historyRes = await createUserHistoryApi(addProductHistory);

      if (res.ecwidUpdateTrack.length) {
        res.ecwidUpdateTrack.forEach((item) => {
          toast.success(item, {
            autoClose: 5000,
          });
        });
      }
      if (res.ecwidUpdateTrackFail.length) {
        res.ecwidUpdateTrackFail.forEach((item) => {
          toast.error(item, {
            position: 'top-right',
            autoClose: 5000,
          });
        });
      }
      const datas = {
        message: liveStatusData.message,
        approvalName,
      };
      refetch();
      refetchUnApprovedCount().then(() => {
        socket.emit('liveStatusServer', liveStatusData);
      });
      await sendWhatsAppmessage(datas).unwrap();
    } catch (error) {
      console.error(`An error occurred ${query} Approval:`, error);
    }
    setSkip(true);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === 'success') {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
          GST: item.GST,
          LandingCost: item.LandingCost || 0,
          LandingCostWithGST: (
            ((item.LandingCost || 0) / 100) *
            (100 + item.GST)
          ).toFixed(2),
          SalesPrice: item.SalesPrice?.toFixed(2) || 0,
          SalesTax: item.SalesTax?.toFixed(2) || 0,
          ProfitSalesWithTax:
            query === 'SellerPrice'
              ? !item.SalesPrice || !item.LandingCost
                ? 0
                : (
                    ((item.SalesPrice - item.LandingCost) / item.LandingCost) *
                    100
                  ).toFixed(2)
              : !item[`Pending${query}`] || !item.LandingCost
              ? 0
              : (
                  ((item[`Pending${query}`] - item.LandingCost) /
                    item.LandingCost) *
                  100
                ).toFixed(2),
          ProfitSales:
            query === 'SellerPrice'
              ? (
                  ((item.SalesPrice - item.LandingCost) /
                    (item.LandingCost * (1 + item.SalesTax / 100))) *
                  100
                ).toFixed(2)
              : (
                  ((item[`Pending${query}`] - item.LandingCost) /
                    (item.LandingCost * (1 + item.SalesTax / 100))) *
                  100
                ).toFixed(2),
          // ProfitSeller:
          //   !item.SellerPrice || !item.LandingCost
          //     ? 0
          //     : (
          //         ((item.SellerPrice - item.LandingCost) / item.LandingCost) *
          //         100
          //       ).toFixed(2),
          SellerTax: item.SellerTax?.toFixed(2) || 0,
          ProfitSellerWithTax:
            !item[`Pending${query}`] || !item.LandingCost
              ? 0
              : (
                  ((item[`Pending${query}`] - item.LandingCost) /
                    item.LandingCost) *
                  100
                ).toFixed(2),
          ProfitSeller: (
            ((item[`Pending${query}`] - item.LandingCost) /
              (item.LandingCost * (1 + item.SellerTax / 100))) *
            100
          ).toFixed(2),

          currentValue: item[query === 'Quantity' ? 'ActualQuantity' : query],
          newValue: item[`Pending${query}`],
          newValueWithGST: item[`Pending${query}`]
            ? ((item[`Pending${query}`] / 100) * (100 + item.GST)).toFixed(2)
            : 0,
        };
      });

      setRows(data);
    }

    if (query === 'MRP') {
      const insertIndex = Math.floor(columns.length / 2);

      const newColumns = [
        ...columns.slice(0, insertIndex),
        ...updatedColumnsMRP,
        ...columns.slice(insertIndex),
      ];

      setActualColumns(newColumns);
    } else if (query === 'SalesPrice') {
      const insertIndex = Math.floor(columns.length / 2);

      const newColumns = [
        ...columns.slice(0, insertIndex),
        ...updatedColumnsSalesPrice,
        ...columns.slice(insertIndex),
      ];

      setActualColumns(newColumns);
    } else if (query === 'SellerPrice') {
      const insertIndex = Math.floor(columns.length / 2);

      const newColumns = [
        ...columns.slice(0, insertIndex),
        ...updatedColumnsSellerPrice,
        ...columns.slice(insertIndex),
      ];

      setActualColumns(newColumns);
    } else if (query === 'LandingCost') {
      const insertIndex = Math.floor(columns.length / 2);

      const newColumns = [
        ...columns.slice(0, insertIndex),
        ...updatedColumnsLandingCost,
        ...columns.slice(insertIndex),
      ];

      setActualColumns(newColumns);
    } else {
      setActualColumns([...columns]);
    }
  }, [allProductData]);

  /// Columns
  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => {
              setOpenHistory(true);
              setProductDetails(params.row);
            }}
          >
            {params.row.Sno}
          </div>
        );
      },
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => {
              navigate(`/OneProductDetails/${params.row.SKU}`);
            }}
          >
            {params.row.SKU}
          </div>
        );
      },
    },
    {
      field: 'Name',
      headerName: 'Product ',
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
      flex: 0.3,
      minWidth: 120,
      maxWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'GST',
      headerName: 'GST',
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'currentValue',
      headerName: `Current ${query}`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Current',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) =>
        query === 'Quantity'
          ? `${(+params.value).toFixed(0)} `
          : `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: 'newValue',
      headerName: `Pending ${query}`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Pending',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) =>
        query === 'Quantity'
          ? `${(+params.value).toFixed(0)} `
          : `₹ ${(+params.value).toFixed(0)} `,
    },

    {
      field: 'Accept',
      headerName: 'Accept',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div
            style={{
              color: 'green',
              fontSize: '32px', // Adjust the size as needed
              cursor: 'pointer', // Show pointer cursor on hover
            }}
            onClick={() => handleApproveClick(params, true)}
          >
            <ThumbUpIcon />
          </div>
        );
      },
    },
    {
      field: 'Reject',
      headerName: 'Reject',
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        return (
          <div
            style={{
              color: 'red',
              fontSize: '32px', // Adjust the size as needed
              cursor: 'pointer', // Show pointer cursor on hover
            }}
            onClick={() => handleApproveClick(params, false)}
          >
            <ThumbDownIcon />
          </div>
        );
      },
    },
    // Add more columns if needed
  ];

  const updatedColumnsMRP = [
    {
      field: 'LandingCost',
      headerName: 'Cost',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'LandingCostWithGST',
      headerName: 'Cost +GST',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
  ];

  const updatedColumnsLandingCost = [
    {
      field: 'newValueWithGST',
      headerName: 'LandingCost +GST',
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
  ];

  const updatedColumnsSalesPrice = [
    {
      field: 'LandingCost',
      headerName: 'Cost',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'LandingCostWithGST',
      headerName: 'Cost +GST',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'ProfitSales',
      headerName: 'ProfitSales',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'SalesTax',
      headerName: 'SalesTax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'ProfitSalesWithTax',
      headerName: 'ProfitSales with Tax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'newValueWithGST',
      headerName: `SalesPrice with GST`,
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
  ];

  const updatedColumnsSellerPrice = [
    {
      field: 'LandingCost',
      headerName: 'Cost',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'LandingCostWithGST',
      headerName: 'Cost +GST',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'SalesPrice',
      headerName: 'SalesPrice',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: 'ProfitSales',
      headerName: 'ProfitSales',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'SalesTax',
      headerName: 'SalesTax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'ProfitSalesWithTax',
      headerName: 'ProfitSales +Tax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Sales',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'SellerTax',
      headerName: 'SellerTax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'ProfitSeller',
      headerName: 'ProfitSeller',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: 'ProfitSellerWithTax',
      headerName: 'ProfitSeller +Tax',
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: 'newValueWithGST',
      headerName: `SellerPrice +GST`,
      flex: 0.3,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header--Seller',
      cellClassName: 'super-app-theme--cell',
      valueFormatter: (params) => `₹ ${params.value}`,
    },
  ];

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`${query} Approval`));
  }, [query]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* <Header
        Name={`${query} Approval`}
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

      {selectedItems.length ? (
        <Button
          onClick={() => {
            handleBulkApprove(true);
          }}
        >
          Accept All
        </Button>
      ) : (
        ''
      )}
      {selectedItems.length ? (
        <Button
          onClick={() => {
            handleBulkApprove(false);
          }}
        >
          Reject All
        </Button>
      ) : (
        ''
      )}
      <Grid container>
        {approvalLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: '5px' }}>
            <Box
              sx={{
                width: '100%',
                height: '82vh',
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
                ' .super-app-theme--header--Pending': {
                  backgroundColor: '#00308F',
                  color: '#F0FFFF',
                },
                ' .super-app-theme--header--Current': {
                  backgroundColor: '#7CB9E8',
                  // color: "#F0FFFF",
                },
                ' .super-app-theme--header--Sales': {
                  backgroundColor: '#93C54B',
                  // color: "#F0FFFF",
                },
                ' .super-app-theme--header--Seller': {
                  backgroundColor: '#606CF2',
                  // color: "#F0FFFF",
                },
              }}
            >
              <DataGrid
                columns={actualColumns}
                rows={rows}
                rowHeight={40}
                // apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                components={{
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <img
                          style={{
                            width: '20%',
                          }}
                          src={Nodata}
                        />

                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                        >
                          No data found !
                        </Typography>
                      </Box>
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ApprovalGrid;
