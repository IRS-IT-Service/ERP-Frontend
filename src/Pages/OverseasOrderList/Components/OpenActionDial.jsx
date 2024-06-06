import { React, useEffect, useState, useRef } from "react";
import { CloudUpload } from "@mui/icons-material";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import excel from "../../../assets/DrivePNG/excel.png";
import image from "../../../assets/DrivePNG/image.png";
import pdf from "../../../assets/DrivePNG/pdf.png";
import unknown from "../../../assets/DrivePNG/unknown.png";
import word from "../../../assets/DrivePNG/word.png";
import txt from "../../../assets/DrivePNG/txt.jpg";
import noData from "../../../assets/no-data-found.jpg";

const OpenActionDial = ({ open, close, selectedDetails }) => {
  const name = Object.keys()
  console.log(selectedDetails)
  const [selectedFile, setSelectedFile] = useState({
    Swift: "",
    PI: "",
  });

  const [selectedData, setSelectedData] = useState({
    RemittanceNO: "",
    RemittanceAmount: "",
    PINO: "",
  });

  const handleOnChangeFile = (event, targetValue) => {
    const { name, value, files } = event.target;
    if (targetValue === "file") {
      const file = files[0];
      setSelectedFile({
        ...selectedFile,
        [name]: file,
      });
    } else {
      setSelectedData({
        ...selectedData,
        [name]: value,
      });
    }
  };

  function getFileExtensionUrl(filename, url) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
    switch (extension) {
      case "csv":
      case "xlsx":
        return excel;
      case "docx":
        return word;
      case "pdf":
        return pdf;
      case "png":
      case "jpg":
      case "jpeg":
        return url;
      case "txt":
        return txt;

      default:
        return unknown;
    }
  }

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle
        sx={{
          background: "grey",
          textAlign: "center",
          color: "white",
          padding: 1,
        }}
      >
        {/* {selectedDetails} */}
      </DialogTitle>
      <DialogContent
        sx={{
      
        }}
      >
       
        {/* View Swift copy */}
       
        {/* View PI copy */}
        
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          border: "2px s",
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            background: "#9E242A",
          }}
          onClick={() => close()}
        >
          Close
        </Button>
        {selectedDetails === "Add Amount" && (
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "#056210",
            }}
            onClick={() => close()}
          >
            {false ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "#fff",
                }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OpenActionDial;
