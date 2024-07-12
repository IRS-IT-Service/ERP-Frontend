import React, { useState, useEffect } from "react";
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
import {
  useCreateAssetsMutation,
} from "../../../features/api/assetsSlice";
import { CircularProgress } from "@mui/material";
import { formatDate, formateDateAndTime, formatsDate } from "../../../commonFunctions/commonFunctions";

const AddAssetsDialog = ({ open, close, data, refetch }) => {
  const [formData, setFormData] = useState({
    id: "",
    AssetsType: "",
    AssetsName: "",
    SerialNo: "",
    PurchasedOn: "",
    AllotedTo: "",
    Expiry: "",
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [productFile, setProductFile] = useState(null);

  const [addAssets, { isLoading: isAdding }] = useCreateAssetsMutation();

  console.log(data);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id || "",
        AssetsType: data.AssetsType || "",
        AssetsName: data.AssetsName || "",
        SerialNo: data.SerialNo || "",
        PurchasedOn: data.PurchaseDate || "",
        AllotedTo: data.AllotedTo || "",
        Expiry: data.Expiry || "",
      });
      setReceiptFile(data.Receipt ? data.Receipt.url : null);
      setProductFile(data.Product ? data.Product.url : null);
    }
  }, [data]);

  const assetTypes = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Machinery",
    "Drones",
    "Entertainment",
    "Others",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setReceiptFile(selectedFile);
  };

  const handleProductFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setProductFile(selectedFile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (
      !formData.AssetsType ||
      !formData.AssetsName ||
      !formData.PurchasedOn ||
      !formData.SerialNo ||
      !formData.AllotedTo
    )
      return toast.error("Please enter all required fields");

    try {
      const formDatas = new FormData();
      formDatas.append("id", formData.id);
      formDatas.append("assetsType", formData.AssetsType);
      formDatas.append("assetsName", formData.AssetsName);
      formDatas.append("purchase", formData.PurchasedOn || "");
      formDatas.append("serialNo", formData.SerialNo);
      formDatas.append("allotedTo", formData.AllotedTo);
      formDatas.append("expiry", formData.Expiry || "");

      if (receiptFile && typeof receiptFile !== "string") {
        formDatas.append("receiptFile", receiptFile);
      }
      if (productFile && typeof productFile !== "string") {
        formDatas.append("productFile", productFile);
      }

      const result = await addAssets(formDatas);

      if (result?.data?.success) {
        toast.success(`Assets added successfully`);
        refetch();
        close();
      } else {
        toast.error("Some error occurred, please try again");
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
        <DialogTitle>Add Assets</DialogTitle>
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
        <Box sx={{ width: "100%" }}>
          <div style={{ display: "flex", gap: "25px" }}>
            <Autocomplete
              sx={{ width: "50%" }}
              options={assetTypes}
              onChange={(event, value) =>
                handleChange({ target: { name: "AssetsType", value } })
              }
              value={formData.AssetsType}
              getOptionSelected={(option, value) => option === value}
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
              value={formatsDate(formData.PurchasedOn)}
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
              name="Expiry"
              value={formData.Expiry}
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
          <Button
            onClick={handleSave}
            variant="contained"
            autoFocus
            disabled={isAdding }
          >
            {isAdding ? <CircularProgress /> : "Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetsDialog;
