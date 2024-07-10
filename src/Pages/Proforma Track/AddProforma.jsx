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
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Common/Header";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllVendorQuery } from "../../features/api/RestockOrderApiSlice";
import { Description, RedoRounded, Verified } from "@mui/icons-material";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useCreateProformaMutation } from "../../features/api/proformaApiSlice";
import { toast } from "react-toastify";
import { truncateFileName } from "../../commonFunctions/commonFunctions";
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
  const [form, setForm] = useState({
    CompanyName: "",
    VendorId: "",
    piNo: "",
    Description: "",
    piDate: "",
    Amount: "",
    AmountType: "USD",
    piFile: null,
    shiftCopy: null,
  });
  const [autoCompleteData, setAutoCompleteData] = useState([]);

  const [saveFormApi, { isLoading: saveFormLoading }] =
    useCreateProformaMutation();

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
  const handleFileChange = (event, fieldName) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    handleChange(selectedFile, fieldName);
  };
  /// handler

  const handleChange = (value, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleToggleChange = (event, newCurrency) => {
  //   if (newCurrency !== null) {
  //     handleChange(newCurrency, "AmountType");
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        "CompanyName",
        form.CompanyName ? form.CompanyName.CompanyName : ""
      );
      formData.append(
        "VendorId",
        form.CompanyName ? form.CompanyName.VendorId : ""
      );
      formData.append("piNo", form.piNo);
      formData.append("piDate", form.piDate);
      formData.append("Description", form.Description);
      formData.append("Amount", form.Amount);
      formData.append("AmountType", form.AmountType);
      formData.append("piFile", form.piFile);
      formData.append("shiftCopy", form.shiftCopy);

      const data = await saveFormApi(formData).unwrap();

      toast.success("Added Successfully");

      setForm({
        CompanyName: "",
        VendorId: "",
        piNo: "",
        piDate: "",
        Description: "",
        Amount: "",
        AmountType: "USD",
        piFile: null,
        shiftCopy: null,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                    borderColor: themeColor.sideBarColor1,
                  },
                },
              }}
              options={autoCompleteData}
              onChange={(e, newValue) => {
                handleChange(newValue, "CompanyName");
              }}
              getOptionLabel={(option) => option.CompanyName}
              value={form.CompanyName || null} // Ensure this line to handle the reset
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select"
                  size="small"
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
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
              PI No
            </InputLabel>
            <TextField
              placeholder=" Enter PI No"
              size="small"
              value={form?.piNo}
              onChange={(e) => {
                handleChange(e.target.value, "piNo");
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
              PI Date
            </InputLabel>
            <TextField
              value={form?.piDate}
              size="small"
              onChange={(e) => {
                handleChange(e.target.value, "piDate");
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
              Description
            </InputLabel>
            <TextField
              placeholder="Description"
              size="small"
              value={form?.Description}
              onChange={(e) => {
                handleChange(e.target.value, "Description");
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
          {/* <Box
            sx={{
              width: "100%",
              borderRadius: "4px",
            }}
          >
            <Box sx={{ marginTop: "10px", marginRight: "10px" }}>
              <ToggleButtonGroup
                value={form?.AmountType}
                exclusive
                onChange={(e) => {
                  handleChange(e.target.value, "AmountType");
                }}
                sx={{
                  width: "100px",
                  height: "30px",
                  border: "none",
                  borderRadius: "0.2rem",
                  padding: "0.2rem",
                  color: "#fff",
                  "& .Mui-selected": {
                    color: "#fff !important",
                    background: "black !important",
                  },
                }}
                aria-label="AmountType"
              >
                <ToggleButton
                  value="USD"
                  sx={{ color: "black", border: "0.5px solid black" }}
                >
                  USD
                </ToggleButton>
                <ToggleButton
                  value="RMB"
                  sx={{ color: "black", border: "0.5px solid black" }}
                >
                  RMB
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box> */}

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
              Amount
            </InputLabel>
            <Box sx={{ width: "70%", display: "flex", flexDirection: "row" }}>
              <Box sx={{ marginRight: "2px" }}>
                <ToggleButtonGroup
                  value={form?.AmountType}
                  exclusive
                  onChange={(e) => {
                    handleChange(e.target.value, "AmountType");
                  }}
                  sx={{
                    width: "100px",
                    height: "40px",
                    border: "none",
                    // borderRadius: "0.2rem",
                    // padding: "0.2rem",
                    color: "#fff",
                    "& .Mui-selected": {
                      color: "#fff !important",
                      background: "black !important",
                    },
                  }}
                  aria-label="AmountType"
                >
                  <ToggleButton
                    value="USD"
                    sx={{ color: "black", border: "0.5px solid black" }}
                  >
                    USD
                  </ToggleButton>
                  <ToggleButton
                    value="RMB"
                    sx={{ color: "black", border: "0.5px solid black" }}
                  >
                    RMB
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <TextField
                value={form?.Amount}
                size="small"
                onChange={(e) => {
                  handleChange(e.target.value, "Amount");
                }}
                type="number"
                placeholder={`Enter ${form?.AmountType || "USD"} Amount`}
                sx={{
                  backgroundColor: "white",
                  width: "100%",
                  border: "1px  black",
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: themeColor.sideBarColor1, // Set the outline color when focused
                    },
                  },
                }}
              />
            </Box>
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
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              PI File
            </InputLabel>
            <InputBase
              type="file"
              onChange={(e) => handleFileChange(e, "piFile")}
              sx={{ display: "none" }}
              inputProps={{
                accept: ".pdf, .doc, .docx, .png, .jpg, .jpeg",
                id: "pi-file-input",
              }}
            />
            <label htmlFor="pi-file-input">
              <IconButton
                component="span"
                sx={{
                  width: "16vw",
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
                <Typography sx={{ paddingLeft: "3%", color: "#00000" }}>
                  {!form.piFile
                    ? "Select File"
                    : truncateFileName(form.piFile.name, 30)}
                </Typography>
                {!form.piFile ? <AddIcon /> : ""}
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
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              Shift Copy
            </InputLabel>
            <InputBase
              type="file"
              onChange={(e) => handleFileChange(e, "shiftCopy")}
              sx={{ display: "none" }}
              inputProps={{
                accept: ".pdf, .doc, .docx, .png, .jpg, .jpeg",
                id: "shift-copy-file-input",
              }}
            />
            <label htmlFor="shift-copy-file-input">
              <IconButton
                component="span"
                sx={{
                  width: "16vw",
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
                <Typography sx={{ paddingLeft: "3%", color: "#00000" }}>
                  {!form.shiftCopy
                    ? "Select File"
                    : truncateFileName(form.shiftCopy.name, 30)}
                </Typography>
                {!form.shiftCopy ? <AddIcon /> : ""}
              </IconButton>
            </label>
          </Box>

          <Box sx={{ marginBottom: "10px" }}>
            <Button
              variant="outlined"
              disabled={saveFormLoading}
              onClick={handleSubmit}
              sx={{
                color: "white",
                background: themeColor.sideBarColor1,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              {saveFormLoading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProforma;
