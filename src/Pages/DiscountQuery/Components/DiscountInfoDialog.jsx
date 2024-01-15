import React, { useState, useEffect } from 'react';
import userRolesData from '../../../constants/UserRolesItems';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  styled,
  LinearProgress,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';

const DiscountInfoDialogue = ({ open, handleClose }) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle></DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DiscountInfoDialogue;
