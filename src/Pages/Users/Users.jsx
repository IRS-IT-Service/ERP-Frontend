import { React, useEffect, useState } from "react";
import {
  Box,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserList from "./Components/UsersList";
import AddUser from "./Components/AddUser";
import { useGetAllUsersQuery } from "../../features/api/usersApiSlice";
import MasterPassword from "./Components/MasterPasswordDialog";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data
const infoDetail = [
  {
    name: "Admin",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_admin%20png.png?updatedAt=1703055106565"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If the toggle is on, it means the user has admin rights otherwise, they don't have rights",
  },
  {
    name: "Active",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_active%20png.png?updatedAt=1703055106280"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If the toggle is on, the user is considered active and can log in to the portal at any time else user can't",
  },
  {
    name: "User Rights",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_userRight%20png.png?updatedAt=1703055106422"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction: "You can grant the user custom rights to access the portal",
  },
  {
    name: "Product Columns ",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_productcol.png?updatedAt=1703055106299"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      " You can allocate specific content rights for product columns to individual users",
  },
  {
    name: "Action",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_action%20png.png?updatedAt=1703055106411"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction: "You can delete the user",
  },
  {
    name: "OTP",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_otp%20png.png?updatedAt=1703055106561"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "The admin  has the authority to view the OTP, and when a new user attempts to log in, they will require an OTP, which only the admin  can provide",
  },
  {
    name: "Password Update",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_passwordUpdate%20png.png?updatedAt=1703055106503"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction: "Admin can update the password",
  },
];
const Users = () => {
  const [open, setOpen] = useState(false);
  const [openMaster, setOpenMaster] = useState(false);
  //Global state
  // const { themeColor } = useSelector((state) => state.ui);
  

  /// rtk query
  const {
    refetch: refetchAllUser,
    data: AllUserData,
    isFetching,
  } = useGetAllUsersQuery();



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenMaster = () => {
    setOpenMaster(true);
  };


  // infodialog state
  const description =
    "This is User Section helps manage user control, allowing the admin to grant or revoke access as needed";


  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
  
  useEffect(() => {
    dispatch(setHeader("Users Section"));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Users Section"} info={true} customOnClick={handleOpen} /> */}
      <UserList
        isFetching={isFetching}
        refetchAllUser={refetchAllUser}
        AllUserData={AllUserData}
        handleAddUserOpen={handleClickOpen}
      />
      <AddUser open={open} setOpen={setOpen} refetchAllUser={refetchAllUser} />
      <MasterPassword open={openMaster} setOpen={setOpenMaster} />
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default Users;
