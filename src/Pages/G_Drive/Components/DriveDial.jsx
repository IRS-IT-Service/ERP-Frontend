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
    <Dialog open={open}>
      <DialogTitle
        sx={{ background: "grey", textAlign: "center", color: "white" }}
      >
        {openFor === "addFolder" ? "Create Folder" : "Upload File"}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "300px",
          width: "400px",
        }}
      >
        {/* <div
          style={{
            border: "1px solid black",
            display: "flex",
            justifyContent: "start",
            height: "100%",
            width: "100%",
          }}
        > */}
        {/* {selectedFile &&
          selectedFile.files &&
          Array.from(selectedFile.files).map((file, index) => (
            <div style={{ display: "flex", gap: "4px" }}>
              <div
                key={index}
                style={{
                  height: "50px",
                  width: "50px",
                  objectFit: "cover",
                  // marginTop: "20px",
                  // marginRight: "20px",
                }}
              >
                <img
                  src={getFileExtensionUrl(
                    selectedFile.value,
                    URL.createObjectURL(selectedFile.files[0])
                  )}
                  alt={`Uploaded File ${index}`}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
          ))} */}
        {/* </div> */}

        {openFor === "addFolder" ? (
          <input
            type="text"
            placeholder="Enter Folder Name"
            value={createFolderName}
            style={{ width: "100%", padding: "10px" }}
            onChange={(e) => setCreateFolderName(e.target.value)}
          ></input>
        ) : (
          <div>
            <p>
              {" "}
              {(selectedFile &&
                selectedFile.files &&
                selectedFile.files.length) ||
                0}{" "}
              Files Selected
            </p>
            <label htmlFor="fileInput">
              <CloudUpload
                sx={{
                  cursor: "pointer",
                  color: `${selectedFile ? "green" : ""}`,
                  height: "100px",
                  width: "100px",
                }}
              />
              <input
                id="fileInput"
                multiple
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target)}
              ></input>
            </label>
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Button variant="contained" onClick={() => close()}>
          Close
        </Button>
        {openFor === "addFolder" ? (
          <Button
            variant="outlined"
            onClick={() => handleCreateFolder()}
            disabled={folderLoading}
          >
            {" "}
            {folderLoading ? (
              <CircularProgress size={30} sx={{ color: "#fff" }} />
            ) : (
              "Create"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleUploadFile()}
            disabled={uploadLoading}
          >
            {uploadLoading ? <CircularProgress /> : "Upload"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DriveDial;
