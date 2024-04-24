import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useAddRemarksMutation, useGetAllRemarksQuery } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";
import { formateDateAndTime } from "../../../commonFunctions/commonFunctions";

const RemarksDial = ({
  refetch,
  open,
  setRemarksPage,
  projectId,
  name
}) => {
  const [percentage, setPercentage] = useState("");
  const [workDetails, setWorkDetails] = useState("");

  // RTK QUERY CALLING
  const [addRemarks] = useAddRemarksMutation();
  const {data:getAllRemarks,refetch:allremarksRefetch} = useGetAllRemarksQuery(projectId)

  const handleClose = () => {
    setRemarksPage(false);
  };


  const handleSubmit = async () => {
    if(!workDetails) return toast.error("Plz Input Remarks before submission")
    try {
      const data = {
        id: projectId,
        percentage,
        remark:workDetails,
        date: new Date(),
      };
      const result = await addRemarks(data).unwrap();
      toast.success("Remarks added successfully")
      setPercentage("");
      setWorkDetails("");
      allremarksRefetch()
      refetch()
      setRemarksPage(false)
     
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        style={{
          backgroundColor: "#2196f3",
          color: "white",
          textAlign: "center",
        }}
      >
        Add Remarks for {name}
      </DialogTitle>
      <DialogContent style={{ margin: "10px", padding: "10px" }}>
        <FormControl fullWidth>
          <InputLabel id="percentage-label">Percentage</InputLabel>
          <Select
            labelId="percentage-label"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            fullWidth
          >
            {[...Array(11).keys()].map((_, index) => (
              <MenuItem key={index} value={index * 10}>
                {index * 10}%
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Work Details"
          value={workDetails}
          onChange={(e) => setWorkDetails(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
      <TableContainer component={Paper} style={{ padding: "4px" }}>
        <Table>
          <TableHead
            style={{ backgroundColor: "grey" }}
          >
            <TableRow>
              <TableCell style={{textAlign:"center"}}>Percentage</TableCell>
              <TableCell style={{textAlign:"center"}}>Work Details</TableCell>
              <TableCell style={{textAlign:"center"}}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAllRemarks?.data?.Remarks.map((work, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{work.WorkPercent}%</TableCell>
                <TableCell>{work.Remarks}</TableCell>
                <TableCell>{formateDateAndTime(work.Date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default RemarksDial;
