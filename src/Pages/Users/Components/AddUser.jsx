import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useRegisterMutation } from "../../../features/api/usersApiSlice";
import { ToastContainer, toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AddUser = ({ open, setOpen, refetchAllUser }) => {
  /// global state

  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// rtk query

  const [register, { isLoading }] = useRegisterMutation();

  /// local state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    profileImage: null,
    password: "",
    contact: "",
  });

  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (formData.profileImage) {
      URL.revokeObjectURL(formData.profileImage);
    }
    setFormData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
  };

  const handleImageUploadClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    // Validate name, password, and email fields
    if (
      formData.name.trim() === "" ||
      formData.password.trim() === "" ||
      formData.email.trim() === ""
    ) {
      toast.error("Name, password, and email cannot be empty");
      return;
    }

    // Validate email domain
    const emailParts = formData.email.toLowerCase().split("@");
    if (emailParts.length !== 2) {
      toast.error("Invalid email format");
      return;
    }
    const emailDomain = emailParts[1];
    const allowedDomains = [
      "indianrobostore.com",
      "irs.org.in",
      "droneservicecenter.com",
    ];
    if (!allowedDomains.includes(emailDomain)) {
      toast.error("Invalid email domain");
      return;
    }

    // Prepare form data

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email.toLowerCase());
    data.append("department", formData.department);
    data.append("Image", formData.profileImage);
    data.append("password", formData.password);
    data.append("contact", formData.contact);

    // Make the API call
    register(data)
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        setFormData({
          name: "",
          email: "",
          department: "",
          password: "",
          profileImage: null,
          contact: "",
        });
        handleClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setFormData({
          name: "",
          email: "",
          department: "",
          password: "",
          profileImage: null,
          contact: "",
        });
        handleClose();
      })
      .finally(() => {
        refetchAllUser();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        // maxWidth='lg'
        open={open}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              flex: "1",
              textAlign: "center",
            }}
          >
            Add User
          </Typography>
          <CloseIcon
            onClick={handleClose}
            sx={{
              backgroundColor: color,
              color: "#fff",
              borderRadius: "5rem",
              fontSize: "1.6rem",
              cursor: "pointer",
              marginRight: ".5rem",
            }}
          />
        </Box>
        <DialogContent sx={{}}>
          <Box display="flex" alignItems="center" flexDirection="column" mb={2}>
            <label htmlFor="upload-button" style={{ cursor: "pointer" }}>
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Selected Profile"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginBottom: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    border: "1px dashed gray",
                    width: "200px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={handleImageUploadClick}
                >
                  <Typography variant="body1">Click to upload image</Typography>
                </div>
              )}
            </label>
            <input
              id="upload-button"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Box>
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: color, // Set the outline color when focused
                },
              },
            }}
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: color, // Set the outline color when focused
                },
              },
            }}
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: color, // Set the outline color when focused
                },
              },
            }}
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            value={formData.department}
            onChange={handleChange}
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: color, // Set the outline color when focused
                },
              },
            }}
            margin="dense"
            name="contact"
            label="ContactNo"
            type="text"
            fullWidth
            value={formData.contact}
            onChange={handleChange}
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: color, // Set the outline color when focused
                },
              },
            }}
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: color }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="outlined"
              color="primary"
              disabled={isLoading}
              sx={{
                color: "white",
                background: color,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" /> // Show loading indicator
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <ToastContainer /> {/* Add ToastContainer at the top level */}
    </div>
  );
};

export default AddUser;
