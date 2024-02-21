import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popover,
  styled,
  TextField,
  Badge,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import {
  setDeepSearch,
  setSearchTerm,
} from "../../features/slice/productSlice";
import { useEffect } from "react";
import {
  setCheckedBrand,
  setCheckedCategory,
  setCheckedGST,
} from "../../features/slice/productSlice";

/// style
const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  position: "relative",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(0,0,0,.5)" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  marginTop: ".7rem",
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "none",
  },
}));

const FilterBarV2 = ({
  customButton,
  customOnClick,
  customButton1,
  customButton2,
  customButton3,
  customButton4,
  apiRef,
  count,

}) => {
  /// initialize
  const dispatch = useDispatch();

  /// global state
  const {
    GST,
    brands,
    categories,
    checkedCategory,
    checkedGST,
    checkedBrand,
    deepSearch,
  } = useSelector((state) => state.product);

  ///local state
  const [Opensortdialog, setOpensortdialog] = useState({
    category: false,
    brand: false,
    GST: false,
  });

  /// useEffect

  useEffect(() => {
    if (apiRef.current?.state) {
      apiRef?.current?.setPage(0);
      apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
    }
  }, [checkedBrand, checkedCategory, checkedGST]);

  /// handlers

  const handleOpenClose = (type) => {
    if (type === "brand") {
      setOpensortdialog({ ...Opensortdialog, brand: !Opensortdialog.brand });
      return;
    }

    if (type === "category") {
      setOpensortdialog({
        ...Opensortdialog,
        category: !Opensortdialog.category,
      });
      return;
    }
    if (type === "GST") {
      setOpensortdialog({
        ...Opensortdialog,
        GST: !Opensortdialog.GST,
      });
      return;
    }
  };

  // Update checked brands and local storage on change
  const handleCheckBoxChange = (item, type, isChecked) => {
    if (type === "brand") {
      setCheckedCategory([]);
      if (isChecked) {
        const index = checkedBrand.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedBrand];
          newChecked.splice(index, 1);

          dispatch(setCheckedBrand(newChecked));
        }
      } else {
        const newChecked = [...checkedBrand, item];

        dispatch(setCheckedBrand(newChecked));
      }
      return;
    }

    if (type === "category") {
      if (isChecked) {
        const index = checkedCategory.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedCategory];
          newChecked.splice(index, 1);
          dispatch(setCheckedCategory(newChecked));
        }
      } else {
        const newChecked = [...checkedCategory, item];
        dispatch(setCheckedCategory(newChecked));
      }
      return;
    }

    if (type === "GST") {
      if (isChecked) {
        const index = checkedGST.indexOf(item);
        if (index !== -1) {
          const newChecked = [...checkedGST];
          newChecked.splice(index, 1);
          dispatch(setCheckedGST(newChecked));
        }
      } else {
        const newChecked = [...checkedGST, item];
        dispatch(setCheckedGST(newChecked));
      }
      return;
    }
  };

  const handleClearFilters = () => {
    dispatch(setCheckedBrand([]));
    dispatch(setCheckedCategory([]));
    dispatch(setCheckedGST([]));
    dispatch(setDeepSearch(""));
    apiRef?.current?.setPage(0);
    apiRef?.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
  };

  return (
    <div>
      <StyledGrid container xl={12}>
        {count && count.length > 0 && (
          <Typography
            sx={{
              fontWeight: "bold",
              margin: "12px",
              padding: "2px",
              color: "black",
              background: "white",
              border: "2px solid black",
              borderRadius: "10px",
            }}
          >
            {" "}
            {count.length}
          </Typography>
        )}
        <FormGroup>
          <Box
            sx={{
              display: "flex",
              overflow: "hidden",
              flexWrap: "wrap",
              maxWidth: "100%",
              gap: "10px",
              paddingLeft: "10px",
              alignItems: "start",
            }}
          >
            <StyledButton onClick={() => handleOpenClose("brand")}>
              <Badge
                badgeContent={checkedBrand && checkedBrand.length}
                sx={{
                  color: "blue",
                }}
              >
                <Typography
                  variant="span"
                  sx={{
                    background: "transparent",
                    color: "gray",
                  }}
                >
                  Sort By Brand
                </Typography>
              </Badge>
            </StyledButton>
            <StyledButton onClick={() => handleOpenClose("category")}>
              <Badge
                badgeContent={checkedCategory && checkedCategory.length}
                sx={{ color: "blue" }}
              >
                <Typography
                  variant="span"
                  sx={{
                    background: "transparent",
                    color: "gray",
                  }}
                >
                  Sort By Category
                </Typography>
              </Badge>
            </StyledButton>
            <StyledButton onClick={() => handleOpenClose("GST")}>
              <Badge
                badgeContent={checkedGST && checkedGST.length}
                sx={{ color: "blue" }}
              >
                <Typography
                  variant="span"
                  sx={{
                    background: "transparent",
                    color: "gray",
                  }}
                >
                  Sort By GST
                </Typography>
              </Badge>
            </StyledButton>

            {(checkedBrand && checkedBrand.length >= 1) ||
            (checkedCategory && checkedCategory.length >= 1) ||
            (checkedGST && checkedGST.length >= 1) ||
            deepSearch ? (
              <StyledButton
                onClick={() => handleClearFilters()}
                sx={{ color: "red" }}
              >
                Clear All Filter
              </StyledButton>
            ) : (
              ""
            )}
            <Box
              sx={{
                marginTop: ".3rem",
                marginLeft: "1rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Box sx={{ flexBasis: "100%" }}>
                <TextField
                  size="small"
                  placeholder="Enter Product Name / SKU"
                  sx={{ minWidth: "230px" }}
                  value={deepSearch}
                  onChange={(e) => {
                    dispatch(setDeepSearch(e.target.value));
                  }}
                />
              </Box>
            </Box>
            {customButton ? (
              <Button
                variant="contained"
                onClick={customOnClick}
                sx={{
                  mt: 0.7,
                }}
              >
                {customButton}
              </Button>
            ) : (
              ""
            )}

            <Box
              sx={{
                mt: 0.7,
              }}
            >
              {customButton1}
            </Box>
            <Box
              sx={{
                mt: 0.7,
              }}
            >
              {customButton2}
            </Box>

            <Box
              sx={{
                mt: 0.7,
              }}
            >
              {customButton3}
            </Box>
            <Box
              sx={{
                mt: 0.7,
                // border: '2px solid green',
              }}
            >
              {customButton4}
            </Box>
            
            <Popover
              open={Opensortdialog.brand}
              sx={{ p: 2, width: "80vw" }}
              onClose={() => handleOpenClose("brand")}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 100, left: 280 }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ width: "80vw", height: "50vh" }}>
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "underline",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Sort By Brand{" "}
                </Typography>
                <TableContainer>
                  <Table aria-label="simple table" size="small">
                    <TableBody>
                      {brands?.map((item, index) => {
                        if (index % 7 === 0) {
                          const rowItems = brands.slice(index, index + 7);

                          return (
                            <TableRow key={index}>
                              {rowItems.map((rowItem, rowIndex) => {
                                const rowItemIndex = index + rowIndex;
                                const isChecked =
                                  checkedBrand.includes(rowItem);
                                return (
                                  <StyledTableCell
                                    align="left"
                                    key={rowItemIndex}
                                  >
                                    <FormControlLabel
                                      control={<Checkbox checked={isChecked} />}
                                      value={rowItem}
                                      label={rowItem}
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 15,
                                        },
                                        "& .MuiFormControlLabel-label": {
                                          fontSize: "14px",
                                        },
                                        paddingLeft: "10px",
                                      }}
                                      onChange={(event) =>
                                        handleCheckBoxChange(
                                          rowItem,
                                          "brand",
                                          isChecked
                                        )
                                      }
                                    />
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Popover>
            {/* GST */}
            <Popover
              open={Opensortdialog.GST}
              sx={{ p: 2, width: "80vw" }}
              onClose={() => handleOpenClose("GST")}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 100, left: 280 }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ width: "80vw", height: "50vh" }}>
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "underline",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Sort By GST{" "}
                </Typography>
                <TableContainer>
                  <Table aria-label="simple table" size="small">
                    <TableBody>
                      {GST?.map((item, index) => {
                        if (index % 7 === 0) {
                          const rowItems = GST.slice(index, index + 7);

                          return (
                            <TableRow key={index}>
                              {rowItems.map((rowItem, rowIndex) => {
                                const rowItemIndex = index + rowIndex;
                                const isChecked = checkedGST.includes(rowItem);
                                return (
                                  <StyledTableCell
                                    align="left"
                                    key={rowItemIndex}
                                  >
                                    <FormControlLabel
                                      control={<Checkbox checked={isChecked} />}
                                      value={rowItem}
                                      label={"GST " + rowItem + "%"}
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 15,
                                        },
                                        "& .MuiFormControlLabel-label": {
                                          fontSize: "14px",
                                        },
                                        paddingLeft: "10px",
                                      }}
                                      onChange={(event) =>
                                        handleCheckBoxChange(
                                          rowItem,
                                          "GST",
                                          isChecked
                                        )
                                      }
                                    />
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Popover>
            {/* GST end */}
            <Popover
              open={Opensortdialog.category}
              sx={{ p: 2, width: "80vw" }}
              onClose={() => handleOpenClose("category")}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 100, left: 280 }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ width: "80vw", height: "50vh" }}>
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "underline",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Sort By Category{" "}
                </Typography>

                <TableContainer>
                  <Table aria-label="simple table" size="small">
                    <TableBody>
                      {categories?.map((item, index) => {
                        if (index % 7 === 0) {
                          const rowItems = categories.slice(index, index + 7);

                          return (
                            <TableRow key={index}>
                              {rowItems.map((rowItem, rowIndex) => {
                                const rowItemIndex = index + rowIndex;
                                const isChecked =
                                  checkedCategory.includes(rowItem);
                                return (
                                  <StyledTableCell
                                    align="left"
                                    key={rowItemIndex}
                                  >
                                    <FormControlLabel
                                      control={<Checkbox checked={isChecked} />}
                                      value={rowItem}
                                      label={rowItem}
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 15,
                                        },
                                        "& .MuiFormControlLabel-label": {
                                          fontSize: "14px",
                                        },
                                        paddingLeft: "10px",
                                      }}
                                      onChange={(event) =>
                                        handleCheckBoxChange(
                                          rowItem,
                                          "category",
                                          isChecked
                                        )
                                      }
                                    />
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Popover>
          </Box>
        </FormGroup>
      </StyledGrid>
    </div>
  );
};

export default FilterBarV2;
