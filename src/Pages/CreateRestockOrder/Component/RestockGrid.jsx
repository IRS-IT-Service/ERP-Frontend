import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
// import FilterBar from "../../../components/Common/FilterBar";
import FilterBarV2 from "../../../components/Common/FilterBarV2";
import { Grid, Box, Button, TablePagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProducts } from "../../../features/slice/productSlice";
import {
  useGetAllProductV2Query,
  useGetAllRoboProductsNewQuery,
} from "../../../features/api/productApiSlice";
import Loading from "../../../components/Common/Loading";
import RestockItemDialog from "./RestockItemDialog";
import CachedIcon from "@mui/icons-material/Cached";
import { setAllProductsV2 } from "../../../features/slice/productSlice";
import {
  removeSelectedCreateQuery,
  setSelectedCreateQuery,
  setSelectedSkuQuery,
  removeSelectedSkuQuery,
} from "../../../features/slice/selectedItemsSlice";

const RestockGrid = () => {
  const apiRef = useGridApiRef();

  /// initialization
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

  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openRestockItem, setOpenRestockItem] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [filterString, setFilterString] = useState("");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [updateValue, setUpdateValue] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllRoboProductsNewQuery(filterString, {
    pollingInterval: 1000 * 300,
  });

  const { createQueryItems, createQuerySku } = useSelector(
    (state) => state.SelectedItems
  );

  /// handlers

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);

    // const selectedItemsDataData = ids.map((id) => {
    //   return rows.find((row) => row.SKU === id);
    // });
    const newselectedItemsDataData = rows.filter((item) =>
      selectionModel.includes(item.id)
    );
    setSelectedItemsData(newselectedItemsDataData);
    dispatch(setSelectedSkuQuery(selectionModel));
  };

  const handleOpenRestockItem = () => {
    setOpenRestockItem(true);
  };
  const handleCloseRestockItem = () => {
    setOpenRestockItem(false);
  };

  const handleRemoveRestockItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);

    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedItemsData.filter((item) => item.id !== id);
    setSelectedItemsData(newSelectedRow);
  };
  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          ...item,
          id: item?.SKU,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          // SKU: item.SKU,
          // Name: item.Name,
          // Quantity: item.ActualQuantity,
          // soldCount: item.soldCount,
          // ThresholdQty: item.ThresholdQty,
          // Brand: item.Brand,
          // Category: item.Category,
          // GST: item.GST,
        };
      });

      dispatch(setAllProductsV2(allProductData.data));
      setRows(data);
      setRowPerPage(allProductData.data.limit);
      setTotalProductCount(allProductData.data.totalProductCount);
      setPage(allProductData.data.currentPage);
    }
  }, [allProductData]);

  // removeSelectedQuery
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
    const newselectedItemsDataData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    const NewUpdatedValue = updateValue.filter((item) => item.SKU !== id);
    setUpdateValue(NewUpdatedValue);
    setSelectedItemsData(newselectedItemsDataData);
    setSelectedItems(newSelectedItems);
  };
  // const uniqueSKUs = new Set(createQueryItems.map((item) => item.SKU));
  // const uniqueDATAs = new Set(createQueryItems);
  // const uniqueDATAsArray = Array.from(uniqueDATAs);
  // const uniqueSKUsArray = Array.from(uniqueSKUs);

  // const realData = uniqueDATAsArray?.filter((item) =>
  //   uniqueSKUsArray.find((docs) => item.SKU === docs)
  // );

  const uniqueSKUs = new Set(createQueryItems.map((item) => item.SKU));
  const realData = Array.from(uniqueSKUs).map((sku) =>
    createQueryItems.find((item) => item.SKU === sku)
  );

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
    if (apiRef?.current) {
      apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    }

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
      minWidth: 200,
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
      hide: true,
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
      field: "soldCount",
      headerName: "Sold Count",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
    },
    {
      field: "ThresholdQty",
      headerName: "Threshold",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      type: "number",
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 0.3,
      minWidth: 120,
      maxWidth: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  /// Custom Footer
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
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        {/* <FilterBarV2
          apiRef={apiRef}
          customButton={
            selectedItemsData.length
              ? `Restock Items ${selectedItemsData.length}`
              : undefined
          }
          customOnClick={handleOpenRestockItem}
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
          count={selectedItems}
        /> */}
        <FilterBarV2
          customButton={
            selectedItemsData.length
              ? `Restock Items ${realData.length}`
              : undefined
          }
          customOnClick={handleOpenRestockItem}
          apiRef={apiRef}
        />
        <Grid container>
          {productLoading || isFetching ? (
            <Loading loading={true} />
          ) : (
            <Grid item xs={12} sx={{ mt: "5px" }}>
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
                  apiRef={apiRef}
                  columnVisibilityModel={{
                    Category: false,
                  }}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={handleSelectionChange}
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
        <RestockItemDialog
          items={realData}
          setItems={setSelectedItemsData}
          open={openRestockItem}
          onClose={handleCloseRestockItem}
          handleDelete={handleRemoveRestockItem}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          removeSelectedItems={removeSelectedItems}
        />
      </Box>
    </>
  );
};

export default RestockGrid;
