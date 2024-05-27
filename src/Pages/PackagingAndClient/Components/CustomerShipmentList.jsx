import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  collapseClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetAllPackagesQuery } from "../../../features/api/clientAndShipmentApiSlice";
import { useNavigate } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import PackingAndCourierDial from "./PackingAndCourierDial";
import InvoiceDial from "./InvoiceDial";
import { Margin, OpenInBrowser } from "@mui/icons-material";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { Portal } from "@mui/base/Portal";
import Grid from "@mui/material/Grid";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const CustomerShipmentList = () => {
  // local state variables
  const [queryParams, setQueryParams] = useState("InPackaging");
  const [rows, setRows] = useState([]);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [courierOpen, setCourierOpen] = useState(false);
  const [orderdetailsopen, setOrderdetailsOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [items, setItems] = useState({});

  const navigate = useNavigate();

  const formatShippingAddress = (obj, keyOrder = []) => {
    if (!obj || typeof obj !== "object") return "";

    const keys = keyOrder.length ? keyOrder : Object.keys(obj);

    const formattedString = keys
      .map((key) => obj[key] || "")
      .filter((value) => value)
      .join(", ");

    return formattedString;
  };

  // rtk query
  const {
    data: getAllShipments,
    isLoading,
    refetch,
  } = useGetAllPackagesQuery(queryParams);

  useEffect(() => {
    refetch();
  }, [getAllShipments]);

  useEffect(() => {
    if (getAllShipments && getAllShipments.status) {
      const result = getAllShipments.client.map((item, index) => {
        const keyOrder = ["Address", "District", "State", "Country", "Pincode"];
        const shippingAddress = formatShippingAddress(
          item.ShippingAddress,
          keyOrder
        );
        return {
          ...item,
          Sno: index + 1,
          id: item._id,
          ShipmentId: item.OrderShipmentId,
          CustomerName: item.ContactPerson,
          CustomerContact: item.Contact,
          ShipAddress: shippingAddress,
          PackingDetails: item.IsPacked,
          CourierDetails: item.HasCourierId,
          Invoice: item.Invoice,
          PackageDispatch: item.Dispatched,
          OrderCompleted: item.IsCompletedOrder,
          Products: item.Items,
          Weight: item.PackageWeight,
          Dimension: item.PackageDimension,
          CourierLink: item.CourierLink,
          CourierName: item.CourierName,
          TrackingId: item.TrackingId,
          FieldPackingDetails: item.PackingDetails,
          OrderDate: formatDate(item.createdAt),
        };
      });
      setRows(result);
    }
  }, [getAllShipments]);

  // functions
  const handleChange = (event, newQuery) => {
    setQueryParams(newQuery);
  };

  const handlePackageOpen = (data) => {
    setCourierOpen(true);
    setDetails(data);
  };

  const handleOrderdetailsOpen = (data) => {
    setOrderdetailsOpen(true);
    setDetails(data);
  };

  const handleInvoiceOpen = (data) => {
    setInvoiceOpen(true);
    setDetails(data);
  };

  function MyCustomToolbar(prop) {
    return (
      <React.Fragment>
        <Portal container={() => document.getElementById("filter-panel")}>
          <GridToolbarQuickFilter />
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </React.Fragment>
    );
  }

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ShipmentId",
      headerName: "ShipmentId",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "OrderDate",
      headerName: "Order-Date",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer-Name",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerContact",
      headerName: "Contact-No",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "ShipAddress",
      headerName: "Ship-Address",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "PackageDispatch",
      headerName: "Package-Dispatch",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const dispatched = !params.value;
        const id = params.row.ShipmentId;
        return dispatched ? (
          <Box onClick={() => navigate(`/ItemsAprroval/${id}`)}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    color: "#fff",
                    background:
                      params.row.Dispatched && !params.row.IsPacked
                        ? "#ccc"
                        : "green",
                    borderRadius: "50%",

                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  1
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <VerifiedIcon sx={{ color: "green", fontSize: "35px" }} />
          </Box>
        );
      },
    },
    {
      field: "PackingDetails",
      headerName: "Packing-Details",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const packed = !params.value;
        const orderId = params.row.ShipmentId;
        const fieldDetails = params.row.FieldPackingDetails;
        const CustomerName = params.row.CustomerName;
        const Weight = params.row.Weight;
        const Dimension = params.row.Dimension;
        const openFor = "Packing";
        return (
          <Box
            onClick={() =>
              handlePackageOpen({
                OpenFor: openFor,
                CustomerName: CustomerName,
                OrderId: orderId,
                Weight: Weight,
                Dimension: Dimension,
                fieldDetails: fieldDetails,
              })
            }
          >
            {/* {packed ? "Open" : <VerifiedIcon sx={{ color: "green" }} />} */}
            {packed ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      color: "#fff",
                      background:
                        !params.row.Dispatched && !params.row.IsPacked
                          ? "#ccc"
                          : "green",
                      borderRadius: "50%",

                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    2
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box>
                <VerifiedIcon sx={{ color: "green", fontSize: "35px" }} />
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: "CourierDetails",
      headerName: "Courier-Details",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const packed = !params.value;
        const orderId = params.row.ShipmentId;
        const CustomerName = params.row.CustomerName;
        const CourierName = params.row.CourierName;
        const TrackingId = params.row.TrackingId;
        const Link = params.row.CourierLink;
        const openFor = "Courier";
        return (
          <Box
            disabled={!params.row.IsPacked && !params.row.HasCourierId}
            onClick={() =>
              handlePackageOpen({
                OpenFor: openFor,
                CustomerName: CustomerName,
                OrderId: orderId,
                CourierName: CourierName,
                Link: Link,
                TrackingId: TrackingId,
              })
            }
          >
            {packed ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    color: "#fff",
                    background:
                      !params.row.IsPacked && !params.row.HasCourierId
                        ? "#ccc"
                        : "green",
                    borderRadius: "50%",

                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  3
                </Box>
              </Box>
            ) : (
              <VerifiedIcon sx={{ color: "green", fontSize: "35px" }} />
            )}
          </Box>
        );
      },
    },
    {
      field: "Invoice",
      headerName: "Invoice",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const invoice = params.value;
        const orderId = params.row.ShipmentId;
        const CustomerName = params.row.CustomerName;
        return (
          <Button
            onClick={() =>
              handleInvoiceOpen({
                invoice: invoice,
                OrderId: orderId,
                CustomerName: CustomerName,
              })
            }
          >
            {invoice ? "View" : "Upload"}
          </Button>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const data = params.row;

        const color = params.row.IsPacked
          ? params.row.HasCourierId
            ? "orange"
            : "blue"
          : params.row.IsCompletedOrder
          ? "green"
          : "red";

        const status = params.row.IsPacked
          ? params.row.HasCourierId
            ? "In transit"
            : "Packed"
          : params.row.IsCompletedOrder
          ? "delivered"
          : "Intialized";

        return (
          <div
            style={{
              color: color,
            }}
          >
            <Button sx={{ color: `${color}` }}>{status}</Button>
          </div>
        );
      },
    },
    {
      field: "OrderCompleted",
      headerName: "Completed",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const IsCompletedOrder = params.row.IsCompletedOrder;
        return (
          <Button
            disabled={
              params.row.IsCompletedOrder &&
              !params.row.IsPacked &&
              !params.row.HasCourierId
            }
            onClick={() => handleOrderdetailsOpen(params.row)}
          >
            {IsCompletedOrder ? "Submitted" : "Open"}
          </Button>
        );
      },
    },
  ];

  const CustomToolbar = () => {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "20px",
          marginTop: "5px",
        }}
      >
        <Button
          size="small"
          variant="contained"
          sx={{
            background: "purple",
          }}
          onClick={() => navigate("/shipRocket")}
        >
          Shipment rate Comparision
        </Button>
        <ToggleButtonGroup
          color="primary"
          value={queryParams}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="InPackaging">In-Packaging</ToggleButton>
          <ToggleButton value="Dispatched">Dispatched</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };

  return (
    <Box>
      <CustomToolbar />
      <Grid item>
        <Box id="filter-panel" />
      </Grid>
      <Box
        sx={{
          height: "84vh",
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
          rows={rows}
          columns={columns}
          slots={{
            toolbar: MyCustomToolbar,
          }}
          loading={isLoading}
          initialState={{
            filter: {
              filterModel: {
                items: ["OrderDate"],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
        />
      </Box>
      {courierOpen && (
        <PackingAndCourierDial
          open={courierOpen}
          setOpen={setCourierOpen}
          details={details}
          refetch={refetch}
        />
      )}
      {invoiceOpen && (
        <InvoiceDial
          open={invoiceOpen}
          setOpen={setInvoiceOpen}
          details={details}
          refetch={refetch}
        />
      )}
      {orderdetailsopen && (
        <OrderDetailsDialog
          open={orderdetailsopen}
          setOpen={setOrderdetailsOpen}
          details={details}
        />
      )}
    </Box>
  );
};

export default CustomerShipmentList;
