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
import { useGetAllVendorWithOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../../../assets/error.gif";
import Loading from "../../../components/Common/Loading";
import BoxesDialog from "./BoxesDialog";
import { makeStyles } from "@mui/styles";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import {
  useGetAllOverseasBoxQuery,
  useOverseasShipmentMutation,
} from "../../../features/api/RestockOrderApiSlice";
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const OverseasOrderBoxesCom = () => {
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [product, setproduct] = useState({
    data: {},
    image: "",
  });
  const [toggleValue, setToggleValue] = useState("pending");
  const [rows, setRows] = useState([]);
  const [shipVal, setshipVal] = useState({});

  const [shipmentValue, setShipmentValue] = useState({
    shipDate: "",
    trackingId: "",
    forwarder: "",
    courierName: "",
    shipmentTo: "",
    comment: "",
    noBoxes: 0,
  });

  const handleOnchange = (e) => {
    const { value, name } = e.target;
    setShipmentValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /// RTK query
  const {
    refetch,
    data: overseasOrderBox,
    isLoading: overseasOrderBoxLoading,
    isFetching,
  } = useGetAllOverseasBoxQuery({ type: toggleValue, vendorId: id });

  const [createBoxShipment, { isLoading: createBoxShipmentLoading }] =
    useOverseasShipmentMutation();

  const handleSubmitShipment = async () => {
    try {
      const params = {
        vendorId: id,
        trackingId: shipmentValue?.trackingId,
        courierName: shipmentValue?.courierName,
        noOfBoxes: shipmentValue?.noBoxes,
        forwarder: shipmentValue?.forwarder,
        comment: shipmentValue?.comment,
        shipmentDate: shipmentValue?.shipDate,
        boxIds: selectedItems,
      };
      const res = await createBoxShipment(params).unwrap();

      toast.success("Shipment Created", {
        position: toast.POSITION.TOP_CENTER,
      });
      setShipmentValue({
        shipDate: "",
        trackingId: "",
        forwarder: "",
        courierName: "",
        shipmentTo: "",
        comment: "",
        noBoxes: 0,
      });
      setSelectedItems([]);
      refetch();
    } catch (error) {
      console.error("An error occurred :", error);
    }
  };

  useEffect(() => {
    if (overseasOrderBox?.success === true) {
      const data = overseasOrderBox.data?.map((item, index) => ({
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
  }, [overseasOrderBox, toggleValue]);

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

  console.log(shipmentValue);
  return (
    <StyledBox>
      <Loading
        loading={
          overseasOrderBoxLoading || createBoxShipmentLoading || isFetching
        }
      />
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
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#9198ed",
                  }}
                >
                  Company Name :
                </TableCell>{" "}
                <TableCell style={{ color: "#fff" }}>{companyName}</TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#9198ed",
                  }}
                >
                  Concern Person :
                </TableCell>{" "}
                <TableCell style={{ color: "#fff" }}>{concernPerson}</TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#9198ed",
                  }}
                >
                  Mobile :
                </TableCell>{" "}
                <TableCell style={{ color: "#fff" }}>{mobile}</TableCell>
              </TableRow>

              <TableBody>{/* Add your table rows here */}</TableBody>
            </Table>
          </Box>
          <ToggleButtonGroup
            color="primary"
            value={toggleValue}
            exclusive
            onChange={(e) => {
              setToggleValue(e.target.value);
            }}
            aria-label="Platform"
          >
            <ToggleButton
              classes={{ selected: classes.selected }}
              value="pending"
            >
              Pending
            </ToggleButton>
            <ToggleButton
              classes={{ selected: classes.selected }}
              value="shipped"
            >
              Shipped
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
          {selectedItems.length ? (
            <Box style={{ display: "flex", gap: "10px", marginBlock: "5px" }}>
              <input
                placeholder=""
                Type="date"
                style={{ borderRadius: "25px", padding: "10px" }}
                value={shipmentValue.shipDate || ""}
                name="shipDate"
                onChange={handleOnchange}
              />
              <input
                placeholder="TrackingId"
                style={{
                  paddingBlock: "2px",
                  borderRadius: "25px",
                  textIndent: "10px",
                }}
                value={shipmentValue.trackingId || ""}
                name="trackingId"
                onChange={handleOnchange}
              />
              <input
                placeholder="Forwarder"
                style={{
                  padding: "2px",
                  borderRadius: "25px",
                  textIndent: "10px",
                }}
                value={shipmentValue.forwarder || ""}
                name="forwarder"
                onChange={handleOnchange}
              />
              <input
                placeholder="Courier Name"
                style={{
                  padding: "2px",
                  borderRadius: "25px",
                  textIndent: "10px",
                }}
                value={shipmentValue.courierName || ""}
                name="courierName"
                onChange={handleOnchange}
              />
              <input
                placeholder="Comment"
                style={{
                  padding: "2px",
                  borderRadius: "25px",
                  textIndent: "10px",
                }}
                value={shipmentValue.comment || ""}
                name="comment"
                onChange={handleOnchange}
              />
              <input
                placeholder="No. Boxes"
                style={{
                  padding: "2px",
                  borderRadius: "25px",
                  textIndent: "10px",
                }}
                value={shipmentValue.noBoxes || ""}
                name="noBoxes"
                onChange={handleOnchange}
              />
              <Button variant="contained" onClick={handleSubmitShipment}>
                {" "}
                Ship Box
              </Button>{" "}
            </Box>
          ) : (
            ""
          )}
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
          checkboxSelection={toggleValue === "pending" ? true : false}
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedItems}
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
    </StyledBox>
  );
};

export default OverseasOrderBoxesCom;
