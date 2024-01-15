import {React,useState} from "react";
import { Box, styled } from "@mui/material";
import SellerVerificationList from "./Component/SellerVerificationList";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
// infoDialog box data 
const infoDetail = [{
  name: 'Action', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click View you can access the seller's personal information", 
 
},]
const SellerVerification = () => {
  // infodialog state
const description = "This is a wholesale request; you can view all the wholesaler requests"

const [infoOpen, setInfoOpen] = useState(false);
const handleClose = () => {
  setInfoOpen(!infoOpen);
};
const handleOpen = ()=>{
 setInfoOpen(true);
}
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Header Name={"WholeSale Requests"}  info={true}
        customOnClick={handleOpen}/>
 
      <SellerVerificationList />
        {/* infoDialog table */}
        <InfoDialogBox
       infoDetails={infoDetail}
       description={description}
        open={infoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default SellerVerification;
