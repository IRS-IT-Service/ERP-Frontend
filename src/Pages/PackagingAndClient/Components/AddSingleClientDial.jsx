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
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAddClientMutation } from "../../../features/api/clientAndShipmentApiSlice";
import { toast } from "react-toastify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useUpdateClientMutation } from "../../../features/api/clientAndShipmentApiSlice";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";

const AddSingleClientDial = ({ open, setOpen, refetch ,editedRows ,setEditedRows }) => {
  // api calling
  const [addClient, { isLoading }] = useAddClientMutation();
  const [updateClient, { isLoading: updateLoading, refetch: updateRefetch }] =
  useUpdateClientMutation();
const [createUserHistoryApi] = useCreateUserHistoryMutation();
const [sendMessageToAdmin] = useSendMessageToAdminMutation();
  // local state
console.log(editedRows)


  const [form, setForm] = useState({
    CompanyName: "",
    Contact: "",
    ContactName: "",
    Email: "",
    GST: "",
    Pincode: "",
    Country: "",
    State: "",
    District: "",
    Address: "",
    helperText: "",
    ClientType: "Company",
  });
  const [error, setError] = useState({
    ContactError: false,
    EmailError: false,
    GSTError: false,
  });

  useEffect(() => {
    if (editedRows !== null) {

         
      setForm({
        ...editedRows,
        Contact: editedRows.ContactNumber,
        Address: editedRows.AddressPoint,
        District: editedRows.District,
        State: editedRows.State,
        Country: editedRows.Country,
        Pincode: +editedRows.Pincode,
      });
    }
  }, [editedRows]);


  const handleClose = () => {
    setEditedRows(null)
    setOpen(false)

  }


  // onchange function
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

    if (name === "GST") {
      if (value.length !== 15) {
        setError((prevError) => ({
          ...prevError,
          GSTError: true,
        }));
        helperText = "GSTIN should be 15 digits";
      }
    }

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
          Country: "",
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
          } catch (error) {
            console.error("Error:", error.message);
          }
        };
        fetchPincodeDetails(value);
      }
    }
    setForm((prev) => ({ ...prev, [name]: value, helperText }));
  };

  // update
 



  // submit function
  const handleSubmit = async () => {
    if (!form.Email || !form.Contact || !form.ContactName || !form.Pincode)
      return toast.error("Plz Fill the Form Before Submitting");

    try {
      const info = {
        datas: [
          {
            id:undefined,
            CompanyName: form.CompanyName,
            ContactNumber: form.Contact,
            ContactName: form.ContactName,
            Email: form.Email,
            ClientType: form.ClientType,
            PermanentAddress: {
              Pincode: form.Pincode,
              District: form.District,
              State: form.State,
              Country: form.Country,
              Address: form.Address,
            },
            GSTIN: form.GST || "N/A",
          },
        ],
      };

 
if(editedRows !== null){

  const update = {
    id: editedRows._id,
    data : {
      CompanyName: form.CompanyName,
      ContactNumber: form.Contact,
      ContactName: form.ContactName,
      Email: form.Email,
      ClientType: form.ClientType,
      PermanentAddress: {
        Pincode: form.Pincode,
        District: form.District,
        State: form.State,
        Country: form.Country,
        Address: form.Address,
      },
      GSTIN: form.GST || "N/A",
    }
   
   
  }

  const result = await updateClient(update).unwrap()
  toast.success("Client updated successfully");
}else{
  const result = await addClient(info).unwrap();
  toast.success("Client added successfully");
}
      refetch();
      setForm({
        CompanyName: "",
        Contact: "",
        ContactName: "",
        Email: "",
        GST: "",
        Pincode: "",
        Country: "",
        State: "",
        District: "",
        Address: "",
        ClientType: "",
        helperText: "",
      });
      setOpen(false);
      setEditedRows(null)
      setError({ ContactError: false, EmailError: false, GSTError: false });
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeforType = (e, name) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{ textAlign: "center",background:"#eee", fontWeight: "bold" }}
      >
        Add Single Client
      </DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", justifyContent: "center" ,marginTop:"4px"}}>
          <ToggleButtonGroup
            color="primary"
            value={form.ClientType}
            exclusive
            onChange={(e) => handleChangeforType(e, "ClientType")}
            aria-label="Platform"
          >
            <ToggleButton value="Individual">Individual</ToggleButton>
            <ToggleButton value="Company">Company</ToggleButton>
          </ToggleButtonGroup>
        </div>
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
         { form.ClientType === "Company" ?  
         <TextField
            variant="outlined"
            fullWidth
            label="Enter Company Name"
            name="CompanyName"
            required = {form.ClientType === "Company" ? true : false}
            value={form.CompanyName}
            onChange={(e) => handleChange(e)}
          />  : ""}

          <TextField
            variant="outlined"
            fullWidth
            label="Enter Name"
            name="ContactName"
            required
            value={form.ContactName}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Phone "
            name="Contact"
            required
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
            required
            value={form.Email}
            onChange={(e) => handleChange(e)}
            error={error.EmailError}
            helperText={form.helperText}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Enter GSTIN"
            required={form.ClientType === "Company" ? true : false}
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
                label="Enter District"
                fullWidth
                name="District"
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
            <Grid item xs={6}>
              <TextField
                sx={{ textAlign: "center" }}
                label="Enter Country"
                fullWidth
                name="Country"
                value={form.Country}
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
        <Button
          variant="contained"
          onClick={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading || updateLoading ? <CircularProgress /> : editedRows !== null ? "Update" : "ADD"}
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSingleClientDial;
