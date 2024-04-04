import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Nodata from "../../assets/error.gif";
import { Grid, Box, TablePagination, Button, styled ,Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProductsV2 } from "../../features/slice/productSlice";
import {
  removeSelectedCreateQuery,
  setSelectedCreateQuery,
  setSelectedSkuQuery,
  removeSelectedSkuQuery,
} from "../../features/slice/selectedItemsSlice";
import { useSendMessageMutation } from "../../features/api/whatsAppApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";

import Loading from "../../components/Common/Loading";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useGetAllProductWithRandDQuery } from "../../features/api/productApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Add Parts",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesQuery.png?updatedAt=1702899124072"
        height={"100%"}
        width={"100%"}
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
    name: "Discount Card",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/discountGUI.png?updatedAt=1702900067460"
        height={"100%"}
        width={"100%"}
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
    name: "Shipment Detail Tracking",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590"
        height={"100%"}
        width={"100%"}
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

const PartsApproval = () => {
  const description = `Our Inventory Management System for R&D efficiently tracks store and R&D inventory quantities, offering real-time updates, customizable alerts, and detailed reporting to streamline operations and optimize resource allocation.`;
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
    dispatch(setHeader(`Parts recieved approval`));
  }, []);

  /// global state
  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
    useSelector((state) => state.product);
  const { createQueryItems, createQuerySku } = useSelector(
    (state) => state.seletedItems
  );
  /// local state

  const [showNoData, setShowNoData] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductWithRandDQuery(filterString, {
    pollingInterval: 1000 * 300,
  });

  /// handlers
  const handleApproveClick = async (params, bool) => {
    try {
      setSkip(false);
      const data = {
        SKU: params.row.SKU,
        value: bool,
      };
  
      const param = { query: query, body: { products: data } };
      const res = await approveProductApi(param).unwrap();
  
      const liveStatusData = {
        message: `${userInfo.name}   ${
          bool ? "Approved" : "Rejected"
        } ${query}  Update for ${params.row.Name}`,
        time: new Date()
      };

      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: "approval",
        by: "user",
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
        socket.emit("liveStatusServer", liveStatusData);
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

      const param = { query: query, body: { products: products } };
      const res = await approveProductApi(param).unwrap();
      const liveStatusData = {
        message: `${userInfo.name}   ${
          bool ? "Approved" : "Rejected"
        } ${query}  Update for Products ${products
          .map((item) => item.name)
          .join(", ")}`,
        time: new Date(),
      };
      const addProductHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: "approval",
        by: "user",
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
            position: "top-right",
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
        socket.emit("liveStatusServer", liveStatusData);
      });
      await sendWhatsAppmessage(datas).unwrap();

    } catch (error) {
      console.error(`An error occurred ${query} Approval:`, error);
    }
    setSkip(true);
  };



  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.Quantity,
          RandDQuantity: item.RAndDQuantity,
          Brand: item.Brand,
          Category: item.Category,
        };
      });

      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);

      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
  };

  

  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      minWidth: 30,
      maxWidth: 40,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      minWidth: 180,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "GST",
      headerName: "GST",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => ` ${(+params.value)?.toFixed(0)} %`,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Accept",
      headerName: "Accept",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "green",
              fontSize: "32px", // Adjust the size as needed
              cursor: "pointer", // Show pointer cursor on hover
            }}
            onClick={() => handleApproveClick(params, true)}
          >
            <ThumbUpIcon />
          </div>
        );
      },
    },
    {
      field: "Reject",
      headerName: "Reject",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "red",
              fontSize: "32px", // Adjust the size as needed
              cursor: "pointer", // Show pointer cursor on hover
            }}
            onClick={() => handleApproveClick(params, false)}
          >
            <ThumbDownIcon />
          </div>
        );
      },
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
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
            handleBulkApprove(true);
          }}
        >
          Accept All
        </Button>
      ) : (
        ""
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
        ""
      )}
      <Grid container>
        {productLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "80vh",
                "& .super-app-theme--header": {
                  background: "#eee",
                  color: "black",
                  textAlign: "center",
                },
                "& .vertical-lines .MuiDataGrid-cell": {
                  borderRight: "1px solid #e0e0e0",
                },
                "& .supercursor-app-theme--cell:hover": {
                  background:
                    "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
                  color: "white",
                  cursor: "pointer",
                },
                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  background: "#eee",
                },
              }}
            >
              <DataGrid columns={columns} rows={rows} rowHeight={40}
                   checkboxSelection
                   disableRowSelectionOnClick
                   onRowSelectionModelChange={handleSelectionChange}
                   rowSelectionModel={selectedItems}
                 components={{
                    NoRowsOverlay: () => (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            style={{
                              width: "20%",
                            }}
                            src={Nodata}
                          />
  
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
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

export default PartsApproval;
