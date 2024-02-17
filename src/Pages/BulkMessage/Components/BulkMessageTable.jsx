import React, { useState, useEffect } from "react";
import {
  styled,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Numbers } from "@mui/icons-material";
//File upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const BulkMessageTable = () => {
  const [open, setOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [customerNumber, setCustomerNumber] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("File uploaded:", file);
    setFileUploaded(true);
  };
  const [input, setInput] = useState({ CustomerName: "", CustomerNumber: "" });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    const customerNumberRegex = /^\d{10}$/;

    if (!input.CustomerName || !input.CustomerNumber) {
      toast.error("Please fill Customer Name or Customer Number ");
      event.preventDefault();
    } else if (!customerNumberRegex.test(input.CustomerNumber)) {
      toast.error("Please Enter Correct Customer Number");
      event.preventDefault();
    } else {
      event.preventDefault();
      console.log("Customer Name:", input.CustomerName);
      console.log("Customer Number:", input.CustomerNumber);
      setInput([]);
      handleClose();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSelectionChange = (selectionModel) => {
    const selectedCustomerNumbers = selectionModel.map((selectedRowId) => {
      const selectedRow = data.find((row) => row.id === selectedRowId);
      return selectedRow ? selectedRow.CustomerNumber : null;
    });
    setCustomerNumber(selectedCustomerNumbers);
  };
  console.log(" Selected Customer Numbers:", customerNumber);

  //This is data grid data
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 150,
      editable: true,
    },
    {
      field: "CustomerNumber",
      headerName: "Customer Number",
      width: 150,
      editable: true,
    },
  ];
  const [data, setDate] = useState([
    { id: 1, CustomerName: "John", CustomerNumber: "12345" },
    { id: 2, CustomerName: "Alice", CustomerNumber: "67890" },
    { id: 3, CustomerName: "Bob", CustomerNumber: "24680" },
    { id: 4, CustomerName: "Emma", CustomerNumber: "13579" },
    { id: 5, CustomerName: "Michael", CustomerNumber: "97531" },
    { id: 6, CustomerName: "Sophia", CustomerNumber: "745565" },
    { id: 7, CustomerName: "Oliver", CustomerNumber: "45632" },
    { id: 8, CustomerName: "Charlotte", CustomerNumber: "78901" },
    { id: 9, CustomerName: "Liam", CustomerNumber: "35782" },
    { id: 10, CustomerName: "Ava", CustomerNumber: "68024" },
    { id: 11, CustomerName: "Mason", CustomerNumber: "12943" },
    { id: 12, CustomerName: "Ella", CustomerNumber: "58371" },
    { id: 13, CustomerName: "Alexander", CustomerNumber: "40236" },
    { id: 14, CustomerName: "Mia", CustomerNumber: "81726" },
    { id: 15, CustomerName: "James", CustomerNumber: "35478" },
    { id: 16, CustomerName: "Emily", CustomerNumber: "69475" },
    { id: 17, CustomerName: "Benjamin", CustomerNumber: "27654" },
    { id: 18, CustomerName: "Harper", CustomerNumber: "50968" },
    { id: 19, CustomerName: "Ethan", CustomerNumber: "81739" },
    { id: 20, CustomerName: "Evelyn", CustomerNumber: "26374" },
  ]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            overflow: "hidden",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ margin: "6px 0px 6px 0px " }}
          >
            Add Customer
          </Button>
          <TextareaAutosize
            minRows={8}
            placeholder="Enter your message"
            aria-label="maximum height"
          />
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: handleSubmit,
            }}
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Add Customer</Typography>
            </DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Customer Name"
                    variant="outlined"
                    sx={{ width: "100%", marginTop: "12px" }}
                    name="CustomerName"
                    value={input.CustomerName}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Customer Number"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    name="CustomerNumber"
                    value={input.CustomerNumber}
                    onChange={handleInputChange}
                    type="number"
                  />

                  <Button type="submit" variant="outlined">
                    Add
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  >
                    {" "}
                    Cancel
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{ backgroundColor: fileUploaded ? "green" : undefined }}
            >
              {fileUploaded ? "File Uploaded" : "Upload File"}
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
            </Button>
            <Button variant="outlined" sx={{ margin: "10px" }}>
              Send
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "35%" }}>
          <Box sx={{ height: "72vh", width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              rowHeight={50}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleSelectionChange}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BulkMessageTable;
