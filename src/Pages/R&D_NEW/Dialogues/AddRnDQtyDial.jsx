import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  styled,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import { setAddparts } from "../../../features/slice/R&DSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "Store Qty" },
  { field: "NewQty", headerName: "R&D Qty" },
  { field: "OldQty", headerName: "Old Qty" },

  { field: "Delete", headerName: "Remove" },
];
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useQuantityUpdateRnDMutation } from "../../../features/api/productApiSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

import { TabOutlined } from "@mui/icons-material";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));
import {
  useAddProjectItemMutation,
  useGetSingleProjectQuery,
} from "../../../features/api/RnDSlice";
import { useNavigate } from "react-router-dom";
const AddRnDQtyDial = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
  removeSelectedCreateQuery,
  removeSelectedSkuQuery,
  setSelectedItemsData,
  selectedItemsData,
  selectedItems,
  id,
  name,
  setSelectedItems,
  refetch,
  updateValue ,
  setUpdateValue
}) => {
  /// initialize
  const socket = useSocket();
  const navigate = useNavigate();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);
  const { Addparts } = useSelector((state) => state.RAndDForm);

  /// local state

  const [NewQty, setNewQty] = useState({});
  const [OldQty, setOldQty] = useState({});
  

  /// rtk query

  const [updateQty, { isLoading }] = useQuantityUpdateRnDMutation();

  useEffect(() => {
    if (open) {
      return;
    }
    return () => {
      setSelectedItems([]);
      setSelectedItemsData([]);
    };
  }, []);

  const dispatch = useDispatch();
  // handlers
  // const [
  //   addProjectItems,
  //   { isLoading: addProjectLoading, refetch: addRefetch },
  // ] = useAddProjectItemMutation();
  // const handleCloseDialog = () => {
  //   setOpen(false);
  // };

  useEffect(() => {
    let newData = [];
    newData = data?.map((data) => {
  
      return {
        SKU: data.SKU,
        NewQty: data.NewQty,
        OldQty: data.OldQty,
      };
      
    });
    setUpdateValue(newData);
  }, [setOpen,open]);

  // useEffect (()=>{
  // for(const products of data){
  //   setNewQty({
  //     SKU: products.SKU,
  //     NewQty: products.NewQty,
 
  //   });
  //   setOldQty({
  //     SKU: products.SKU,
  //     OldQty: products.OldQty,
 
  //   });
  // }

  // },[data])

 

  useEffect(() => {
    dispatch(setAddparts(updateValue));
  }, [setSelectedItems, selectedItems]);
  //Reset value after delete elements
  useEffect(() => {
    const matchingArray = [];
    selectedItemsData.forEach((item) => {
      const match = Addparts.find((items) => item.SKU === items.SKU);
      if (match) {
        matchingArray.push(match);
      }
    });

    if (matchingArray.length > 0) {
      setUpdateValue(matchingArray);
    }
  }, [setUpdateValue]);

  console.log(updateValue);

  const handleQuantityChange = (event, item) => {
    const { value, name } = event.target;

    setUpdateValue((prev) => {
      return prev.map((data) => {
        if (data.SKU === item.SKU) {
          if (name === "NewQty") {
            setNewQty((prevOldQty) => ({
              ...prevOldQty,
              [item.SKU]: +value,
            }));
            return {
              ...data,
              NewQty: +value,
            };
          } else {
            setOldQty((prevOldQty) => ({
              ...prevOldQty,
              [item.SKU]: +value,
            }));
            return {
              ...data,
              OldQty: +value,
            };
          }
        } else {
          return data;
        }
      });
    });
  };

  // handling send query
  const handleSubmit = async () => {
    try {
      let info = {
        items: updateValue,
      };

      const result = await updateQty(info).unwrap();

      toast.success("Quantity add successfully");
      dispatch(removeSelectedCreateQuery());
      dispatch(removeSelectedSkuQuery());
      removeSelectedItems([]);
      setNewQty({});
      setOldQty({});
      setUpdateValue([]);
      setSelectedItems([]);
      setSelectedItemsData([]);
      refetch();
      setOpen(false);
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              paddingTop: ".5rem",
              paddingX: ".7rem",
            }}
          >
            <Typography
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.3rem",
              }}
            >
              Add Parts Quantity
            </Typography>
            <CancelIcon
              sx={{ cursor: "pointer", "&:hover": { color: "red" } }}
              onClick={(event) => {
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <TableContainer sx={{ maxHeight: "60vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".8rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {index + 1}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.SKU}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "150px" }}>
                        {item.Name}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Brand}
                      </StyleTable>

                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "80px" }}>
                        {item.GST} %
                      </StyleTable>

                      <StyleTable>{item.Quantity}</StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          name="NewQty"
                          value={updateValue[index]?.NewQty}
                     
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>
                      <StyleTable>
                        <TextField
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          name="OldQty"
                          value={updateValue[index]?.OldQty}
                   
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>
                      <StyleTable>
                        <DeleteIcon
                          sx={{
                            "&:hover": {
                              color: "red",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            removeSelectedItems(item.SKU);
                          }}
                        />
                      </StyleTable>
                    </TableRow>
                  );
                })}

                <TableRow></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <StyledBox>
          {/* another section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: " 2rem",
              marginTop: ".7rem",
              paddingX: "2rem",
              paddingBottom: ".6rem",
            }}
          >
            {" "}
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
              sx={{
                width: "150px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "update"
              )}
            </Button>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default AddRnDQtyDial;
