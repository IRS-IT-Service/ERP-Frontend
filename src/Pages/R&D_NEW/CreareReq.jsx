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
import { useGetAllProductV2Query } from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

import { useNavigate } from "react-router-dom";
import CreateReqDial from "../R&D_NEW/Dialogues/CreateReqDial";
import CachedIcon from "@mui/icons-material/Cached";
import { useGetAllProductWithRandDQuery } from "../../features/api/productApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Create parts request",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesQuery.png?updatedAt=1702899124072"
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
    instruction: `When you click on Create Query, it will show you the selected product discount GUI`,
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
    instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
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

const Inventory = () => {
  const description = `Our Inventory Management System for R&D efficiently tracks store and R&D inventory quantities, offering real-time updates, customizable alerts, and detailed reporting to streamline operations and optimize resource allocation.`;
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const debouncing = useRef();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Create parts request`));
  }, []);

  /// global state
  const { checkedBrand, checkedCategory, searchTerm, checkedGST, deepSearch } =
    useSelector((state) => state.product);
  const { createQueryItems, createQuerySku } = useSelector(
    (state) => state.seletedItems
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
  } = useGetAllProductWithRandDQuery(filterString, {
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
          Sno: index + 1,
          SKU: item.SKU,
          Name: item.Name,
          GST: item.GST,
          MRP: item.MRP,
          Quantity: item.Quantity,
          RandDQuantity: item.RAndDQuantity,
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

  //Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      minWidth: 30,
      maxWidth: 40,
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
      valueFormatter: (params) => ` ${(+params.value)?.toFixed(0)} %`,
    },
    {
      field: "Quantity",
      headerName: "In Stock",
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "RandDQuantity",
      headerName: "In R&D Stock",
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
        customButton={selectedItems.length ? "Create Requirement" : ""}
        customOnClick={handleOpenDialog}
      />
      <CreateReqDial
        data={realData}
        apiRef={apiRef}
        removeSelectedItems={setSelectedItems}
        open={open}
        setOpen={setOpen}
        dispatch={dispatch}
        removeSelectedCreateQuery={removeSelectedCreateQuery}
        removeSelectedSkuQuery={removeSelectedSkuQuery}
      />
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
                onRowSelectionModelChange={handleSelectionChange}
                // isRowSelectable={(params) => params.row.SalesPrice > 0}
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