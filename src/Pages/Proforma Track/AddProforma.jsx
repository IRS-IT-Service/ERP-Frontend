import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  styled,
  Button,
  InputLabel,
  Autocomplete,
  InputBase,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllVendorQuery } from "../../features/api/RestockOrderApiSlice";
import { RedoRounded } from "@mui/icons-material";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AddProforma = () => {
  /// initialize

  /// global State
  const { themeColor } = useSelector((state) => state.ui);

  /// RTK query
  const { data, isLoading } = useGetAllVendorQuery();

  /// local state
  const [form, setForm] = useState(null);
  const [autoCompleteData, setAutoCompleteData] = useState([]);

  /// useEffect
  useEffect(() => {
    if (data?.status === "success") {
      const newAutoCompleteData = data.data.map((item) => {
        return { CompanyName: item.CompanyName, VendorId: item.VendorId };
      });

      setAutoCompleteData(newAutoCompleteData);
    }
  }, [data]);

  //choice file
  const handleFileChange = (event) => {
    // Handle file change here
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
  };

  /// handler

  const handleChange = (value, name) => {
    setForm((prev) => {
      if (name === "CompanyName") {
        return { ...prev, ...value };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    console.log(form);
  };

  console.log(form);

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
  
  useEffect(() => {
    dispatch(setHeader(`Add Performa`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Add Performa"} /> */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          className="formContainer"
          sx={{
            marginTop: { xs: "10px", sm: "50px" },
            width: "37%",
            minWidth: "350px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            // backgroundColor: themeColor.sideBarColor1,
            // padding: "20px",
            border: "4px solid ",
            borderColor: themeColor.sideBarColor1,
            borderRadius: "10px",
            boxShadow: 10,
          }}
        >
          <Box
            sx={{
              width: "100%",
              borderRadius: "4px",
              backgroundColor: themeColor.sideBarColor1,
              marginBottom: "10px",
            }}
          >
            <Typography
              sx={{
                color: "white",

                fontSize: "1.6rem",
                fontWeight: "bold",
              }}
            >
              Enter Details
            </Typography>
          </Box>
          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                marginTop: "12px",
                fontWeight: "bold",
              }}
            >
              Select Vendor
            </InputLabel>
            <Autocomplete
              sx={{
                width: { xs: "100%", md: "70%" },
                backgroundColor: "rgba(255, 255, 255)",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
              options={autoCompleteData}
              onChange={(e, newValue) => {
                handleChange(newValue, "CompanyName");
              }}
              getOptionLabel={(option) => option.CompanyName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select"
                  value={form?.CompanyName || ""}
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                  size="small"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              Performa No
            </InputLabel>
            <TextField
              placeholder=" Enter Performa No"
              value={form?.performaNo || ""}
              onChange={(e) => {
                handleChange(e.target.value, "performaNo");
              }}
              sx={{
                backgroundColor: "white",
                width: { xs: "100%", md: "70%" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              performa Date
            </InputLabel>
            <TextField
              value={form?.performaDate || ""}
              onChange={(e) => {
                handleChange(e.target.value, "performaDate");
              }}
              sx={{
                backgroundColor: "white",
                width: { xs: "100%", md: "70%" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
              type="date"
            />
          </Box>

          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              USD Amount $
            </InputLabel>
            <TextField
              value={form?.usdAmount || ""}
              onChange={(e) => {
                handleChange(e.target.value, "usdAmount");
              }}
              type="number"
              placeholder=" Enter USD amount"
              sx={{
                backgroundColor: "white",
                width: { xs: "100%", md: "70%" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
            />
          </Box>
          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              Performa File
            </InputLabel>
            {/* <TextField
              onChange={(e) => {
                handleChange(e.target.files[0], "performaFile");
              }}
              type="file"
              placeholder=" Enter Proforma No"
              sx={{
                backgroundColor: "white",
                width: { xs: "100%", md: "70%" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
            /> */}
            <InputBase
              type="file"
              onChange={(e) => {
                handleChange(e.target.files[0], "performaFile");
              }}
              sx={{
                display: "none",
              }}
              inputProps={{
                onChange: handleFileChange,

                accept: ".pdf, .doc, .docx", // Specify allowed file types
                id: "file-input", // Add a unique ID for the label to reference
              }}
            />
            <label htmlFor="file-input">
              <IconButton
                component="span"
                sx={{
                  width: "15vw",
                  height: "6vh",
                  margin: "1% 0px",
                  border: "solid 3px #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 15px 0 rgba(0, 0, 0, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(60px)",
                  paddingLeft: "0%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ paddingLeft: "3%", color: "#f9f8fc" }}>
                  Upload File 1
                </Typography>
                <AddIcon />
              </IconButton>
            </label>
          </Box>
          <Box
            sx={{
              color: "white",
              display: "flex",
              width: "90%",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "" },
              marginBottom: "10px",
            }}
          >
            <InputLabel
              sx={{
                width: "30%",
                minWidth: "115px",
                alignContent: "center",
                // color: "white",
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              Other File
            </InputLabel>
            <TextField
              onChange={(e) => {
                handleChange(e.target.files[0], "otherFile");
              }}
              type="file"
              placeholder=" Enter Proforma No"
              sx={{
                backgroundColor: "white",
                width: { xs: "100%", md: "70%" },
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ marginBottom: "10px" }}>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              sx={{
                color: "white",
                background: themeColor.sideBarColor1,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProforma;
