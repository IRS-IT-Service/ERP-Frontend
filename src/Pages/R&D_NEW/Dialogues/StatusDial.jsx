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
import { useChangeStatusMutation } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";

const StatusDial = ({
  open,
  setStatusOpen,
  projectId,
  setProjectId,
  refetch,
}) => {
  const [updateStatus, { isLoading, refetch:updateRefetch }] = useChangeStatusMutation();
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
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusUpdate = async () => {
    try {
      const info = {
        projectId: projectId,
        status: selectedStatus,
      };
      const result = await updateStatus(info).unwrap();
      toast.success("Status updated successfully");
      setProjectId("");
      refetch()
      setStatusOpen(false);
    } catch (e) {
      console.log(e);
    }
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
        <DialogTitle sx={{ textAlign: "center" }}>Select Status For {projectId}</DialogTitle>
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
