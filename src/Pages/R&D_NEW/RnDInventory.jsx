import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";
// import Nodata from "../../../assets/empty-cart.png";
// import FilterBar from "../../../components/Common/FilterBar";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import {
  Grid,
  Box,
  TablePagination,
  Button,
  styled,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddProductInventory from "./Dialogues/AddProductInventory";
import Loading from "../../components/Common/Loading";

import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetAllRDInventoryQuery } from "../../features/api/RnDSlice";

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

const RnDInventory = () => {
  const description = `Our Inventory Management System for R&D efficiently tracks store and R&D inventory quantities, offering real-time updates, customizable alerts, and detailed reporting to streamline operations and optimize resource allocation.`;
  /// initialize
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const ref = useRef();
const [open ,setOpen] = useState(false)
  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
const handlecloseDial = () =>{
  setOpen(false)
}
  useEffect(() => {
    dispatch(setHeader(`R&D inventory`));
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

  /// rtk query

  const {
    data: allProductData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetAllRDInventoryQuery();

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  /// handlers

  /// useEffect
  useEffect(() => {
    if (allProductData?.status) {
      const data = allProductData?.data?.map((item, index) => {
        return {
          ...item,
          id: item.SKU,
          Sno: index + 1,
        
        };
      });

      setRows(data);
    }
  }, [allProductData]);

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

      flex:0.1,
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
   flex:0.1,
      minWidth: 500,
      maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Weight",
      headerName: "Weight (gm)",
      flex:0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",

    },

    {
      field: "Dimension",
      headerName: "Dimension (cm)",
      flex:0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
     

    },
    {
      field: "OldQty",
      headerName: "Old Qty",
      flex:0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Newqty",
      headerName: "New Qty",
      flex:0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
          {open && (
        <AddProductInventory
          open={open}
          close={handlecloseDial}
          refetch={refetch}
        />
      )}
      <Grid container>
        {productLoading || isFetching ? (
          <Loading loading={true} />
        ) : (
          <Grid item xs={12} sx={{ mt: "5px" }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginLeft: "10px",
                width: "60%",
                paddingY: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Search by Name"
                sx={{ width: "40%" }}
                onChange={(e) => {
                  // setSkuFilter(e.target.value);
                  // setCheckedBrands([]);
                  // setCheckedCategory([]);
                  handleFilterChange("Name", "contains", e.target.value);
                }}
              />
              <TextField
                size="small"
                placeholder="Search by SKU"
                onChange={(e) => {
                  // setSkuFilter(e.target.value);
                  // setCheckedBrands([]);
                  // setCheckedCategory([]);
                  handleFilterChange("SKU", "contains", e.target.value);
                }}
              />
              <Button variant="contained" onClick={()=>setOpen(true)}>Add Product</Button>
            </Box>
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
                // checkboxSelection
                disableRowSelectionOnClick
                // onRowSelectionModelChange={handleSelectionChange}
                // isRowSelectable={(params) => params.row.SalesPrice > 0}
                // rowSelectionModel={selectedItems}
                // keepNonExistentRowsSelected
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RnDInventory;
