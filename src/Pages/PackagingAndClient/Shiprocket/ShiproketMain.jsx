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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useGetShipRocketCourierMutation } from "../../../features/api/otherSlice";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

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
    pickupCity: "",
    pickupState: "",
    deliverCity: "",
    deliverState: "",
  });

  const [getShippingData, { isLoading }] = useGetShipRocketCourierMutation();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    try {
      if (
        (name === "pickupCode" || value.length === 6) &&
        (name === "deliverCode" || value.length === 6)
      ) {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          const data = response.data[0];
          if (data.PostOffice && data.PostOffice.length > 0) {
            const postOffice = data.PostOffice[0];
            if (name === "pickupCode") {
              setForm((prevForm) => ({
                ...prevForm,
                pickupCity: postOffice.District,
                pickupState: postOffice.State,
              }));
            } else {
              setForm((prevForm) => ({
                ...prevForm,
                deliverCity: postOffice.District,
                deliverState: postOffice.State,
              }));
            }
          } else {
            console.log("Pincode Details not found");
          }
        } else {
          console.log("No data received from the API");
        }
      }
    } catch (error) {
      console.log(error);
    }
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
        cod: form.cod,
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

  const picodeFiller = async () => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        const data = response.data[0];
        if (data.PostOffice && data.PostOffice.length > 0) {
          const postOffice = data.PostOffice[0];
          setForm((prevForm) => ({
            ...prevForm,
            Country: postOffice.Country,
            State: postOffice.State,
            District: postOffice.District,
          }));
        } else {
          console.log("Pincode Details not found");
        }
      } else {
        console.log("No data received from the API");
      }
    } catch (error) {}
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

  // function for calculating volumetric weights
  const calculateVolumetricWeight = () => {
    let length = form.length;
    let breadth = form.breadth;
    let height = form.height;
    if (!length || !height || !breadth) return "0.00";

    const volumetricWeight = (length * breadth * height) / 5000;

    return volumetricWeight.toFixed(3);
  };
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflowY: "auto",
        marginTop: "80px",
        height: "87vh",
        // border:"1px solid yellow"
      }}
    >
      {/* Input Field For Get Delivery partner  */}

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          // flexDirection: "column",
          // gap: "10px",
          // justifyContent: "center",
          //   alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "75%",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Pickup Pincode
              </span>
              <TextField
                placeholder="Enter 6 digit pickup area pincode"
                size="small"
                name="pickupCode"
                fullWidth
                value={form.pickupCode}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Delivery Pincode
              </span>
              <TextField
                placeholder="Enter 6 digit delivery area pincode"
                size="small"
                name="deliverCode"
                fullWidth
                value={form.deliverCode}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>{" "}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Actual Weight
              </span>
              <TextField
                placeholder="0.00"
                variant="outlined"
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
                      size="small"
                      value={form.unit}
                      onChange={(e) => handleChange(e)}
                      variant="standard"
                      sx={{ width: "50%", opacity: "0.6" }}
                    >
                      <MenuItem sx={{ opacity: 0.6 }} value="gram">
                        Gram
                      </MenuItem>
                      <MenuItem sx={{ opacity: 0.6 }} value="kg">
                        Kilogram
                      </MenuItem>
                    </TextField>
                  ),
                }}
              />
            </div>

            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Dimensions
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <TextField
                  placeholder="Length (in cm)"
                  name="length"
                  type="number"
                  size="small"
                  value={form.length}
                  onChange={(e) => handleChange(e)}
                />
                <TextField
                  placeholder="Breadth (in cm)"
                  name="breadth"
                  size="small"
                  type="number"
                  value={form.breadth}
                  onChange={(e) => handleChange(e)}
                />
                <TextField
                  placeholder="Height (in cm)"
                  name="height"
                  size="small"
                  type="number"
                  value={form.height}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Payment type
              </span>
              <div>
                <RadioGroup
                  defaultValue="0"
                  name="cod"
                  row
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    sx={{ opacity: "0.6" }}
                    value="1"
                    control={<Radio />}
                    label="Cash On Delivery"
                  />
                  <FormControlLabel
                    sx={{ opacity: "0.6" }}
                    value="0"
                    control={<Radio />}
                    label="Prepaid"
                  />
                </RadioGroup>
              </div>
            </div>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                Volumetric Weight
              </span>
              <TextField
                placeholder="0.00"
                size="small"
                name="deliverCode"
                sx={{ opacity: "0.6" }}
                fullWidth
                value={calculateVolumetricWeight()}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "40px",
            }}
          >
            <Button
              variant="contained"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              size="small"
            >
              {isLoading ? <CircularProgress /> : "Calculate"}
            </Button>
            <Button onClick={() => window.location.reload()} variant="outlined"               size="small"
>
              Reset
            </Button>
          </div>
        </Box>
        <Box sx={{ width: "24%" }}>
          <Paper elevation={8} sx={{ height: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon sx={{ color: "blue" }} />{" "}
                <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                  Pickup Location
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  border: "0.2px solid #03396c",
                  borderTopStyle: "dotted",
                  borderBottomStyle: "dotted",
                  width: "60%",
                  borderRadius: "8px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    fontWeight: "bolder",
                    opacity: "0.6",
                    fontSize: "14px",
                  }}
                >
                  {form.pickupCity ? form.pickupCity : "City"}{" "}
                </span>
                <span
                  value={"State"}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    opacity: "0.8",
                    fontSize: "16px",
                  }}
                >
                  {form.pickupState ? form.pickupState : "State"}{" "}
                </span>
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "40%",
                border: "0.2px dotted #03396c",
                margin: "auto",
              }}
            />{" "}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LocationOnIcon sx={{ color: "blue" }} />{" "}
                <span style={{ fontWeight: "bold", opacity: "0.7" }}>
                  Delivery Location
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  border: "0.2px solid #03396c",
                  borderTopStyle: "dotted",
                  borderBottomStyle: "dotted",
                  width: "60%",
                  borderRadius: "8px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    fontWeight: "bolder",
                    opacity: "0.6",
                    fontSize: "14px",
                  }}
                >
                  {form.deliverCity ? form.deliverCity : "City"}{" "}
                </span>
                <span
                  value={"State"}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    opacity: "0.8",
                    fontSize: "16px",
                  }}
                >
                  {form.deliverState ? form.deliverState : "State"}{" "}
                </span>
              </div>
            </div>{" "}
          </Paper>
        </Box>
      </Box>
      {/* to show the data of courier */}

      <Box
        sx={{
          height: "53vh",width:"100%",
          "& .super-app-theme--header": {
            background: "#eee",
            color: "black",
            textAlign: "center",
            marginTop:"15px"
          },
          
        }}
      >
        <DataGrid rows={shipDatas} columns={columns} />
      </Box>
    </Box>
  );
};

export default ShiproketMain;
