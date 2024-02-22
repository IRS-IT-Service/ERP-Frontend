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

const CustomMsgDialogbox = ({
  msgDialogbox,
  handleCloseMsgDialogbox,
  sendingType,
}) => {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const handleSend = () => {
    // Add your logic here for handling the "Add" button click
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
          <Typography sx={{ fontWeight: "bold" }}>Add Customer</Typography>
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
                  sx={{ width: "100%", marginTop: "12px" }}
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
                    width: "100%",
                    height: "200px",

                    resize: "none",
                    paddingTop: 5,
                    textIndent: "20px",
                  }}
                  value={message}
                  minRows={8}
                  placeholder="Enter your message"
                  aria-label="maximum height"
                  onChange={(e) => setMessage(e.target.value)}
                />
              )}

              <Button variant="outlined" onClick={handleSend}>
                Send
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseMsgDialogbox}
                sx={{ fontWeight: "bold" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomMsgDialogbox;
