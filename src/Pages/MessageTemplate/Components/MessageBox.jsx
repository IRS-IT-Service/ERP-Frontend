import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MessageDialogBox from "./MessageDialogBox";

const MessageBox = () => {
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const [dialopen, setDialopen] = useState(false);
  const [title, setTitle] = useState("");

  const handleClickOpen = (name) => {
    setTitle(name);
    setDialopen(true);
  };

  const handleClose = () => {
    setDialopen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        padding: "12px",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          padding: "12px",
          backgroundColor: "#e0f2fe",
          borderRadius: "0.5rem",
          cursor: "pointer",
          textAlign: "center",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: color,
            color: "white",
          },
        }}
        onClick={() => handleClickOpen("Register Wholesale")}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>
          <i className="fa-brands fa-whatsapp"></i>
        </Typography>
        <Typography sx={{ fontSize: "0.9rem" }}> Register Wholesale</Typography>
      </Box>
      <Box
        sx={{
          padding: "12px",
          backgroundColor: "#e0f2fe",
          borderRadius: "0.5rem",
          cursor: "pointer",
          textAlign: "center",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: color,
            color: "white",
          },
        }}
        onClick={() => handleClickOpen("Login Wholesale")}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>
          <i className="fa-brands fa-whatsapp"></i>
        </Typography>
        <Typography sx={{ fontSize: "0.9rem" }}> Login Wholesale</Typography>
      </Box>
      <Box
        sx={{
          padding: "12px",
          backgroundColor: "#e0f2fe",
          borderRadius: "0.5rem",
          textAlign: "center",
          cursor: "pointer",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: color,
            color: "white",
          },
        }}
        onClick={() => handleClickOpen("OTP Wholesale")}
      >
        <Typography sx={{ fontSize: "1.5rem" }}>
          <i className="fa-brands fa-whatsapp"></i>
        </Typography>
        <Typography sx={{ fontSize: "0.9rem" }}>OTP Wholesale</Typography>
      </Box>
      {dialopen && (
        <MessageDialogBox
          open={dialopen}
          handleClose={handleClose}
          title={title}
        />
      )}
    </Box>
  );
};

export default MessageBox;
