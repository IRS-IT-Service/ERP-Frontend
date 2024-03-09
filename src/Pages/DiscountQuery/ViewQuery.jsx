import { React, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Box,
  Button,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Loading from "../../components/Common/Loading";
import { useGetDiscountQueryQuery } from "../../features/api/discountQueryApiSlice";
import ViewQueryDialog from "./Components/ViewQueryDialog";
import { useLocation, useNavigate } from "react-router-dom";
import Nodata from "../../../src/assets/error.gif";
import { formatDate } from "../../commonFunctions/commonFunctions";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const infoDetail = [
  {
    name: "Open Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/open%20query.png?updatedAt=1702962275516"
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
    instruction: `When you click on Open Query, it will show you the column of Status like "pending" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order `,
  },

  {
    name: "Closed Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/closed%20query.png?updatedAt=1702962740744"
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
    instruction:
      'When you click on Close Query, it will show you the column of Status like "close" "reject" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order',
  },

  {
    name: "Sold Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sold%20query.png?updatedAt=1702962761484"
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
    instruction: `When you click on Sold Query, it will show you the column of Status like "sold" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`,
  },
];

const ViewQuery = () => {
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);

  // local state
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [openDial, setOpenDial] = useState(false);
  const [toggleParam, setToggleParam] = useState("Open");
  const [rowData, setRowData] = useState();
  const [showNewData, setShowNewData] = useState(true);
  const [showOldData, setShowOldData] = useState(false);



  const CustomToolbar = () => {
    /// global state
    const { themeColor } = useSelector((state) => state.ui);
    const color = themeColor.sideBarColor1;

    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton classes={{ selected: classes.selected }} value="Open">
            Open Query
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="Closed">
            Closed Query
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="Sold">
            Sold Query
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };
  // additional
  const location = useLocation();
  const isOnAdminRoute = location.pathname.includes("/admin");
  const navigate = useNavigate();

  // Handlers for toggling data

  ///toggle chnage
  const [alignment, setAlignment] = useState("Open");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  // rtk query
  const { data, isLoading, refetch } = useGetDiscountQueryQuery(alignment, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.status === "success") {
      const filteredRows = data.data.map((item, index) => {
        return {
          ...item,
          id: item.QueryId,
          Sno: index + 1,
          subtotal: (item.AfterDiscountTotalProfit
            ? item.AfterDiscountTotalProfit
            : item.subtotal
          ).toFixed(2),
          Products: item.Data.length,
          Date: formatDate(item.createdAt),
          ActualPrice: item.TotalSalesPrice,
          OldPrice: item.TotalDiscountPrice,
          status: item.status,
        };
      });
      setRows(filteredRows);
    }
  }, [data, showNewData, isOnAdminRoute, alignment]);

  const handleClose = () => {
    setOpenDial(false);
  };

  const handleOpen = () => {
    setOpenDial(true);
  };

  // useEffect(() => {
  //   refetch();
  // }, [data]);

  // Columns for normal user view
  const userColumns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.3,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MobileNo",
      headerName: "Mobile",
      flex: 0.5,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Products",
      headerName: "Products",
      flex: 0.3,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 0.3,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "subtotal",
      headerName: "Amount",
      flex: 0.3,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      maxWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        let statusValue;
        if (params.value === "newOffer") {
          statusValue = "New Offer";
        } else if (params.value === "sold") {
          statusValue = "Sold";
        } else if (params.value === "reject") {
          statusValue = "Rejected";
        } else if (params.value === "pending") {
          statusValue = "Pending";
        } else {
          statusValue = "Close";
        }

        const cellStyle = {
          color:
            statusValue === "New Offer"
              ? "green"
              : statusValue === "Sold"
              ? "blue"
              : statusValue === "Pending"
              ? "Orange"
              : statusValue === "Rejected"
              ? "red"
              : "black",
        };

        return <div style={cellStyle}>{statusValue}</div>;
      },

      // valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.3,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const handleViewClick = () => {
          setRowData(params.row.QueryId);
          handleOpen();
        };
        return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                handleViewClick();
              }}
            >
              Details
            </Button>
          </>
        );
      },
    },
  ];

  // Columns for admin view
  const adminColumns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.1,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MobileNo",
      headerName: "Mobile",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "NewOffer",
      headerName: "Status",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",

      renderCell: (params) => {
        let statusValue;
        let cellColor;

        if (
          params.row.status === "sold" &&
          (params.value === true || params.value === false)
        ) {
          statusValue = "Sold";
          cellColor = "blue";
        } else if (params.value === true) {
          statusValue = "Submitted";
          cellColor = "green";
        } else if (params.row.status === "reject") {
          (statusValue = "Rejected"), (cellColor = "red");
        } else {
          statusValue = "Pending";
          cellColor = "orange";
        }

        const cellStyle = {
          color: cellColor,
        };

        return <div style={cellStyle}>{statusValue}</div>;
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.1,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                navigate(`/discountquery/${params.row.QueryId}`);
              }}
            >
              Details
            </Button>
          </>
        );
      },
    },
  ];

  // Merge columns based on isAdminRoute
  const finalColumns = isOnAdminRoute ? adminColumns : userColumns;

  const description = `The Barcode Generation function is  designed to create barcodes for
          products. This is accomplished by selecting the product, clicking on
          the "Generate" button, which will yield a new barcode. To obtain the
          barcode, click on "Download." If you wish to view the barcode, you can
          do so by clicking on "View."`;


  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };
 
  useEffect(() => {
    dispatch(setHeader(`Barcode Stick`));
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: "93vh", overflowY: "hidden" }}>
      <DrawerHeader />
      {/* <Header Name={"Barcode Stick"} info={true} customOnClick={handleOpen1} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose1}
      />

      <Grid container>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <Grid item xs={12} sx={{}}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: "1rem",
                // marginBottom: "1rem",
              }}
            ></Box>
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
                columns={finalColumns}
                rows={rows}
                rowHeight={40}
                components={{
                  Toolbar: CustomToolbar,
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
                      {showNoData && (
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
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
      {openDial ? (
        <ViewQueryDialog
          openDial={openDial}
          handleClose={handleClose}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default ViewQuery;
