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

const InfoDialogue = ({ open, handleClose }) => {
  return (
    <div>
      <Dialog></Dialog>
    </div>
  );
};

export default InfoDialogue;
