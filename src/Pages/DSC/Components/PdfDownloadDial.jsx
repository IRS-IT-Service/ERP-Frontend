import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { formateDateAndTime } from "../../../commonFunctions/commonFunctions";
import BASEURL from "../../../constants/BaseApi";
import axios from "axios";
import { useSendPdfOnWhatsappDscMutation } from "../../../features/api/whatsAppApiSlice";
import { toast } from "react-toastify";

const PdfDownloadDial = ({ open, close, data }) => {
  /// initialization
  const [contact, setContact] = useState(data.Contact || "");
  const [downloadLoading, setDownloadLoading] = useState(false);

  // rtk query calling
  const [sendFile, isLoading] = useSendPdfOnWhatsappDscMutation();

  const handleDownloadPdf = (id) => {
    setDownloadLoading(true);
    const pdfUrl = `${BASEURL}/dsc/DSCFormPDF/${data.Token}`;

    axios({
      url: pdfUrl,
      method: "GET",
      responseType: "blob", // important
    })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Repair_${data.Token}.pdf`; // specify the filename
        link.click();
        setDownloadLoading(false);
        close();
      })
      .catch((error) => {
        setDownloadLoading(false);
        console.error("Error downloading PDF:", error);
        // Handle the error as needed
      });
  };
  const handleSendFile = async () => {
    try {
      const info = {
        token: data.Token,
        contact: contact,
      };
      const result = await sendFile(info);

      toast.success("Pdf successfully send to whatsapp");
      close();
    } catch (error) {
      console.log("serverError", error);
    }
  };
  /// RTK query
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle
        sx={{
          textAlign: "center",
          backgroundColor: "#040678",
          color: "#fff",
        }}
      >
        PDF Downlaod For Token No: {data.Token}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "0px",
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5px",
          }}
        >
          Customer Name : {data.Name}
        </span>
        <div style={{ marginTop: "10px", padding: "10px" }}>
          {/* downloading pdf */}
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              display: "flex",
              justifyContent: "space-evenly",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <span>Download Pdf</span>
            <Button onClick={handleDownloadPdf}>Click here</Button>
          </div>
          {/* send pdf directly to whatsapp */}
          <div
            style={{
              border: "1px solid black",
              padding: "10px",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <TextField
              id="standard-basic"
              label="Send On WhatsApp No"
              variant="standard"
              defaultValue={contact}
              onChange={(e) => setContact(e.target.value)}
              inputProps={{
                style: { textIndent: "10px" },
              }}
            ></TextField>
            <Button onClick={handleSendFile}>Click here</Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PdfDownloadDial;
