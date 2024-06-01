import React, { useEffect } from "react";
import { Box, styled } from "@mui/material";
import CreateCareer from "./Components/CreateCareer";
import GetCareer from "./Components/GetCareer";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const infoDetail = [
  {
    name: "Folder Selection",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717225421033"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Click on the "VIEW" link in the "Resume" column to see detailed information about each entry.`,
  },

  {
    name: "View Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/savedPriceCalc_Account.png?updatedAt=1703222092787"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Click on the "VIEW" link in the "Resume" column to see resume or Download about each entry.`,
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const CareerDetails = () => {
  const description = `Career Portal! Here’s a quick guide to help you navigate and utilize the portal efficiently`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Career Applicants Details`));
  }, []);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <GetCareer />
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default CareerDetails;
