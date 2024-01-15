import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  useRegisterMutation,
  useMasterPasswordMutation,
  useUpdatePasswordMutation,
} from "../../../features/api/usersApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CategorySharp } from "@mui/icons-material";

const UpdatePasswordDialogue = ({ open, setOpen, adminId, name,departmentName,contactNo ,color}) => {
  const [password, setPassword] = useState("");
  const [names,setName] = useState("");
  const [department,setDepartment] = useState("")
  const [contact,setContact] = useState("")
  /// rtk query
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  /// local state

  const handleClose = () => {
    setOpen(false);
    setPassword("");
  };

  const handleSubmit = async () => {
    // if (!password) {
    //   return toast.error("Plz Enter Password Before Submitting");
    // }
    try {
      const data = {
        userId: adminId,
        newPassword: password,
        department :department,
        contact:contact,
        name:names
      };
      const update = await updatePassword(data);
      console.log(update);
      if (update.data?.status === true) {
        handleClose();
        setPassword("");
        toast.success("Password Updated Successfully");
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{textAlign:"center",background:color,color:"white"}}>Update Data of {name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="names"
            label="Name.."
            fullWidth
            defaultValue={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            name="Department"
            label="Department.."
            fullWidth
            defaultValue={departmentName}
            // value={department || departmentName}
            onChange={(event) => {
              setDepartment(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            name="ContactNo"
            label="ContactNo..."
            fullWidth
            defaultValue={contactNo}
            // value={contact  || contactNo}
            onChange={(event) => {
              setContact(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            fullWidth
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{background:color}}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" /> // Show loading indicator
            ) : (
              "Submit"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer /> {/* Add ToastContainer at the top level */}
    </div>
  );
};

export default UpdatePasswordDialogue;
