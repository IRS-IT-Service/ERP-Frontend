import {React,useState} from "react";
import { Box, styled } from "@mui/material";
import OrderList from "./OrderComponents/OrderList";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data 
const infoDetail = [{
  name: 'Details', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/details_wholesale%20order.png?updatedAt=1703064824324"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click on Details you can view all the wholesale order details", 
 
},]


const Order = () => {
   // infodialog state
const description = "This is a WholeSale Order you can view all sales data"

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
      <Header Name={"WholeSale Orders"}  info={true}
        customOnClick={handleOpen}/>
  
      <OrderList />
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

export default Order;
