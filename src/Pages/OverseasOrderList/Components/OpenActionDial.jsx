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
  const [selectedFile, setSelectedFile] = useState({
    Swift:"",
    PI:""
  });

  const [selectedData, setSelectedData] = useState({
    RemittanceNO:"",
    RemittanceAmount:"",
    PINO:"",
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
        {selectedDetails}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: selectedDetails === "Add Amount" ? "45vh":"60vh",
          width: selectedDetails === "Add Amount" ? "20vw":"50vw",
        }}
      >
        {selectedDetails === "Add Amount" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
       border:"0.5px solid #ccc",
       borderRadius:"25px",
       boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                paddingX: "10px",
                flexDirection: "column",
       
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "5px",
                  width: "100%",
                  gap: "20px",
                  marginTop:"20px"
                }}
              >
                <TextField
                  name="RemittanceNO"
                  label="Remittance No"
                  size="small"

                    value={selectedData.RemittanceNO}
                    onChange={handleOnChangeFile}
                />
                <TextField
                  name="RemittanceAmount"
                  label="Remittance Amount"
                  size="small"

                 
                  value={selectedData.RemittanceAmount}
                  onChange={handleOnChangeFile}
                />
                <TextField
                  name="PINO"
                  label="PI NO"
                  size="small"

                  value={selectedData.PINO}
                  onChange={handleOnChangeFile}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginTop: "5px",
                  width: "100%",
                  height: "100%",
                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    gap: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upload PI copy
                    </Typography>
                    <label htmlFor="fileInput">
                      <CloudUpload
                        sx={{
                          cursor: "pointer",
                          color: `${selectedFile?.PI ? "green" : ""}`,
                          fontSize: "2rem",
                        }}
                      />
                      <input
                        id="fileInput"
                        type="file"
                        name="PI"
                        style={{ display: "none" }}
                        onChange={(e) => handleOnChangeFile(e,"file")}
                      ></input>
                    </label>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upload Swift copy
                    </Typography>
                    <label htmlFor="swift">
                      <CloudUpload
                        sx={{
                          cursor: "pointer",
                          color: `${selectedFile?.Swift ? "green" : ""}`,
                          fontSize: "2rem",
                        }}
                      />
                      <input
                        id="swift"
                        type="file"
                        name="Swift"
                        style={{ display: "none" }}
                        onChange={(e) => handleOnChangeFile(e,"file")}
                      ></input>
                    </label>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        {/* View Swift copy */}
        {selectedDetails === "Swift copy" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",

              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "80%",
                width: "30vw",
                objectFit: "contained",
              }}
            >
              <img
                src={pdf}
                alt="uploaded File"
                style={{ height: "100%", width: "100%" }}
              ></img>
            </div>
          </Box>
        )}
        {/* View PI copy */}
        {selectedDetails === "PI copy" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",

              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "80%",
                width: "30vw",
                objectFit: "contained",
              }}
            >
              <img
                src={pdf}
                alt="uploaded File"
                style={{ height: "100%", width: "100%" }}
              ></img>
            </div>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
       
        }}
      >
        <Button variant="contained" size="small" sx={{
          background:"#9E242A"
        }} onClick={() => close()}>
          Close
        </Button>
     {selectedDetails === "Add Amount" &&   <Button variant="contained" size="small" sx={{
          background:"#056210"
        }} onClick={() => close()}>
       {
        false ? <CircularProgress size={20} sx={{
          color:"#fff"
        }} />
        : "Submit" }
        </Button> }
      </DialogActions>
    </Dialog>
  );
};

export default OpenActionDial;
