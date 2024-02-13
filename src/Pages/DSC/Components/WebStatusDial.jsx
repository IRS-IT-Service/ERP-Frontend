import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const WebStatusDial = ({ open, close, data }) => {
  return (
    <Dialog open={open}>
      <DialogTitle sx={{ background: "blue", color: "white" }}>Website Status for Token No : {data?.token}</DialogTitle>
      <DialogContent>
        <Button fullWidth variant="contained">Service Book</Button>
        <Button fullWidth variant="contained">Repair or Replacement Plan</Button>
        <Button fullWidth variant="contained">Parts Ordering and Waiting</Button>
        <Button fullWidth variant="contained">Component Replacement or Repair</Button>
        <Button fullWidth variant="contained">System Testing and Calibration</Button>
        <Button fullWidth variant="contained">Final Inspection and Quality Control</Button>
        <Button fullWidth variant="contained">Ready to dispatch</Button>
        <Button fullWidth variant="contained">Delivered</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} fullWidth>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebStatusDial;
