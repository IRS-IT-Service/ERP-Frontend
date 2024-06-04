import { CloudUpload } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useUpdateRepairImageMutation } from "../../../features/api/dscApiSlice";
import { toast } from "react-toastify";

const DSCImageDial = ({ open, close, refetch, data }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [updateRepairImage, { isLoading }] = useUpdateRepairImageMutation();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 files.");
    } else {
      setSelectedFiles(files);
    }
  };

  const handleUploadFile = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("Images", file);
      });

      formData.append("id", data?.id);
      await updateRepairImage(formData).unwrap();
      toast.success("Images uploaded successfully.");
      refetch();
      close();
      setSelectedFiles([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle
        sx={{ background: "grey", textAlign: "center", color: "white" }}
      >
        {data?.Images?.length ? "See Images" : "Upload Images"}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70vw",
          flexDirection: "column",
        }}
      >
        {selectedFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  height: "150px",
                  width: "150px",
                  objectFit: "cover",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded File ${index}`}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            ))}
          </div>
        )}
        {data?.Images?.length ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {data?.Images.map((img, index) => (
              <div
                key={index}
                style={{
                  width: "300px",
                  height: "300px",
                  border: "1px solid black",
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  src={img?.url}
                  alt={`Image ${index}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <label
            htmlFor="fileInput"
            style={{
              width: "200px",
              height: "200px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              cursor: "pointer",
            }}
          >
            <CloudUpload
              sx={{
                cursor: "pointer",
                color: `${selectedFiles.length ? "green" : ""}`,
              }}
            />
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
              accept=".jpeg, .png, .jpg"
            />
          </label>
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
        {data?.Images?.length ? (
          ""
        ) : (
          <Button
            variant="contained"
            onClick={handleUploadFile}
            disabled={isLoading || selectedFiles.length === 0}
          >
            {isLoading ? <CircularProgress /> : "Upload"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DSCImageDial;
