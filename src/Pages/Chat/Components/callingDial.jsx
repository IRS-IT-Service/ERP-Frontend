import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import noImage from "../../../assets/NoImage.jpg";
import CloseIcon from "@mui/icons-material/Close";

const CallingDial = ({
  open,
  setOpen,
  name,
  handleAcceptCall,
  handleRejectCall,
  incomingCallData,
  remoteStream,
}) => {
    

  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{
          borderBottom: "1px solid black",
          background: "grey",
          position: "relative",
        }}
      >
        <span>IRS Calling</span>{" "}
        <div
          style={{ position: "absolute", top: 2, right: 1, cursor: "pointer" }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </div>
      </DialogTitle>
      <DialogContent sx={{}}>
        <Box
          sx={{
            height: "200px",
            width: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={noImage}
              style={{
                height: "70px",
                width: "70px",
                borderRadius: "35px",
                border: "1px solid red",
              }}
            ></img>
            <span style={{ fontWeight: "bold" }}>{name}</span>
          </div>
          

          <span>calling</span>
          <div style={{ marginTop: "10px", display: "flex", gap: "15px" }}>
            {incomingCallData && (
              <Button
                sx={{ color: "green" }}
                onClick={() => handleAcceptCall()}
              >
                Accept
              </Button>
            )}

            <Button sx={{ color: "red" }} onClick={() => handleRejectCall()}>
              Reject
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CallingDial;
