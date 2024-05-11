import { CloudUpload } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import excel from "../../../assets/DrivePNG/excel.png";
import image from "../../../assets/DrivePNG/image.png";
import pdf from "../../../assets/DrivePNG/pdf.png";
import unknown from "../../../assets/DrivePNG/unknown.png";
import word from "../../../assets/DrivePNG/word.png";
import txt from "../../../assets/DrivePNG/txt.jpg";
import noData from "../../../assets/no-data-found.jpg";

const DriveDial = ({
  open,
  close,
  setCreateFolderName,
  createFolderName,
  handleCreateFolder,
  openFor,
  handleUploadFile,
  setSelectedFile,
  selectedFile,
  folderLoading,
  uploadLoading,

}) => {

  function getFileExtensionUrl(filename ,url) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
;
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
          return url
        case "txt":
          return txt;
      
         default:
        return unknown;
    }
  }
  
  return (
    <Dialog open={open}>
      <DialogTitle
        sx={{ background: "grey", textAlign: "center", color: "white" }}
      >
        {openFor === "addFolder" ? "Create Folder" : "Upload File"}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: "10px",
          display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",
          height: "300px",
          width: "400px",
        }}
      >
        {selectedFile && (
          <div
            style={{
              height: "150px",
              width: "150px",
              objectFit: "cover",
              marginTop: "20px",
         
            }}
          >
            <img
              src={getFileExtensionUrl(selectedFile.value,URL.createObjectURL(selectedFile.files[0]))}
              alt="uploaded File"
              style={{ height: "100%", width: "100%" }}
            ></img>
          </div>
        )}
        {openFor === "addFolder" ? (
          <input
            type="text"
            placeholder="Enter Folder Name"
            value={createFolderName}
            style={{width:"100%",padding:"10px"}}
            onChange={(e) => setCreateFolderName(e.target.value)}
          ></input>
        ) : (
          <label htmlFor="fileInput">
            <CloudUpload
              sx={{
                cursor: "pointer",
                color: `${selectedFile ? "green" : ""}`,
              }}
            />
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setSelectedFile(e.target)}
            ></input>
          </label>
        )}
      </DialogContent>
      <DialogActions sx={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
        <Button variant="contained" onClick={() => close()}>Close</Button>
        {openFor === "addFolder" ? (
          <Button variant="outlined" onClick={() => handleCreateFolder()} disabled={folderLoading}>
            {" "}
            {folderLoading ? <CircularProgress size={30} sx={{color:"#fff"}}  /> : "Create"}
          </Button>
        ) : (
          <Button variant="contained" onClick={() => handleUploadFile()} disabled={uploadLoading}>
            {uploadLoading ? <CircularProgress /> : "Upload"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DriveDial;
