import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "../../commonFunctions/commonFunctions";
import {
  useGetSingleAdminQuery,
  useUpdateProfileMutation,
  useUserUpdateWholeMutation,
} from "../../features/api/usersApiSlice";
import { toast } from "react-toastify";
import { CloudUpload, Edit } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { ref } from "firebase/storage";

// UserProfile component
const SellerProfile = () => {
  const { adminId } = useSelector((state) => state.auth.userInfo);
  const [updateUser, { isLoading }] = useUserUpdateWholeMutation();
  const {
    data: getSingleAdmin,
    isLoading: adminLoading,
    refetch,
  } = useGetSingleAdminQuery(adminId);
  const [updateProfile, { isLoading: loadingProfile }] =
    useUpdateProfileMutation();
  const [isHover, setIsHover] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    ContactNo: "",
  });

  const { name, email, createdAt, ContactNo, profileImage } =
    getSingleAdmin?.user || {};

  useEffect(() => {
    if (getSingleAdmin?.user) {
      setUserDetails({
        name: name,
        email: email,
        ContactNo: ContactNo,
      });
    }
  }, [getSingleAdmin, getSingleAdmin?.user]);

  // Format date
  const formattedDate = formatDate(createdAt);

  // Handle changePassword route

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedFields = {};
      Object.keys(userDetails).forEach((key) => {
        if (userDetails[key] !== getSingleAdmin.user[key]) {
          updatedFields[key] = userDetails[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        console.log("No fields updated.");
        return;
      }

      const updatedUser = {
        adminId: adminId,
        ...updatedFields,
      };

      await updateUser(updatedUser).unwrap();
      refetch();
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    try {
      const formdata = new FormData();
      formdata.append("id", adminId), formdata.append("Image", file);
      const upload = await updateProfile(formdata).unwrap();
      refetch();
      setIsHover(false);
      setIsEditingImage(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditImageClick = () => {
    setIsEditingImage(true);
  };

  const handleCancelImageEdit = () => {
    setIsEditingImage(false);
    setIsHover(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "92vh",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {/* Paper Boxes */}
      <Grid
        container
        spacing={1}
        sx={{
          height: "100%",
        }}
      >
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              height: "calc(91vh - 47vh)",
              padding: "10px",
              backgroundColor: "#eee",
            }}
            elevation={12}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "Helvetica, sans-serif",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "24px",
              }}
            >
              Personal Information
            </Typography>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                alignItems: "center",
                gap: "50%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label>Email</label>
                  <input
                    style={{
                      padding: "8px",
                      width: "200%",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    value={userDetails.email}
                    onChange={(e) => handleChange(e)}
                    placeholder="saket@irs.org.in"
                    name="email"
                  ></input>
                </div>

                <div
                  style={{
                    padding: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label>Phone</label>
                  <input
                    style={{
                      padding: "8px",
                      width: "200%",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    placeholder="1234567890"
                    value={userDetails.ContactNo}
                    onChange={(e) => handleChange(e)}
                    name="ContactNo"
                  ></input>
                </div>

                <div
                  style={{
                    padding: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label>Password</label>
                  <input
                    style={{
                      padding: "8px",
                      width: "200%",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    type="password"
                    placeholder="***********"
                    onChange={(e) => handleChange(e)}
                    value={userDetails.password}
                    name="password"
                  ></input>
                </div>
                <Button onClick={() => handleUpdate()}>Update</Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  <Avatar
                    sx={{ width: 130, height: 130, mb: 2 }}
                    src={profileImage?.url}
                    alt={name || "User"}
                    onClick={handleEditImageClick}
                    style={{ cursor: "pointer" }}
                  >
                    {!profileImage && (
                      <AccountCircleIcon sx={{ fontSize: 130 }} />
                    )}
                  </Avatar>
                  {isHover && !isEditingImage && (
                    <Button
                      // variant="contained"
                      // color="primary"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      onClick={handleEditImageClick}
                    >
                      <Edit />{" "}
                    </Button>
                  )}
                  {isEditingImage && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        id="profile-image-input"
                      />
                      <label htmlFor="profile-image-input">
                        <Button
                          component="span"
                          sx={{ mr: 1 }}
                          disabled={loadingProfile}
                        >
                          {loadingProfile ? (
                            <CircularProgress size={10} />
                          ) : (
                            <CloudUpload />
                          )}
                        </Button>
                      </label>
                      <Button
                        disabled={loadingProfile}
                        onClick={handleCancelImageEdit}
                      >
                        <CancelIcon />{" "}
                      </Button>
                    </Box>
                  )}
                </div>

                <span style={{ fontSize: "13px", marginTop: "8px" }}>
                  {formattedDate}
                </span>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "22px", fontFamily: "monospace" }}
                >
                  {name}
                </Typography>
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "calc(91vh - 47vh)",
              backgroundColor: "#eee",
            }}
            elevation={12}
          >
            <Typography>User Roles and Responsibility</Typography>
            <span>Coming Soon</span>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "calc(91vh - 47vh)",
              backgroundColor: "#eee",
            }}
            elevation={12}
          >
            <Typography>User Everyday Work</Typography>
            <span>Coming soon</span>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "calc(91vh - 47vh)",
              backgroundColor: "#eee",
            }}
            elevation={12}
          >
            <Typography>More Content</Typography>
            <span>Coming soon</span>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SellerProfile;
