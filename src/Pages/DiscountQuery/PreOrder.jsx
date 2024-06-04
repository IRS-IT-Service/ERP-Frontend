import { React, useEffect, useState, useRef } from 'react';
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import Nodata from '../../assets/error.gif';
import {
  Grid,
  Box,
  TablePagination,
  Button,
  styled,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DvrIcon from '@mui/icons-material/Dvr';
import { useSendMessageMutation } from '../../features/api/whatsAppApiSlice';
import { useSocket } from '../../CustomProvider/useWebSocket';
import Loading from '../../components/Common/Loading';
import InfoDialogBox from '../../components/Common/InfoDialogBox';
import { setHeader, setInfo } from '../../features/slice/uiSlice';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  useGetAllPreOrderQuery,
  useFullFillPreOrderMutation,
} from '../../features/api/RnDSlice';
import { FlashlightOffRounded, TaskOutlined } from '@mui/icons-material';
import { formatDate } from '../../commonFunctions/commonFunctions';
import { toast } from 'react-toastify';
const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
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
    instruction: `Here we Can See PreOrder Detail with QTY and SKU`,
  },

  // {
  //   name: "Discount Card",
  //   screenshot: (
  //     <img
  //       src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/discountGUI.png?updatedAt=1702900067460"
  //       height={"100%"}
  //       width={"100%"}
  //       style={
  //         {
  //           // width: '10vw',
  //           // height: '10vh'
  //         }
  //       }
  //     />
  //   ),
  //   instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
  // },

  // {
  //   name: "Shipment Detail Tracking",
  //   screenshot: (
  //     <img
  //       src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590"
  //       height={"100%"}
  //       width={"100%"}
  //       style={
  //         {
  //           // width: '10vw',
  //           // height: '10vh'
  //         }
  //       }
  //     />
  //   ),
  //   instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  // },
];

const PreOrder = () => {
  const description = `Pre Order`;
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();
  const socket = useSocket();
  const { userInfo } = useSelector((state) => state.auth);

  const [sendWhatsAppmessage] = useSendMessageMutation();
  // Parse the query string

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Pre Order`));
  }, []);

  /// global state

  /// local state

  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSKU, setSelectedSKU] = useState([]);
  const [open, setOpen] = useState(false);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllPreOrderQuery();

  const [Acceptdata, { isLoading: acceptLoading }] =
    useFullFillPreOrderMutation();

  /// handlers

  const handleApproval = async (params) => {
    const data = params.row;
    try {
      const info = {
        items: [
          {
            SKU: data.SKU,
            id: data.Orderid,
          },
        ],
      };
      const res = await Acceptdata(info).unwrap();
      toast.success('Accepted Items successfully');
      setSelectedItems([]);
      setSelectedSKU([]);
      refetch();
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handleApprovalBulk = async () => {
    try {
      if (!selectedSKU?.length > 0) {
        return;
      }
      const info = {
        items: selectedSKU,
      };
      const res = await Acceptdata(info).unwrap();
      toast.success('Accepted Items successfully');
      setSelectedItems([]);
      setSelectedSKU([]);
      refetch();
    } catch (e) {
      console.log('Error', e);
    }
  };

  function checkCharacterMatch(string, char) {
    if (string[0] === char[0] && string[1] === char[1]) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.allOrders?.map((item, index) => {
        const char = 'PR';
        return {
          ...item,
          id: item.SKU,
          Sno: index + 1,
          Orderid: item.id,
          createdAt: new Date(item.createdAt),
          customerName: checkCharacterMatch(item.id, char)
            ? 'R&D'
            : item.userName,
        };
      });

      setRows(data);
    }
  }, [allProductData]);

  const handleSelectionChange = (selectionModel) => {
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );

    const finalValue = newSelectedRowsData.map((data) => {
      return {
        SKU: data.SKU,
        id: data.Orderid,
      };
    });
    setSelectedSKU(finalValue);
    setSelectedItems(selectionModel);
  };

  //Columns*******************
  const columns = [
    {
      field: 'Sno',
      headerName: 'Sno',
      minWidth: 30,
      maxWidth: 40,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'createdAt',
      headerName: 'Pre-Order Date',
      minWidth: 120,
      maxWidth: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        const date = params.row.createdAt;

        return <>{formatDate(date)}</>;
      },
    },
    {
      field: 'SKU',
      headerName: 'SKU',
      minWidth: 200,
      maxWidth: 300,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Orderid',
      headerName: 'Order Id',
      minWidth: 200,
      maxWidth: 300,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      minWidth: 250,
      maxWidth: 350,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'Name',
      headerName: 'Product Name',
      flex: 0.1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Quantity',
      headerName: 'Pre-Order QTY',
      minWidth: 80,
      maxWidth: 120,
      flex: 0.1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'ActualQuantity',
      headerName: 'QTY in stock',
      minWidth: 80,
      maxWidth: 120,
      flex: 0.1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },

    {
      field: 'Accept',
      headerName: 'Accept',
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => {
        const AcutalQty = params.row.ActualQuantity;
        const preOrderQTY = params.row.Quantity;
        return (
          <div
            style={{
              color: `${AcutalQty > preOrderQTY ? 'green' : '#eeee'}`,
              fontSize: '32px', // Adjust the size as needed
              cursor: 'pointer', // Show pointer cursor on hover
            }}
            onClick={() => AcutalQty > preOrderQTY && handleApproval(params)}
          >
            <ThumbUpIcon />
          </div>
        );
      },
    },
  ];

  return (
    <Box
      component='main'
      sx={{ flexGrow: 1, p: 0, width: '100%', overflowY: 'auto' }}
    >
      <DrawerHeader />

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      {selectedItems.length ? (
        <Button
          onClick={() => {
            handleApprovalBulk();
          }}
        >
          Accept All
        </Button>
      ) : (
        ''
      )}

      <Grid container>
        {productLoading || isFetching || acceptLoading ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: '5px' }}>
            <Box
              sx={{
                width: '100%',
                height: '80vh',
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
              }}
            >
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                checkboxSelection
                isRowSelectable={(params) =>
                  params.row.ActualQuantity > params.row.Quantity
                }
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

export default PreOrder;
