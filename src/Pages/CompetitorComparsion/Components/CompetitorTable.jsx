import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from "@mui/material";

const Columns = ["Sno", "SKU", "ProductName", "GST", "Comp1", "Comp2", "Comp3"];

const initialData = [
  {
    Sno: 1,
    SKU: "SKU123",
    ProductName: "Product A",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 2,
    SKU: "SKU456",
    ProductName: "Product B",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 3,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 4,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 5,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 6,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
  {
    Sno: 7,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
    Comp3: "",
  },
];

const CompetitorTable = () => {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);

  const handleInputChange = (event, rowIndex, columnName) => {
    const { value } = event.target;
    const newData = [...data];
    newData[rowIndex][columnName] = value;
    setData(newData);
    console.log(newData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  const handleSave = () => {
    data.forEach((row, index) => {
      const gstValue = row.GST;
      console.log("Saving GST value for row:", index, "Value:", gstValue);
    });
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" sx={{ margin: "10px" }} onClick={handleClickOpen}>
         Add Competitor
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: handleSubmit,
          }}
        >
          <DialogContent sx={{minWidth:"30vw"}}>
           <Box sx={{display:"flex", flexDirection:"column", gap:"10px"} }>
           <TextField id="outlined-basic" label="Competitor Name " variant="outlined"  />
          <TextField id="outlined-basic" label="URL" variant="outlined" />
           </Box>
         
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
        <Button variant="outlined" sx={{ margin: "10px" }} onClick={handleSave}>
          Save
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row.Sno}>
                <TableCell>{row.Sno}</TableCell>
                <TableCell>{row.SKU}</TableCell>
                <TableCell>{row.ProductName}</TableCell>
                <TableCell>
                  <p>{row.GST}</p>
                </TableCell>
                {[1, 2, 3].map((compNum) => (
                  <TableCell key={`Comp${compNum}`}>
                    <input
                      type="text"
                      value={row[`Comp${compNum}`]}
                      onChange={(event) =>
                        handleInputChange(event, rowIndex, `Comp${compNum}`)
                      }
                      style={{
                        width: "5vw",
                        height: "4vh",
                        border: "1px solid black",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompetitorTable;
