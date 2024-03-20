import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  styled,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import FilterBar from "../../../components/Common/FilterBar";
import { useGridApiRef } from "@mui/x-data-grid";
import CartGrid from "../../../components/Common/CardGrid";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";
import PriceHistoryCalc from "./PriceHistoryCalc";
import {
  useAddPriceHistoryMutation,
  useGetAllPriceHistoryQuery,
} from "../../../features/api/PriceHistoryApiSlice";
import { setAllProducts } from "../../../features/slice/productSlice";
import PriceHistoryDialogue from "./PriceHistoryDialogue";
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));

const PriceHistroy = ({ autoHeight }) => {
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();

  /// global state
  const { searchTerm, forceSearch } = useSelector((state) => state.product);

  /// functions
  const successdisplay = () => {
    Swal.fire({
      title: "History Genrate!",
      text: "The Purchase history has been successfully submitted.",
      icon: "success",
      showConfirmButton: false,
    });
    const close = () => {
      setTimeout(function () {
        Swal.close();
      }, 2000);
    };
    close();
  };

  /// rtk query
  const {
    data: allProductData,
    isLoading: productLoading,
    isFetching,
  } = useGetAllProductQuery({ searchTerm: searchTerm, type: "priceHistory" });

  /// Local state
  const [paramsData, setParamsData] = useState({
    brand: "",
    productName: "",
  });
  const [openHistory, setOpenHistory] = useState(false);
  const [openPriceHistoryCalc, setOpenPriceHistoryCalc] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [rows, setRows] = useState([]);

  /// useEffects
  useEffect(() => {
    if (allProductData?.status === "success") {
      const data = allProductData.data.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          Brand: item.Brand,
          Category: item.Category,
          QTY: item.priceHistory ? item.priceHistory.Quantity : "",
          conversionRate: item.priceHistory
            ? item.priceHistory.conversionRate
            : "",
Date: item.priceHistory ? formatDate(item.priceHistory.Date ) : "",
          GST: item.GST,
          prevRMB: item.priceHistory ? item.priceHistory.RMB : "",
          prevUSD: item.priceHistory ? item.priceHistory.USD : "",
        };
      });

      dispatch(setAllProducts({ ...allProductData }));
      setRows(data);
    }
  }, [allProductData]);

  /// handlers
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };

  /// handlers
  const HandleOpen = (sku) => {
    setOpenHistory(true);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
  };

  /// Custom Button for Filter
  const CustomText2 = (
    <Box
      onClick={() => {
        setOpenPriceHistoryCalc(true);
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "12px",
      }}
    >
      {selectedItemsData.length > 0 ? (
        <Box>
          <Button>Price History</Button>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );

  /// Columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 40,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.4,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const onClick = () => {
          setParamsData({
            brand: params.row.brand,
            productName: params.row.Name,
            SKU: params.row.SKU,
          });
          HandleOpen(params.row.SKU);
        };
        return (
          <Typography
            style={{
              cursor: "pointer",
            }}
            onClick={onClick}
          >
            {" "}
            {params.row.SKU}
          </Typography>
        );
      },
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
      minWidth: 400,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.1,
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.4,
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST%",
      flex: 0.2,
      minWidth: 50,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    // {
    //   field: "Date",
    //   headerName: "Date",
    //   flex: 0.2,
    //   minWidth: 50,
    //   maxWidth: 150,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    // },
    // {
    //   field: "QTY",
    //   headerName: "Purchase Qty",
    //   flex: 0.2,
    //   minWidth: 100,
    //   maxWidth: 200,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    // },
    // {
    //   field: "conversionRate",
    //   headerName: "Conversion Rate",
    //   flex: 0.2,
    //   minWidth: 100,
    //   maxWidth: 200,
    //   align: "center",
    //   headerAlign: "center",
    //   headerClassName: "super-app-theme--header",
    //   cellClassName: "super-app-theme--cell",
    //   renderCell: (params) => {
    //     const value = params.row.conversionRate;
    //     return <Typography variant="body2">{value && (+value).toFixed(2)}</Typography>;
    //   },
    // },
    {
      field: "prevRMB",
      headerName: "Prev RMB",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: ({ value }) => (value !== "" ? `¥ ${value} ` : ""),
    },
    {
      field: "prevUSD",
      headerName: "Prev USD",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: ({ value }) => (value !== "" ? `$ ${value} ` : ""),
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <StyledBox>
          <FilterBar
            apiRef={apiRef}
            // CustomText={CustomButton}
            CustomText2={CustomText2}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
          />
          <PriceHistoryCalc
            data={selectedItemsData}
            successdisplay={successdisplay}
            open={openPriceHistoryCalc}
            setOpen={setOpenPriceHistoryCalc}
            handleSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Loading loading={productLoading || isFetching} />

            <Box
              sx={{
                width: "100%",
                height: "78vh",
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
                columns={columns}
                rows={rows}
                rowHeight={40}
                Height={"84vh"}
                apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
              />
            </Box>
          </Grid>
        </StyledBox>
        <PriceHistoryDialogue
          openHistory={openHistory}
          handleCloseHistory={handleCloseHistory}
          paramsData={paramsData}
          HandleOpen={HandleOpen}
        />
      </Box>
    </>
  );
};
export default PriceHistroy;
