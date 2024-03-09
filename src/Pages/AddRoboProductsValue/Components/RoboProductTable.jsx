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
import RoboDialogbox from "./RoboDialogbox";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const RoboProductTable = () => {
  const [selectValue, setSelectValue] = useState("");
  const [addvalue, setAddvalue] = useState("");
  const [values, setValues] = useState([]);
  const [del, setDel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedtable, setSelectedTable] = useState(null);
  const [inputSearchBrand, setInputSearchBrand] = useState("");
  const [inputSearchCategory, setInputSearchCategory] = useState("");
  const [inputSearchSubCategory, setInputSearchSubCategory] = useState("");

  //rtk Querry
  const [addDynamicValue] = useAddDynamicValueMutation();
  const {
    data: getDyanmicValue,
    isLoading: getDyanmaicValueLoading,
    refetch,
  } = useGetDynamicValueQuery();

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (values.length === 0) {
      setSelectValue(selectedValue);
    }
  };

  const handleInput = (event) => {
    if (selectValue === "Brand") {
      setAddvalue(event.target.value.toUpperCase());
    } else {
      setAddvalue(event.target.value);
    }
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

  const handleClickOpen = (item, table) => {
    setDel(true);
    setSelectedItem(item);
    setSelectedTable(table);
  };

  const handleClose = () => {
    setDel(false);
  };

  // funnction for searching
  const handleSearchOnChange = (value) => {
    setInputSearch(value);
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
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 200 }} size="large">
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
                <MenuItem value="SubCategory">SubCategory</MenuItem>
                <MenuItem value="GST">GST</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <TextField
                sx={{ m: 1, minWidth: 400 }}
                id="outlined-basic"
                label="Add Value"
                variant="outlined"
                onChange={handleInput}
                value={addvalue}
              />
            </Box>
            <Button sx={{}} variant="outlined" onClick={handleAdd}>
              Add
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              border: "1px solid black",
              height: "7vh",
              width: "87%",
              margin: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
              gap: 1,
              borderRadius: "10px",
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
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                  onClick={() => handleDelete(index)}
                ></i>
              </Box>
            ))}
          </Box>
          <Button variant="outlined" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, m: 1 }}>
        <Box
          sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              background: "blue",
            }}
          >
            <input
              placeholder="Search Brand"
              style={{ outline: "blue" }}
              value={inputSearchBrand}
              onChange={(e) => setInputSearchBrand(e.target.value)}
            ></input>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "white",
              }}
            >
              Brand
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "74vh",
              width: "20vw",
            }}
          >
            {[
              ...(getDyanmicValue?.data?.[0]?.Brand?.filter((item) =>
                item.toLowerCase().includes(inputSearchBrand)
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.Brand?.filter(
                (item) => !item.toLowerCase().includes(inputSearchBrand)
              ) || []),
            ].map((item, index) => {
              const isBrandWithLogo =
                getDyanmicValue?.data?.[0]?.BrandWithLogo?.some(
                  (brandItem) => brandItem.BrandName === item
                );

              return (
                <Box
                  sx={{ display: "flex", justifyContent: "space-evenly" }}
                  key={index}
                >
                  <Typography sx={{ fontSize: "1.4rem" }}>
                    {index + 1}.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>{" "}
                    <Typography
                      sx={{ fontSize: "1.4rem", marginRight: "1rem" }}
                    >
                      <i
                        className="fa-solid fa-trash"
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                        onClick={() => handleClickOpen(item, "Brand")}
                      ></i>
                    </Typography>
                  </Box>
                  <Box>
                    <AddPhotoAlternateIcon
                      onClick={() => handleClickOpen(item, "BrandWithLogo")}
                      sx={{
                        color: isBrandWithLogo ? "green" : "red",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
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
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              background: "blue",
            }}
          >
            <input
              placeholder="Search Category"
              style={{ outline: "blue" }}
              value={inputSearchCategory}
              onChange={(e) => setInputSearchCategory(e.target.value)}
            ></input>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "white",
              }}
            >
              Category
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "74vh",
              width: "20vw",
            }}
          >
            {[
              ...(getDyanmicValue?.data?.[0]?.Category?.filter((item) =>
                item.toLowerCase().includes(inputSearchCategory)
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.Category?.filter(
                (item) => !item.toLowerCase().includes(inputSearchCategory)
              ) || []),
            ].map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>{" "}
                  <Typography sx={{ fontSize: "1.4rem", marginRight: "1rem" }}>
                    <i
                      className="fa-solid fa-trash"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                      onClick={() => handleClickOpen(item, "Category")}
                    ></i>
                  </Typography>
                </Box>
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
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              background: "blue",
            }}
          >
            <input
              placeholder="Search Sub Category"
              style={{ outline: "blue" }}
              value={inputSearchSubCategory}
              onChange={(e) => setInputSearchSubCategory(e.target.value)}
            ></input>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "white",
              }}
            >
              Sub Category
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              overflowY: "auto",
              maxHeight: "74vh",
              width: "20vw",
            }}
          >
            {[
              ...(getDyanmicValue?.data?.[0]?.SubCategory?.filter((item) =>
                item.toLowerCase().includes(inputSearchSubCategory)
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.SubCategory?.filter(
                (item) => !item.toLowerCase().includes(inputSearchSubCategory)
              ) || []),
            ].map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
                  <Typography sx={{ fontSize: "1.4rem", marginRight: "1rem" }}>
                    <i
                      className="fa-solid fa-trash"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                      onClick={() => handleClickOpen(item, "SubCategory")}
                    ></i>
                  </Typography>
                </Box>
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
              maxHeight: "74vh",
              width: "20vw",
            }}
          >
            {getDyanmicValue?.data?.[0]?.GST?.map((item, index) => (
              <Box sx={{ display: "flex", gap: 1 }} key={index}>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {index + 1}.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ fontSize: "1.4rem" }}>{item}</Typography>
                  <Typography sx={{ fontSize: "1.4rem", marginRight: "1rem" }}>
                    <i
                      className="fa-solid fa-trash"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                      }}
                      onClick={() => handleClickOpen(item, "GST")}
                    ></i>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {del && (
        <RoboDialogbox
          open={del}
          handleClose={handleClose}
          selectedItem={selectedItem}
          selectedtable={selectedtable}
          fetch={refetch}
          Logos={getDyanmicValue?.data?.[0]?.BrandWithLogo}
        />
      )}
    </Box>
  );
};

export default RoboProductTable;
