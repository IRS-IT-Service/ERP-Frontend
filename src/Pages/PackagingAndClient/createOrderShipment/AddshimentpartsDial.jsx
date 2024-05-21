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
  Grid,
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
  { field: "InStock", headerName: "In Store" },
 { field: "Require QTY", headerName: "Require QTY" },
  { field: "Delete", headerName: "Remove" },
];
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useCreateRandDInventryMutation } from "../../../features/api/barcodeApiSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

import { InfoRounded, TabOutlined } from "@mui/icons-material";
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

const AddshipmentDial = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
  removeSelectedCreateQuery,
  removeSelectedSkuQuery,
  setSelectedItemsData,
  selectedItemsData,
  id,
  name,
  refetch,
}) => {
  /// initialize
  const socket = useSocket();
  const navigate = useNavigate();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);
  const { Addparts } = useSelector((state) => state.RAndDForm);

  /// local state

  const [Requireqty, setRequireqty] = useState([]);
  const [preOrder, setPreorder] = useState(null);
  const [qty, setQty] = useState({});
  const [finalData, setFinalData] = useState([{}]);
  const [FinalPreorder, setFinalPreorder] = useState({});

  /// rtk query

  const [createQueryApi, { isLoading }] = useCreateRandDInventryMutation();

  const dispatch = useDispatch();
  // handlers
  const [
    addProjectItems,
    { isLoading: addProjectLoading, refetch: addRefetch },
  ] = useAddProjectItemMutation();
  const handleCloseDialog = () => {
    setOpen(false);
  };
  useEffect(() => {
    let newData = [];
    newData = data.map((data) => {
      return {
        SKU: data.SKU,
        Name: data.Name,
      };
    });
    setRequireqty(newData);
  }, [setOpen, open]);


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
      setRequireqty(matchingArray);
    }
  }, [selectedItemsData, setSelectedItemsData]);

  const handleQuantityChange = (event, item) => {
    const { value, name } = event.target;
    let error = false;

  
      setQty({ ...qty, [item.SKU]: value });
      setRequireqty((prev)=>{
        return prev.map((data) => {
          if (data.SKU === item.SKU) {
            if(value > item.Quantity) {
              error = true;
            }
            
            return {
             ...data,
              Qty: value,
          error:error
            };
          }
          return data;
        });
      })
    



  };


  console.log(Requireqty)
  useEffect(() => {
    return () => {
      removeSelectedItems([]);
    

      setPreorder();
      setRequireqty([]);
    };
  }, [setOpen]);

  // handling send query
  const handleSubmit = async () => {
    try {
      const requestData = Requireqty.filter((item) => item.Quantity);
      console.log(Requireqty);
      let info = {
        id: id,
        items: Requireqty,
      };
      console.log(info);
      const filterData = requestData.filter((item) => item.error > 0);
      if (filterData.length > 0) return toast.error("Missing Require Quantiy");
      const result = await addProjectItems(info).unwrap();

      toast.success("Parts add successfully");
      dispatch(removeSelectedCreateQuery());
      dispatch(removeSelectedSkuQuery());
      removeSelectedItems([]);
      setNewqty({});
      setOldqty({});
      setPreorder();
      refetch();
      handleCloseDialog();
      navigate("/Project");
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
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
              ADD PARTS
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
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Company Name{" "}
                </Typography>
                <Autocomplete
                style={{
                  width: "80%",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                options={data?.data || []}
                getOptionLabel={(option) => option.ModelName}
                // onChange={handleSelectedChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select"
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                    size="small"
                  />
                )}
              />
            
              </Grid>
              <Grid
                item
                xs={3.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
      
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Contact person{" "}
                </Typography>
                <Autocomplete
                style={{
                  width: "75%",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                options={data?.data || []}
                getOptionLabel={(option) => option.ModelName}
                // onChange={handleSelectedChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select"
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                    size="small"
                  />
                )}
              />
              </Grid>
              <Grid
                item
                xs={3.5}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
           
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Upload Invoice{" "}
                </Typography>
                <input
                  name="reqQTY"
                  type="file"
                  //   value={Newqty[item.SKU]}
            
                  onChange={(event) => {
                    // handleQuantityChange(event, item);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Billing Address{" "}
                </Typography>
                <Autocomplete
                style={{
                  width: "50%",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                options={data?.data || []}
                getOptionLabel={(option) => option.ModelName}
                // onChange={handleSelectedChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select"
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                    size="small"
                  />
                )}
              />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Shipping Address{" "}
                </Typography>
                <Autocomplete
                style={{
                  width: "50%",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                options={data?.data || []}
                getOptionLabel={(option) => option.ModelName}
                // onChange={handleSelectedChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select"
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                    size="small"
                  />
                )}
              />
              </Grid>
            </Grid>
          </Box>
          <TableContainer sx={{ maxHeight: "60vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".7rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => {
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
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Quantity}
                      </StyleTable>
              
                   
                      <StyleTable>
                        <TextField
                          autocomplete={false}
                          size="small"
                          sx={{
                            "& input": {
                              height: "10px",
                              maxWidth: "30px",
                            },
                          }}
                          name="Qty"
                            value={qty[item.SKU]}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error={Requireqty[index]?.error}
                          helperText={
                            Requireqty[index]?.error  ? (
                              <spna style={{ fontSize: "9px" }}>
                                Enter valid Qty!
                              </spna>
                            ) : (
                              ""
                            )
                          }
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
                "Add Parts"
              )}
            </Button>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default AddshipmentDial;
