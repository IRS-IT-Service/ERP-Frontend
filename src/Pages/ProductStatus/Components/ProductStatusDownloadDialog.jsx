import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CircularProgress } from "@mui/material";

const ProductStatusDownloadDialog = ({
  open,
  setOpen,
  handleExcelDownload,
  loading,
  type
}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkboxItems, setCheckboxItems] = useState([
    "Quantity",
    "GST",
    "MRP",
    "LandingCost",
    "CostWithGst",
    "SalesPrice",
    "SellerPrice",
  ]);

  useEffect(() => {
    if (type === "boolean") {
      setCheckboxItems((prevItems) =>
        prevItems.filter((item) => item !== "CostWithGst")
      );
    } else {
      setCheckboxItems([
        "Quantity",
        "GST",
        "MRP",
        "LandingCost",
        "CostWithGst",
        "SalesPrice",
        "SellerPrice",
      ]);
    }
  }, [type]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setCheckedItems((prevCheckedItems) => [...prevCheckedItems, value]);
    } else {
      setCheckedItems((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== value)
      );
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Select Columns to download or Leave Blank to Download All
        </DialogTitle>
        <DialogContent>
          {checkboxItems.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={checkedItems.includes(item)}
                  onChange={handleCheckboxChange}
                  value={item}
                />
              }
              label={item}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              handleExcelDownload(checkedItems, handleClose);
              setCheckedItems([]);
            }}
            color="primary"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Download"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductStatusDownloadDialog;
