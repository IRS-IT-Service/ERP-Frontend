import { React, useEffect } from "react";
import { Box, styled } from "@mui/material";
import OverseasOrderGrid from "./Components/OverseasOrderGrid";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

//Todo
const infoDetail = [
  {
    name: "Orders",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click to View assets so you can see All overseas orders with all the information",
  },
  {
    name: "Box",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction: "If you click to View assets Under Box so you can see All overseas Box with all the Box Details",
  },
  {
    name: "Shipments",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click to View assets Under Shipments so you can see All Overseas Shipments with all the Box Details",
  },
];

const OverseasOrder = () => {
  const description = "This is Overseas Order";
  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Overseas Orders`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Overseas Orders"}/> */}

      <OverseasOrderGrid />

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default OverseasOrder;
