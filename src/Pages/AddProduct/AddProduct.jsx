import { React, useState ,useEffect } from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import AddProductBoxesDetails from "./component/AddProductBoxesDetails";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setHeader } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Add Brand",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addBrand_addproduct.png?updatedAt=1703133562580"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Add Brand,' you can add brands and provide a custom name",
  },
  {
    name: "Upload Excel File",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/uploadExcelFile_addproduct.png?updatedAt=1703133562583"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Upload Excel File,' you can upload an Excel file here",
  },
  {
    name: "Add Image",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/addImage_addproduct.png?updatedAt=1703133562600"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Add Image,' you can upload the product image here",
  },
  {
    name: "Download Sample",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/downloadSample_addproduct.png?updatedAt=1703133562554"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click 'Download Sample,' you can download product sample details",
  },
];

const AddRoboProducts = () => {
  /// initialize
  const navigate = useNavigate();
  const dispatch = useDispatch()
  /// global state
  const { themeColor } = useSelector((state) => state.ui);

  // infodialog state
  const description = "This is to add a product. You can add a product here";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
useEffect(()=>{
  dispatch(setHeader("Add Product"))
},[])
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Add Product"} info={true} customOnClick={handleOpen} /> */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            "&hover": {
              backgroundColor: "black",
            },
          }}
          onClick={() => {
            navigate("/bulkAddProduct");
          }}
        >
          Bulk Upload Product
        </Button>
        <Button
          sx={{
            backgroundColor: themeColor.sideBarColor1,
            "&hover": {
              backgroundColor: "black",
            },
          }}
          variant="contained"
          onClick={() => {
            navigate("/uploadimage");
          }}
        >
          Upload Image
        </Button>
      </Box>

      <AddProductBoxesDetails />
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default AddRoboProducts;
