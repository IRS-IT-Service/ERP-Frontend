import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import { useGetShipRocketCourierMutation } from "../../../features/api/otherSlice";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";

const ShiproketMain = () => {
  const [shipDatas, setShipData] = useState([]);
  const [form, setForm] = useState({
    pickupCode: "",
    deliverCode: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    cod: "0",
    unit: "gram",
  });

  const [getShippingData, { isLoading }] = useGetShipRocketCourierMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.pickupCode ||
      !form.deliverCode ||
      !form.weight ||
      !form.length ||
      !form.breadth
    )
      return toast.error("All Fields are required");
    try {
      let weight = form.weight;
      if (form.unit === "gram") {
        weight = String(+weight / 1000);
      }
      const info = {
        pickup_postcode: form.pickupCode,
        delivery_postcode: form.deliverCode,
        cod: "0",
        weight: weight,
        length: form.length,
        breadth: form.breadth,
        height: form.height,
      };
      const result = await getShippingData(info).unwrap();
      setShipData(result?.available_courier_companies);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "courier_name",
      headerName: "Courier-Name",
      minWidth: 350,
      flex: 0.1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "etd",
      headerName: "ETD",
      width: "250",
      flex: 0.3,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "estimated_delivery_days",
      headerName: "Delivery-Time",
      width: "250",
      align: "center",
      flex: 0.3,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "rate",
      headerName: "Freight-Charge",
      width: "250",
      align: "center",
      flex: 0.3,
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const value = params.value;
        let color = "inherit";

        const sortedData = shipDatas
          .map((data) => data.rate)
          .sort((a, b) => a - b);

        const index = sortedData.indexOf(value);

        if (index < 3) {
          color = "green";
        } else if (index < 6) {
          color = "orange";
        } else {
          color = "red";
        }

        return <div style={{ color }}>{value}</div>;
      },
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflowY: "auto",
        marginTop: "80px",
        height: "85vh",
      }}
    >
      {/* Input Field For Get Delivery partner  */}
      <Box sx={{}}>
        <Paper
          elevation={8}
          sx={{ height: "100%", width: "90%", margin: "auto" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "center",
              //   alignItems: "center",
            }}
          >
            <span
              style={{
                width: "20%",
                textAlign: "center",
                zIndex: 1,
                background: "linear-gradient(to right,#182848, #4b6cb7 )",
                color:"#eee",
                clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)",
              }}
            >
              Pickup-Details
            </span>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                label="Pickup Pincode"
                size="small"
                name="pickupCode"
                value={form.pickupCode}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                label="Delivery Pincode"
                size="small"
                name="deliverCode"
                value={form.deliverCode}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <span
              style={{
                width: "20%",
                textAlign: "center",
                zIndex: 1,
                background: "linear-gradient(to right,#182848, #4b6cb7 )",
                color:"#eee",
                clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)",
              }}
            >
              Product-Details
            </span>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                label="Weight"
                name="weight"
                size="small"
                type="number"
                value={form.weight}
                onChange={(e) => handleChange(e)}
                InputProps={{
                  endAdornment: (
                    <TextField
                      select
                      name="unit"
                      value={form.unit}
                      onChange={(e) => handleChange(e)}
                      variant="standard"
                      sx={{ width: "50%" }}
                    >
                      <MenuItem value="gram">Gram</MenuItem>
                      <MenuItem value="kg">Kilogram</MenuItem>
                    </TextField>
                  ),
                }}
              />
              <TextField
                label="Length (in cm)"
                name="length"
                type="number"
                size="small"
                value={form.length}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                label="Breadth (in cm)"
                name="breadth"
                size="small"
                type="number"
                value={form.breadth}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                label="Height (in cm)"
                name="height"
                size="small"
                type="number"
                value={form.height}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  background: "linear-gradient(to right,#182848, #4b6cb7 )",
                  color: "white",
                  margin: "2px",
                }}
                onClick={() => handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Get-Details"}
              </Button>
            </div>
          </Box>
        </Paper>
      </Box>
      {/* to show the data of courier */}
     
      <Box
        sx={{
          height: "57vh",
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
          marginTop: "20px"
        }}
      >
        <DataGrid rows={shipDatas} columns={columns} />
        </Box>
      </Box>

  );
};

export default ShiproketMain;
