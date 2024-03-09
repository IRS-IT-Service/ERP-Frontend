import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/Common/Header";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";
import noDataFound from "../../../assets/error.gif";
import noImage from "../../../assets/NoImage.jpg";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Common/Loading";
import {
  Box,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  styled,
  Button,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useGetSingleAssetsMutation } from "../../../features/api/assetsSlice";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: "100%",
  },
});
const StyleCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#eee",
  padding: 3,
  color: theme.palette.mode === "dark" ? "black" : "black",
  textAlign: "center",
}));

const StyleTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",

  color: theme.palette.mode === "dark" ? "black" : "black",
  padding: 4,
  textAlign: "center",
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Search",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/seacrch_AssetsScan.png?updatedAt=1703227910493"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you want to search for assets, you can use the search bar here and enter the asset code",
  },
  {
    name: "Checkbox",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/checkbox_priceHistory.png?updatedAt=1703224608533"
        height={"20%"}
        width={"20%"}
      />
    ),
    instruction:
      "If you check the checkbox, it means you have selected that particular list",
  },
  {
    name: "Show Receipt",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Showreceipt_AssetsScan.png?updatedAt=1703227702508"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Show Receipt,' you can view the receipt for the selected list",
  },
];

const ScanAssetsCode = () => {
  // infodialog state
  const description = "This is Asset Scan. You can view scanned assets ";
  //Global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  
  const classes = useStyles();
  const socket = useSocket();

  const { userInfo } = useSelector((state) => state.auth);

  const [input, setInput] = useState("");
  const textFieldRef = useRef(null);
  const [apiResponse, setApiResponse] = useState([]);
  const [open, setOpen] = useState(false);

  const [scanAssetCode, { isLoading: LoadingAssets }] =
    useGetSingleAssetsMutation();

  useEffect(() => {
    textFieldRef.current.focus();
  }, []);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
 
  useEffect(() => {
    dispatch(setHeader(`Asset Scan`));
  }, []);

  // api calling
  useEffect(() => {
    const fetchData = async () => {
      if (input.length === 7) {
        try {
          const response = await scanAssetCode(input);
          if (response?.data?.status === "success") {
            const liveStatusData = {
              message: `${userInfo.name} Scanned Assets of Code ${input} `,
              time: new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
              }),
            };
            socket.emit("liveStatusServer", liveStatusData);

            setApiResponse((prevResults) => [...prevResults, response.data]);
            setInput("");
          } else {
            setInput("");
          }
        } catch (error) {
          console.error("Error while calling API:", error);
          setApiResponse([]);
          setInput("");
        }
      }
    };

    fetchData();
  }, [input]);

  const rows = apiResponse
    .flatMap((apiData, index) => {
      if (apiData?.data) {
        const productImage = apiData.data?.product?.url;
        const receipt = apiData.data?.receipt?.url;
        return {
          sno: index + 1,
          AssetsType: apiData.data?.AssetsType,
          AssetsName: apiData.data?.AssetsName,
          Waranty: apiData.data?.Expiry,
          Purchase: apiData.data?.PurchasedOn,
          SerialNo: apiData.data?.SerialNo,
          product: productImage,
          receiptImage: receipt,
        };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  // Reverse the rows array to display the latest data on top
  const reversedRows = [...rows].reverse();
  console.log(reversedRows);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 0,
        overflowY: "auto",
        marginTop: "70px",
      }}
    >
      {/* <Header Name={"Asset Scan"} info={true} customOnClick={handleOpen1} /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "82vh",
        }}
      >
        <Box
          sx={{
            marginTop: ".5rem",
            display: "grid",
            gridTemplateColumns: "20% 60% 20%",
          }}
        >
          <Box>
            <Paper
              elevation={10}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "15rem",
                height: "12rem",
                marginX: "1rem",
              }}
            >
              <img
                src={
                  reversedRows[0]?.product ? reversedRows[0]?.product : noImage
                }
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
          {/* search bar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4rem",
            }}
          >
            <TextField
              id="filled basic"
              placeholder="Enter Assets.. Code"
              variant="outlined"
              value={input}
              onChange={handleOnChange}
              inputRef={textFieldRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "60%",
                justifySelf: "center",
                "& input": {
                  height: "15px",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: color, // Set the outline color when focused
                  },
                },
              }}
            />

            {/* Barcode Name */}
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
                {reversedRows.length > 0 ? reversedRows[0].AssetsName : ""}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            <Button onClick={() => handleOpen()}>Show Receipt</Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          className={classes.tableContainer}
          sx={{ overflow: "auto", maxHeight: "500px", mt: "25px" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                backgroundColor: themeColor.sideBarColor1,
                color: "white",
              }}
            >
              <TableRow>
                <StyleCell>Sno.</StyleCell>
                <StyleCell>AssetsType</StyleCell>
                <StyleCell>AssetName</StyleCell>
                <StyleCell>Serial Number</StyleCell>
                <StyleCell>Purchase Date</StyleCell>
                <StyleCell>Waranty Duration</StyleCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LoadingAssets ? <Loading loading={LoadingAssets} /> : null}
              {reversedRows?.length > 0 ? (
                reversedRows.map((row) => (
                  <TableRow key={row.sno}>
                    <StyleTableCell>{row.sno}</StyleTableCell>
                    <StyleTableCell>{row.AssetsType}</StyleTableCell>
                    <StyleTableCell>{row.AssetsName}</StyleTableCell>
                    <StyleTableCell>{row.SerialNo}</StyleTableCell>
                    <StyleTableCell>{formatDate(row.Purchase)}</StyleTableCell>
                    <StyleTableCell>{row.Waranty}</StyleTableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <Box
                    sx={{
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
                    >
                      <img
                        src={noDataFound}
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
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open}>
        <DialogTitle sx={{ textAlign: "center", background: "skyblue" }}>
          Asset's Receipt
        </DialogTitle>
        <DialogContentText>
          {reversedRows[0]?.receiptImage ? (
            <iframe
              src={reversedRows[0]?.receiptImage}
              width="100%"
              height="100%"
            ></iframe>
          ) : (
            "No Receipt found"
          )}
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => setOpen(!open)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default ScanAssetsCode;
