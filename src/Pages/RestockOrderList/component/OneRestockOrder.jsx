import { useEffect, useState } from "react";
import { Grid, styled, Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid, useGridApiRef,GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import {
  useDeleteRestockByIdMutation,
  useGetAllNewRestocksQuery,
  useUpdateRestockQuantityMutation,
} from "../../../features/api/RestockOrderApiSlice";
import Loading from "../../../components/Common/Loading";
import Order2Vendor from "./Order2Vendor";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import BASEURL from "../../../constants/BaseApi";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import ViewHistoryDial from "./ViewHistoryDial";
import { useDispatch, useSelector } from "react-redux";
import { Delete } from "@mui/icons-material";
import AllVendorDial from "./AllVendorDial";
import { setOverseaseSelectedOrder } from "../../../features/slice/selectedItemsSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OneRestockOrder = () => {
  /// initialize
  const { search } = useLocation();
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  // const { id } = useParams();

  const { userInfo } = useSelector((state) => state.auth);

  /// local state
  const [rows, setRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [editedRows, setEditedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openRestockItem, setOpenRestockItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ SKU: "", history: [] });
  const [openVendorDial, setOpenVendorDial] = useState(false);

  /// rtk query
  // const {
  //   refetch,
  //   data: RestockProduct,
  //   isLoading: RestockLoading,
  //   isFetching,
  // } = useGetRestockProductDetailQuery(id);

  const {
    refetch,
    data: RestockProduct,
    isLoading: RestockLoading,
    isFetching,
  } = useGetAllNewRestocksQuery("pending");

  const [updateQuantityApi, { isLoading: updateLoading }] =
    useUpdateRestockQuantityMutation();

  const [deleteRestock, { isLoading: deleteLaoding }] =
    useDeleteRestockByIdMutation();

  /// useEffect
  // useEffect(() => {
  //   if (RestockProduct?.status === "success") {
  //     const data = RestockProduct?.product?.products?.map((item, index) => {
  //       return {
  //         id: item.SKU,
  //         Sno: index + 1,
  //         Name: item.Name,
  //         Quantity: item.Quantity,
  //         Status: item.Status,
  //         Brand: item.Brand,
  //         Category: item.Category,
  //         GST: item.GST || 0,
  //         NewQuantity: item.NewQuantity,
  //         SKU: item.SKU,
  //         ThresholdQty: item.ThresholdQty,
  //         SoldCount: item.SoldCount,
  //         prevUSD: item.prevUSD,
  //         prevRMB: item.prevRMB,
  //         priceDate: item.priceDate,
  //       };
  //     });
  //     setRows(data);
  //   }
  // }, [RestockProduct]);

  useEffect(() => {
    if (RestockProduct && RestockProduct.data) {
      const data = RestockProduct.data.map((item, index) => ({
        ...item,
        id: item._id,
        Sno: index + 1,
        date: formatDate(item.createdAt),
        status: item.status,
        addedBy: item.AddedBy,
        SKU: item.SKU,
      }));
      setRows(data);
    }
  }, [RestockProduct]);

  /// handlers
  const handleRemoveRestockItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);

    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelectedRow);
  };

  const handleOpenRestockItem = () => {
    // setOpenRestockItem(!openRestockItem);
    setOpenVendorDial(true);
  };

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);

    const selectedRowsData = ids.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
    dispatch(setOverseaseSelectedOrder(selectedRowsData));
  };

  const handleRowUpdate = () => {
    const ids = apiRef?.current?.state?.editRows || {};

    const outputArray = [];
    for (const [id, fields] of Object.entries(ids)) {
      for (const [field, valueObj] of Object.entries(fields)) {
        const value = Number(valueObj.value);
        outputArray.push({ id: id, field, value });
      }
    }

    setEditedRows(outputArray);
  };

  const handleSubmit = async () => {
    try {
      const processsedRows = editedRows.map((item) => {
        return {
          id: item.id,
          RestockQuantity: item.value,
          addBy: { name: userInfo.name, askQty: item.value, date: Date.now() },
        };
      });

      if (!processsedRows.length) {
        toast.error("Unable to process");

        return;
      }

      const params = {
        products: processsedRows,
      };
      console.log(params);
      const res = await updateQuantityApi(params).unwrap();
      toast.success("Quantity updated successfully");
      handleClear();
      refetch();
    } catch (err) {
      console.log("error At Update Quantity Restock Order");
      console.log(err);
    }
  };
  const handleExcelDownload = async (checkedItems, handleClose) => {
    setLoading(true);
    try {
      const body = {
        type: "restockOrder",
        // id: id,
      };

      const response = await axios.post(
        `${BASEURL}/restock/admin/getRetstockOrderToExcel`,
        body,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // saveAs(blob, `RestockOrder_${id}.xlsx`);

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("An error occurred during download:", error);
    }
    setLoading(false);
  };

  const handleClear = () => {
    if (editedRows.length > 0) {
      editedRows.forEach((row) => {
        apiRef.current.stopCellEditMode({
          id: row.id,
          field: row.field,
          ignoreModifications: true,
        });
      });
    }
    setEditedRows([]);
  };

  const handleOpenView = (SKU, Product) => {
    setData({
      SKU: SKU,
      history: Product,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      if (!id) return;
      const result = await deleteRestock(id).unwrap();
      toast.success("Restock deleted successfully");
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SKU",
      headerName: "SKU",
      flex: 0.3,
      minWidth: 80,
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
      //  maxWidth: 600,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST ",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },

    {
      field: "Threshold",
      headerName: "Threshold",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "SoldCount",
      headerName: "SoldCount",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Quantity",
      headerName: "Acutal QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "RestockQuantity",
      headerName: "Required QTY",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: search === "?view" ? false : true,
      type: "number",
    },
    {
      field: "addedBy",
      headerName: "AddedBy",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 240,
      renderCell: (params) => {
        const Sku = params.row.SKU;
        const AddedBy = params.row.addedBy;
        return (
          <Button
            onClick={() => {
              // You can pass Sku and AddedBy to handleOpenView if needed
              handleOpenView(Sku, AddedBy);
            }}
          >
            View
          </Button>
        );
      },
    },
    {
      field: "Delete",
      headerName: "Delete",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      align: "center",
      headerAlign: "center",
      minWidth: 10,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <Button
            onClick={() => {
              handleDelete(id);
            }}
          >
            <Delete sx={{ color: "red" }} />
          </Button>
        );
      },
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Grid container>
        <Loading loading={RestockLoading || isFetching || updateLoading} />

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              height: "2.5rem",
            }}
          >
            <Grid item xs={4}>
              {editedRows.length > 0 ? (
                <Box sx={{}}>
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </Button>{" "}
                  <Button onClick={handleClear}>Clear</Button>
                </Box>
              ) : (
                ""
              )}
            </Grid>
            {/* <Grid item xs={4}>
              <Box
                sx={{
                  mt: "0.3rem",
                }}
              >
                <Box
                  sx={{
                    // backgroundColor: '	#d9d9d9 ',
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",

                    // boxShadow: '  #bfbfbf 0px 3px 8px;',
                    paddingX: "1rem",
                    cursor: "pointer",
                    width: "50rem",
                    // border: '1.3px solid #4da6ff',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "#0",
                      backgroundColor: " #80bfff",
                      paddingX: "1rem",
                      border: "2px solid #3385ff",
                      borderRadius: ".4rem",
                      boxShadow: "-3px 3px 4px 0px #404040",
                      height: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                    variant="span"
                    color="black"
                    // sx={{ fontWeight: 'bold' }}
                  >
                    Current Status :
                    <Typography
                      sx={{ color: "#000", fontWeight: "400" }}
                      variant="span"
                      color={
                        RestockProduct?.product?.status === "pending"
                          ? "red"
                          : RestockProduct?.product?.status === "fulfilled"
                          ? "green"
                          : ""
                      }
                    >
                      {" "}
                      {RestockProduct?.product?.status}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="span"
                    color="black"
                    sx={{
                      fontSize: "1rem",
                      color: "#0",
                      backgroundColor: " #80bfff",
                      paddingX: "1rem",
                      border: "2px solid #3385ff",
                      borderRadius: ".4rem",
                      boxShadow: "-3px 3px 4px 0px #404040",
                      height: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Order Description:
                    <Typography
                      sx={{ color: "#000", fontWeight: "400" }}
                      variant="span"
                      color={
                        RestockProduct?.product?.status === "pending"
                          ? "red"
                          : RestockProduct?.product?.status === "fulfilled"
                          ? "green"
                          : ""
                      }
                    >
                      {" "}
                      {RestockProduct?.product?.description}
                    </Typography>
                  </Typography>
                  <Button variant="contained" onClick={handleExcelDownload}>
                    Download in Excel
                  </Button>
                </Box>
              </Box>
            </Grid> */}
            <Grid item xs={12} mt={0.4}>
              {selectedRows.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    sx={{ margin: "auto" }}
                    variant="outlined"
                    onClick={handleOpenRestockItem}
                  >
                    Assign to Vendor{" "}
                    {selectedRows.length > 0 ? selectedRows.length : ""}
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </Grid>
          </Box>

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
            }}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              rowHeight={40}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    Category: false,
                  },
                },
              }}
              columnVisibilityModel={hiddenColumns}
              onColumnVisibilityModelChange={(newModel) =>
                setHiddenColumns(newModel)
              }
              editMode="cell"
              apiRef={apiRef}
              processRowUpdate={handleRowUpdate}
              // onProcessRowUpdateError={(error) => {}}
              // isCellEditable={(params) => {
              //   if (params.field === "NewQuantity") {
              //     return params.row.Status === "generated";
              //   }
              // }}
              checkboxSelection
              disableRowSelectionOnClick
              // isRowSelectable={true}
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedItems}
              disableColumnFilter
              disableDensitySelector
              slots={{ toolbar:  GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
            <Order2Vendor
              items={selectedRows}
              reStockId={RestockProduct?.product?.restockId}
              open={openRestockItem}
              refetch={refetch}
              onClose={handleOpenRestockItem}
              handleDelete={handleRemoveRestockItem}
              setSelectedItems={setSelectedItems}
            />
          </Box>
        </Grid>
      </Grid>
      {open && <ViewHistoryDial open={open} setOpen={setOpen} data={data} />}
      {openVendorDial && (
        <AllVendorDial open={openVendorDial} setOpen={setOpenVendorDial} />
      )}{" "}
    </Box>
  );
};

export default OneRestockOrder;
