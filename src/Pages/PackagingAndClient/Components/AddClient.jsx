import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AddSingleClientDial from "./AddSingleClientDial";
import { useGetAllClientQuery } from "../../../features/api/clientAndShipmentApiSlice";
import { useGridApiRef } from "@mui/x-data-grid";

const AddClient = () => {
  // api calling
  const { data: getAllClient, refetch, isLoading } = useGetAllClientQuery();

  const apiRef = useGridApiRef();

  // local state
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const formatShippingAddress = (obj, keyOrder = []) => {
    if (!obj || typeof obj !== "object") return "";

    const keys = keyOrder.length ? keyOrder : Object.keys(obj);

    const formattedString = keys
      .map((key) => obj[key] || "")
      .filter((value) => value)
      .join(", ");

    return formattedString;
  };

  ///search

  const handleFilterChange = (field, operator, value) => {
    apiRef.current.setFilterModel({
      items: [{ field: field, operator: operator, value: value }],
    });
  };

  useEffect(() => {
    if (getAllClient?.client) {
      const response = getAllClient.client.map((client, index) => {
        const keyOrder = ["Address", "District", "State", "Country", "Pincode"];
        const shippingAddress = formatShippingAddress(
          client.PermanentAddress,
          keyOrder
        );
     
        return {
          ...client,
          Sno: index + 1,
          id: client._id,
          CompanyName: client.CompanyName || "N/A",
          GST: client.GSTIN,
          Address: shippingAddress,
          ContactNumber: client.ContactNumber,
          ContactName: client.ContactName,
          Email: client.Email,
        };
      });
      setRows(response);
    }
  }, [getAllClient]);

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
      field: "ContactName",
      headerName: "Contact Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CompanyName",
      headerName: "Company Name",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "GST",
      headerName: "GST",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "ContactNumber",
      headerName: "Contact",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ClientType",
      headerName: "Type",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "Email",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Address",
      headerName: "Address ",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];
  return (
    <Box sx={{}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          padding: "10px",
        }}
      >
        <Box>
          <input
            placeholder="search Company Name"
            style={{
              width: "30rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "20px",
            }}
            name="search"
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange("CompanyName", "contains", e.target.value);
            }}
          />
        </Box>
        <Button variant="outlined" onClick={() => navigate("/bulkAdd")}>
          Bulk Add Client
        </Button>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          {" "}
          Add Single Client
        </Button>
      </Box>

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
        <DataGrid columns={columns} rows={rows} apiRef={apiRef} />
      </Box>
      {open && (
        <AddSingleClientDial open={open} setOpen={setOpen} refetch={refetch} />
      )}
    </Box>
  );
};

export default AddClient;
