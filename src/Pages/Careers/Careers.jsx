import React, { useEffect } from "react";
import { Box, styled } from "@mui/material";
import CreateCareer from "./Components/CreateCareer";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const infoDetail = [
  {
    name: "Job Listing",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(1).png?updatedAt=1717226864725"
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
    instruction: `Job Listing: On the right side, you will see the list of current job listings.
    Delete Listing: Click the trash icon next to a listing to delete it.
    `,
  },

  {
    name: "Applicants Form",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image(2).png?updatedAt=1717226917252"
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
    instruction: `Title: Enter the job title you are hiring for.
    Skills: List the required skills for the position.
    CTC: Enter the Cost to Company (salary package) for the position.
    Experience: Specify the required years of experience.
    Position: Mention the job position.
    Education: Provide the educational qualifications needed for the role.
    Summary: Write a brief summary of the job description.
    Responsibility: List the key responsibilities associated with the job`,
  },
];
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Careers = () => {
  const description = `Career Form section! Follow these steps to create and manage career opportunities efficiently:`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Career Form`));
  }, []);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <CreateCareer />

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default Careers;
