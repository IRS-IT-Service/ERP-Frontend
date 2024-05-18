import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
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
            width: "30rem",
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
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Address"
            name="Address"
            required
            value={form.Address}
            onChange={(e) => handleChange(e)}
          />
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
