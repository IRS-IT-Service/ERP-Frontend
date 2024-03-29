import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

const StatusDial = ({ open, setStatusOpen, projectId, setProjectId }) => {
  const [selectOptions, setSelectOptions] = useState([
    {
      value: "Started",
      label: "Started",
    },
    {
      value: "Processing",
      label: "Processing",
    },
    {
      value: "Closed",
      label: "Closed",
    },
  ]);
  const [selectedStatus, setSelectedStatus] = useState("Started");

  const handleStatusUpdate = () => {
    const info = {
      id: projectId,
      status: selectedStatus,
    };
    console.log(selectedStatus);
    setStatusOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setStatusOpen(false);
          setSelectedStatus("");
          setProjectId("");
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Select Status</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            defaultValue="EUR"
            helperText="Please select to change the status of your project"
            sx={{
              margin: "5px",
            }}
          >
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setStatusOpen(false);
              setSelectedStatus("");
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleStatusUpdate();
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StatusDial;
