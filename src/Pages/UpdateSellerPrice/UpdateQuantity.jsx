import {
  React,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import FilterBarV2 from "../../components/Common/FilterBarV2";
import { Grid, Box, Button, styled } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAllProductsV2 } from "../../features/slice/productSlice";
import CachedIcon from "@mui/icons-material/Cached";
import BulkUpdateSelectorDialog from "./components/BulkUpdateSelectorDialog";
import {
  useUpdateProductsColumnMutation,
  useUpdateNotationMutation,
  useGetAllProductV2Query,
} from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import UpdateStockDialog from "./components/UpdateStockDialog";
import productColumnData from "../../constants/ProductColumn";
import { useSocket } from "../../CustomProvider/useWebSocket";
import ColumnsExplainerDialog from "./components/ColumnsExplainerDialog";
import HideColumnsDialog from "./components/HideColumnsDialog";
import { useCreateUserHistoryMutation } from "../../features/api/usersApiSlice";
import TablePagination from "@mui/material/TablePagination";
import { useSendMessageToAdminMutation } from "../../features/api/whatsAppApiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useParams } from "react-router-dom";

import { setHeader, setInfo } from "../../features/slice/uiSlice";

import {
  setCheckedBrand,
  setCheckedCategory,
  setCheckedGST,
  setDeepSearch,
} from "../../features/slice/productSlice";

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
    name: "Sort By GST",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortByGst.png?updatedAt=1717242547125"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by GST' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Clear All Filter",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/ClearAllFilter.png?updatedAt=1717242379859"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "The 'Clear all filters' button removes all applied filters, resetting the view to display all available data without any filtering criteria applied",
  },
  {
    name: "Search",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the search box, you can search for any product or brand here",
  },
  {
    name: "Bulk Update",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/bulkupdate_updateproduct.png?updatedAt=17031364375822"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "If you click 'Bulk Update,' you can update products in bulk",
  },
  {
    name: "Hiddin Column",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Hiddincol_updateProduct.png?updatedAt=1703136437592"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the 'Hidden' button, you can select what you want to hide from the list",
  },
  {
    name: "Column summary",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/colsummery_updateproduct.png?updatedAt=1703141954319"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the 'Column Summary' button, you can view details about the columns",
  },
  {
    name: "Orange color",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/orangeclr_updateproduct.png?updatedAt=17031364377602"
        height={"10%"}
        width={"10%"}
      />
    ),
    instruction:
      "If any content in the list has an orange background color, it means it is awaiting approval",
  },
  {
    name: "Red color",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/redclr_updateproduct.png?updatedAt=1703136437653"
        height={"10%"}
        width={"10%"}
      />
    ),
    instruction:
      "If any content in the list has a red background color, it means the update has been rejected",
  },
  {
    name: "Green color",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/greenclr_updateproduct.png?updatedAt=1703136437783"
        height={"10%"}
        width={"10%"}
      />
    ),
    instruction:
      "If any content in the list has a green background color, it indicates an issue in the Sales Columns",
  },
  {
    name: "Purple color",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/purpleclr_updateproduct.png?updatedAt=1703136437796"
        height={"10%"}
        width={"10%"}
      />
    ),
    instruction:
      "If any content in the list has a purple background color, it indicates an issue in the Seller Columns",
  },
];

