import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Box,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../../../assets/error.gif";
import Loading from "../../../components/Common/Loading";
import BoxesDialog from "./BoxesDialog";
import { makeStyles } from "@mui/styles";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import {
  useGetOneOverseasShipmentQuery,
  useOverseasShipmentMutation,
} from "../../../features/api/RestockOrderApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

//Todo
const infoDetail = [
  {
    name: "Inventory Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addassets_companyassets.png?updatedAt=1703058228325"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click to add assets so you can add product with all the information for that If you click to add assets, you can easily input all the necessary information for the product, streamlining the process of adding a new asset to your inventory",
  },
  {
    name: "MRP Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadCode_CompanyAssets.png?updatedAt=1703226924367"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction: "If you click 'Download Code,' you can download an Excel file",
  },
  {
    name: "SalesPrice Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/receipt_companyassets.png?updatedAt=1703058228260"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the receipt logo, you can effortlessly view the product receipt in PDF format and download it for your convenience",
  },
  {
    name: "SellerPrice Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/product-image_Companyassets.png?updatedAt=1703058228441"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the product-image logo, you can view the product PDF and download it for your convenience",
  },
  {
    name: "Cost Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "OpenBox Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "New Product Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "Product Changes Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale SignUp",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale Registration Form",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale OTP",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
];

const OneOverseasShipment = () => {
  /// initialize
  const classes = useStyles();
  const id = useParams().id;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyName = queryParams.get("companyName");
  const concernPerson = queryParams.get("concernPerson");
  const mobile = queryParams.get("mobile");

  /// local state
  const [openBox, setOpenbox] = useState(false);
  const [product, setproduct] = useState({
    data: {},
    image: "",
  });

  const [rows, setRows] = useState([]);

  /// RTK query
  const {
    refetch,
    data: overseasOrderBox,
    isLoading: overseasOrderBoxLoading,
    isFetching,
  } = useGetOneOverseasShipmentQuery(id);

  /// useEffect

  useEffect(() => {
    if (overseasOrderBox?.success === true) {
      const data = overseasOrderBox.data?.boxData?.map((item, index) => ({
        ...item,
        id: item.overseasBoxId,
        Sno: index + 1,
        subQty: item?.products?.length,
        boxId: item.overseasBoxId,
        dimension:
          item?.dimension.length +
          " X " +
          item?.dimension.width +
          " X " +
          item?.dimension.height,
        products: item?.products,
        date: formatDate(item?.createdAt),
      }));

      setRows(data);
    }
  }, [overseasOrderBox]);

  /// handler
  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
  };

  // Define the columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "boxId",
      headerName: "BoxId",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "boxMarking",
      headerName: "Box Marking",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.3,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "subQty",
      headerName: "Product QTY",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "totalOrderQty",
      headerName: "Sub Qty",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "weight",
      headerName: "Weight (kg)",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "dimension",
      headerName: "Dimensions (L x W x H)",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "details",
      headerName: "Details",
      sortable: false,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const { products, boxImage } = params.row;

        return (
          <Button
            onClick={() => {
              setOpenbox(true);
              setproduct({
                data: products,
                image: boxImage,
              });
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  //Todo
  const description =
    "This is Company Assets you can add assets and download assets details";

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Overseas Shipment Details`));
  }, []);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <StyledBox>
        <Loading loading={overseasOrderBoxLoading || isFetching} />
        <Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Table sx={{ background: "#024d70", borderRadius: "15px" }}>
                {companyName ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Tracking Id :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {overseasOrderBox?.data?.trackingId}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Courier :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {overseasOrderBox?.data?.courierName}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Company Name :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {companyName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Concern Person :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {concernPerson}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Mobile :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>{mobile}</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Tracking Id :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {overseasOrderBox?.data?.trackingId}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Courier :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {overseasOrderBox?.data?.courierName}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "68vh",
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
            position: "relative",
          }}
        >
          <DataGrid
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      // border: '2px solid blue',
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "150px",
                      height: "150px",
                    }}
                  >
                    <img
                      src={Nodata}
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      No data found !
                    </Typography>
                  </Box>
                </Box>
              ),
              // Toolbar:CustomToolbar,
            }}
            // checkboxSelection={toggleValue === "pending" ? true : false}
            // disableRowSelectionOnClick
            // onRowSelectionModelChange={handleSelectionChange}
            // rowSelectionModel={selectedItems}
            columns={columns}
            rows={rows}
            rowHeight={40}
            Height={"85vh"}
          />
        </Box>

        {openBox && (
          <BoxesDialog
            setOpenbox={setOpenbox}
            openBox={openBox}
            product={product}
          />
        )}

        <InfoDialogBox
          infoDetails={infoDetail}
          description={description}
          open={isInfoOpen}
          close={handleClose}
        />
      </StyledBox>
    </Box>
  );
};

export default OneOverseasShipment;
