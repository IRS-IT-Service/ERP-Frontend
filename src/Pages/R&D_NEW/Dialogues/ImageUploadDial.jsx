import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  InputLabel,
  CircularProgress,
  Paper ,
  CardMedia
} from "@mui/material";
import noImage from "../../../assets/NoImage.jpg";

import { useAddImageMutation } from "../../../features/api/RnDSlice";
import { toast } from "react-toastify";

const ImageUploadDial = ({ open, close, refetch ,data }) => {
  const [addImage, { isLoading, refetch: addRefetch }] =
  useAddImageMutation();

  const [Image, setImage] = useState(null);
  const [PreviewImage, setPreviewImage] = useState();

  const handleImageUpload = (e) =>{
    const ImageFile= e.target.files[0]
    setImage(ImageFile);
    setPreviewImage(URL.createObjectURL(ImageFile));

  }



  const handleSubmit = async () => {
    try {
      let formData = new FormData(); 
       formData.append("file",Image)
  
      const info = {
        id: data.id,
        data: formData
      };
      console.log(info);
  
      const res = await addImage(info).unwrap(); 
      toast.success(`Image Added successfully`); 
      setImage(); 
      setPreviewImage(); 
      close(); 
      refetch(); 
    } catch (e) {
      toast.error(e); 
    }
  };
  


  return (
    <Dialog maxWidth="xl" open={open} onClose={close}>
      <DialogTitle
        sx={{
       
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "skyblue",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add Image</Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          width: "auto",
          minHeight: " 10vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap:"2rem",
          marginTop:"2rem"
        }}>
        <Paper elevation={10} sx={{ width: "300px", height: "300px" }}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                  objectFit: "fill",
                }}
                image={PreviewImage|| noImage}
                alt="main Image"
              />
            </Paper>
            <input
            type="file"
            multiple
   
            onChange={handleImageUpload}
            id="file-input"
          />
       
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress sx={{ color: "#fff" }} size={30} />
          ) : (
            "Submit"
          )}
        </Button>
        <Button variant="contained" onClick={close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDial;
