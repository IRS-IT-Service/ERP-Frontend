import { React, useEffect, useState, useContext } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Nodata from "../../assets/error.gif";
import FilterBar from "../../components/Common/FilterBar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Grid, Box, Button, Typography, styled } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetUnApprovedProductQuery,
  useApproveProductsMutation,
  useGetUnApprovedCountQuery,
} from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSocket } from "../../CustomProvider/useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Common/Header";
import { useCreateUserHistoryMutation } from "../../features/api/usersApiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useSendMessageMutation } from "../../features/api/whatsAppApiSlice";
import { DataSaverOff } from "@mui/icons-material";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const infoDetail = [
  {
    name: "Create parts request",
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

const ItemsApproval = ({ setOpenHistory, setProductDetails }) => {
  const description = `"This is an Approval Module for mutual functionalities such as Stock, MRP, Sales Price, Seller Price, and Cost. In this module, you grant permission by selecting the products. Subsequently, ACCEPT ALL and REJECT ALL buttons appear, allowing you to approve or reject all selected products. You can navigate to the accept and reject columns, where icons enable you to perform the desired actions."`;

  const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));

  /// initialization
  const socket = useSocket();
  const navigate = useNavigate();




  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [rows, setRows] = useState([]);
  const [actualColumns, setActualColumns] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [skip, setSkip] = useState(true);

  /// rtk query

  // const {
  //   data: allProductData,
  //   isLoading: productLoading,
  //   isFetching,
  //   refetch,
  // } = useGetUnApprovedProductQuery(query, {
  //   refetchOnMountOrArgChange: true,
  // });

  const [approveProductApi, { isLoading: approvalLoading }] =
    useApproveProductsMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });

  const [createUserHistoryApi] = useCreateUserHistoryMutation();

  const [sendWhatsAppmessage] = useSendMessageMutation();
  /// handlers
  useEffect(() => {
    dispatch(setHeader(`Create parts request`));
  }, []);

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
  };

  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "currentValue",
      headerName: `Current Stock`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header--Current",
      cellClassName: "super-app-theme--cell",
      // valueFormatter: (params) =>
      //   query === "Quantity"
      //     ? `${(+params.value).toFixed(0)} `
      //     : `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "newValue",
      headerName: `Parts receive`,
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header--Pending",
      cellClassName: "super-app-theme--cell",
      // valueFormatter: (params) =>
      //   query === "Quantity"
      //     ? `${(+params.value).toFixed(0)} `
      //     : `₹ ${(+params.value).toFixed(0)} `,
    },

    {
      field: "Accept",
      headerName: "Accept",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
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
      flex: 0.3,
      minWidth: 80,
      maxWidth: 80,
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
    // Add more columns if needed
  ];

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Parts Received Approval`));
  },[]);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Box sx={{ width: "100%" }}>
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
     
            <Grid item xs={12} sx={{ mt: "5px" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "82vh",
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
                  " .super-app-theme--header--Pending": {
                    backgroundColor: "#00308F",
                    color: "#F0FFFF",
                  },
                  " .super-app-theme--header--Current": {
                    backgroundColor: "#7CB9E8",
                    // color: "#F0FFFF",
                  },
                  " .super-app-theme--header--Sales": {
                    backgroundColor: "#93C54B",
                    // color: "#F0FFFF",
                  },
                  " .super-app-theme--header--Seller": {
                    backgroundColor: "#606CF2",
                    // color: "#F0FFFF",
                  },
                }}
              >
                <DataGrid
                  columns={columns}
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
    
        </Grid>
      </Box>
    </Box>
  );
};

export default ItemsApproval;
