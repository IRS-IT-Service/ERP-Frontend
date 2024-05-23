import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const InvoiceDial = ({ open, setOpen, details }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileType = details?.invoice?.url?.split(".").pop();
  const invoice = details?.invoice;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log("File uploaded:", selectedFile);
  };

  return (
    <Box>
      <Dialog open={open} maxWidth={"xl"}>
        <DialogTitle
          sx={{ textAlign: "start", background: "blue", color: "white" }}
        >
          {details?.invoice ? "Viewing" : "Uploading"} Invoice of{" "}
          {details.CustomerName} and ShippingId : {details.OrderId}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {invoice ? (
              <Box sx={{ width: "400px", height: "500px", objectFit: "cover", overflow: "hidden" }}>
                {fileType === "pdf" ? (
                  <iframe style={{ width: "100%", height: "100%" }} src={invoice.url} />
                ) : (
                  <img src={invoice.url} alt="Invoice" />
                )}
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
                {selectedFile && (
                  <Box sx={{ marginBottom: "10px" }}>
                    <strong>Selected File:</strong> {selectedFile.name}
                  </Box>
                )}
                <Button onClick={handleUpload}>Upload</Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceDial;
