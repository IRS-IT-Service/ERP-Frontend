import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Nodata from "../../assets/error.gif";
import {
  Grid,
  Box,
  TablePagination,
  Button,
  styled,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DvrIcon from "@mui/icons-material/Dvr";
import { useSendMessageMutation } from "../../features/api/whatsAppApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";
import Loading from "../../components/Common/Loading";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useGetAllPreOrderQuery } from "../../features/api/RnDSlice";
import PreOrderDetailDial from "./Components/preOrderDetailDial";
import { FlashlightOffRounded } from "@mui/icons-material";
import { formatDate } from "../../commonFunctions/commonFunctions";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Pre Order",
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

const PreOrder = () => {
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
    dispatch(setHeader(`Pre Order`));
  }, []);

  /// global state
  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
    useSelector((state) => state.product);
  const { createQueryItems, createQuerySku } = useSelector(
    (state) => state.seletedItems
  );
  /// local state

  const [showData, setShowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);




  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllPreOrderQuery();

  /// handlers
  const handleCloseDial = () => {
    setOpen(FlashlightOffRounded);
  };
  
const handleDetails = (details) =>{
setOpen(true)
setShowData(details)
}


  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.allOrders?.map((item, index) => {
        return {
          ...item,
          id: item._id,
          Sno: index + 1,
          ProjectId: item.id,
        };
      });

      setRows(data);
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
      field: "ProjectId",
      headerName: "Project Id",
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },    {
        field: "createdAt",
        headerName: "Pre-Order Date",
        minWidth: 200,
        maxWidth: 300,
        align: "center",
        headerAlign: "center",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
        renderCell: (params) => {
const date = params.row.createdAt

       return (
          <>
            {formatDate(date)}
          </>
        );
            
                  
          },
      },
    {
      field: "Name",
      headerName: "Product Name",
      flex: 0.1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Details",
      headerName: "Details",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const paramsData = params.row

    
        return (
          <Box
            sx={{
              color: "blue",
              fontSize: "32px", 
              cursor: "pointer",
              "&:hover":{color:"green"} 
            }}
            onClick={() => handleDetails(paramsData)}
          >
          < DvrIcon />
          </Box>
        );
      },
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
            onClick={() => setOpen(true)}
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
     {open && <PreOrderDetailDial 
      open={open}
      setOpen={setOpen}
      data={showData}
      
      /> }
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
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
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

export default PreOrder;
