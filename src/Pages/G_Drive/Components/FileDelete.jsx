import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { toast } from "react-toastify";
import { useDeleteFileMutation } from "../../../features/api/driveApiSlice";


const FileDelete = ({ open, setDeleteConf, file,setTrigger }) => {
  const [otp, setOtp] = useState("");
  const [sendOtpForDelete, { isLoading:otpLoading }] = useSendMessageToAdminMutation();
  const adminContact = import.meta.env.VITE_ADMIN_CONTACT;

  const [
    deleteFile,
    { isLoading: deleteFileLoading, refetch: deleteFileRefetch },
  ] = useDeleteFileMutation();

  const handleSendOtp = async () => {
    const getOtp = Math.floor(Math.random() * 9000) + 1000;
    try {
      const message = `Otp For Deleting Folder From Drive: ${getOtp}`;
      const info = { contact: adminContact, message: message };
      const sendOtpToAdmin = await sendOtpForDelete(info).unwrap();
      localStorage.setItem("fileOtp", getOtp);
      toast.success("Otp succssfull send to admin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSelectedFolder = async () => {
    if (!file.id) return toast.error("plz select folder to delete");
    const generatedOtp = localStorage.getItem("fileOtp");
    if (+otp !== +generatedOtp)
      return toast.error("Plz put valid otp or try again");
    try {
      const deleted = await deleteFile(file.id).unwrap();
      setTrigger('delete')
      setDeleteConf(false)
      toast.success("File deleted successfully");
      localStorage.removeItem("fileOtp");
       } catch (error) {
      console.log(error);
      setOtp("")
    }
  };


  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Box sx={{display:"flex" ,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap:"10px",
        
        }}>
          <Box sx={{
            width:"25rem",
           
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexWrap:"wrap"
            
          }}>
            <Typography>
              Do you really want to delete <span style={{
                color:"red"
              }}>{file.name} </span> file ?
            </Typography>
          </Box>
        <Box
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="outlined"
            disabled={otpLoading}
            onClick={() => handleSendOtp()}
          >
            {otpLoading ? <CircularProgress /> : "Click To Send Otp"}
          </Button>

          <input
            placeholder="Enter OTP"
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Box>
        <Box display="flex" justifyContent="space-around">
          <Button
            variant="contained"
            onClick={() => handleDeleteSelectedFolder()}
            disabled={deleteFileLoading}
          >
            {deleteFileLoading ? <CircularProgress size={30} sx={{color:"#fff"}} /> : "Delete"}
          </Button>
        </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConf(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDelete;
