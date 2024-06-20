import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { useSelector } from "react-redux";

const ViewHistoryDial = ({ open, setOpen, data }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const admin = userInfo.isAdmin;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl">
      <DialogTitle
        sx={{
          textAlign: "center",
          borderBottom: "1px solid #eee",
          color: "skyblue",
        }}
      >
        {data?.SKU}
      </DialogTitle>
      <DialogContent>
        <div style={{ width: "35vw" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ textAlign: "center", background: "grey" }}>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  Sno
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  Name
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  Ask Quantity
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.history?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                    {item.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                    {item.askQty }
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", color: "green", padding: "4px" }}
                  >
                    {formatDate(item.date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewHistoryDial;
