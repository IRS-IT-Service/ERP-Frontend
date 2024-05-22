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
import { AddDriveVerifyOtp } from "../../../features/slice/authSlice";

const FolderVerificationDial = ({
  open,
  setOpen,
  folderId,
  folderName,
  dispatch,
  setTrigger
}) => {
  const [otp, setOtp] = useState("");
  const [sendOtpForDelete, { isLoading: otpLoading }] =
    useSendMessageToAdminMutation();
  const adminContact = import.meta.env.VITE_ADMIN_CONTACT;



  const handleSendOtp = async () => {
    const getOtp = Math.floor(Math.random() * 9000) + 1000;
    try {
      const message = `Otp For Viewing Drive: ${getOtp}`;
      const info = { contact: adminContact, message: message };
      const sendOtpToAdmin = await sendOtpForDelete(info).unwrap();
      localStorage.setItem("folderOtp", getOtp);
      toast.success("Otp succssfull send to admin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifySelectedFolder = async () => {
    if (!folderId) return toast.error("plz select folder to delete");
    const generatedOtp = localStorage.getItem("folderOtp");
    if (+otp !== +generatedOtp)
      return toast.error("Plz put valid otp or try again");
    try {
      dispatch(AddDriveVerifyOtp(generatedOtp));
      localStorage.removeItem("folderOtp");
      setTrigger("triggered")
      setOpen(false);
    } catch (error) {
      console.log(error);
      setOtp("");
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              width: "25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography>
              Do you Really want to delete{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {folderName}{" "}
              </span>{" "}
              Folder ?
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
              onClick={() => handleVerifySelectedFolder()}
            >
              Verify
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

export default FolderVerificationDial;
