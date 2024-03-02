import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

function RejectDial({ open, setDial, handleVerify ,isLoading,name}) {
  const [message, setMessage] = useState(`Hi ${name},`);
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <textarea
            rows={10}
            cols={50}
            placeholder="Write Rejection Message"
            style={{ textIndent: "10px" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
        >
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={() => handleVerify({ action: "reject", message: message })}
          >
            {isLoading ? <CircularProgress/> : "Send"}
          </Button>
          <Button variant="outlined" onClick={() => setDial(false)}>
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RejectDial;
