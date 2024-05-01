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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditProductDial from "./Dialogues/EditProductDial";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetAllRDInventoryQuery } from "../../features/api/RnDSlice";
import ImageUploadDial from "./Dialogues/ImageUploadDial";
import CachedIcon from "@mui/icons-material/Cached";

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
  const [open, setOpen] = useState(false);
  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
  const handlecloseDial = () => {
    setOpen(false);
    setOpenedit(false);
    setOpenimageupload(false);
  };
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

  const [openEdit, setOpenedit] = useState(false);
  const [openImageupload, setOpenimageupload] = useState(false);
  const [editData, setEditdata] = useState([]);
  const [rows, setRows] = useState([]);
  const [buttonBlink, setButtonBlink] = useState("");


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

  const handleOpenImage = (params) => {
    setOpenimageupload(true);
    setEditdata(params.row);
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
          LandingCost: item.LandingCost,
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

      flex: 0.1,
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
      minWidth: 500,
      maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "LandingCost",
      headerName: "Landing Cost ",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `₹ ${params.value}`,
    },
    {
      field: "Weight",
      headerName: "Weight (gm)",
      flex: 0.1,
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
      flex: 0.1,
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
      flex: 0.1,
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
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Edit",
      flex: 0.3,
      headerName: "Update & Edit Items",
      minWidth: 150,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const paramsData = params.row;
        return (
          <ModeEditIcon
            sx={{ "&:hover": { color: "red" }, cursor: "pointer" }}
            onClick={() => {
              setOpenedit(true);
              setEditdata(paramsData);
            }}
          />
        );
      },
    },
    {
      field: "uploadImg",
      headerName: "Upload",
      minWidth: 50,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box>
          <AddPhotoAlternateIcon
            sx={{
              color: "grey",
              cursor: "pointer",
              "&:hover": { color: "red" },
            }}
            onClick={() => handleOpenImage(params)}
          />
        </Box>
      ),
    },
  ];

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
          {/* <Button size="small" onClick={() => status()}>
            <CachedIcon />
          </Button> */}

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

      {openImageupload && (
        <ImageUploadDial
          open={openImageupload}
          close={handlecloseDial}
          data={editData}
        />
      )}
      {openEdit && (
        <EditProductDial
          data={editData}
          open={openEdit}
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
              <Button variant="contained" onClick={() => setOpen(true)}>
                Add Product
              </Button>
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
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RnDInventory;
