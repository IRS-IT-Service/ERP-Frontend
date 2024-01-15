import { React, useState } from "react";
import "./Home_Page.css";
import { Box, styled } from "@mui/material";
import ProductHistory from "./Components/ProductHistory";
import Content from "./Components/Content";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data 
const infoDetail = [{
  name: 'Sort By Brand', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand", 
 
},{
  name: 'Sort By Category', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product", 
 
},{
  name: 'Search', 
  screenshot: (<img
    src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
    height={"60%"}
    width={"90%"}
  />), 
  instruction: "If you click the search box, you can search for any product or brand here", 
 
},]



const Home_Page = () => {
     // infodialog state
const description = "This is the product list, where you can view all the product listings"

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
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      <Header Name={"Product List"}
      info={true}
      customOnClick={handleOpen}/>
 
      <Content />
      
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

export default Home_Page;
