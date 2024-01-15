import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TableContainer,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const BarcodeDialogbox = ({ open, onClose, serialNumbers }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: "darkblue",
          display: "flex",
          justifyContent: "space-around",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <Box>SKU: {serialNumbers?.products?.sku} </Box>{" "}
        <Box>Name: {serialNumbers?.products?.name}</Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Sno
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Serial Number
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serialNumbers?.data?.map((serialData, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    {new Date(serialData.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {serialData.serialNumber}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: serialData.isRejected ? "red" : "green" }}
                  >
                    {serialData.isOpen ? (
                      <Tooltip title={serialData?.openItems?.join(" | ")} style={{ color: 'red' }}>
                        <Button>Box Opened</Button>
                      </Tooltip>
                    ) : serialData.isRejected ? (
                      "Rejected"
                    ) : serialData.isProcessed ? (
                      "Sticked"
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeDialogbox;
