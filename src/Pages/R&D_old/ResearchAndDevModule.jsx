import React from 'react'
import {
  Box,
  styled,
  Button,
  Typography,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputBase,
} from '@mui/material';
import AllInventoryData from './AllInventoryData';
import ResearchNewProject from './ResearchNewProject';

const ResearchAndDevModule = () => {
  return (
    <Box>
      
    <AllInventoryData/>
    
    <ResearchNewProject/>
    </Box>
  )
}

export default ResearchAndDevModule