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
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import Loading from "../../../components/Common/Loading";
import { useGetSingleVendorWithOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import PaidOrderDialog from "./PaidOrderDialog";
import ShipOrderDialog from "./ShipOrderDialog";
import { formatDate } from "../../../commonFunctions/commonFunctions";

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
  console.log(id);

  /// local State
  const classes = useStyles();
  const [editedRows, setEditedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [toggleValue, setToggleValue] = useState("unpaid");

  /// rtk query

  const {
    data: getSingleOrder,
    isLoading: singleLoading,
    refetch: singleOrderRefetch,
  } = useGetSingleVendorWithOrderQuery(id);

  const navigate = useNavigate();

  /// useEffect
  useEffect(() => {
    if (getSingleOrder && getSingleOrder?.status === true) {
      const data = getSingleOrder.data?.Orders?.map((item, index) => ({
        ...item,
        id: item._id,
        overseaseOrderId:item.overseaseOrderId,
        Sno: index + 1,
        OrderDate: formatDate(item.createdAt),
        products: item.subOrders,
        totalProducts: item.subOrders.map((item) => item.finalProducts.length),
      }));

      const filteredData = data.filter((item) => item.status === toggleValue);

      setRows(filteredData);
    }
  }, [toggleValue, getSingleOrder]);
  
console.log(getSingleOrder?.data)
  // handle columns

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
      field: "piNo",
      headerName: "PI No",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "OrderDate",
      headerName: "Order Date",
      flex: 0.3,
      minWidth: 80,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "totalUSDAmount",
      headerName: "Order Amount ",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `$ ${params.value} `,
    },
    {
      field: "totalProducts",
      headerName: "Total Product",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Order",
      headerName: "Ordered-Product",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              navigate(`/tempOrder/${params.row.overseaseOrderId}`)
            }
          >
            View
          </Button>
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
          <ToggleButton classes={{ selected: classes.selected }} value="unpaid">
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
        <Loading loading={singleLoading} />
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              height: "2.5rem",
            }}
          >
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
                      {getSingleOrder?.data?.CompanyName}
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
                      {getSingleOrder?.data?.ConcernPerson}
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
                toggleValue === "unpaid" ? columns : columns.slice(0, -1)
              }
              rows={rows}
              rowHeight={40}
              editMode="cell"
              apiRef={apiRef}
              checkboxSelection
              disableRowSelectionOnClick
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </Box>
        </Grid>
      </Grid>
      {/* <PaidOrderDialog
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
      /> */}
    </Box>
  );
};

export default OverSeasOrderProductGrid;
