import React, { useEffect, useState } from "react";
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

import { useUpdateSingleProductMutation } from "../../../features/api/barcodeApiSlice";
import { toast } from "react-toastify";

const EditProductDial = ({ open, close, data, refetch }) => {
  const [Editproduct, { isLoading, refetch: addRefetch }] =
  useUpdateSingleProductMutation();

  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    try {
      const info = {
        id:data.SKU,
        Name: formData.Name,
        Weight: formData.Weight,
        Newqty: formData.Newqty,
        OldQty: formData.OldQty,
        Weight: formData.Weight,
        LandingCost: formData.LandingCost,
        Dimension: `${formData.length}X${formData.width}X${formData.height}`,
    };

      const res = await Editproduct(info).unwrap();
      toast.success(`Product Added successfully`);
      setFormData();
      close();
      refetch();
    } catch (e) {
      toast.error(e);
    }
  };

  useEffect(() => {
    if (data) {
      setFormData({
        Name: data.Name,
        Weight: data.Weight,
        Newqty: data.Newqty,
        OldQty: data.OldQty,
        Weight: data.Weight,
        LandingCost: data.LandingCost,
        length: data.Dimension.split("X")[0],
        width: data.Dimension.split("X")[1],
        height: data.Dimension.split("X")[2],
      });
    }
  }, [data]);


  const handleChange = (event) => {
    const { name, value } = event.target;

    let parsedValue;

    if (
      name === "Name" ||
      name === "length" ||
      name === "width" ||
      name === "height"
    ) {
      parsedValue = value;
    } else if (!isNaN(value)) {
      parsedValue = parseInt(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
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
              name="Name"
              value={formData?.Name}
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
                name="Weight"
                type="number"
                value={formData.Weight}
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
                  value={formData.LandingCost}
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
                name="Newqty"
                type="Number"
                value={formData.Newqty}
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
                name="OldQty"
                type="number"
                value={formData.OldQty}
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

export default EditProductDial;
