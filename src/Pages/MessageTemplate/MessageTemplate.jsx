import { React, useEffect, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import MessageBox from "./Components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
//infoDialog box data
const infoDetail = [
  {
    name: "Register Wholesale",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717238582689"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Register Wholesale' Section You Can add Message Template for Wholesale Registration",
  },
  {
    name: "Login Wholesale",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(3).png?updatedAt=1717227575817"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Login Wholesale' Section You Can add Message Template for Wholesale Login",
  },
  {
    name: "OTP Wholesale",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(2).png?updatedAt=1717227575835"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'OTP Wholesale' Section You Can add Message Template for Wholesale OTP",
  },
];

const MessageTemplate = () => {
  // infodialog state
  const description =
    "This is Whatsapp Message Template Section";
    const dispatch = useDispatch();

    const { isInfoOpen } = useSelector((state) => state.ui);
    const handleClose = () => {
      dispatch(setInfo(false));
    };
  
    useEffect(() => {
      dispatch(setHeader(`Message Template`));
    }, []);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Message Template"}
        info={true}
        customOnClick={handleOpen}
      /> */}

      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
      <MessageBox />
    </Box>
  );
};

export default MessageTemplate;
