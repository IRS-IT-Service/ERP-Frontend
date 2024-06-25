import { React, useEffect, useState, useContext } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Nodata from "../../../assets/error.gif";
import FilterBar from "../../../components/Common/FilterBar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  styled,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormControl,
  Typography,
  Collapse,
  Tooltip,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import noImage from "../../../assets/NoImage.jpg";

import Loading from "../../../components/Common/Loading";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useDispatch, useSelector } from "react-redux";

import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { useSendMessageMutation } from "../../../features/api/whatsAppApiSlice";

import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useVerifyBarcodeForDispatchMutation,
  useGetPendingRequestQuery,
  useDispatchBarcodeInBulkMutation,
} from "../../../features/api/barcodeApiSlice";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import { useGetCustomerOrderShipmentQuery } from "../../../features/api/clientAndShipmentApiSlice";
import alreadyMp3 from "../../../../public/Already_fulfilled.mp3"
import NotinReqMp3 from "../../../../public/Product_is_not_in_req.mp3"
import NotFoundMp3 from "../../../../public/Barcode_Not_Found.mp3"
import successMp3 from "../../../../public/success.mp3"
import alreadyExstMp3 from "../../../../public/Product_already_exis.mp3"

import Swal from "sweetalert2";
const StyleCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: 10,
}));
const StyleCellData = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  fontSize: "12px",
}));

