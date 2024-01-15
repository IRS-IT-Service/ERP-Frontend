import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  CircularProgress,
  TextField,
  TextareaAutosize,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useCreateBoxOpenApprovalMutation } from "../../../features/api/barcodeApiSlice";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const CreateBoxApprovalDialog = ({ open, setOpen, data, removeHandler }) => {
  /// initialize
  const navigate = useNavigate();
  /// local state
  const [requiredQty, setRequiredQty] = useState({});
  const [reason, setReason] = useState("");

  /// rtk query
  const [createApprovalApi, { isLoading }] = useCreateBoxOpenApprovalMutation();

  /// handlers
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      let error = false;
      const processedData = data.map((item) => {
        if (!requiredQty[item.SKU]) {
          error = true;
        }
        return {
          SKU: item.SKU,
          name: item.Name,
          openQty: requiredQty[item.SKU],
          Quantity: item.Quantity,
        };
      });
      if (error) {
        toast.error("Please Enter Required Quantity");
        return;
      }

      if (!reason) {
        toast.error("Please Enter Reason");
        return;
      }
      const params = {
        reason: reason,
        products: processedData,
      };

      const res = await createApprovalApi(params);
      toast.success("Successfully Created");
      navigate("/boxapprovalstatus");
    } catch (e) {
      console.log("Error at Create Box Open Approval");
      console.log(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ width: "100%", backdropFilter: "blur(5px)" }}
      maxWidth="xl"
    >
      <DialogTitle textAlign="center" sx={{ display: "flex", gap: "1rem" }}>
        Box Open Approval
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }}>
            <TableHead
              sx={{
                position: "sticky",
                top: "0",
              }}
            >
              <TableRow>
                <StyledTableCell>Sno</StyledTableCell>
                <StyledTableCell>SKU</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Brand</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Required Box Open Qty</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.SKU}</StyledTableCell>
                  <StyledTableCell>{row.Name}</StyledTableCell>
                  <StyledTableCell>{row.Brand}</StyledTableCell>
                  <StyledTableCell>{row.Quantity}</StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      value={requiredQty[row.SKU || ""]}
                      type="number"
                      onChange={(e) => {
                        setRequiredQty((prev) => {
                          return { ...prev, [row.SKU]: e.target.value };
                        });
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      onClick={() => {
                        removeHandler(row.SKU);
                      }}
                    >
                      <Delete />
                    </Button>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Box>
        <TextareaAutosize
          value={reason}
          placeholder="Enter Reason For Box Opening"
          onChange={(e) => {
            setReason(e.target.value);
          }}
        />
      </Box>
      <Box>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit}>
          {isLoading ? <CircularProgress /> : "Submit"}{" "}
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreateBoxApprovalDialog;
