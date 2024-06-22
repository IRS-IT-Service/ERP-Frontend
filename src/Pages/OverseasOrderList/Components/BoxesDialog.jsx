import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  Grid,
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

const BoxesDialog = ({ setOpenbox, openBox, product }) => {
  /// handlers

  const handleClose = () => {
    setOpenbox(false);
  };
  const StyledCell = styled(TableCell)(({ theme }) => ({
    textAlign: "center",
  }));
  const StyledCellHeader = styled(TableCell)(({ theme }) => ({
    textAlign: "center",
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: "#fff",
  }));

  return (
    <div>
      <Dialog
        sx={{ backdropFilter: "blur(5px)" }}
        open={openBox}
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
            Shipment Order Details
          </Typography>
          <CancelRounded
            onClick={handleClose}
            sx={{ fontSize: "1.8rem", cursor: "pointer" }}
          />
        </DialogTitle>
        <DialogContent>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Box style={{ flexBasis: "75%" }}>
              <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <StyledCellHeader>Sno</StyledCellHeader>
                      <StyledCellHeader>SKU</StyledCellHeader>
                      <StyledCellHeader>Name</StyledCellHeader>
                 
                      <StyledCellHeader>Order Quantity</StyledCellHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product?.data?.map((item, index) => (
                      <TableRow key={index}>
                        <StyledCell>{index + 1}</StyledCell>
                        <StyledCell>{item.SKU}</StyledCell>
                        <StyledCell>{item.Name}</StyledCell>
                       <StyledCell>{item.updateQTY || item.Orderqty}</StyledCell>

            
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box style={{ flexBasis: "35%", width:600 ,height:500,padding:"10px" }}>
              <img
                src={product?.image?.url}
                title="Image Preview"
                style={{objectFit:"cover",objectPosition:"center",width:"100%",height:"100%"}}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoxesDialog;
