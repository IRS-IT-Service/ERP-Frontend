import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
CircularProgress
} from "@mui/material";

import { useChangeStatusMutation } from "../../../features/api/RnDSlice";
import { useUpdateShipmentStatusMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";


const StatusDial = ({
  open,
  setStatusOpen,
  refetch,
  data
}) => {
    const [updateStatus, { isLoading, refetch:updateRefetch }] = useUpdateShipmentStatusMutation();
  const [selectOptions, setSelectOptions] = useState([

    {
      value: "Delivered",
      label: "Delivered",
    },

  ]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reason, setReason] = useState("")
  const [reasonFile,setReasonFile] = useState("")

console.log(data)


  const handleStatusUpdate = async () => {
    try {
 
      const formDatas = new FormData();

      formDatas.append("status", selectedStatus);
      formDatas.append("file", reasonFile);
      formDatas.append("TrackingId", data?.Tracking);
      formDatas.append("remark", reason);
      formDatas.append("customerMobile", data?.CustomerMobile);


      const result = await updateStatus(formDatas).unwrap();
      toast.success("Status updated successfully");
      refetch()
      setStatusOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={()=>{setStatusOpen(false)}}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Status Update</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{
                display:"flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>

          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            value={selectedStatus}
            defaultValue={"InTransit"}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
       
            helperText="Please select to change the status of your project"
            sx={{
              margin: "5px",
            }}
          >
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Typography sx={{
            color:"red",
            fontSize:"12px",
            textAlign:"center"
          }}>
            Note :"After changes status to Delivered please provide remark or POD"
          </Typography>
 <textarea 
 name="reason"
 type="text"
 size="small"
 placeholder="Remark"
 style={{
    resize:"none",
    width:"100%",
    height:"10vh",
    paddingLeft:"5px"
 }}
 onChange={(e)=>setReason(e.target.value)}
 value={reason}
  />

  <Typography sx={{

    
  }}>
    Or
  </Typography>
 <Box sx={{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"right",
    width:"100%",
    gap:"5px"
 }}> <Typography sx={{
    fontWeight:"bold"
 }}>Upload POD</Typography> <input type="file" onChange={(e)=>{setReasonFile(e.target.files[0])}} /></Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
            setStatusOpen(false);
            setSelectedStatus("");
            }}
        
          >
            Close
          </Button>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={() => {
              handleStatusUpdate();
            }}
          >
          {isLoading ? <CircularProgress size={30} sx={{color:"#fff"}}/> : "Update"}  
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StatusDial;
