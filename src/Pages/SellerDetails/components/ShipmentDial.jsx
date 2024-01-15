import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const ShipmentDial = ({ open, close, data }) => {
  return (
    <div>
      {" "}
      <Dialog open={open}>
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box>
              <Box>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">sno</TableCell>
                        <TableCell align="center">Product-Name</TableCell>
                        <TableCell align="center">Barcode</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((row, index) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{row.product}</TableCell>
                          <TableCell align="center">{row.barcode}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box>
                <TextField
                  variant="filled"
                  placeholder="Enter TrackingId"
                ></TextField>
                <TextField
                  variant="filled"
                  placeholder="Enter CourierName"
                ></TextField>
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
          <Button>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShipmentDial;
