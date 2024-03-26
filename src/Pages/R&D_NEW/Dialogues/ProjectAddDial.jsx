import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  InputLabel,
  CircularProgress,
} from "@mui/material";

import { useAddProjectNameMutation } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";

const ProjectAddDial = ({ open, close, refetch }) => {
  const [addProject, { isLoading, refetch: addRefetch }] =
    useAddProjectNameMutation();

  const [projectValue, setProjectValue] = useState({
    projectName: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await addProject(projectValue).unwrap();
      toast.success(`Project Added successfully`);
      setProjectValue({
        projectName: "",
        description: "",
      });
      close();
      refetch();
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <Dialog maxWidth="xl" open={open} onClose={close}>
      <DialogTitle
        sx={{
          minWidth: "50vw",
          minHeight: "5vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "skyblue",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add New Project</Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          width: "auto",
          minHeight: " 10vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box>
          <InputLabel htmlFor="projectName">Project Name</InputLabel>
          <InputBase
            id="projectName"
            sx={{
              width: "250px",
              height: "40px",
              border: "2px solid grey",
              borderRadius: "5px",
              paddingX: "5px",
            }}
            name="projectName"
            value={projectValue.ProjectName}
            onChange={(e) => {
              setProjectValue({ ...projectValue, projectName: e.target.value });
            }}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="projectDescription">
            Project Description
          </InputLabel>
          <InputBase
            id="projectDescription"
            sx={{
              width: "600px",
              height: "40px",
              border: "2px solid grey",
              borderRadius: "5px",
              paddingX: "5px",
            }}
            name="description"
            value={projectValue.ProjectDisc}
            onChange={(e) => {
              setProjectValue({ ...projectValue, description: e.target.value });
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={30} />
          ) : (
            "Submit"
          )}
        </Button>
        <Button variant="contained" onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectAddDial;
