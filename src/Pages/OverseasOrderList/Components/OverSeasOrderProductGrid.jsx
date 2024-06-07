import { useEffect, useState } from "react";
import {
  Grid,
  styled,
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Loading from "../../../components/Common/Loading";
import {
  useGetAssignedOrderQuery,
  useDeleteAssignedProductMutation,
  useUpdateAssignedOrderMutation,
  useAssignPaidOrderMutation,
  useCreateOverseasBoxMutation,
} from "../../../features/api/RestockOrderApiSlice";
import PaidOrderDialog from "./PaidOrderDialog";
import ShipOrderDialog from "./ShipOrderDialog";

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const OverSeasOrderProductGrid = () => {
  /// initialize
  const { id } = useParams();
  const apiRef = useGridApiRef();

  /// local State
  const classes = useStyles();
  const [editedRows, setEditedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [newOrderQty, setNewOrderQty] = useState({});
  const [toggleValue, setToggleValue] = useState("unPaid");
  const [formQuantity, setFormQuantity] = useState({});
  const [formData, setFormData] = useState({
    boxMarking: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    fileInput: null, // Assuming it's a file input
  });
  /// rtk query

  const {
    refetch,
    data: overseasOrderData,
    isLoading: overseasOrderLoading,
  } = useGetAssignedOrderQuery(id);

  const [deleteOrderItemApi, { isLoading: deleteLoading }] =
    useDeleteAssignedProductMutation();
  const [updateOrderApi, { isLoading }] = useUpdateAssignedOrderMutation();
  const [paidOrderApi, { isLoading: paidOrderLoading }] =
    useAssignPaidOrderMutation();
  const [createBoxApi, { isLoading: createBoxLoading }] =
    useCreateOverseasBoxMutation();

  /// useEffect

  useEffect(() => {
    if (overseasOrderData?.status === "success") {
      if (toggleValue === "unPaid") {
        const data = overseasOrderData.data?.products?.map((item, index) => {
          return {
            id: item.SKU,
            SKU: item.SKU,
            Sno: index + 1,
            Name: item.Name,
            Brand: item.Brand,
            Price: item.Price || 0,
            RMB: item.RMB || 0,
            GST: item.Gst,
            PrevUSD: item.prevUSD,
            PrevRMB: item.prevRMB,
            OrderQty: item.Orderqty,
          };
        });

        setRows(data);
      } else {
        const data = overseasOrderData.data?.paidProducts?.map(
          (item, index) => {
            return {
              id: item.SKU,
              SKU: item.SKU,
              Sno: index + 1,
              Name: item.Name,
              Brand: item.Brand,
              Price: item.Price || 0,
              RMB: item.RMB || 0,
              GST: item.Gst,
              PrevUSD: item.prevUSD,
              PrevRMB: item.prevRMB,
              OrderQty: item.Orderqty,
            };
          }
        );

        setRows(data);
      }
    }

    setSelectedItems([]);
    setSelectedRows([]);
  }, [overseasOrderData, toggleValue]);

  // handle

  const handleRowUpdate = (params) => {
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

  const handleDeleteItem = async (sku) => {
    try {
      const params = {
        vendorId: overseasOrderData?.data?.vendorId,
        sku: sku,
      };
      const res = await deleteOrderItemApi(params).unwrap();
      refetch();
    } catch (error) {
      console.error("An error occurred during OverseasOrderList:", error);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      const params = {
        vendorId: overseasOrderData?.data?.vendorId,
        products: editedRows,
      };

      const res = await updateOrderApi(params).unwrap();

      setEditedRows([]);
      refetch().then((data) => {
        handleClear();
      });

      toast.success("Product Updated Successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleSubmitPaidItem = async () => {
    try {
      let error = true;
      const processedItems = selectedRows.map((row) => {
        if (!newOrderQty[row.SKU]) {
          error = true;
        }
        return { ...row, Orderqty: row.OrderQty, Gst: row.GST };
      });

      if (!error) {
        toast.error("Missing Order Quantity");
        return;
      }
      const params = {
        vendorId: overseasOrderData?.data?.vendorId,
        products: processedItems,
      };
      console.log(params);
      const res = await paidOrderApi(params).unwrap();

      refetch();
      toast.success("Product Processed To Paid", {
        position: toast.POSITION.TOP_CENTER,
      });
      setSelectedItems([]);
      setSelectedRows([]);
      setNewOrderQty({});
      setOpen(false);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleSubmitBox = async () => {
    try {
      if (!formData.boxMarking) {
        return toast.error("boxMarking  is required");
      }
      if (!formData.weight) {
        return toast.error("weight  is required");
      }

      if (!formData.length || !formData.height || !formData.width) {
        return toast.error("Dimension is required");
      }

      let errString = "";
      const processedProducts = selectedRows.map((row) => {
        const newOrderQty = formQuantity[row.SKU];
        if (!newOrderQty) {
          errString = `${row.Name} shipped Quantity is Required`;
        }
        if (newOrderQty > row.OrderQty) {
          errString = `${row.Name} shipped Quantity Cannot be Higher than order Quantity`;
        }
        return { ...row, Orderqty: formQuantity[row.SKU], Gst: row.GST };
      });

      if (errString) {
        return toast.error(errString);
      }

      const newFormData = new FormData();

      newFormData.append("vendorId", overseasOrderData?.data?.vendorId);
      newFormData.append("companyName", overseasOrderData?.data?.companyName);
      newFormData.append("boxMarking", formData.boxMarking);
      newFormData.append("weight", formData.weight);
      newFormData.append(
        "dimension",
        JSON.stringify({
          length: formData.length,
          height: formData.height,
          width: formData.width,
        })
      );
      newFormData.append("products", JSON.stringify(processedProducts));
      newFormData.append("boxImage", formData.fileInput);



      const res = await createBoxApi(newFormData).unwrap();
      setSelectedItems([]);
      setSelectedRows([]);
      setFormQuantity({});
      setShipOpen(false);
      setFormData({
        boxMarking: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        fileInput: null, // Assuming it's a file input
      });
      refetch();
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedItems(selectionModel);

    const selectedRowsData = selectionModel.map((id) => {
      return rows.find((row) => row.id === id);
    });

    setSelectedRows(selectedRowsData);
  };
  const handleRemoveRestockItem = (id) => {
    const newSelectedItems = selectedItems.filter((item) => item !== id);
    setSelectedItems(newSelectedItems);
    const newSelectedRow = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelectedRow);
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
      maxWidth: 150,
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
      maxWidth: 200,
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
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `${params.value} %`,
    },
    {
      field: "PrevUSD",
      headerName: "Prev USD Price",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `$ ${params.value}`,
    },
    {
      field: "PrevRMB",
      headerName: "Prev RMB Price",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `¥ ${params.value}`,
    },
    {
      field: "Price",
      headerName: "USD $",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      type: "number",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `$ ${params.value}`,
      editable: toggleValue === "unPaid" ? true : false,
    },
    {
      field: "RMB",
      headerName: "RMB ¥",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      type: "number",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => ` ¥ ${params.value}`,
      editable: toggleValue === "unPaid" ? true : false,
    },
    {
      field: "OrderQty",
      headerName: "OrderQty",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: toggleValue === "unPaid" ? true : false,
    },

    {
      field: "action",
      headerName: "Action",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <DeleteIcon
            onClick={() => {
              if (overseasOrderData?.data?.status === "paid") {
                toast.error("Cant Delete Paid Order Item");
                return;
              }
              handleDeleteItem(params.row.SKU);
            }}
          />
        );
      },
    },
  ];

  // CustomToolbar

  const CustomToolbar = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        <ToggleButtonGroup
          color="primary"
          value={toggleValue}
          exclusive
          onChange={(e) => {
            setToggleValue(e.target.value);
          }}
          aria-label="Platform"
        >
          <ToggleButton classes={{ selected: classes.selected }} value="unPaid">
            UnPaid
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="paid">
            Paid
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="closed">
            Closed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <Grid container>
        <Loading loading={overseasOrderLoading || deleteLoading || isLoading} />
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
                  <Button onClick={handleUpdateQuantity}>Save</Button>{" "}
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
                  width: "45rem",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "	#d9d9d9 ",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: ".3rem",
                    boxShadow: "  #bfbfbf 0px 3px 8px;",
                    paddingX: "1rem",
                    cursor: "pointer",
                    marginLeft: ".7rem",
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Company Name:
                    <Typography variant="span" color="red">
                      {" "}
                      {overseasOrderData?.data?.companyName}
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "	#d9d9d9 ",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: ".3rem",
                    boxShadow: "  #bfbfbf 0px 3px 8px;",
                    paddingX: "1rem",
                    cursor: "pointer",
                    marginLeft: ".7rem",
                  }}
                >
                  <Typography
                    variant="span"
                    color="black"
                    sx={{ fontWeight: "bold" }}
                  >
                    Concern Person:
                    <Typography variant="span" color="red">
                      {overseasOrderData?.data?.concernPerson}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                {" "}
                {selectedItems.length ? (
                  <Box sx={{}}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (toggleValue === "unPaid") {
                          setOpen(true);
                        } else {
                          setShipOpen(true);
                        }
                      }}
                    >
                      {toggleValue === "unPaid"
                        ? "Process Paid Order"
                        : "Box Paid Order"}
                    </Button>{" "}
                  </Box>
                ) : (
                  ""
                )}
              </Box>
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
              columns={
                toggleValue === "unPaid" ? columns : columns.slice(0, -1)
              }
              rows={rows}
              rowHeight={40}
              editMode="cell"
              apiRef={apiRef}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedItems}
              processRowUpdate={handleRowUpdate}
              onProcessRowUpdateError={(error) => {}}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <PaidOrderDialog
        data={selectedRows}
        open={open}
        setOpen={setOpen}
        handleDelete={handleRemoveRestockItem}
        newOrderQty={newOrderQty}
        setNewOrderQty={setNewOrderQty}
        handleSubmit={handleSubmitPaidItem}
        loading={paidOrderLoading}
      />
      <ShipOrderDialog
        data={selectedRows}
        open={shipOpen}
        setOpen={setShipOpen}
        handleDelete={handleRemoveRestockItem}
        setFormQuantity={setFormQuantity}
        formQuantity={formQuantity}
        setFormData={setFormData}
        formData={formData}
        handleSubmit={handleSubmitBox}
        loading={createBoxLoading}
      />
    </Box>
  );
};

export default OverSeasOrderProductGrid;
