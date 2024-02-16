import { React, useState } from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import CompetitorTable from "./Components/CompetitorTable";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Sort By Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortBrand_productList.png?updatedAt=1703135461416"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Brand' and select a particular brand, you can view listings for that specific brand",
  },
  {
    name: "Sort By Category",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sortcategory_productList.png?updatedAt=1703135461428"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Sort by Category' and select a particular category, you can view listings for that specific product",
  },
  {
    name: "Search",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/search_productList.png?updatedAt=1703135461582"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click the search box, you can search for any product or brand here",
  },
  {
    name: "Check",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/right_productStatus.png?updatedAt=1703142361021"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If the checkbox is check like this , It  indicates that there is a value in this particular list",
  },
  {
    name: "Uncheck",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/cross_productStatus.png?updatedAt=1703142361005"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If the checkbox is unchecked like this, it indicates that there is no value in this particular list",
  },
  {
    name: "Download With Valuer",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/value_productStatus.png?updatedAt=1703142731023"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you have selected a particular list and want to download the values in Excel format, you can click this button",
  },
  {
    name: "Download With True/False",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/True-false_ProductStatus.png?updatedAt=1703142731003"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you have selected a particular list and want to download information about which items have values or are empty in Excel format, you can click this button",
  },
];
const CompetitorComparsion = () => {
  // infodialog state
  const description =
    "This is the Product Status you can check product details  ";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflow: "hidden" }}
    >
      <DrawerHeader />
      <Header
        Name={"Competitor Comparsion"}
        info={true}
        customOnClick={handleOpen}
      />
     
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
      <CompetitorTable />
    </Box>
  );
};

export default CompetitorComparsion;
