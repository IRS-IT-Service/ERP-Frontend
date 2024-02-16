import { Category, DisabledByDefault } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAddDynamicValueMutation } from "../../../features/api/productApiSlice";
import { useGetDynamicValueQuery } from "../../../features/api/productApiSlice";

const RoboProductTable = () => {
  const [selectValue, setSelectValue] = useState("");
  const [addvalue, setAddvalue] = useState("");
  const [values, setValues] = useState([]);

  //rtk Querry
  const [addDynamicValue] = useAddDynamicValueMutation();
  const { data: getDyanmicValue, isLoading: getDyanmaicValueLoading,refetch } =
    useGetDynamicValueQuery();


  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (values.length === 0) {
      setSelectValue(selectedValue);
    }
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

  const handleSave = async () => {
    if (!selectValue || values.length === 0)
      return toast.error("Please select value option");

    try {
      const info = { name: selectValue, values: values };
      const result = await addDynamicValue(info).unwrap();
      toast.success("Values Succesfully Save");
      setValues([]);
      refetch();
      setSelectValue("");
    } catch (error) {
      console.log(error);
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
            <MenuItem value="Brand">Brand</MenuItem>
            <MenuItem value="Category">Category</MenuItem>
            <MenuItem value="SubCategory">Subcategory</MenuItem>
            <MenuItem value="GST">GST</MenuItem>
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
          flexWrap: "wrap",
          justifyContent: "start",
          gap: 2,
          borderRadius: "10px",
          padding: 2,
          overflow: "hidden",
        }}
      >
        {values.map((value, index) => (
          <Box
            key={index}
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
              className="fa-solid fa-trash"
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
            {getDyanmicValue?.data?.[0]?.Brand?.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
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
            {getDyanmicValue?.data?.[0]?.Category?.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
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
            {getDyanmicValue?.data?.[0]?.SubCategory?.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
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
            {getDyanmicValue?.data?.[0]?.GST?.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RoboProductTable;
