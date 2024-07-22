import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
// import Nodata from "../../../assets/empty-cart.png";
// import FilterBar from "../../../components/Common/FilterBar";
import { Grid, Box, TablePagination, Button, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAllProductsV2 } from "../../features/slice/productSlice";
import {
  removeSelectedCreateQuery,
  setSelectedCreateQuery,
  setSelectedSkuQuery,
  removeSelectedSkuQuery,
} from "../../features/slice/selectedItemsSlice";
import FilterBarV2 from "../../components/Common/FilterBarV2";
import {
  useGetAllProductV2Query,
  useGetAllRoboProductsNewQuery,
} from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetSingleProjectQuery } from "../../features/api/RnDSlice";
import CreateReqDial from "../R&D_NEW/Dialogues/CreateReqDial";
import CachedIcon from "@mui/icons-material/Cached";
import { useParams } from "react-router-dom";
import AddRnDQtyDial from "./Dialogues/AddRnDQtyDial";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

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
    name: "Fetching R&D Data",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(4).png?updatedAt=1717228601186"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "To fetch updated Research & Development quantities, click the FETCH R&D button at the bottom of the table.",
  },
  {
    name: "New Qty in R&D",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(6).png?updatedAt=1717228601217"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: " Newly added quantity in Research & Development.",
  },
  {
    name: "Old Qty in R&D",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(5).png?updatedAt=1717228601184"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Previous quantity in Research & Development",
  },
];

const Inventory = () => {
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();
  const [skip, setSkip] = useState(true);
  const { id } = useParams();
  const [SelectedSKU, setSelectedSKU] = useState();
  const [updateValue, setUpdateValue] = useState([]);
  const [buttonBlink, setButtonBlink] = useState("");

  const newValue = id !== "R&D" && id.split("&");
  const idValue = id !== "R&D" && newValue[0];
  const compName = id !== "R&D" && newValue[1];
  const { data: allData, isLoading: dataLoading } = useGetSingleProjectQuery(
    idValue,
    {
      skip,
    }
  );

  useEffect(() => {
    let selectSKU = [];
    if (allData?.success) {
      selectSKU = allData.data.projectItem?.map((item) => item.SKU);
    }

    setSelectedSKU(selectSKU);
  }, [allData]);

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  let description =
    id === "R&D"
      ? `Our Inventory Management System for R&D efficiently tracks store and R&D inventory quantities, offering real-time updates, customizable alerts, and detailed reporting to streamline operations and optimize resource allocation.`
      : `Add Parts For ${compName}`;

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

  const [openAdditem, setOpenAdditem] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [open, setOpen] = useState(false);

  const [filterString, setFilterString] = useState("");
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(100);
  const [totalProductCount, setTotalProductCount] = useState(0);

  /// rtk query
  useEffect(() => {
    const Header = id === "R&D" ? "R&D Inventory " : `Add Parts For ${name}`;
    const skipped = id === "R&D" ? true : false;
    setSkip(skipped);
    dispatch(setHeader(Header));
  }, [id]);

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

  const handleSetAddItem = () => {
    setOpenAdditem(true);
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
  console.log(selectedItemsData.length);
  const removeSelectedItems = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    const newSelectedRowsData = selectedItemsData.filter(
      (item) => item.SKU !== id
    );
    const NewUpdatedValue = updateValue.filter((item) => item.SKU !== id);
    setUpdateValue(NewUpdatedValue);
    setSelectedItemsData(newSelectedRowsData);
    setSelectedItems(newSelectedItems);
  };
  // const uniqueSKUs = new Set(createQueryItems || [].map((item) => item.SKU));
  // const uniqueSKUsArray = Array.from(uniqueSKUs);
  // const realData = uniqueSKUsArray?.filter((item) =>
  //   selectedItems.find((docs) => item.SKU === docs)
  // );

  const uniqueSKUs = new Set(createQueryItems.map((item) => item.SKU));
  const realData = Array.from(uniqueSKUs).map((sku) =>
    createQueryItems.find((item) => item.SKU === sku)
  );

  const handleOpenDialog = () => {
    setOpen(true);
  };

  /// useEffect
  useEffect(() => {
    if (allProductData?.success) {
      const data = allProductData?.data?.products?.map((item, index) => {
        return {
          ...item,
          id: item.SKU,
          Sno:
            index +
            1 +
            (allProductData.data.currentPage - 1) * allProductData.data.limit,
          GST: item.GST || 0,
          NewQty: item.NewQty || "",
          OldQty: item.OldQty || "",
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
    // if (apiRef?.current) {
    //   apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    // }

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

  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      minWidth: 100,
      maxWidth: 200,
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
      valueFormatter: (params) => ` ${(+params.value)?.toFixed(0)} %`,
    },
    {
      field: "ActualQuantity",
      headerName: "In Store",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "NewQty",
      minWidth: 150,
      maxWidth: 300,
      headerName: "New Qty in R&D",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "OldQty",
      minWidth: 150,
      maxWidth: 300,
      headerName: "Old Qty in R&D",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
          <Box>
            <Button
              variant="outlined"
              sx={{ color: `${buttonBlink ? "green" : "blue"} ` }}
              onClick={() => fetchDataWithQuery("RandDProducts")}
            >
              Fetch R&D
            </Button>
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
          />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <FilterBarV2
        apiRef={apiRef}
        customButton={
          selectedItems.length > 0 && (id === "R&D" ? "Add items" : "Add Parts")
        }
        customOnClick={id === "R&D" ? handleSetAddItem : handleOpenDialog}
      />
      {open && (
        <CreateReqDial
          data={realData}
          apiRef={apiRef}
          removeSelectedItems={removeSelectedItems}
          open={open}
          setOpen={setOpen}
          dispatch={dispatch}
          id={idValue}
          name={name}
          removeSelectedCreateQuery={removeSelectedCreateQuery}
          removeSelectedSkuQuery={removeSelectedSkuQuery}
          setSelectedItemsData={setSelectedItemsData}
          selectedItemsData={selectedItemsData}
          refetch={refetch}
        />
      )}

      {openAdditem && (
        <AddRnDQtyDial
          data={realData}
          apiRef={apiRef}
          removeSelectedItems={removeSelectedItems}
          open={openAdditem}
          setOpen={setOpenAdditem}
          dispatch={dispatch}
          id={idValue}
          name={name}
          removeSelectedCreateQuery={removeSelectedCreateQuery}
          removeSelectedSkuQuery={removeSelectedSkuQuery}
          setSelectedItemsData={setSelectedItemsData}
          selectedItemsData={selectedItemsData}
          refetch={refetch}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          updateValue={updateValue}
          setUpdateValue={setUpdateValue}
        />
      )}

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
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
                isRowSelectable={(params) =>
                  !SelectedSKU.includes(params.row.SKU)
                }
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
    </Box>
  );
};

export default Inventory;
