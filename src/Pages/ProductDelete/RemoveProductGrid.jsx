import { React, useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
import FilterBar from "../../components/Common/FilterBar";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Grid,
  Box,
  Button,
  styled,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import CachedIcon from "@mui/icons-material/Cached";
import Header from "../../components/Common/Header";
import generateUniqueId from "generate-unique-id";
import { Delete, Spa } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useDeleteProductMutation } from "../../features/api/productApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: "Sort By Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: "Sort By Category",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Search-Product",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search-product_ProductRemoval.png?updatedAt=1703144447246"
        height={"60%"}
        width={"90%"}
      />  
    ),
    instruction:
      "If you click the search product, you can search for any product or brand here",
  },  {
    name: "Search-SKU",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Sku_productRemoval.png?updatedAt=1703144412883"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click search SKU, you can search for any product or brand by SKU number here ",
  },  {
    name: "Remove",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_ProductRemoval.png?updatedAt=1703143893564"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click this button you can remove that particular product",
  }, 
  
];

// for refresh data
function CustomFooter(props) {
  const { status } = props;
  return (
    <GridToolbarContainer>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Button size="small" onClick={() => status()}>
          <CachedIcon />
        </Button>
        <GridPagination />
      </Box>
    </GridToolbarContainer>
  );
}

const RemoveProductGrid = () => {
   // infodialog state
   const description =
   "This is Product Removal you can delete  here any product ";

 const [infoOpen, setInfoOpen] = useState(false);
 const handleClose = () => {
   setInfoOpen(!infoOpen);
 };
 const handleOpen = () => {
   setInfoOpen(true);
 };
  /// initialization
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const socket = useSocket();
  const {

    userInfo,
  } = useSelector((state) => state.auth);
  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// local state
  const [rows, setRows] = useState([]);
  const [openCaptcha, setOpenCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [timerError, setTimerError] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  /// rtk query

  const {
    data: allProductData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductQuery({ searchTerm: searchTerm, type: "restock" });

  const [deleteApi, { isLoading: deleteLoading }] = useDeleteProductMutation();

  /// handlers

  /// useEffect
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData?.data.map((item, index) => {
        return {
          id: index + 1,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          Quantity: item.ActualQuantity,
          soldCount: item.soldCount,
          oldSoldCount: item.oldSoldCount,
          ThresholdQty: item.ThresholdQty,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST,
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  console.log(allProductData)

  /// Function

  const CaptchaElementGenerator = () => {
    if (!captcha) {
      return (
        <Box
          sx={{
            paddingTop: "7px",
            paddingBottom: "9px",
            // margin: "5px",
            letterSpacing: "6px",
            width: "200px",
            height: "40px",
            backgroundColor: "grey",
            borderRadius: "5px",
            textAlign: "center",
            marginBottom: "10px",
            display: "inline-block",
          }}
        ></Box>
      );
    }

    return (
      <Box
        sx={{
          paddingTop: "7px",
          paddingBottom: "9px",
          // margin: "5px",
          letterSpacing: "6px",
          width: "200px",
          height: "40px",
          backgroundColor: "grey",
          borderRadius: "5px",
          textAlign: "center",
          marginBottom: "10px",
          display: "inline-block",
        }}
      >
        {captcha.split("").map((item, index) => {
          const min = 1;
          const max = 25;

          const randomNumber =
            Math.floor(Math.random() * (max - min + 1)) + min;
          let transformValue = `rotate(${randomNumber}deg)`;

          return (
            <Typography
              key={index}
              sx={{
                display: "inline-block",
                margin: "5px",
                transform: transformValue,
              }}
            >
              {item}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const captchaRegen = () => {
    setCaptcha(
      generateUniqueId({
        length: 6,
        useLetters: true,
      })
    );
  };

  const handleSubmit = async () => {
    try {
      if (captchaInput === captcha) {
        const res = await deleteApi(selectedRow.SKU).unwrap();
        if (res.success === true) {
          const liveStatusData = {
            message: `${userInfo.name} Deleted The Product With SKU  ${selectedRow.SKU}`,
            time: new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
          socket.emit("liveStatusServer", liveStatusData);
          toast.success(res.message);
          setOpenCaptcha(false);
          setCaptchaInput("");
          setSelectedRow(null);
          refetch();
        } else {
          toast.error("Some Error Occured Plz Try Again!");
          setOpenCaptcha(false);
          setCaptchaInput("");
          setSelectedRow(null);
          refetch();
        }
      } else {
        captchaRegen();
        toast.error("Invalid Captcha");
        setTimerError(true);
        setTimeout(() => {
          setTimerError(false);
        }, 3000);
      }
    } catch (e) {
      console.log("Error at Product Removal section");
      console.log(e);
    }
  };
  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Name",
      headerName: "Product ",
      flex: 0.3,
      minWidth: 300,
      //    maxWidth: 290,
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
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 130,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "soldCount",
      headerName: "Sold Count",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
    },
    {
      field: "oldSoldCount",
      headerName: "Old Sold Count",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
    },
    {
      field: "Action",
      headerName: "Remove",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setCaptcha(
                generateUniqueId({
                  length: 6,
                  useLetters: true,
                })
              );
              setSelectedRow(params.row);
              setOpenCaptcha(true);
            }}
          >
            <Delete />
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DrawerHeader />
      <Loading loading={isLoading || isFetching} />
      <Header Name="Product Removal"  info={true} customOnClick={handleOpen}/>
      <FilterBar apiRef={apiRef} />
      <Grid container>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Box
            sx={{
              width: "100%",
              height: "83vh",
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
                Footer: CustomFooter,
              }}
              slotProps={{
                footer: { status: refetch },
              }}
              columns={columns}
              rows={rows}
              rowHeight={40}
              apiRef={apiRef}
            />
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openCaptcha}
        maxWidth="xl"
        onClose={() => {
          setOpenCaptcha(false);
          setCaptcha("");
          setCaptchaInput("");
          setSelectedRow(null);
        }}
      >
        <DialogTitle
          sx={{
            justifyContent: "space-between",
            display: "flex",

            backgroundColor: "#040678",
            color: "#fff",
          }}
        >
          <span style={{ marginLeft: "30%" }}> Captcha Verification</span>
          <div>
            <i
              className="fa-solid fa-circle-xmark"
              style={{
                marginLeft: "20%",
                cursor: "pointer",
                color: "white", // Initial color
              }}
              onClick={() => {
                setOpenCaptcha(false);
                setCaptcha("");
                setCaptchaInput("");
                setSelectedRow(null);
              }}
            ></i>
          </div>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "0",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            // textAlign: "center", // Add this line to center the content
          }}
        >
          <Box
            sx={{
              backgroundColor: "#80bfff",
              padding: "5px",
              fontWeight: "bold",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              SKU : {selectedRow?.SKU}
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Name : {selectedRow?.Name}
            </Typography>
          </Box>
          <Box
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              paddingLeft: "20px",
            }}
          >
            {CaptchaElementGenerator()}

            <Button
              sx={{
                marginBottom: "10px",
              }}
              onClick={captchaRegen}
            >
              <ReplayIcon />
            </Button>

            <TextField
              placeholder="Enter captcha"
              sx={{ display: "block" }}
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-around">
            <Button onClick={handleSubmit} variant="contained">
              {deleteLoading ? <CircularProgress /> : "Delete"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
           {/* infoDialog table */}
           <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default RemoveProductGrid;
