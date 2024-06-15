import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useGetAllVendorQuery } from "../../../features/api/RestockOrderApiSlice";
import { useNavigate } from "react-router-dom";

const AllVendorDial = ({ open, setOpen, }) => {
  const { data: allVendorData } = useGetAllVendorQuery();

  const navigate = useNavigate()
  return (
    <Dialog open={open} onClose={()=> setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle sx={{textAlign:"center",background:"lightblue",color:"blue",fontWeight:"bold"}}>All Vendors</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{textAlign:"center"}}>
                <TableCell sx={{textAlign:"center"}}>S.No</TableCell>
                <TableCell sx={{textAlign:"center"}}>Company Name</TableCell>
                <TableCell sx={{textAlign:"center"}}>Contact Person</TableCell>
                <TableCell sx={{textAlign:"center",}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allVendorData && allVendorData?.data.map((vendor, index) => (
                <TableRow key={vendor._id}>
                  <TableCell sx={{textAlign:"center",padding:"2px"}}>{index + 1}</TableCell>
                  <TableCell sx={{textAlign:"center",padding:"2px"}}>{vendor.CompanyName}</TableCell>
                  <TableCell sx={{textAlign:"center",padding:"2px"}}>{vendor.ConcernPerson}</TableCell>
                  <TableCell sx={{textAlign:"center",padding:"2px"}}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/tempOrder/${vendor.VendorId}`)}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllVendorDial;
