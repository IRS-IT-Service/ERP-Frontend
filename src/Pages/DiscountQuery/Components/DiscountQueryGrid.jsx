import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Nodata from "../../../assets/empty-cart.png";
import FilterBar from "../../../components/Common/FilterBar";
import { Grid, Box, TablePagination, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import {
  removeSelectedCreateQuery,
  setSelectedCreateQuery,
  setSelectedSkuQuery,
  removeSelectedSkuQuery,
} from "../../../features/slice/selectedItemsSlice";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import {
  useGetAllProductV2Query,
  useGetAllRoboProductsNewQuery,
} from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import { useNavigate } from "react-router-dom";
import DiscountCalcDialog from "./DiscountCalcDialog";
import CachedIcon from "@mui/icons-material/Cached";

const DiscountQueryGrid = () => {
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();

  /// global state
  const {
    checkedBrand,
    checkedCategory,
    searchTerm,
    checkedGST,
    deepSearch,
    name,
    sku,
  } = useSelector((state) => state.product);
  const { createQueryItems, createQuerySku } = useSelector(
    (state) => state.SelectedItems
  );
  /// local state

  const [showNoData, setShowNoData] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  const [filterString, setFilterString] = useState("page=1");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllRoboProductsNewQuery(filterString, {
    pollingInterval: 1000 * 300,
  });

  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);
    const newSelectedRowsData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newSelectedRowsData);
    dispatch(setSelectedSkuQuery(selectionModel));
  };

  useEffect(() => {
    return () => {
      dispatch(removeSelectedCreateQuery());
      dispatch(removeSelectedSkuQuery());
    };
  }, []);

  useEffect(() => {
    if (
      selectedItemsData.length > 0 &&
      (!createQueryItems || createQueryItems.length === 0)
    ) {
      dispatch(setSelectedCreateQuery(selectedItemsData));
    } else if (createQueryItems.length > 0 && selectedItemsData.length > 0) {
      const newData = [...createQueryItems, ...selectedItemsData];
      dispatch(setSelectedCreateQuery(newData));
    }
  }, [selectedItemsData]);

  const removeSelectedItems = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    const newSelectedRowsData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    setSelectedItemsData(newSelectedRowsData);
    setSelectedItems(newSelectedItems);
  };
  const uniqueSKUs = new Set(createQueryItems || [].map((item) => item.SKU));
  const uniqueSKUsArray = Array.from(uniqueSKUs);
  const realData = uniqueSKUsArray?.filter((item) =>
    selectedItems.find((docs) => item.SKU === docs)
  );
  const handleOpenDialog = () => {
    setOpen(true);
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
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.ActualQuantity,
          SalesPrice: item.SalesPrice,
          SalesPriceGst: (
            (item.SalesPrice * item.GST) / 100 +
            item.SalesPrice
          ).toFixed(0),
          Brand: item.Brand,
          Category: item.Category,
        };
      });

      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);

      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

  useEffect(() => {
    let newFilterString = "";
    if (checkedBrand.length) {
      newFilterString += `brands=${checkedBrand.join(",")}`;
    }

    if (checkedCategory.length) {
      if (newFilterString) newFilterString += "&";
      newFilterString += `category=${checkedCategory.join(",")}`;
    }

    if (checkedGST.length) {
      if (newFilterString) newFilterString += "&";
      newFilterString += `gst=${checkedGST.join(",")}`;
    }

    if (!newFilterString) {
      setFilterString("page=1");
    } else {
      setFilterString(`${newFilterString}&page=1`);
    }
  }, [checkedBrand, checkedCategory, checkedGST]);

  useEffect(() => {
    clearTimeout(debouncing.current);

    if (!name && !sku) {
      setFilterString("");
      return;
    }

    debouncing.current = setTimeout(() => {
      let newFilterString = "";
      if (name) {
        newFilterString += `name=${name}`;
      }
      if (sku) {
        if (newFilterString) newFilterString += "&";
        newFilterString += `sku=${sku}`;
      }
      setFilterString(`${newFilterString}&page=1`);
    }, 1000);

    return () => clearTimeout(debouncing.current);
  }, [name, sku]);

  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      minWidth: 50,
      maxWidth: 100,
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
      valueFormatter: (params) => ` ${(+params.value).toFixed(0)} %`,
    },
    {
      field: "Quantity",
      headerName: "QTY",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MRP",
      headerName: "MRP",

      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "SalesPrice",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      maxWidth: 300,
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
    {
      field: "SalesPriceGst",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Sales Price Inclu (GST) ₹",
      align: "center",
      minWidth: 200,
      maxWidth: 300,
      valueFormatter: (params) => `₹ ${(+params.value).toFixed(0)} `,
    },
  ];

  function CustomFooter(props) {
    const { status } = props;

    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button>
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
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box>
      <FilterBarV2
        apiRef={apiRef}
        customButton={selectedItems.length ? "Create Query" : ""}
        customOnClick={handleOpenDialog}
      />
      <DiscountCalcDialog
        data={realData}
        apiRef={apiRef}
        removeSelectedItems={removeSelectedItems}
        open={open}
        setOpen={setOpen}
        dispatch={dispatch}
        removeSelectedCreateQuery={removeSelectedCreateQuery}
        removeSelectedSkuQuery={removeSelectedSkuQuery}
      />
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
                apiRef={apiRef}
                columnVisibilityModel={{
                  Category: false,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                isRowSelectable={(params) => params.row.SalesPrice > 0}
                rowSelectionModel={selectedItems}
                keepNonExistentRowsSelected
                components={{
                  Footer: CustomFooter,
                }}
                slotProps={{
                  footer: { status: refetch },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DiscountQueryGrid;
