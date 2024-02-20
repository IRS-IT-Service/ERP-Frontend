import { Box, Button, Grid, styled, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WhastsAppDial from "./components/WhastsAppDial";
import Header from "../../components/Common/Header";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const approvalItems = [
  {
    name: "Inventory Approval",
    icon: "fa-solid fa-warehouse",
  },
  {
    name: "MRP Approval",
    icon: "fa-solid fa-dollar-sign",
  },
  {
    name: "SalesPrice Approval",
    icon: "fa-solid fa-universal-access",
  },
  {
    name: "SellerPrice Approval",
    icon: "fa-solid fa-hand-holding-dollar",
  },
  {
    name: "Cost Approval",
    icon: "fa-solid fa-check-to-slot",
  },
  {
    name: "Open Box Approval",
    icon: "fa-solid fa-box-open",
  },
  {
    name: "New Product Approval",
    icon: "fa-brands fa-product-hunt",
  },
  {
    name: "Product Changes Approval",
    icon: "fa-solid fa-fa-solid fa-arrow-right-arrow-left",
  },
  {
    name: "Whole Sale Signup",
    icon: "fa-solid fa-right-to-bracket",
  },
  {
    name: "Whole Sale Registration Form",
    icon: "fa-solid fa-address-card",
  },
  {
    name: "Whole Sale Otp",
    icon: "fa-solid fa-key",
  },
];

// infoDialog box data
const infoDetail = [
  {
    name: "Add Assets",
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
    name: "Download",
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
    name: "Receipt",
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
    name: "Product Image",
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
    name: "Delete",
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
const WhatsappEvent = () => {
  // local state
  const [openDial, setOpenDial] = useState(false);
  const [name, setName] = useState("");
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor2;

  const handleOnclickButton = (item, index) => {
    setOpenDial(!openDial);
    setName(item.item.name);
  };

  // infodialog state
  const description =
    "This is Company Assets you can add assets and download assets details";

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
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflowY: "auto",

        // border: "2px solid red",
      }}
    >
      <DrawerHeader />
      <Header Name={"WhatsApp Event"} info={true} customOnClick={handleOpen} />
      <Box sx={{ marginTop: "2rem" }}>
        <Grid
          container
          spacing={2}
          sx={{
            // border: "2px solid green",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {approvalItems.map((item, index) => (
            <Grid
              key={index}
              item
              xs={4}
              sx={{
                // marginTop: "15px",
                background: color,
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "20px",
                paddingBottom: 1,
                boxShadow:
                  "-6px -6px 14px rgba(255, 255, 255, 0.7), -6px -6px 10px rgba(255, 255, 255, 0.5), 6px 6px 8px rgba(255, 255, 255, 0.075), 6px 6px 10px rgba(0, 0, 0, 0.15)",
                borderRadius: "10px",
                "&:hover": {
                  boxShadow:
                    "inset -2px -2px 6px rgba(255, 255, 255, .7),inset -2px -2px 4px rgba(255, 255, 255, .5),inset 2px 2px 2px rgba(255, 255, 255, .075),inset 2px 2px 4px rgba(0, 0, 0, .15)",
                },
              }}
            >
              <i className={`${item.icon}`} />
              <Button
                sx={{ borderRadius: "8px" }}
                onClick={() => handleOnclickButton({ item, index })}
              >
                {item.name}
              </Button>
            </Grid>
          ))}
        </Grid>
        {/* infoDialog table */}
 
      </Box>
      {openDial && (
        <WhastsAppDial
          open={openDial}
          setOpen={setOpenDial}
          name={name}
          color={color}
        />
      )}
    </Box>
  );
};

export default WhatsappEvent;
