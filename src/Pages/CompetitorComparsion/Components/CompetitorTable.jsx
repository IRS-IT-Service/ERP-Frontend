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
  TextField,
  Typography,
} from "@mui/material";

const Columns = ["Sno", "SKU", "ProductName", "GST", "Comp1", "Comp2"];

const initialData = [
  {
    Sno: 1,
    SKU: "SKU123",
    ProductName: "Product A",
    GST: "12",
    Comp1: "Hex",
    Comp2: "",
  },
  {
    Sno: 2,
    SKU: "SKU456",
    ProductName: "Product B",
    GST: "12",
    Comp1: "",
    Comp2: "",
  },
  {
    Sno: 3,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
  },
  {
    Sno: 4,
    SKU: "SKU789",
    ProductName: "Product C",
    GST: "12",
    Comp1: "",
    Comp2: "",
  },
];

// Dilog box table
function createData(Sno, CompetitorName, url) {
  return { Sno, CompetitorName, url };
}
const rows = [
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
  createData(1, "Tesla", "kdjfkljdskfj"),
];
const CompetitorTable = () => {
  const [data, setData] = useState(initialData);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event, rowIndex, columnName) => {
    const { value } = event.target;
    const newData = [...data];
    newData[rowIndex][columnName] = value;
    setData(newData);
    console.log(newData);
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
        <Button
          variant="outlined"
          sx={{ margin: "10px" }}
          onClick={handleClickOpen}
        >
          Add Competitor
        </Button>

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
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Add Competitor</Typography>
            <Button onClick={handleClose} sx={{ fontWeight: "bold" }}>
              {" "}
              Cancel
            </Button>
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
                  label="Competitor Name "
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
                <TextField
                  id="outlined-basic"
                  label="URL"
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
                <Button type="submit" variant="outlined">
                  Add
                </Button>
              </Box>
              <Box sx={{ marginTop: "12px" }}>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table
                    sx={{ minWidth: 500 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead
                      sx={{ position: "sticky", top: 0, background: "white" }}
                    >
                      <TableRow>
                        <TableCell>Sno</TableCell>
                        <TableCell>Competitor Name</TableCell>
                        <TableCell>Url</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.Sno}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.Sno}
                          </TableCell>
                          <TableCell>{row.CompetitorName}</TableCell>
                          <TableCell>{row.url}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
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
                {[1, 2].map((compNum) => (
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
