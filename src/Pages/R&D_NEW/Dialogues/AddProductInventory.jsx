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
  TextField,
  Container,
  Grid,
} from "@mui/material";

import { useAddProductInRnDInventoryMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";

const AddProductInventory = ({ open, close, refetch }) => {
  const [addProduct, { isLoading, refetch: addRefetch }] =
  useAddProductInRnDInventoryMutation();



  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    newQuantity: '',
    oldQuantity: '',
    length: '',
    width: '',
    height: ''
  });

  const handleSubmit = async () => {
    try {
const info ={
    name: formData.name,
    weight: Number(formData.weight),
    newQuantity: Number(formData.newQuantity),
    oldQuantity: Number(formData.oldQuantity),
    dimension:`${formData.length}X${formData.width}X${formData.height}`
}

      const res = await addProduct(info).unwrap();
      toast.success(`Product Added successfully`);
      setFormData({
    name: '',
    weight: '',
    newQuantity: '',
    oldQuantity: '',
    length: '',
    width: '',
    height: ''
      });
      close();
      refetch();
    } catch (e) {
      toast.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Dialog maxWidth="lg" open={open} onClose={close}>
      <DialogTitle
        sx={{
          minWidth: "50vw",
          minHeight: "5vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "skyblue",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add Product</Typography>
      </DialogTitle>

      <DialogContent>
      <Container sx={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
      <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Typography variant="body1">Name</Typography>
        <TextField size="small" fullWidth name="name" value={formData.name} onChange={handleChange} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center",marginRight:"0.5rem" }}>
          <Typography variant="body1">Weight<sup>gm</sup></Typography>
          <TextField size="small" name="weight" value={formData.weight} onChange={handleChange} />
        </Box>
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography variant="body1">New Quantity</Typography>
            <TextField size="small" placeholder="QTY" name="newQuantity" value={formData.newQuantity} onChange={handleChange} sx={{ width: "80px" }} />
            <Typography variant="body1">Old Quantity</Typography>
            <TextField size="small" placeholder="QTY" name="oldQuantity" value={formData.oldQuantity} onChange={handleChange} sx={{ width: "80px" }} />
          </Box>
          <Typography variant="body1">Dimension<sup>cm</sup></Typography>
          <TextField size="small" placeholder="Length" name="length" value={formData.length} onChange={handleChange} sx={{ width: "80px" }} />
          <Typography variant="body1" sx={{ alignSelf: "center" }}>X</Typography>
          <TextField size="small" placeholder="Width" name="width" value={formData.width} onChange={handleChange} sx={{ width: "80px" }} />
          <Typography variant="body1" sx={{ alignSelf: "center" }}>X</Typography>
          <TextField size="small" placeholder="Height" name="height" value={formData.height} onChange={handleChange} sx={{ width: "80px" }} />
        </Box>
      </Box>
    </Container>


  
    
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

export default AddProductInventory;
