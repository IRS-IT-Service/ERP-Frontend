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
import React, { useEffect, useState,useRef, } from "react";
import { toast } from "react-toastify";

import { useAddDynamicValueMutation } from "../../../features/api/productApiSlice";
import { useGetDynamicValueQuery } from "../../../features/api/productApiSlice";
import RoboDialogbox from "./RoboDialogbox";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const RoboProductTable = () => {
  const brandContainerRef = useRef(null);
  const categoryContainerRef = useRef(null);
  const subCategoryContainerRef = useRef(null);

  const [selectValue, setSelectValue] = useState("");
  const [addvalue, setAddvalue] = useState("");
  const [values, setValues] = useState([]);
  const [del, setDel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedtable, setSelectedTable] = useState(null);
  const [inputSearchBrand, setInputSearchBrand] = useState("");
  const [inputSearchCategory, setInputSearchCategory] = useState("");
  const [inputSearchSubCategory, setInputSearchSubCategory] = useState("");
  const [error , setError] = useState(null)

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
      setError(null)
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  };

  const handleInput = (event) => {
    if (!selectValue){
    setError("Select Value First")
      return 
    }
    if (selectValue === "Brand") {
      setAddvalue(event.target.value.toUpperCase());
      setError(null)
    } else {
      setAddvalue(event.target.value);
      setError(null)
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
const handleSearch = (e) =>{

const {name,value} = e.target;

if(name === "brand") {
  setInputSearchBrand(value)
  if (brandContainerRef.current) {
    brandContainerRef.current.scrollTop = 0;
  }
}else if(name === "category"){
  setInputSearchCategory(value)
  if (categoryContainerRef.current) {
    categoryContainerRef.current.scrollTop = 0;
  }
}else {
  setInputSearchSubCategory(value)
  if (subCategoryContainerRef.current) {
    subCategoryContainerRef.current.scrollTop = 0;
  }
}
}


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
            <FormControl sx={{ m: 2, minWidth: 200 }} size="large">
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
            <Box sx={{width:400 ,padding:2}} >
              <TextField
           
                id="outlined-basic"
                label="Add Value"
                variant="outlined"
                fullWidth
                onChange={handleInput}
                value={addvalue}
                error={error}
                helperText={error}
              />
            </Box>
            <Button sx={{}} variant="contained" onClick={handleAdd}>
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
              height: "6vh",
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
          <Button variant="contained" onClick={handleSave}>
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
              name="brand"
              style={{ outline: "blue" }}
              value={inputSearchBrand}
              onChange={handleSearch}
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
              ref={brandContainerRef}
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
                item.toLowerCase().includes(inputSearchBrand.toLocaleLowerCase())
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.Brand?.filter(
                (item) => !item.toLowerCase().includes(inputSearchBrand.toLocaleLowerCase())
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
              name="category"
              value={inputSearchCategory}
              onChange={handleSearch}
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
                ref={categoryContainerRef}
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
                item.toLowerCase().includes(inputSearchCategory.toLocaleLowerCase())
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.Category?.filter(
                (item) => !item.toLowerCase().includes(inputSearchCategory.toLocaleLowerCase())
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
              name="subCategory"
              value={inputSearchSubCategory}
              onChange={handleSearch}
            />
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
                ref={subCategoryContainerRef}
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
                item.toLowerCase().includes(inputSearchSubCategory?.toLocaleLowerCase())
              ) || []),
              ...(getDyanmicValue?.data?.[0]?.SubCategory?.filter(
                (item) => !item.toLowerCase().includes(inputSearchSubCategory?.toLocaleLowerCase())
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
