import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useGetAllBoxesQuery } from "../../../features/api/RestockOrderApiSlice";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import BoxesDialog from "./BoxesDialog";

const CreateShipment = () => {
  const [rows, setRows] = useState([]);
  const [openBox, setOpenBox] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { data: getAllBoxes } = useGetAllBoxesQuery("pending");

  // Handle functions
  const handleOpenBox = (data) => {
    const product = {
      data: data.product,
      image: data.image,
    };
    setProduct(product);
    setOpenBox(true);
  };

  useEffect(() => {
    if (getAllBoxes && getAllBoxes.data.length > 0) {
      const result = getAllBoxes.data.map((box, index) => ({
        ...box,
        Sno: index + 1,
        id: box.boxId,
        createdAt: formatDate(box.createdAt),
        weight: box.weight + "Kg" || "N/A",
      }));
      setRows(result);
    }
  }, [getAllBoxes]);
  console.log(selectedRows);

  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "boxId",
      headerName: "Box Id",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "createdAt",
      headerName: "Created-On",
      flex: 0.3,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "comPanyName",
      headerName: "From-Company",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "weight",
      headerName: "Box-Weight",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "dimension",
      headerName: "Dimension(LXBXH)",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) =>
        ` ${params.value.length} X ${params.value.width} X ${params.value.height} `,
    },
    {
      field: "marking",
      headerName: "Box-Marking",
      flex: 0.3,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "products",
      headerName: "Products",
      flex: 0.3,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const product = params.row.product;
        const image = params.row.boxImage;
        return (
          <Button onClick={() => handleOpenBox({ product, image })}>
            View
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ marginTop: "71px" }}>
      {selectedRows.length > 0 && <Button>Create Shipment</Button>}
      <Box
        sx={{
          height: "87vh",
          width: "100%",
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      {openBox && (
        <BoxesDialog
          setOpenBox={setOpenBox}
          openBox={openBox}
          product={product}
        />
      )}
    </Box>
  );
};

export default CreateShipment;
