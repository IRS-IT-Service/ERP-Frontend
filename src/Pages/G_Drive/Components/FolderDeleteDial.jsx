import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { toast } from "react-toastify";
import { useDeleteFolderMutation } from "../../../features/api/driveApiSlice";

const FolderDeleteDial = ({ open, setOpen, folderId,refetchAllFolder,folderName }) => {
  const [otp, setOtp] = useState("");
  const [sendOtpForDelete, { isLoading:otpLoading }] = useSendMessageToAdminMutation();
  const adminContact = import.meta.env.VITE_ADMIN_CONTACT;

  const [
    deleteFolder,
    { isLoading: deleteFolderLoading },
  ] = useDeleteFolderMutation();

  const handleSendOtp = async () => {
    const getOtp = Math.floor(Math.random() * 9000) + 1000;
    try {
      const message = `Otp For Deleting Folder From Drive: ${getOtp}`;
      const info = { contact: adminContact, message: message };
      const sendOtpToAdmin = await sendOtpForDelete(info).unwrap();
      localStorage.setItem("folderOtp", getOtp);
      toast.success("Otp succssfull send to admin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSelectedFolder = async () => {
    if (!folderId) return toast.error("plz select folder to delete");
    const generatedOtp = localStorage.getItem("folderOtp");
    if (+otp !== +generatedOtp)
      return toast.error("Plz put valid otp or try again");
    try {
      const deleted = await deleteFolder(folderId).unwrap();
      toast.success("Folders deleted successfully");
      localStorage.removeItem("folderOtp");
      refetchAllFolder()
      setOpen(false)
    } catch (error) {
      console.log(error);
      setOtp("")
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Box sx={{
display:"flex" ,
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
              Do you Really want to delete <span style={{
                color:"red"
              }}>{folderName} </span> Folder ?
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
            placeholder="Enter otp"
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Box>
        <Box display="flex" justifyContent="space-around">
          <Button
            variant="contained"
            onClick={() => handleDeleteSelectedFolder()}
            disabled={deleteFolderLoading}
          >
            {deleteFolderLoading ? <CircularProgress size={30} sx={{color:"#fff"}} /> : "Delete"}
          </Button>
        </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderDeleteDial;
