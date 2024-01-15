import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useCreateAssetsMutation } from "../../../features/api/assetsSlice";
import { CircularProgress } from "@mui/material";

const AddAssetsDialog = ({ open, close, refetch }) => {
  const [formData, setFormData] = useState({
    AssetsType: "",
    AssetsName: "",
    PurchasedOn: "",
    AllotedTo: "",
    SerialNo: "",
    Expiry: "",
    Duration: "",
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [productFile, setProductFile] = useState(null);

  // calling rtk query saving the data of all assets
  const [addAssets, { isLoading }] = useCreateAssetsMutation();

  // autocomplet assets options
  const assetTypes = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Machinery",
    "Drones",
  ];

  // function for changing the file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setReceiptFile(selectedFile);
  };

  const handleProductFileChange = (e) => {
    const selecteFile = e.target.files[0];
    setProductFile(selecteFile);
  };

  // fuction for changing the value of all input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // function for saving the data
  const handleSave = async () => {
    if (
      !formData.AssetsType ||
      !formData.AssetsName ||
      !formData.AllotedTo ||
      !formData.SerialNo ||
      !formData.PurchasedOn
    )
      return toast.error("Plz Enter All required field");

    try {
      const formDatas = new FormData();

      formDatas.append("type", formData.AssetsType);
      formDatas.append("name", formData.AssetsName);
      formDatas.append("expiry", formData.Duration || "");
      formDatas.append("duration", formData.Duration || "");
      formDatas.append("purchase", formData.PurchasedOn || "");
      formDatas.append("serialNo", formData.SerialNo);

      if (receiptFile) {
        formDatas.append("receiptFile", receiptFile);
      }
      if (productFile) {
        formDatas.append("productFile", productFile);
      }
      const result = await addAssets(formDatas);
      if (result?.data?.success === true) {
        toast.success("Assets Added Successfully");
        refetch();
        close();
      } else {
        toast.error("Some Error Occurs plz try again");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} maxWidth={"xl"}>
      <Box
        sx={{
          backgroundColor: "blue",
          color: "white",
          display: "flex",
          justifyContent: "center",
          width: "600px",
        }}
      >
        <DialogTitle>Add-Assets</DialogTitle>
        <Button
          sx={{
            position: "absolute",
            right: 0,
            color: "white",
            ":hover": {
              backgroundColor: "black",
            },
          }}
          onClick={close}
        >
          <CloseIcon />
        </Button>
      </Box>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "25px" }}>
            <Autocomplete
              sx={{ width: "50%" }}
              options={assetTypes}
              onChange={(event, value) =>
                handleChange({ target: { name: "AssetsType", value } })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assets Type"
                  required
                  value={formData.AssetsType}
                  name="AssetsType"
                  variant="standard"
                  onChange={handleChange}
                />
              )}
            />
            <TextField
              sx={{ width: "50%" }}
              label="Assets Name"
              required
              value={formData.AssetsName}
              onChange={handleChange}
              name="AssetsName"
              variant="standard"
              placeholder="Enter Assets Name"
            />
          </div>
          <div style={{ display: "flex", gap: "25px", marginBottom: "10px" }}>
            <TextField
              sx={{ width: "50%" }}
              label="Serial No"
              required
              value={formData.SerialNo}
              onChange={handleChange}
              name="SerialNo"
              variant="standard"
              placeholder="Enter Serial No"
            />

            <TextField
              sx={{ width: "50%" }}
              label="Purchase Date"
              required
              value={formData.PurchasedOn}
              onChange={handleChange}
              name="PurchasedOn"
              variant="standard"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <TextField
              sx={{ width: "50%" }}
              label="Alloted to"
              value={formData.AllotedTo}
              name="AllotedTo"
              required
              onChange={handleChange}
              variant="standard"
              placeholder="Alloted to"
            />
            <TextField
              sx={{ width: "50%" }}
              label="Warranty Duration"
              variant="standard"
              required
              name="Duration"
              value={formData.Duration}
              onChange={handleChange}
              placeholder="Warranty Duration"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <h4>Upload Receipt : </h4>
            <TextField
              type="file"
              variant="standard"
              onChange={handleFileChange}
              sx={{ width: "50%" }}
              placeholder="Upload Receipt"
            ></TextField>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4>Upload Product Image: </h4>
            <TextField
              type="file"
              variant="standard"
              onChange={handleProductFileChange}
              sx={{ width: "50%" }}
              placeholder="Upload Product Image"
            ></TextField>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Button onClick={handleSave} variant="contained" autoFocus disabled={isLoading}>
            {isLoading ? <CircularProgress /> : "Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetsDialog;
