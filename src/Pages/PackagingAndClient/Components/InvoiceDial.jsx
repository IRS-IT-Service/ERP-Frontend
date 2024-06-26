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
import { useUpdateInvoiceMutation } from "../../../features/api/clientAndShipmentApiSlice";
import { toast } from "react-toastify";

const InvoiceDial = ({ open, setOpen, details, refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileType = details?.invoice?.url?.split(".").pop();
  const invoice = details?.invoice;
  const orderId = details?.OrderId;

  const [updateInvoice, { isLoading: updateInvoiceLoading }] =
    useUpdateInvoiceMutation();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !orderId) {
      alert("Please select a invoice and Shipment Id");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("id", orderId);
    try {
      const result = await updateInvoice(formData);
      toast.success("Invoice Update Successfully");
      setSelectedFile(null);
      refetch()
      setOpen(false);
    } catch (error) {
      console.log(error.message);
    }
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {invoice ? (
              <Box
                sx={{
                  width: "400px",
                  height: "500px",
                  objectFit: "cover",
                  overflow: "hidden",
                }}
              >
                {fileType === "pdf" ? (
                  <iframe
                    style={{ width: "100%", height: "100%" }}
                    src={invoice.url}
                  />
                ) : (
                  <img src={invoice.url} style={{ width: "100%", height: "100%" ,objectFit:"cover" ,objectPosition:"center" }} alt="Invoice" />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginBottom: "10px" }}
                />
                {selectedFile && (
                  <Box sx={{ marginBottom: "10px" }}>
                    <strong>Selected File:</strong> {selectedFile.name}
                  </Box>
                )}
                <Button onClick={handleUpload} disabled={updateInvoiceLoading}>
                  {updateInvoiceLoading ? <CircularProgress /> : "Upload"}
                </Button>
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
