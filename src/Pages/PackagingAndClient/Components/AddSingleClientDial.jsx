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
  });
 
  // onchange functtion
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
            // width: "30rem",
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Company Name"
            name="CompanyName"
            required
            value={form.CompanyName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Contact Name"
            name="ContactName"
            required
            value={form.ContactName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Contact"
            name="Contact"
            value={form.Contact}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Email"
            name="Email"
            value={form.Email}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter GSTIN"
            required
            name="GST"
            value={form.GST}
            onChange={(e) => handleChange(e)}
          />
          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            Add Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                type="number"
                placeholder="Enter Pincode"
                fullWidth
                name="Pincode"
                value={form.Pincode}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                placeholder="Enter City"
                fullWidth
                name="City"
                value={form.City}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                placeholder="Enter District"
                fullWidth
                name="Districe"
                value={form.District}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                placeholder="Enter State"
                fullWidth
                name="State"
                value={form.State}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ textAlign: "center" }}
                placeholder="Enter Address"
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
