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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PaidOrderDialog = ({
  open,
  setOpen,
  data,
  handleDelete,
  newOrderQty,
  setNewOrderQty,
  handleSubmit,
  loading,
}) => {
  /// handlers

  const handleChange = (SKU, value) => {
    setNewOrderQty({ ...newOrderQty, [SKU]: value });
  };

  const handleClose = () => {
    setOpen(false);
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
            Process Paid Order
          </Typography>
          <CancelRounded onClick={handleClose} sx={{ fontSize: "1.8rem" }} />
        </DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Sno
                  </TableCell>
                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Brand
                  </TableCell>
                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    GST %
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Price $
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Order Quantity
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "linear-gradient(0deg, #01127D, #04012F)",
                      color: "#fff",
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.SKU}</TableCell>
                    <TableCell>{item.Name}</TableCell>
                    <TableCell>{item.Brand}</TableCell>
                    <TableCell>{item.GST}</TableCell>
                    <TableCell sx={{ textAlign: "center", width: "150px" }}>
                      $ {item.Price}
                    </TableCell>
                    <TableCell>{item.OrderQty}</TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer", // Add the pointer cursor on hover
                        }}
                      />
                    </TableCell>
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
            mt: 2,
            gap: "1rem",
            padding: "0.5rem",
            backgroundColor: " #e6e6e6",
          }}
        >
          <Button onClick={handleSubmit} variant="outlined">
            {loading ? <CircularProgress /> : "Submit"}
          </Button>

          <Button variant="outlined" onClick={handleClose}>
            Add More
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default PaidOrderDialog;
