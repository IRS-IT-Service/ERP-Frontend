import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridPagination,
} from "@mui/x-data-grid";
// import Nodata from "../../../assets/empty-cart.png";
import { Grid, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import { useGetAllProductQuery } from "../../../features/api/productApiSlice";

import {
  useGenerateBarcodeMutation,
  useGetAllBarcodesSkusQuery,
  useGetBarcodeMutation,
  useGetAllBarcodesQuery,
} from "../../../features/api/barcodeApiSlice";
import Loading from "../../../components/Common/Loading";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import BASEURL from "../../../constants/BaseApi";
import { BARCODE_URL } from "../../../constants/ApiEndpoints";
import axios from "axios";
import { saveAs } from "file-saver"; // Import this to use the saveAs function
import { toast } from "react-toastify"; // Import this to show toast messages
import BarcodeDialogbox from "./BarcodeDialogbox";
import Nodata from "../../../assets/error.gif";
import CachedIcon from "@mui/icons-material/Cached";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import TablePagination from "@mui/material/TablePagination";

import {
  setCheckedBrand,
  setCheckedCategory,
  setCheckedGST,
  setDeepSearch,
} from "../../../features/slice/productSlice";

// for refresh data

const BarcodeGenerateGrid = () => {
  /// initialize
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const debouncing = useRef();

  /// global state
  const { checkedBrand, checkedCategory, checkedGST, deepSearch } = useSelector(
    (state) => state.product
  );
  /// local state

  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectingRows, setIsSelectingRows] = useState(false);
  const [isGeneratingBarcode, setIsGeneratingBarcode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [buttonBlink, setButtonBlink] = useState("");

  /// pagination State
  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  // Rtk query
  const {
    data: allBarcodes,
    isLoading: barcodeLoading,
    refetch: barcodeRefetch,
    isFetching: isFetchingBarcode,
  } = useGetAllBarcodesQuery(filterString, { pollingInterval: 1000 * 300 });

  // this api is not getting used now
  const [generateBarcodeMutation, { isLoading: isGenerating }] =
    useGenerateBarcodeMutation();

  // this api for single sku barcode view
  const [getBarcode, { isLoading, isError }] = useGetBarcodeMutation();

  // seleciton change for button
  const handleSelectionChange = (selectionModel) => {
    if (selectionModel.length > 0) {
      setIsSelectingRows(true);
    } else {
      setIsSelectingRows(false);
    }
    setSelectedItems(selectionModel);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog box
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // this function is getting used for generating new barcodes
  const handleGenerateClick = async () => {
    try {
      if (selectedItems.length === 0) {
        window.alert("Please select Product First");
        return;
      }
      const selectedSKUs = selectedItems;
      setIsGeneratingBarcode(true);
      const { data } = await generateBarcodeMutation({ SKUs: selectedSKUs });
      if (data) {
        toast.success("Barcode Generated Successfully");
      }
      setIsGeneratingBarcode(false);
    } catch (error) {
      setIsGeneratingBarcode(false);
      toast.error("Error occurred while generating barcode");
    }
  };

  // download barcodes which is not sticked in excel file
  const handleDownloadClick = async () => {
    try {
      if (selectedItems.length === 0) {
        window.alert("Please select Product First");
        return;
      }
      const body = {
        SKUs: selectedItems,
      };

      const response = await axios.post(
        `${BASEURL}${BARCODE_URL}/getBarcode`,
        body,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "barcodes.xlsx");

      setSelectedItems([]);

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
  };

  // to view all barcode for a single sku
  const handleViewBarcode = async (sku) => {
    try {
      const { data } = await getBarcode(sku);

      if (data) {
        setData(data);
        openDialog();
      }
    } catch (error) {
      console.error("An error occurred while getting the barcode:", error);
    }
  };

  // datagrid rows api
  useEffect(() => {
    if (allBarcodes?.status === true) {
      const data = allBarcodes?.data?.data.map((item, index) => {
        return {
          id: item.SKU,
          SKU: item.SKU,
          Name: item.Name,
          Quantity: item.ActualQuantity,
          genQuantity: item.Quantity,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST,
          Color: item.Color,
        };
      });
      setRows(data);
      dispatch(setAllProductsV2(allBarcodes?.data));
      setRows(data);
      setRowPerPage(allBarcodes?.data?.limit);
      setTotalProductCount(allBarcodes?.data?.totalProductCount);
      setPage(allBarcodes?.data?.currentPage);
    }
  }, [allBarcodes]);

  // FOR CHECKBOX SELECTION
  const isRowSelectable = (params) => {
    const quantity =
      params.row.genQuantity ||
      params.row.Color === "red" ||
      params.row.Color === "yellow";
    return quantity > 0;
  };

  // function for fetch data on latest query
  const fetchDataWithQuery = (query) => {
    if (!buttonBlink) {
      setFilterString(
        `${
          filterString === "page=1"
            ? `type=${query}&page=1`
            : filterString + `type=${query}&page=1`
        }`
      );
      setButtonBlink(query);
    } else {
      setFilterString("page=1");
      setButtonBlink();
    }
  };

  useEffect(() => {
    barcodeRefetch();
    return () => {
      dispatch(setCheckedBrand([])),
        dispatch(setCheckedCategory([])),
        dispatch(setCheckedGST([])),
        dispatch(setDeepSearch(""));
      // apiRef?.current?.setPage(0),
      // apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    };
  }, []);

  // BARCODE CATEGORY GST ON SELECTION FROM FILTER BAR
  useEffect(() => {
    let newFilterString = "";
    checkedBrand.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `brand=${item}`;
      } else {
        newFilterString += `&brand=${item}`;
      }
    });

    checkedCategory.forEach((item, index) => {
      newFilterString += `&category=${item}`;
    });

    checkedGST.forEach((item, index) => {
      if (index === 0) {
        newFilterString += `&gst=${item}`;
      } else {
        newFilterString += `&gst=${item}`;
      }
    });
    if (!checkedCategory.length && !checkedBrand.length && !checkedGST.length) {
      setFilterString(`${newFilterString}page=1`);
      return;
    }

    setFilterString(`${newFilterString}&page=1`);
    setButtonBlink("");
  }, [checkedBrand, checkedCategory, checkedGST]);

  // search by name and sku
  useEffect(() => {
    // apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    clearTimeout(debouncing.current);
    if (!deepSearch) {
      setFilterString(`page=1`);
      return;
    } else {
      debouncing.current = setTimeout(() => {
        setFilterString(`deepSearch=${deepSearch}&page=1`);
      }, 1000);
      setButtonBlink("");
    }
  }, [deepSearch]);

  const BarCodeButton = (
    <Box
      sx={{
        position: "absolute",
        right: 0,
      }}
    >
      {isSelectingRows && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            m: "10px 10px 0px 10px",
          }}
        >
          {/* <Button
            sx={{ mr: "12px" }}
            variant="contained"
            onClick={handleGenerateClick}
            disabled={isChecking}
            startIcon={isGeneratingBarcode && <CircularProgress size={20} />}
          >
            {isGeneratingBarcode ? "Generating..." : "Generate"}
          </Button> */}
          <Button
            variant="contained"
            onClick={handleDownloadClick}
            disabled={isGeneratingBarcode}
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );

  function CustomFooter(props) {
    const { status } = props;
    return (
      <GridToolbarContainer>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>

          <Box display="flex" gap="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>Less Than 50% Sticked</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  backgroundColor: `${buttonBlink === "red" ? "white" : "red"}`,
                }}
                onClick={() => fetchDataWithQuery("red")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>More Than 50% Sticked</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "10px",
                  height: "20px",
                  borderRadius: "10px",
                  backgroundColor: `${
                    buttonBlink === "yellow" ? "white" : "yellow"
                  }`,
                }}
                onClick={() => fetchDataWithQuery("yellow")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>100% Sticked</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: `${
                    buttonBlink === "green" ? "white" : "green"
                  }`,
                  color: "#ffff",
                  "&:hover": {
                    backgroundColor: "#ffff",
                    color: "#B22222",
                  },
                }}
                onClick={() => fetchDataWithQuery("green")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>No Barcode</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: `blue`,

                  backgroundColor: `${
                    buttonBlink === "blue" ? "white" : "blue"
                  }`,
                  color: "#ffff",
                  "&:hover": {
                    backgroundColor: "#ffff",
                    color: "#B22222",
                  },
                }}
                onClick={() => fetchDataWithQuery("blue")}
              ></Button>
            </Box>
          </Box>

          <TablePagination
            component="div"
            count={totalProductCount}
            page={page - 1}
            onPageChange={(event, newPage) => {
              setPage(newPage + 1);

              let paramString = filterString;

              let param = new URLSearchParams(paramString);

              param.set("page", newPage + 1);

              let newFilterString = param.toString();

              setFilterString(newFilterString);

              // apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
            }}
            rowsPerPage={rowPerPage}
            onRowsPerPageChange={(event) => {
              setRowPerPage(event.target.value);
            }}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  const columns = [
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
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
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
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
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Quantity",
      headerName: "QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "View",
      headerName: "Barcode",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const { SKU, Color } = params.row;
        const handleonViewClick = () => {
          handleViewBarcode(SKU);
        };
        return (
          <>
            <Button
              variant="contained"
              sx={{
                backgroundColor: `${Color}`,
                color: "#fff",
              }}
              onClick={handleonViewClick}
            >
              View
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {/* <FilterBar
        apiRef={apiRef}
        CustomText={BarCodeButton}
        hiddenColumns={hiddenColumns}
        setHiddenColumns={setHiddenColumns}
        count={selectedItems}
      /> */}
      <FilterBarV2
        apiRef={apiRef}
        customButton1={BarCodeButton}
        count={selectedItems}
      />

      <BarcodeDialogbox
        open={isDialogOpen}
        onClose={closeDialog}
        serialNumbers={data}
      />
      <Grid container>
        {barcodeLoading || isFetchingBarcode ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                width: "100%",
                height: "85vh",
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
                apiRef={apiRef}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                rowSelectionModel={selectedItems}
                columnVisibilityModel={hiddenColumns}
                onColumnVisibilityModelChange={(newModel) =>
                  setHiddenColumns(newModel)
                }
                isRowSelectable={isRowSelectable}
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
                  Footer: CustomFooter,
                }}
                slotProps={{
                  footer: { status: barcodeRefetch },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BarcodeGenerateGrid;
