import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

import { toast } from "react-toastify";

const ViewImageDialog = ({open,setOpen,image}) => {
 let url = null

    const getFileExtension = (url) => {
        const urlObject = new URL(url);
        const pathname = urlObject.pathname;
       const lastPeriodIndex = pathname.lastIndexOf('.');
        if (lastPeriodIndex !== -1) {
          return pathname.substring(lastPeriodIndex + 1);
        } else {
          return '';
        }
      };
    url = (getFileExtension(image))
 
     
  return (
    <Box>
    <Dialog open={open} maxWidth={"xl"}>
      <DialogTitle
        sx={{ textAlign: "center", background: "blue", color: "white" }}
      >
    View Box Image
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
        
            <Box
              sx={{
                width: "400px",
                height: "500px",
                objectFit: "cover",
                overflow: "hidden",
              }}
            >
              {url === "pdf" ? (
                <iframe
                  style={{ width: "100%", height: "100%" }}
                  src={image}
                />
              ) : (
                <img src={image} style={{ width: "100%", height: "100%" ,objectFit:"cover" }} alt="Invoice" />
              )}
            </Box>
          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </Box>
  )
}

export default ViewImageDialog