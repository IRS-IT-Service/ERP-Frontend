import { DataGrid } from "@mui/x-data-grid";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetAllPackagesQuery } from "../../../features/api/clientAndShipmentApiSlice";

const CustomerShipmentList = () => {
  // local state variables
  const [queryParams, setQueryParams] = useState("InPackaging");
  const [rows, setRows] = useState([]);

  // rtk query
  const {
    data: getAllShipments,
    isLoading,
    refetch,
  } = useGetAllPackagesQuery(queryParams);
  console.log(getAllShipments);

  useEffect(() => {
    if (getAllShipments && getAllShipments.status) {
      const result = getAllShipments.client.map((item, index) => {
        return {
          ...item,
          Sno: index + 1,
          id: item._id,
          ShipmentId: item.OrderShipmentId,
          CustomerName: item.ContactPerson,
          CustomerContact: item.Contact,
          ShipAddress:
            item.ShippingAddress?.City +
            " " +
            item.ShippingAddress?.District || "" +
            " " +
            item.ShippingAddress?.State +
            " " +
            item.ShippingAddress?.Country +
            "," +
            item.ShippingAddress?.Pincode,
            PackingDetails:item.IsPacked,
            CourierDetails:item.HasCourierId,
            Invoice: item.Invoice,
            PackageDispatch:item.Dispatched,
            OrderCompleted:item.IsCompletedOrder
        };
      });
      setRows(result);
    }
  }, [getAllShipments]);

  // functions
  const handleChange = (event, newQuery) => {
    setQueryParams(newQuery);
  };

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
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
      field: "CustomerName",
      headerName: "Customer-Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerContact",
      headerName: "Contact-No",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "ShipAddress",
      headerName: "Ship-Address",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "PackageDispatch",
      headerName: "Package-Dispatch",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
    },
    {
      field: "CourierDetails",
      headerName: "Courier-Details",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Invoice",
      headerName: "Invoice",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "OrderCompleted",
      headerName: "Completed",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  const CustomToolbar = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
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
      <Box
        sx={{
          height: "87vh",
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
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default CustomerShipmentList;