const infoDetail = [
  {
    name: "Parts requirement",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/partsReq.png?updatedAt=1717245317209"
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
    instruction: `Sno: Serial number of the entry.
    SKU: Stock Keeping Unit, a unique identifier for each part.
    Product: Name and description of the part.
    Parts Request: Quantity of parts requested.
    Done: Status of the request (if completed).`,
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
    instruction: `Barcode Entry Field: Enter the barcode number of the part.
    Submit Button: Submit the entered barcode for processing.`,
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
  const description = `The main interface of the Parts Requirement section is system for fullfillment`;

  const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
  }));

  /// initialization
  const socket = useSocket();
  const navigate = useNavigate();
  const { id } = useParams();
  const skip = !id;
  const already = new Audio(alreadyMp3);
  const NotinReq = new Audio(NotinReqMp3);
  const alreadyExst = new Audio(NotFoundMp3);
  const NotFound = new Audio(successMp3);
  const success = new Audio(alreadyExstMp3);
 

  /// global state
  const { userInfo } = useSelector((state) => state.auth);
  const [verifyBarcodeApi, { isLoading: verifyDispatchLoading }] =
    useVerifyBarcodeForDispatchMutation();
  const [dispatchBarcodeApi, { isLoading: dispatchLoading }] =
    useDispatchBarcodeInBulkMutation();

  const [createUserHistoryApi] = useCreateUserHistoryMutation();

  const { data: clientData, isLoading: clientLoading } =
    useGetCustomerOrderShipmentQuery(id, {
      skip,
    });

  /// local state
  const [rows, setRows] = useState([]);
  const [actualColumns, setActualColumns] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [latestSKU, setLatestSKU] = useState({
    SKU: "",
    Serial: "",
  });
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState("");
  const [barcodeRow, setBarcoderow] = useState([]);
  const [finalBarcodeRow, setFinalBarcodeRow] = useState([]);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    isFetching,
    refetch,
  } = useGetPendingRequestQuery(id, {
    skip: !skip,
  });

  useEffect(() => {
    if (allProductData?.status) {
      const newData = allProductData.data?.map((item, index) => {
        return {
          ...item,
          id: item._id,
          Sno: index + 1,
        };
      });
      setRows(newData);
    }
  }, [allProductData]);

  useEffect(() => {
    if (clientData?.status) {
      const newData = clientData.client.Items?.map((item, index) => {
        return {
          ...item,
          id: item._id,
          Sno: index + 1,
          Count: item.Qty,
          Name: item.productName,
          Isdone: false,
        };
      });
      setRows(newData);
    }
  }, [clientData]);

  const isBarcodeAlreadyExists = (rows, serialNumber) => {
    return rows.some((row) => row.serialNumber === serialNumber);
  };
  //for checking request qty
  const countSKUs = (products, rows, newSku) => {
    const skuCounts = {};
    const reqCount = {};
    for (const product of products) {
      const sku = product.SKU;
      skuCounts[sku] = (skuCounts[sku] || 0) + 1;
    }
    for (const sku of rows) {
      const skuRow = sku.SKU;
      reqCount[skuRow] = sku.Count;
    }

    if (skuCounts.hasOwnProperty(newSku)) {
      if (reqCount[newSku] === skuCounts[newSku]) {
        setRows((prev) => {
          return prev.map((item) => {
            if (item.SKU === newSku) {
              return {
                ...item,
                Isdone: "true",
              };
            }
            return item;
          });
        });
      } else {
        setRows((prev) => {
          return prev.map((item) => {
            if (item.SKU === newSku) {
              return {
                ...item,
                Isdone: skuCounts[newSku],
              };
            }
            return item;
          });
        });
      }
      if (!(reqCount[newSku] >= skuCounts[newSku])) {
        return true;
      }
    } else {
      return false;
    }

    return false;
  };

  const isBarcodeInRequest = (rows, SKU) => {
    return rows.some((row) => row.SKU === SKU);
  };

  /// handlers
  useEffect(() => {
    dispatch(setHeader(`Parts requirement`));
  }, []);

  // for barcode
  function groupBySKU(products) {
    const skuMap = {};

    products.forEach((product) => {
      const { SKU, serialNumber } = product;

      if (skuMap[SKU]) {
        skuMap[SKU].Sno.push(serialNumber);
      } else {
        skuMap[SKU] = { SKU, Sno: [serialNumber] };
      }
    });

    return Object.values(skuMap);
  }

  // handel submit function
  const handleSubmit = async () => {
    if (barcodeRow?.length <= 0) {
      toast.error("Please provide a barcode before submitting");
      return;
    }

    try {
      const data = groupBySKU(barcodeRow);
      const allDone = rows.every((row) => row.Isdone === true);
      let params = null;
      if (id) {
        if (!allDone) {
          return toast.error("Please provide all required quantities");
        }
        params = {
          OrderShipmentId: clientData?.client?.OrderShipmentId,
          CustomerName: clientData?.client?.ContactPerson,
          MobileNo: clientData?.client?.Contact,
          CompanyName: clientData?.client?.CompanyName,
          InvoiceNo: "N/A",
          barcodes: data,
        };
      } else {
        params = {
          CustomerName: "R & D",
          OrderShipmentId: null,
          CompanyName: "N/A",
          MobileNo: null,
          InvoiceNo: "N/A",
          barcodes: data,
        };
      }

      const res = await dispatchBarcodeApi(params).unwrap();

      const resultMessages = params.barcodes.map((barcode) => {
        const sku = barcode.SKU;
        const numProducts = barcode.Sno?.length || 0;
        const productsText = numProducts > 1 ? "Products" : "Product";
        return `Dispatched ${numProducts} ${productsText} of ${sku}`;
      });

      const liveStatusData = {
        message: `${userInfo.name} ${resultMessages.join(", ")}`,
        time: new Date(),
      };
      socket.emit("liveStatusServer", liveStatusData);

      const addBarcodHistory = {
        userId: userInfo.adminId,
        message: liveStatusData.message,
        type: "logistic",
        by: "user",
        reference: {},
      };

      setBarcoderow([]);
      setImage("");
      setBarcode("");

      const historyRes = await createUserHistoryApi(addBarcodHistory);
      Swal.fire({
        icon: "success",
        title: "Product Dispatched Successfully",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        timer: 700,
      });
      if (id) {
        navigate("/shipmentList");
      }
    } catch (error) {
      console.error("An error occurred during dispatch:", error);
      Swal.fire({
        icon: "error",
        title: "Barcode Product Not Found",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        timer: 700,
      });

      setBarcoderow([]);
      setImage("");
      setBarcode("");
    }
  };

  useEffect(() => {
    if (!countSKUs(finalBarcodeRow, rows, latestSKU.SKU)) {
      const latestValue = finalBarcodeRow.slice();
      
      setBarcoderow(latestValue);
    } else if (finalBarcodeRow.length > 0) {
      already.play()
      toast.error("Items are already fulfilled as per requirements");
      const latestValue = finalBarcodeRow.slice();

      const currentValue = latestValue.filter(
        (value) => value.serialNumber !== latestSKU.Serial
      );
      
      setFinalBarcodeRow(currentValue);
      
    }
  }, [finalBarcodeRow, setFinalBarcodeRow]);

  const handleChangeBarcode = async (e) => {
    setBarcode(e.target.value);
    let isDispatchError = null;
    if (e.target.value.length === 16) {
      try {
        const params = { Sno: e.target.value };
        const isExist = barcodeRow.some(
          (item) => item.serialNumber === params.Sno
        );

        if (isExist) {
          alreadyExst.play()
          toast.error("Product already exists");
          setBarcode("");
          return;
        }

        isDispatchError = true;
        const res = await verifyBarcodeApi(params).unwrap();

        if (res.status === "success") {
          
          const { barcode, product } = res.data;
          setImage(product.mainImage?.lowUrl);
          const newRow = { ...barcode, ...product };
          setBarcode("");

          if (!isBarcodeInRequest(rows, newRow.SKU)) {
            NotinReq.play()
            toast.error("Product is not in the requested");
            return;
          }

          if (!isBarcodeAlreadyExists(finalBarcodeRow, newRow.serialNumber)) {
            success.play()
            setFinalBarcodeRow((prevRows) => [...prevRows, newRow]);
            setBarcode("");
            setLatestSKU({ SKU: newRow.SKU, Serial: newRow.serialNumber });
          }
        }
      } catch (error) {
        console.error("An error occur #248f24 Dispatch return:", error);
        setBarcode("");
        NotFound.play()
        Swal.fire({
          icon: "error",
          title: isDispatchError
            ? error.data.message
            : "Barcode Product Not Found",
          confirmButtonText: "OK",
          allowOutsideClick: false,
          timer: 1700,
        });
      }
    }
  };

  const handleRowRemove = (indexToRemove) => {
    setBarcoderow((prevRows) =>
      prevRows.filter((_, index) => index !== indexToRemove)
    );
  };

  //convert object into string

  const formatShippingAddress = (obj, keyOrder = []) => {
    if (!obj || typeof obj !== "object") return "";

    // If keyOrder is provided, sort the keys accordingly; otherwise, use the object's keys as is
    const keys = keyOrder.length ? keyOrder : Object.keys(obj);

    // Build the string by iterating over the keys and getting corresponding values from the object
    const formattedString = keys
      .map((key) => obj[key] || "") // Get the value for each key or an empty string if undefined
      .filter((value) => value) // Filter out any empty values
      .join(", "); // Join the values with a comma and space

    return formattedString;
  };
  const keyOrder = ["Address", "District", "State", "Country", "Pincode"];
  const shippingAddress = formatShippingAddress(
    clientData?.client?.ShippingAddress,
    keyOrder
  );
  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 20,
      maxWidth: 50,
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
            // onClick={() => {
            //   navigate(`/OneProductDetails/${params.row.SKU}`);
            // }}
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
    // {
    //   field: "Brand",
    //   headerName: "Brand",
    //   flex: 0.3,
    //   minWidth: 120,
    //   maxWidth: 150,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    // },
    // {
    //   field: "GST",
    //   headerName: "GST",
    //   flex: 0.3,
    //   minWidth: 70,
    //   maxWidth: 70,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   valueFormatter: (params) => `${params.value} %`,
    // },

    {
      field: "Count",
      headerName: `Parts request`,
      flex: 0.3,
      minWidth: 30,
      maxWidth: 120,
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
      field: "Done",
      headerName: `Done`,
      flex: 0.3,
      minWidth: 30,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header--Pending",
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
          >
            {params.row.Isdone === "true" ? (
              <span style={{ color: "green", fontSize: "20px" }}>
                {" "}
                <i className="fa-solid fa-check"></i>{" "}
              </span>
            ) : (
              params.row.Isdone
            )}
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

        <Grid container>
          <Grid item xs={6} sx={{ mt: "5px" }}>
            {id && (
              <Box>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          padding: 1,
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Shipment Id
                      </TableCell>
                      <TableCell sx={{ padding: 1, fontSize: "12px" }}>
                        {clientData?.client?.OrderShipmentId}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          padding: 1,
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Customer Name
                      </TableCell>
                      <TableCell sx={{ padding: 1, fontSize: "12px" }}>
                        {clientData?.client?.ContactPerson}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          padding: 1,
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Company Name
                      </TableCell>
                      <TableCell sx={{ padding: 1, fontSize: "12px" }}>
                        {clientData?.client?.CompanyName}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}
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
                loading={productLoading}
                // apiRef={apiRef}
                // checkboxSelection
                disableRowSelectionOnClick
                // onRowSelectionModelChange={handleSelectionChange}
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

          {/* Dispatch section */}

          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "82.5vh",
              }}
            >
              <Box
                spacing={3}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "20% 58% 10%",
                  margin: ".9rem",
                }}
              >
                <Box>
                  <Box></Box>
                </Box>

                {/* search bar */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <TextField
                    id="filled basic"
                    placeholder="Enter barcode. NO"
                    // disabled={selectedOption ? false : true}
                    // inputRef={textFieldRef}
                    variant="outlined"
                    value={barcode}
                    onChange={handleChangeBarcode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{}} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: "60%",
                      justifySelf: "center",
                      "& input": { height: "15px" },
                    }}
                  />
                  <Box sx={{ width: "80%" }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: "bolder",
                        fontSize: "1.2rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "wrap",
                        maxWidth: "100%",
                        textAlign: "center",
                      }}
                    >
                      {barcodeRow?.length > 0
                        ? barcodeRow[barcodeRow?.length - 1].Name
                        : ""}
                    </Typography>
                  </Box>
                  <Button
                    sx={{}}
                    disabled={dispatchLoading}
                    onClick={handleSubmit}
                    variant="contained"
                  >
                    {dispatchLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Box>
                {/* dropdown */}

                <Paper
                  elevation={10}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "9rem",
                    height: "8rem",
                  }}
                >
                  <img
                    src={image ? image : noImage}
                    alt="No image available"
                    style={{
                      objectFit: "fill",
                      objectPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Paper>
              </Box>

              <TableContainer
                component={Paper}
                sx={{ overflowY: "auto", width: "100%", height: "590px" }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        SNO.
                      </StyleCell>
                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        SKU
                      </StyleCell>

                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        Barcode Number
                      </StyleCell>
                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        Name
                      </StyleCell>
                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        Brand
                      </StyleCell>

                      <StyleCell
                        sx={{
                          backgroundColor: "#248f24",
                          color: "#fff",
                        }}
                      >
                        Remove
                      </StyleCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* {verifyDispatchLoading || verifyReturnLoading ? (
                      <Loading loading={true} />
                    ) : null} */}
                    {barcodeRow.length > 0 ? (
                      barcodeRow.map((row, index) => (
                        <>
                          <TableRow key={index}>
                            <StyleCellData>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyItems: "center",
                                  alignItems: "center",
                                }}
                              >
                                {index + 1}
                              </Box>
                            </StyleCellData>
                            <StyleCellData>{row.SKU}</StyleCellData>

                            <StyleCellData>{row.serialNumber}</StyleCellData>
                            <StyleCellData>{row.Name}</StyleCellData>
                            <StyleCellData>{row.Brand}</StyleCellData>

                            <StyleCellData>
                              <DeleteIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRowRemove(index)}
                              />
                            </StyleCellData>
                          </TableRow>
                        </>
                      ))
                    ) : (
                      <>
                        <Box
                          sx={{
                            // border: '2px solid blue',

                            position: "absolute",
                            top: "70%",
                            left: "55%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              width: "200px",
                              height: "200px",
                            }}
                          ></Box>
                        </Box>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Loading loading={verifyDispatchLoading} />
    </Box>
  );
};

export default ItemsApproval;
