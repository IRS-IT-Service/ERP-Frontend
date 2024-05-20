import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const AddSingleClientDial = ({ open, setOpen }) => {
  // local state
  const [form, setForm] = useState({
    CompanyName: "",
    Contact: "",
    ContactName: "",
    Email: "",
    GST: "",
    Pincode: "",
    City: "",
    State: "",
    District: "",
    Address: "",
    helperText: "",
  });
  const [error, setError] = useState({
    ContactError: false,
    EmailError: false,
    GSTError: false,
  });
  // onchange functtion
  const handleChange = (e) => {
    let helperText = "";
    const { name, value } = e.target;

    setError((prevError) => ({
      ...prevError,
      [`${name}Error`]: false,
    }));
  
    if (name === "Contact") {
      if (value.length !== 10) {
        setError((prevError) => ({
          ...prevError,
          ContactError: true,
        }));
        helperText = "Contact number should be 10 digits";
      }
    }
  
    // Validation for GST
    if (name === "GST") {
      if (value.length !== 16) {
        setError((prevError) => ({
          ...prevError,
          GSTError: true,
        }));
        helperText = "GSTIN should be 16 digits";
      }
    }
  
    // Validation for Email
    if (name === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError((prevError) => ({
          ...prevError,
          EmailError: true,
        }));
        helperText = "Enter a valid email address";
      }
    }
  
    if (name === "Pincode") {
      if (value.length === 0) {
        setForm((prevForm) => ({
          ...prevForm,
          City: "",
          State: "",
          District: "",
        }));
      } else if (value.length === 6) {
        const fetchPincodeDetails = async (pincode) => {
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
                  City: postOffice.Name,
                  State: postOffice.State,
                  District: postOffice.District,
                }));
              } else {
                console.log("Pincode Details not found");
              }
            } else {
              console.log("No data received from the API");
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        };
        fetchPincodeDetails(value);
      }
    }
    setForm((prev) => ({ ...prev, [name]: value, helperText }));
  };

  // submit function
  const handleSubmit = () => {
    if (!form.CompanyName || !form.GST || !form.Address)
      return toast.error("Plz Fill the Form Before Submitting");
    try {
    } catch (e) {}
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{ textAlign: "center", color: "blue", fontWeight: "bold" }}
      >
        Add Single Client
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            mt: "6px",
          }}
          autoComplete="off"
          component="form"
          noValidate
        >
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Company Name"
            name="CompanyName"
            required
            value={form.CompanyName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Contact Name"
            name="ContactName"
            required
            value={form.ContactName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Contact"
            name="Contact"
            value={form.Contact}
            type="number"
            error={error.ContactError}
            helperText={form.helperText}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Email"
            type="email"
            name="Email"
            value={form.Email}
            onChange={(e) => handleChange(e)}
            error={error.EmailError}
            helperText={form.helperText}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Enter GSTIN"
            required
            name="GST"
            value={form.GST}
            onChange={(e) => handleChange(e)}
            error={error.GSTError}
            helperText={form.helperText}
          />
          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            Add Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                type="number"
                label="Enter Pincode"
                fullWidth
                name="Pincode"
                value={form.Pincode}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                label="Enter City"
                fullWidth
                name="City"
                value={form.City}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                label="Enter District"
                fullWidth
                name="Districe"
                value={form.District}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                label="Enter State"
                fullWidth
                name="State"
                value={form.State}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ textAlign: "center" }}
                label="Enter Address"
                fullWidth
                name="Address"
                value={form.Address}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button variant="contained" onClick={() => handleSubmit()}>
          Add
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSingleClientDial;
