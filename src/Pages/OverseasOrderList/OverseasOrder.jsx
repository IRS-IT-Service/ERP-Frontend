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
    name: "Inventory Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addassets_companyassets.png?updatedAt=1703058228325"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click to add assets so you can add product with all the information for that If you click to add assets, you can easily input all the necessary information for the product, streamlining the process of adding a new asset to your inventory",
  },
  {
    name: "MRP Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadCode_CompanyAssets.png?updatedAt=1703226924367"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction: "If you click 'Download Code,' you can download an Excel file",
  },
  {
    name: "SalesPrice Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/receipt_companyassets.png?updatedAt=1703058228260"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the receipt logo, you can effortlessly view the product receipt in PDF format and download it for your convenience",
  },
  {
    name: "SellerPrice Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/product-image_Companyassets.png?updatedAt=1703058228441"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click on the product-image logo, you can view the product PDF and download it for your convenience",
  },
  {
    name: "Cost Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "OpenBox Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "New Product Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "Product Changes Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale SignUp",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale Registration Form",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
  },
  {
    name: "WholeSale OTP",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/delete_CompanyAssets.png?updatedAt=1703226924568"
        height={"40%"}
        width={"40%"}
      />
    ),
    instruction:
      "If you click 'Delete Logo,' you can delete that particular list",
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
