import React, { useState, useEffect } from "react";
import userRolesData from "../../../constants/UserRolesItems";
import { Dialog, DialogContent, Box, Typography, Button ,  CircularProgress, } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useUserRoleUpdateMutation } from "../../../features/api/usersApiSlice";
import { useSelector } from "react-redux";
import UserRoleDailogBoxSubmenu from "./UserRoleDailogBoxSubmenu";
import { toast } from "react-toastify";
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: "300px",
  height: "400px",
  border: "2px solid gray",
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const StyledDraggableItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "lightblue",
  margin: theme.spacing(1),
  cursor: "pointer",
}));

const UserRolesDialog = ({
  open,
  setOpen,
  handleClose,
  oneUserData,
  adminId,
  refetchOneUser,
  color
}) => {
  /// local state
  const [userSubmenuData, setUserSubmenuData] = useState(userRolesData);
  const [userRights, setUserRights] = useState([]);
  const [checked , setChecked] = useState([])
const [newExisting, setNewExisting] = useState([])

  /// RTK query
  const [userRoleUpdateApi, { isLoading }] = useUserRoleUpdateMutation();
  const [submitRights, setSubmitRights] = useState(false);

  

  const { name } = useSelector((state) => state.auth.userInfo);
  /// userEffect
  useEffect(() => {
    if (oneUserData?.status === "success") {
      setUserRights(oneUserData.data.userRoles);
    }
  }, [oneUserData]);

const handleSubmit = async () => {
  const rightsMessage = newExisting
  .map((item) => `${item.name}`)
  .join(', ');

const data = {
  type: "userRole",
  body: {
    adminId: adminId,
    role: userRights,
    message: `${name} added  ${rightsMessage} rights to`,
  },
};

  try {
    const res = await userRoleUpdateApi(data);
    toast("Rights Updated");
    refetchOneUser();
    handleClose();
    setNewExisting([])
  } catch (error) {
    console.error("Error updating user role:", error);
    toast("Failed to update rights");
  }
}



  return (
    <div>
      <StyledDialog
        open={open}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(5px)" }}
        maxWidth="xl"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {`UserRights To ${oneUserData?.data?.name}`}
            </Typography>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: "pointer",
                background: color,
                color: "#fff",
                borderRadius: "5rem",
                padding: ".1rem",
                marginLeft: "auto",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              // border: '2px solid blue',
              height: "60vh",
              overflowY: "auto",
            }}
          >
            <Box sx={{ width: "100%" }}>
              {userSubmenuData.map((item, index) => {
                return (
                  <UserRoleDailogBoxSubmenu
                    key={index}
                    {...item}
                    userRights={userRights}
                    setUserRights={setUserRights}
                    refetchOneUser={refetchOneUser}
                    userRoleUpdateApi={userRoleUpdateApi}
                    loading={isLoading}
                    adminId={adminId}
                    setChecked={setChecked}
                    newExisting={newExisting}
                    checked
                    setNewExisting={setNewExisting}
                    color = {color
                    }
                  ></UserRoleDailogBoxSubmenu>
                );
              })}
            </Box>
         
          </Box>
        </DialogContent>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          margin: "10px",
        }}>
        <Button variant="contained" sx={{

        }} 
        disabled={!userRights?.length > 0}
        onClick={handleSubmit}>  {isLoading ? (
          <CircularProgress sx={{color:"#fff"}} size={30} />
        ) :"Set User Rights"}</Button>
        </Box>
      </StyledDialog>
    </div>
  );
};

export default UserRolesDialog;
