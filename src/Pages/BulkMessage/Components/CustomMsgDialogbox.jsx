import React, { useState } from "react";
import {
  styled,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { useSendBulkMessagesWithPicMutation } from "../../../features/api/whatsAppApiSlice";
const CustomMsgDialogbox = ({
  msgDialogbox,
  handleCloseMsgDialogbox,
  sendingType,
  title,
  customerNumber,
  setCustomerNumber,
}) => {
  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();

  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileUploaded(true);
    setFile(file);
  };

  //File upload
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleSend = async () => {
    try {
      if (!file || !message) {
        return toast.error("Please provide both field");
      }
      const formdata = new FormData();
      formdata.append("message", message);
      formdata.append("file", file);
      formdata.append("contacts", JSON.stringify(customerNumber));
      const res = await sendMsg(formdata).unwrap();
      toast("Successfully Send message");
      handleCloseMsgDialogbox();
      setMessage();
      setFile(null);
      setC;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box>
      <Dialog open={msgDialogbox} onClose={handleCloseMsgDialogbox}>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {sendingType === "Link" && (
                <TextField
                  label=" Link"
                  variant="outlined"
                  sx={{ width: "100%", marginTop: "12px", width: "30vw" }}
                  name="Link"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
              )}
              {sendingType === "Text" && (
                <textarea
                  style={{
                    width: "30vw",
                    height: "20vh",
                    resize: "none",
                    paddingTop: 5,
                    textIndent: "20px",
                  }}
                  value={message}
                  // minRows={8}
                  placeholder="Enter your message"
                  aria-label="maximum height"
                  onChange={(e) => setMessage(e.target.value)}
                />
              )}
              {sendingType === "File" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <textarea
                    style={{
                      width: "30vw",
                      height: "20vh",
                      resize: "none",
                      paddingTop: 5,
                      textIndent: "20px",
                    }}
                    value={message}
                    // minRows={8}
                    placeholder="Enter your message"
                    aria-label="maximum height"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button
                    component="label"
                    sx={{ width: "50%" }}
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={{
                      backgroundColor: fileUploaded ? "green" : undefined,
                    }}
                  >
                    {fileUploaded ? "File Uploaded" : "Upload File"}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
              )}
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  disabled={sendMsgLoading}
                  onClick={handleSend}
                  sx={{ margin: "4px", width: "50%" }}
                >
                  {sendMsgLoading ? <CircularProgress size={30} /> : "Send"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseMsgDialogbox}
                  sx={{ margin: "4px", width: "50%" }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomMsgDialogbox;
