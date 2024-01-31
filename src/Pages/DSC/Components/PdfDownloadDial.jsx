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
  Grid,
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
  const [sendFile, { isLoading }] = useSendPdfOnWhatsappDscMutation();

  // this is for download pdf file
  const handleDownloadPdf = (id) => {
    setDownloadLoading(true);
    const pdfUrl = `${BASEURL}dsc/DSCFormPDF/${data.Token}`;

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

  // this for sending the file to customer whatsapp
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
            fontWeight:"bold"
          }}
        >
          Customer Name : {data.Name}
        </span>
        <Grid
          container
          sx={{ mt: "4px" }}
          justifyContent={"center"}
          rowGap={5}
          paddingX={5}
        >
          {/* downloading pdf */}
          <Grid container sx={{border:"1px solid black"}} justifyContent={"center"} columnGap={5} alignItems={"center"} paddingY={1.2} marginTop={1}>
            <Grid item sm={6} xl={4} >
              <span>Download Pdf</span>
            </Grid>
            <Grid item sm={6} xl={3}>
              {" "}
              <Button onClick={handleDownloadPdf} disabled={downloadLoading}>
                {downloadLoading ? <CircularProgress /> : "Click here"}
              </Button>
            </Grid>
          </Grid>

          {/* send pdf directly to whatsapp */}
          <Grid container sx={{border:"1px solid black"}} justifyContent={"center"} columnGap={5} alignItems={"center"} paddingY={1}>
            <Grid item sm={6} xl={4} >
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
            </Grid>
            <Grid item sm={6} xl={3}>
              <Button onClick={handleSendFile} disabled={isLoading}>
                {isLoading ? <CircularProgress /> : "Send"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
