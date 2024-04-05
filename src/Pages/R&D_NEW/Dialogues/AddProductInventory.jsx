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
    name: "",
    weight: "",
    newQuantity: "",
    oldQuantity: "",
    length: "",
    width: "",
    height: "",
   LandingCost:"",
  });

  const handleSubmit = async () => {
    try {
      const info = {
        name: formData.name,
        weight: Number(formData.weight),
        newQuantity: Number(formData.newQuantity),
        oldQuantity: Number(formData.oldQuantity),
        LandingCost:Number(formData.LandingCost),
        dimension: `${formData.length}X${formData.width}X${formData.height}`,
      };

      const res = await addProduct(info).unwrap();
      toast.success(`Product Added successfully`);
      setFormData({
        name: "",
        weight: "",
        newQuantity: "",
        oldQuantity: "",
        length: "",
        width: "",
        height: "",
        LandingCost:"",
      });
      close();
      refetch();
    } catch (e) {
      toast.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        <Typography sx={{ fontWeight: "bold" }}>Add Product</Typography>
      </DialogTitle>

      <DialogContent sx={{}}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
          
            padding: "2rem",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <InputLabel
              sx={{
                alignSelf: "center",
                fontWeight: "bold",
                width: "21%",
              }}
            >
              Name
            </InputLabel>
            <TextField
              size="small"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <Box display="flex" gap="0.5rem">
              <InputLabel
                sx={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  width: "18%",
                 
                }}
              >
                Weight<sup>gm</sup>
              </InputLabel>

              <TextField
                size="small"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
              <Box display="flex" gap="0.5rem">
                <InputLabel
                  sx={{
                    alignSelf: "center",
                    fontWeight: "bold",
                    width: "40%",
                  }}
                >
                  Landing Cost
                </InputLabel>

                <TextField
                  size="small"
                 placeholder="₹ Landing Cost"
                 type="number"
                  name="LandingCost"
                  value={formData.Price}
                  onChange={handleChange}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Box display="flex" gap="0.5rem">
              <InputLabel
                sx={{
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Dimension<sup>cm</sup>
              </InputLabel>

              <TextField
                size="small"
                placeholder="Length"
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                sx={{ width: "80px" }}
              />
              <Typography variant="body1" sx={{ alignSelf: "center" }}>
                X
              </Typography>
              <TextField
                size="small"
                placeholder="Width"
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                sx={{ width: "80px" }}
              />
              <Typography variant="body1" sx={{ alignSelf: "center" }}>
                X
              </Typography>
              <TextField
                size="small"
                placeholder="Height"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                sx={{ width: "80px" }}
              />
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap="0.5rem">
              <InputLabel
                sx={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  width: "60%",
                }}
              >
                New Quatity
              </InputLabel>
              <TextField
                size="small"
                placeholder="QTY"
                name="newQuantity"
                type="number"
                value={formData.newQuantity}
                onChange={handleChange}
                sx={{ width: "80px" }}
              />
            </Box>
            <Box display="flex" gap="0.5rem">
              <InputLabel
                sx={{
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Old Quantity
              </InputLabel>

              <TextField
                size="small"
                placeholder="QTY"
                name="oldQuantity"
                type="number"
                value={formData.oldQuantity}
                onChange={handleChange}
                sx={{ width: "80px" }}
              />
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
