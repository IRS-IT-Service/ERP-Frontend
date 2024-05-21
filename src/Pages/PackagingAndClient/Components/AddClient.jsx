import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AddSingleClientDial from "./AddSingleClientDial";
import { useGetAllClientQuery } from "../../../features/api/clientAndShipmentApiSlice";
import Client from "../Client";

const AddClient = () => {
  // api calling
  const { data: getAllClient, refetch, isLoading } = useGetAllClientQuery();
 
  // local state
  const [open, setOpen] = useState(false);
  const [rows,setRows] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (getAllClient?.client) {
      const response = getAllClient.client.map((client, index) => {
        return {
          Sno: index + 1,
          id: client._id,
          CompanyName: client.CompanyName,
          GST: client.GSTIN,
          Address:
            client.PermanentAddress?.Address +
            " " +
            client.PermanentAddress?.District +
            " " +
            client.PermanentAddress?.State +
            " " +
            client.PermanentAddress?.Country +
            " " +
            client.PermanentAddress?.Pincode,
          ContactNumber: client.ContactNumber,
          ContactName: client.ContactName,
          Email: client.Email,
        };
      });
      setRows(response)
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
          justifyContent: "space-around",
          gap: "20px",
          padding: "10px",
        }}
      >
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
        <DataGrid columns={columns} rows={rows} />
      </Box>
      {open && <AddSingleClientDial open={open} setOpen={setOpen} refetch={refetch} />}
    </Box>
  );
};

export default AddClient;
