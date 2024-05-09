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

} from "@mui/material";

import { useChangeStatusMutation } from "../../../features/api/RnDSlice";
import { useUpdateShipmentStatusMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";

const RemarkDial = ({
  open,
  setRemarkOpen,
data,
  

}) => {
  const [updateStatus, { isLoading, refetch:updateRefetch }] = useUpdateShipmentStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [reason, setReason] = useState("")
  const [reasonFile,setReasonFile] = useState("")


console.log(data)

  const handleStatusUpdate = async () => {
    try {
      const info = {
        TrackingId: Tracking,
        status: selectedStatus,
      };
      const result = await updateStatus(info).unwrap();
      toast.success("Status updated successfully");
      setProjectId("");
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
        onClose={()=>{setRemarkOpen(false)}}
        maxWidth="xl"
      
      >
        <DialogTitle sx={{ textAlign: "center" }}>Remarks</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
     
<Box sx={{
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    border:"0.5px solid black",
    width:"50vw",

  
  
  
}}>
 <Box sx={{
        width:"100%",
        flexBasis:"80%",
   
  
    }}> <Typography sx={{
        backgroundColor:"grey",
        color:"#fff",
        textAlign:"center"
    }}>
        Uploaded POD
    </Typography>

    <img style={{
        width:"100%",
        height:"100%",
        objectFit:"cover",
        objectPosition:"center"
    }} src={data?.POD?.url} /> 
    </Box>
    <Box sx={{
        width:"100%",
        flexBasis:"20%",
        borderTop:"0.5px solid black",
  
    }}><Typography sx={{
        textAlign:"center",
        fontSize:"12px",
        fontWeight:"bold"
       
    }}>
        Update Remark
        </Typography>
        <Typography sx={{
            paddingLeft:"5px"
        }}>
            {data?.Remark}
        </Typography>
        </Box>
</Box>
         

        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
            setRemarkOpen(false);
            setSelectedStatus("");
            }}
          >
            Close
          </Button>
     
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RemarkDial;
