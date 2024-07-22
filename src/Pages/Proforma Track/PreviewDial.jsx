import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const PreviewDial = ({ open, setOpen, details, refetch }) => {
  console.log("details", details);
  const fileType = details?.file?.split(".").pop();
  const file = details?.file;
  const piId = details?.piId;

  return (
    <Box>
      <Dialog open={open} maxWidth={"xl"}>
        <DialogTitle
          sx={{ textAlign: "start", background: "blue", color: "white" }}
        >
          {`Viewing Pi Details of
          ${details.CompanyName} and Pi Id : ${piId}`}
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
              {fileType === "pdf" ? (
                <iframe style={{ width: "100%", height: "100%" }} src={file} />
              ) : (
                <img
                  src={file}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  alt="Invoice"
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PreviewDial;
