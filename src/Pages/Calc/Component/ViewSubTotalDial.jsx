import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SubtotalCalc from "./SubtotalCalc";

const ViewSubTotalDial = ({open,close,}) => {
  return (
    <div>
      {" "}
      <Dialog
        open={open}
  
      >
        <DialogTitle sx={{textAlign:"center"}}>Sub-Total</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          <SubtotalCalc/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewSubTotalDial;
