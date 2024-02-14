import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";

const RoboProductTable = () => {
  const [selectValue, setSelectValue] = useState("");
  const [addvalue, setAddvalue] = useState("");
  const [values, setValues] = useState([]);
  const [brand, setBrand] = useState([
    { sno: "1", name: "Tesla" },
    { sno: "2", name: "Apple" },
    { sno: "3", name: "Google" },
    { sno: "4", name: "Amazon" },
    { sno: "5", name: "Microsoft" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
    { sno: "6", name: "Samsung" },
  ]);
  const [category, setCategory] = useState([
    { sno: "1", name: "senior fresher" },
    { sno: "2", name: "manager" },
    { sno: "3", name: "assistant manager" },
    { sno: "4", name: "team lead" },
    { sno: "5", name: "senior engineer" },
    { sno: "6", name: "junior engineer" },
    { sno: "6", name: "junior engineer" },
    { sno: "6", name: "junior engineer" },
    { sno: "6", name: "junior engineer" },
    { sno: "6", name: "junior engineer" },
    { sno: "6", name: "junior engineer" },
  ]);
  const [subcategory, setSubcategory] = useState([
    { sno: "1", name: "intern" },
    { sno: "2", name: "senior intern" },
    { sno: "3", name: "managerial intern" },
    { sno: "4", name: "executive intern" },
    { sno: "5", name: "associate intern" },
    { sno: "6", name: "junior intern" },
    { sno: "6", name: "junior intern" },
    { sno: "6", name: "junior intern" },
    { sno: "6", name: "junior intern" },
    { sno: "6", name: "junior intern" },
    { sno: "6", name: "junior intern" },
  ]);

  const [gst, setGst] = useState([
    { sno: "1", per: "5%" },
    { sno: "2", per: "12%" },
    { sno: "3", per: "18%" },
    { sno: "4", per: "28%" },
    { sno: "5", per: "0%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
    { sno: "6", per: "15%" },
  ]);

  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  const handleInput = (event) => {
    setAddvalue(event.target.value);
  };
  const handleAdd = () => {
    if (addvalue.length > 0) {
      setValues([...values, addvalue]);
      setAddvalue("");
    }
  };
  const handleDelete = (index) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
  };

  const handleSave = () => {
    if (selectValue && addvalue) {
      switch (selectValue) {
        case "1":
          setBrand((prevBrand) => [
            ...prevBrand,
            { sno: prevBrand.length + 1, name: addvalue },
          ]);
          break;
        case "2":
          setCategory((prevCategory) => [
            ...prevCategory,
            { sno: prevCategory.length + 1, name: addvalue },
          ]);
          break;
        case "3":
          setSubcategory((prevSubcategory) => [
            ...prevSubcategory,
            { sno: prevSubcategory.length + 1, name: addvalue },
          ]);
          break;
        case "4":
          setGst((prevGst) => [
            ...prevGst,
            { sno: prevGst.length + 1, per: addvalue },
          ]);
          break;
        default:
          break;
      }
      setAddvalue("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <FormControl sx={{ m: 1, minWidth: 300 }} size="large">
          <InputLabel
            id="demo-select-small-label"
            sx={{ color: "black", fontWeight: "bold" }}
          >
            Select Value
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectValue}
            label="Select Value"
            onChange={handleChange}
            sx={{ color: "black", fontWeight: "bold" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Brand</MenuItem>
            <MenuItem value={2}>Category</MenuItem>
            <MenuItem value={3}>Subcategory</MenuItem>
            <MenuItem value={4}>GST</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ m: 1, minWidth: 400 }}
          id="outlined-basic"
          label="Add Value"
          variant="outlined"
          onChange={handleInput}
          value={addvalue}
        />

        <Button sx={{ width: "4vw" }} variant="outlined" onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <Box
        sx={{
          border: "2px solid black",
          height: "20vh",
          width: "100%",
          m: 2,
          display: "flex",
          justifyContent: "start",
          gap: 2,
          borderRadius: "10px",
          padding: 2,
        }}
      >
        {values.map((value, index) => (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              marginRight: "15px",
              height: "3vh",
              border: "1px solid blue",
              padding: "20px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "1.2rem" }} key={index}>
              {value}
            </Typography>
            <i
              class="fa-solid fa-trash"
              style={{ color: "blue", cursor: "pointer", fontSize: "1.2rem" }}
              onClick={() => handleDelete(index)}
            ></i>
          </Box>
        ))}
      </Box>
      <Button variant="outlined" onClick={handleSave}>
        Click TO Save
      </Button>
      <Box sx={{ display: "flex", gap: 2, m: 2 }}>
        <Box
          sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: "blue",
              width: "100%",
              textAlign: "center",
              color: "white",
            }}
          >
            Brand
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "30vh",
              width: "20vw",
            }}
          >
            {brand.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.sno}.</Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: "blue",
              width: "100%",
              textAlign: "center",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            Category
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "30vh",
              width: "20vw",
            }}
          >
            {category.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.sno}.</Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: "blue",
              width: "100%",
              textAlign: "center",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            Subcategory
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "30vh",
              width: "20vw",
            }}
          >
            {subcategory.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.sno}.</Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: "blue",
              width: "100%",
              textAlign: "center",
              color: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            GST
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "30vh",
              width: "20vw",
            }}
          >
            {gst.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.sno}.</Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item.per}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RoboProductTable;