const UpdateQuantity = ({
  setOpenHistory,
  setProductDetails,
  autoHeight,
  condition,
}) => {
  // infodialog state
  const description = "This is the Update product you can upload product";
  /// initialization
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const socket = useSocket();
  const debouncing = useRef();
  const { isInfoOpen } = useSelector((state) => state.ui);

  /// global state
  const {
    isAdmin,
    productColumns,
    userInfo,
    hiddenColumns: latestHiddenColumns,
  } = useSelector((state) => state.auth);

  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
    useSelector((state) => state.product);
  /// local state
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [SKU, setSKU] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [openBulkUpdateSelector, setOpenBulkUpdateSelector] = useState(false);
  const [buttonBlink, setButtonBlink] = useState("");

  /// pagination State
  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [localData, setLocalData] = useState([]);

  /// rtk query
  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllProductV2Query(filterString, {
    pollingInterval: 1000 * 300,
  });

  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();

  const [notationUpdateApi, { isLoading: NotationLoading }] =
    useUpdateNotationMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();

  useEffect(() => {
    dispatch(setHeader(`Update Quantity`));
  }, []);

  const handleClose = () => {
    dispatch(setInfo(false));
  };


  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          SKU: item.SKU,
          Name: item.Name,
          MRP: item.MRP.toFixed(2),
          GST: item.GST,
          ThresholdQty: item.ThresholdQty,
          Mqr: item.Mqr || 0,
          Quantity: item.Quantity,
          ActualQuantity: item.ActualQuantity,
          AssignedQty: item.AssignedQuantity,
          AwaitingScanning:
            item.Quantity - (item.ActualQuantity + item.AssignedQuantity),
          Category: item.Category,

          Brand: item.Brand,

          isVerifiedQuantity: item.isVerifiedQuantity,
          isRejectedQuantity: item.isRejectedQuantity,
        };
      });

      dispatch(setAllProductsV2(allProductData.data));

      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

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
    const newHiddenColumns = {};

    latestHiddenColumns.forEach((column) => {
      newHiddenColumns[column] = false;
    });

    setHiddenColumns(newHiddenColumns);
  }, [latestHiddenColumns]);

  useEffect(() => {
    refetch();
    return () => {
      dispatch(setCheckedBrand([])),
        dispatch(setCheckedCategory([])),
        dispatch(setCheckedGST([])),
        dispatch(setDeepSearch("")),
        apiRef?.current?.setPage(0),
        apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    };
  }, []);

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
  }, [checkedBrand, checkedCategory, checkedGST]);

  useEffect(() => {
    apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    clearTimeout(debouncing.current);
    if (!deepSearch) {
      setFilterString(`page=1`);
      return;
    } else {
      debouncing.current = setTimeout(() => {
        setFilterString(`deepSearch=${deepSearch}&page=1`);
      }, 1000);
    }
  }, [deepSearch]);

  //Columns*******
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 60,
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
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
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
            // onDoubleClick={() => {
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
      minWidth: 450,
      // maxWidth: 290,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Brand",
      headerName: "Brand",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Category",
      headerName: "Category",
      flex: 0.3,
      minWidth: 90,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST %",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      editable: true,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: "ThresholdQty",
      headerName: "Thld",
      flex: 0.3,
      minWidth: 60,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
      valueFormatter: (params) => `${params.value}`,
    },
    {
      field: "ActualQuantity",
      headerName: "Actual Quantity",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
      valueFormatter: (params) => `${params.value}`,
    },
    {
      field: "AssignedQty",
      headerName: "Quantity Assigned",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
      valueFormatter: (params) => `${params.value}`,
    },
    {
      field: "AwaitingScanning",
      headerName: "Awaiting Scanning",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "number",
      valueFormatter: (params) => `${params.value}`,
    },
    {
      field: "Quantity",
      headerName: "Quantity in Store",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
      renderCell: (params) => {
        // for background
        const statusColor = params.row.isRejectedQuantity
          ? "#B22222"
          : !params.row.isVerifiedQuantity
          ? "#FF7F50"
          : "";
        // for text color
        const textColor = params.row.isRejectedQuantity
          ? "#fff"
          : !params.row.isVerifiedQuantity
          ? "#fff"
          : "";
        const onClick = () => {
          if (!params.row.isVerifiedQuantity) {
            return;
          }
          const product = productColumns.find(
            (productColumn) => productColumn.name === "Quantity"
          );

          if (!isAdmin && !product.isEdit) {
            return;
          }
          setSKU(params.row.SKU);
          setOpen(true);
        };
        return (
          <Button
            sx={{ background: statusColor, color: textColor }}
            onClick={onClick}
          >
            {params.row.Quantity}
          </Button>
        );
      },
    },
  ];

  /// Functions
  const getModifiedColumns = (isAdmin, productColumns, columns) => {
    if (isAdmin) {
      return columns;
    } else if (productColumns.length === 0) {
      return columns.slice(0, 5);
    } else {
      const retainedColumns = columns.filter((column) =>
        productColumns.find(
          (productColumn) => productColumn.name === column.field
        )
      );

      const isEditRetainedColumns = retainedColumns.map((item) => {
        const product = productColumns.find(
          (productColumn) => productColumn.name === item.field
        );
        if (item.field === "SalesPrice") {
          return item;
        }
        if (item.field === "SellerPrice") {
          return item;
        }
        if (item.field === "LandingCostWithGst") {
          return item;
        }

        return { ...item, editable: product?.isEdit === true ? true : false };
      });

      return columns.slice(0, 5).concat(isEditRetainedColumns);
    }
  };

  /// Custom Button
  const bulkUpdateCustomButton = (
    <Button
      variant="contained"
      onClick={() => {
        setOpenBulkUpdateSelector(true);
      }}
    >
      Bulk Update
    </Button>
  );

  const hiddenColumnCustomButton = (
    <HideColumnsDialog
      columns={getModifiedColumns(isAdmin, productColumns, columns)}
    />
  );

  /// Custom Footer
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
          <ColumnsExplainerDialog />

          <Box display="flex" gap="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>Waiting Approval</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  backgroundColor: `${
                    buttonBlink === "waitingApproval" ? "white" : "#FF7F50"
                  }`,
                }}
                onClick={() => fetchDataWithQuery("waitingApproval")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>New Product</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "10px",
                  height: "20px",
                  borderRadius: "10px",
                  backgroundColor: `${
                    buttonBlink === "newProduct" ? "white" : "violet"
                  }`,
                }}
                onClick={() => fetchDataWithQuery("newProduct")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>Update Rejected</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: `${
                    buttonBlink === "update" ? "white" : "#B22222"
                  }`,
                  color: "#ffff",
                  "&:hover": {
                    backgroundColor: "#ffff",
                    color: "#B22222",
                  },
                }}
                onClick={() => fetchDataWithQuery("update")}
              ></Button>
            </Box>
            <Box display="flex" alignItems="center" gap="10px">
              <span style={{ fontWeight: "bold" }}>Updated Product</span>
              <Button
                sx={{
                  border: "0.5px solid black",
                  width: "25px",
                  height: "20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: `${
                    buttonBlink === "updatedProduct" ? "white" : "grey"
                  }`,
                  color: "#ffff",
                  "&:hover": {
                    backgroundColor: "#ffff",
                    color: "#B22222",
                  },
                }}
                onClick={() => fetchDataWithQuery("updatedProduct")}
              ></Button>
            </Box>
            {condition === "SalesPrice" ? (
              <Box display="flex" alignItems="center" gap="10px">
                <span style={{ fontWeight: "bold" }}>Sales Columns</span>
                <Box
                  bgcolor="#93C54B"
                  sx={{
                    border: "0.5px solid black",
                    width: "25px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                ></Box>
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gap="10px">
                <span style={{ fontWeight: "bold" }}>Seller Columns</span>
                <Box
                  bgcolor="#606CF2"
                  sx={{
                    border: "0.5px solid black",
                    width: "25px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                ></Box>
              </Box>
            )}
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

              apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
            }}
            rowsPerPage={rowPerPage}
            // onRowsPerPageChange={(event) => {
            //   setRowPerPage(event.target.value);
            // }}
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      <UpdateStockDialog
        SKU={SKU}
        open={open}
        setOpen={setOpen}
        updateProductsApi={updateProductsApi}
        RefetchAll={refetch}
        loading={updateProductLoading}
        socket={socket}
        userInfo={userInfo}
      />
      <BulkUpdateSelectorDialog
        list={isAdmin ? productColumnData : productColumns}
        open={openBulkUpdateSelector}
        setOpen={setOpenBulkUpdateSelector}
        condition={"QTY"}
      />

      <FilterBarV2 customButton1={bulkUpdateCustomButton} apiRef={apiRef} />

      <Grid container>
        <Loading
          loading={productLoading || updateProductLoading || isFetching}
        />

        <Grid item xs={12} sx={{ mt: "5px" }}>
          {editedRows.length > 0 ? (
            <Box>
              <Button
                disabled={updateProductLoading}
                onClick={() => {
                  handleSellerPrice();
                }}
              >
                Save
              </Button>{" "}
              <Button onClick={handleClear}>Clear</Button>
            </Box>
          ) : (
            ""
          )}

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

              // "& .MuiDataGrid-columnHeaderTitleContainer": {
              //   background: "#eee",
              // },

              "& .orange": {
                backgroundColor: "#FF7F50",
                color: "#F0FFFF",
              },
              "& .red": {
                backgroundColor: "#B22222",
                color: "#F0FFFF",
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
              columns={getModifiedColumns(isAdmin, productColumns, columns)}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
              apiRef={apiRef}
              isCellEditable={(params) => {
                if (params.field === "Quantity") {
                  return params.row.isVerifiedQuantity;
                } else if (params.field === "SellerPrice") {
                  return params.row.isVerifiedSellerPrice;
                } else if (params.field === "SalesPrice") {
                  return params.row.isVerifiedSalesPrice;
                } else if (params.field === "LandingCost") {
                  return params.row.isVerifiedLandingCost;
                } else if (params.field === "MRP") {
                  return params.row.isVerifiedMRP;
                } else if (params.field === "GST") {
                  return true;
                } else if (params.field === "ThresholdQty") {
                  return true;
                } else if (params.field === "Mqr") {
                  return true;
                }
              }}
              getCellClassName={(params) => {
                if (params.field === "Quantity") {
                  return params.row.isRejectedQuantity
                    ? "red"
                    : !params.row.isVerifiedQuantity
                    ? "orange"
                    : "";
                } else if (params.field === "SellerPrice") {
                  return params.row.isRejectedSellerPrice
                    ? "red"
                    : !params.row.isVerifiedSellerPrice
                    ? "orange"
                    : "";
                } else if (params.field === "SalesPrice") {
                  return params.row.isRejectedSalesPrice
                    ? "red"
                    : !params.row.isVerifiedSalesPrice
                    ? "orange"
                    : "";
                } else if (params.field === "LandingCost") {
                  return params.row.isRejectedLandingCost
                    ? "red"
                    : !params.row.isVerifiedLandingCost
                    ? "orange"
                    : "";
                } else if (params.field === "MRP") {
                  return params.row.isRejectedMRP
                    ? "red"
                    : !params.row.isVerifiedMRP
                    ? "orange"
                    : "";
                }

                return "";
              }}
              components={{
                Footer: CustomFooter,
              }}
              slotProps={{
                footer: { status: refetch },
              }}
              onProcessRowUpdateError={(error) => {}}
              columnVisibilityModel={hiddenColumns}
            />
          </Box>
        </Grid>
      </Grid>
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

export default UpdateQuantity;
