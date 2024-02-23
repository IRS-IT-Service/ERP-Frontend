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
import { useSendBulkMessagesWithPicMutation } from "../../../features/api/whatsAppApiSlice";
const CustomMsgDialogbox = ({
  msgDialogbox,
  handleCloseMsgDialogbox,
  sendingType,
  title,
}) => {
  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();

  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

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

  // const handleSend = async () => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("contacts", JSON.stringify(customerNumber)),
  //       formData.append("message", message),
  //       formData.append("file", file);

  //     const res = await sendMsg(formData).unwrap();
  //     if (!res.status) {
  //       return;
  //     }
  //     toast.success("Message successfully send!");
  //     setFileUploaded(false);
  //     setFile("");
  //     setMessage("");
  //     refetch();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
                <Button variant="outlined" sx={{ margin: "4px", width: "50%" }}>
                  send
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
