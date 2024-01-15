import { useEffect, useState } from "react";
import { Grid, styled, Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import axios from "axios";
import {
  useGetRestockProductDetailQuery,
  useUpdateRestockQuantityMutation,
} from "../../../features/api/RestockOrderApiSlice";
import Loading from "../../../components/Common/Loading";
import Order2Vendor from "./Order2Vendor";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import BASEURL from "../../../constants/BaseApi";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OneRestockOrder = () => {
  /// initialize
  const { search } = useLocation();
  const apiRef = useGridApiRef();
  const { id } = useParams();

  /// local state
  const [rows, setRows] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [editedRows, setEditedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openRestockItem, setOpenRestockItem] = useState(false);
  const [loading, setLoading] = useState(false);

  /// rtk query
  const {
    refetch,
    data: RestockProduct,
    isLoading: RestockLoading,
    isFetching,
  } = useGetRestockProductDetailQuery(id);

  const [updateQuantityApi, { isLoading: updateLoading }] =
    useUpdateRestockQuantityMutation();

  /// useEffect
  useEffect(() => {
    if (RestockProduct?.status === "success") {
      const data = RestockProduct?.product?.products?.map((item, index) => {
        return {
          id: item.SKU,
          Sno: index + 1,
          Name: item.Name,
          Quantity: item.Quantity,
          Status: item.Status,
          Brand: item.Brand,
          Category: item.Category,
          GST: item.GST || 0,
          NewQuantity: item.NewQuantity,
          SKU: item.SKU,
          ThresholdQty: item.ThresholdQty,
          SoldCount: item.SoldCount,
          prevUSD: item.prevUSD,
          prevRMB: item.prevRMB,
          priceDate: item.priceDate,
        };
      });
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
    setOpenRestockItem(!openRestockItem);
  };

  const handleSelectionChange = (ids) => {
    setSelectedItems(ids);

    const selectedRowsData = ids.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
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
        return { SKU: item.id, NewQuantity: item.value };
      });

      if (!processsedRows.length) {
        toast.error("Unable to process");

        return;
      }

      const params = {
        id: id,
        body: { newProductQuantity: processsedRows },
      };

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
        id: id,
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

      saveAs(blob, `RestockOrder_${id}.xlsx`);

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
      field: "Status",
      headerName: "Status",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 110,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ThresholdQty",
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
      field: "NewQuantity",
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
            <Grid item xs={4}>
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
            </Grid>
            <Grid item xs={4}>
              {selectedRows.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button sx={{ ml: "auto" }} onClick={handleOpenRestockItem}>
                    Click to Order{" "}
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
              onProcessRowUpdateError={(error) => {}}
              isCellEditable={(params) => {
                if (params.field === "NewQuantity") {
                  return params.row.Status === "generated";
                }
              }}
              checkboxSelection={search === "?view" ? false : true}
              disableRowSelectionOnClick
              isRowSelectable={(params) => params.row.Status === "generated"}
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedItems}
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
    </Box>
  );
};

export default OneRestockOrder;
