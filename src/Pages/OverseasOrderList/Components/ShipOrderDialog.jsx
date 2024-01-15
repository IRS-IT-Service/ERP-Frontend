import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CancelRounded } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Button,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ShipOrderDialog = ({
  open,
  setOpen,
  data,
  handleDelete,
  handleSubmit,
  loading,
  formData,
  setFormData,
  formQuantity,
  setFormQuantity,
}) => {
  /// handlers

  const handleChange = (SKU, value) => {
    setNewOrderQty({ ...newOrderQty, [SKU]: value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const StyledCell = styled(TableCell)(({ theme }) => ({
    textAlign: "center",
  }));
  const StyledCellHeader = styled(TableCell)(({ theme }) => ({
    textAlign: "center",
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: "#fff",
  }));

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleQuantityChange = (e, sku) => {
    const { name, value } = e.target;

    // Update the formQuantity state with the new quantity for the specific SKU
    setFormQuantity((prevData) => ({
      ...prevData,
      [sku]: value,
    }));
  };

  return (
    <div>
      <Dialog
        sx={{ backdropFilter: "blur(5px)" }}
        open={open}
        onClose={handleClose}
        maxWidth="xl"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              flex: "1",
              textAlign: "center",
            }}
          >
            Shipment Order
          </Typography>
          <CancelRounded
            onClick={handleClose}
            sx={{ fontSize: "1.8rem", cursor: "pointer" }}
          />
        </DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledCellHeader>Sno</StyledCellHeader>
                  <StyledCellHeader>SKU</StyledCellHeader>
                  <StyledCellHeader>Name</StyledCellHeader>
                  <StyledCellHeader>Brand</StyledCellHeader>
                  <StyledCellHeader>GST %</StyledCellHeader>
                  <StyledCellHeader>Price $</StyledCellHeader>
                  <StyledCellHeader>RMB ¥</StyledCellHeader>
                  <StyledCellHeader>Order Quantity</StyledCellHeader>
                  <StyledCellHeader>Shipped Quantity</StyledCellHeader>
                  <StyledCellHeader>Delete</StyledCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <StyledCell>{index + 1}</StyledCell>
                    <StyledCell>{item.SKU}</StyledCell>
                    <StyledCell>{item.Name}</StyledCell>
                    <StyledCell>{item.Brand}</StyledCell>
                    <StyledCell>{item.GST} %</StyledCell>
                    <StyledCell sx={{ textAlign: "center", width: "150px" }}>
                      $ {item.Price}
                    </StyledCell>
                    <StyledCell sx={{ textAlign: "center", width: "150px" }}>
                      ¥ {item.RMB}
                    </StyledCell>
                    <StyledCell>{item.OrderQty}</StyledCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <input
                        style={{
                          width: "5rem",
                          height: "2rem",
                          textIndent: "20px",
                        }}
                        name="shippedQty"
                        value={formQuantity[item.SKU] || ""}
                        onChange={(e) => handleQuantityChange(e, item?.SKU)}
                      />
                    </TableCell>

                    <StyledCell>
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer", // Add the pointer cursor on hover
                        }}
                      />
                    </StyledCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            padding: "0.5rem",
            backgroundColor: "#e6e6e6",
            alignItems: "end",
          }}
        >
          {/* Main Content */}
          <Box
            style={{
              display: "flex",
              width: "100%",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onChange={handleInputChange}
          >
            {/* Box Marking */}
            <TextField
              name="boxMarking"
              label="Box Marking"
              style={{ marginTop: "1.5rem", background: "#fff" }}
              value={formData.boxMarking}
              onChange={handleInputChange}
            />

            {/* Dimension */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold", paddingBottom: "0.5rem" }}>
                Dimension
              </span>
              <Box
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <TextField
                  name="length"
                  type="number"
                  label="L"
                  style={{ width: "80px", background: "#fff" }}
                  variant="outlined"
                  value={formData.length}
                  onChange={handleInputChange}
                />
                <span>X</span>
                <TextField
                  name="width"
                  type="number"
                  label="W"
                  style={{ width: "80px", background: "#fff" }}
                  variant="outlined"
                  value={formData.width}
                  onChange={handleInputChange}
                />
                <span>X</span>
                <TextField
                  name="height"
                  type="number"
                  label="H"
                  style={{ width: "80px", background: "#fff" }}
                  variant="outlined"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </Box>
            </Box>

            {/* Weight in kg */}
            <TextField
              name="weight"
              type="number"
              label="Weight in kg"
              style={{
                width: "150px",
                marginTop: "1.5rem",
                background: "#fff",
              }}
              value={formData.weight}
              onChange={handleInputChange}
            />

            {/* File Input */}
            <input
              type="file"
              name="fileInput"
              style={{ marginTop: "1rem" }}
              onChange={handleInputChange}
              accept=".jpeg, .jpg, .png"
            />
          </Box>

          {/* Buttons */}
          <Box
            style={{
              display: "flex",
              height: "60px",
              gap: "10px",
              width: "18rem",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleSubmit}
              variant="outlined"
              style={{ marginTop: "1rem" }}
            >
              {loading ? <CircularProgress /> : "Submit"}
            </Button>

            <Button
              type="button"
              onClick={handleClose}
              variant="outlined"
              style={{ marginTop: "1rem" }}
            >
              Add More
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ShipOrderDialog;
