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
              border: "0.5px solid gray",
            }}
          >
            <img
              src={URL.createObjectURL(selectedFile)}
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
              onChange={(e) => setSelectedFile(e.target.files[0])}
            ></input>
          </label>
        )}
      </DialogContent>
      <DialogActions sx={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
        <Button variant="outlined" onClick={() => close()}>Close</Button>
        {openFor === "addFolder" ? (
          <Button variant="outlined" onClick={() => handleCreateFolder()} disabled={folderLoading}>
            {" "}
            {folderLoading ? <CircularProgress /> : "Create"}
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleUploadFile()} disabled={uploadLoading}>
            {uploadLoading ? <CircularProgress /> : "Upload"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DriveDial;
