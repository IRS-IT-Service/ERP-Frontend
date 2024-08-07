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
import { useSendMessageMutation } from "../../features/api/whatsAppApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";

import Loading from "../../components/Common/Loading";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { toast } from "react-toastify";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  useAllDispatchRnDProductQuery,
  useApproveRnDproductMutation,
} from "../../features/api/RnDSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Received Parts",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717236644148"
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
    instruction: 'R&D Approved Received Part which is getting From Logistics',
  },
];

const PartsApproval = () => {
  const description = `Parts Approval here R&D Approved Received Part which is getting From Dispatch`;
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

  /// local state

  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useAllDispatchRnDProductQuery({
    pollingInterval: 1000 * 300,
  });

  const [allAprovalSKU, { isLoading: aprrovalLoading }] =
    useApproveRnDproductMutation();

  /// handlers
  const handleApproveClick = async (data) => {
    try {
      const datas = {
        items: [data],
      };
      const res = await allAprovalSKU(datas).unwrap();
      toast.success("Accepted Items successfully");
      setSelectedItems([]);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkApprove = async (bool) => {
    try {
      const data = {
        items: selectedItems,
      };
      const res = await allAprovalSKU(data).unwrap();
      toast.success(`Accepted Items successfully`);
      setSelectedItems([]);
      refetch();
    } catch (error) {
      console.error(`An error occurred ${query} Approval:`, error);
    }

  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.allOrders?.map((item, index) => {
        return {
          ...item,
          id: item.SKU,
          Sno: index + 1,
          Sendqty:item.Sendqty
        };
      });

      setRows(data);
    }
  }, [allProductData]);

  const handleSelectionChange = (selection) => {
    const selectedRowsWithSendQty = rows.filter(row => selection.includes(row.id));
    const UpdatedValue = selectedRowsWithSendQty.map((row)=>{
      return {...row, received: row.Sendqty }
    })


    setSelectedItems(UpdatedValue)
    
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
      field: "Sendqty",
      minWidth: 200,
      maxWidth: 300,
      headerName: "Received Quantity",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Count",
      minWidth: 200,
      maxWidth: 300,
      headerName: "Rest Quantity",
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
            onClick={() => handleApproveClick({SKU:params.row.SKU,received:params.row.Sendqty})}
          >
            <ThumbUpIcon />
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
              <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={40}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                // rowSelectionModel={selectedItems}
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
