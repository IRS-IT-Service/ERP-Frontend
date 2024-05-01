import { React, useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import { Box, Container, styled } from "@mui/material";
import ToggleNav from "../../components/Common/Togglenav";
import LandingComponent from "./Component/LandingComponent";
import LandingPage from "../../components/Common/LandingPage";
import { useDispatch} from "react-redux";
import { setHeader} from "../../features/slice/uiSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#eee",
  display: "flex",
  gap: "5px",
  overflow: "hidden",
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Verify = () => {
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(setHeader(""));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* <LandingComponent /> */}
        <LandingPage />
        {/* <img  src="https://drive.google.com/thumbnail?id=115ktIpjSl4fBe0jR5mvlhK6OAjDf5etG&sz=w50" alt="Image from Google Drive" /> */}

      </Box>
    </Box>
  );
};

export default Verify;
