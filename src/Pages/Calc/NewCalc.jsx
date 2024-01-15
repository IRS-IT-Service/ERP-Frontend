import React, { useState, useEffect, useRef } from "react";
import {
  Collapse,
  Box,
  styled,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Tooltip,
} from "@mui/material";

import { useAutoCompleteProductMutation } from "../../features/api/productApiSlice";

import Header from "../../components/Common/Header";
import { useSelector } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const newData = [
  // Your data here
];

const NewCalc = () => {
  /// initialize
  const debounce = useRef();
  const collapseRef = useRef();

  /// global state
  const { themeColor } = useSelector((state) => state.ui);

  /// RTK query
  const [autoCompleteApi, { isLoading: autoCompleteLoading }] =
    useAutoCompleteProductMutation();

  /// Local state
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [searchValue, setSearchvalue] = useState("");
  const [searchResult, setSearchResult] = useState([...newData]);

  /// Handler
  const handleSearchCall = async () => {
    try {
      const searchResponse = await autoCompleteApi(searchValue).unwrap();
      setSearchResult(searchResponse.data);
      collapseRef.current.scrollTop = 0;
    } catch (e) {
      console.error(e);
    } finally {
      setOpenSearchBox(true);
    }
  };

  /// useEffect
  useEffect(() => {
    if (!searchValue) {
      return;
    }

    clearTimeout(debounce.current);

    debounce.current = setTimeout(handleSearchCall, 1000);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log(event);
      if (
        collapseRef.current &&
        !collapseRef.current.contains(event.target) &&
        event.target !== document.getElementById("search-input") // Exclude the search input from the outside click handling
      ) {
        setOpenSearchBox(false);
        collapseRef.current.scrollTop = 0;
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0, width: "100%" }}>
      <DrawerHeader />
      <Header Name={"Landing Cost Calculator"} />
      <Box
        sx={{
          border: "2px solid",
          width: "99.7%",
          height: "87vh",
        }}
      >
        {/* {Searbar Container Start} */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "7%",
            border: "2px solid",
          }}
        >
          <Box
            sx={{
              width: "50%",
            }}
          >
            <TextField
              onClick={() => {
                setOpenSearchBox(true);
              }}
              id="search-input"
              placeholder="Search Product"
              onChange={(e) => setSearchvalue(e.target.value)}
              value={searchValue}
              sx={{
                width: "100%",
              }}
              autoComplete="off"
            />
            <Box>
              <Collapse
                sx={{
                  position: "absolute",
                  width: "44%",
                  paddingX: "1rem",
                  paddingTop: ".5rem",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  maxHeight: "25rem",
                  overflow: "auto",
                  zIndex: "100",
                  padding: "0px",
                }}
                in={openSearchBox}
                ref={collapseRef}
              >
                {searchResult.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: "5px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: themeColor.sideBarColor1,
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {item.Name} ({item.GST})%
                  </Box>
                ))}
              </Collapse>
            </Box>
          </Box>
        </Box>
        {/* {Searbar Container Start} */}

        {/* {Searbar Container Start} */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: "2px solid red",
          }}
        >
          <Box>
           
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewCalc;
