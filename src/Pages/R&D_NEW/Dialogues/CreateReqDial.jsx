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
import {
  setSelectedItemsRandD,
  setSelectedSkusRandD,
} from "../../../features/slice/R&DSlice";

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
  { field: "R&DStock", headerName: "New Parts" },
  { field: "Old", headerName: "Old Parts" },
  { field: "FromStore", headerName: "From Store" },
  { field: "Require QTY", headerName: "Use New Parts" },
  { field: "UseOld", headerName: "Use Old Parts" },
  { field: "TotalReq", headerName: "Total Requirement" },
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
import SliderValueLabel from "@mui/material/Slider/SliderValueLabel";
const CreateReqDial = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
  removeSelectedCreateQuery,
  removeSelectedSkuQuery,
  // setSelectedItemsData,
  // selectedItemsData,
  id,
  name,
  refetch,
}) => {
  /// initialize
  const socket = useSocket();
  const navigate = useNavigate();
  const [localData, setLocalData] = useState(data);
  /// global state
  const { userInfo } = useSelector((state) => state.auth);
  const { Addparts } = useSelector((state) => state.RAndDForm);

  /// local state

  const [Requireqty, setRequireqty] = useState([]);
  const [StoreQty, setStoreQty] = useState({});
  const [OldQty, setOldQty] = useState({});
  const [Error, setError] = useState(false);
  const [NewQty, setNewQty] = useState({});
  const [updatedreq, setUpdatedreq] = useState([]);

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
        Name: data.Name,
        SKU: data.SKU,
        Brand: data.Brand,
        GST: data.GST,
        ActualQuantity: data.ActualQuantity,
        Newqty: data.NewQty,
        Oldqty: data.OldQty,
      };
    });
    setUpdatedreq(newData);
  }, [setOpen, open, data]);

  const handleDelete = (sku) => {
    // deleted the sku from local and redux both
    const filterData = data.filter((data) => data.SKU !== sku);
    // setLocalData([filterData]);
    dispatch(setSelectedItemsRandD(sku));
    dispatch(setSelectedSkusRandD(sku));
    setUpdatedreq([]);
  };

  useEffect(() => {
    dispatch(setAddparts(Requireqty));
  }, [setStoreQty, setOldQty, setNewQty, OldQty, NewQty, StoreQty]);

  //Reset value after delete elements
  // useEffect(() => {
  //   const matchingArray = [];
  //   selectedItemsData.forEach((item) => {
  //     const match = Addparts.find((items) => item.SKU === items.SKU);
  //     console.log(match);
  //     if (match) {
  //       matchingArray.push(match);
  //     }
  //   });

  //   if (matchingArray.length > 0) {
  //     setRequireqty(matchingArray);
  //   }
  // }, [selectedItemsData, setSelectedItemsData]);

  // const handleQuantityChange = (event, item) => {
  //   console.log(item)
  //   const { value, name } = event.target;
  //   let error = '';
  //   let InStore = '';
  //   let Restock = '';
  //   let SubTotal = "";
  //   let NewQty = "";

  //   if (name === "reqQTY") {
  //     setNewqty({...Newqty,[item.SKU]: value})
  //     NewQty = +item.NewQty
  //     InStore = +item.ActualQuantity
  //     SubTotal = +item.NewQty + +InStore
  //     Restock = +SubTotal - +value < 0 ? +value - +SubTotal  : 0
  //     setRestock({...restock,[item.SKU]: Restock})
  //     } else if (name === "Oldparts") {
  //     if (value > item.OldQty) {
  //       error = 'Enter a value less than or equal to Old Qty';
  //     } else {
  //       setOldqty({ ...Oldqty, [item.SKU]: value });
  //     }

  //   }

  // };

  // const handleQuantityChange = (event, item) => {
  //   const { value, name } = event.target;

  //   let error = '';
  //   let InStore = '';
  //   let Restock = '';
  //   let SubTotal = '';
  //   let NewQty = '';
  //   let OldQty = '';
  //   let RequireQty = ''

  //   if (name === "reqQTY") {
  //     NewQty = +item.NewQty;
  //     InStore = +item.ActualQuantity;

  //     SubTotal = NewQty + InStore;
  //     if(value > SubTotal) {
  //       Restock = SubTotal - +value < 0 ? +value - SubTotal : 0;
  //     }else {
  //       if(value <= +item.NewQty) {
  //         NewQty = +item.NewQty - value
  //         InStore = 0
  //       }else {
  //         InStore = +value - +item.NewQty
  //         SubTotal = NewQty + InStore;
  //         Restock =  Math.abs(+value - SubTotal)  ;
  //       }

  //     }

  //     RequireQty = +value
  //     setNewqty({ [item.SKU]: value });
  //   } else if (name === "Oldparts") {
  //     if (value > item.OldQty) {
  //       error = 'Enter a value less than or equal to Old Qty';
  //       console.error(error); // Or handle the error as needed
  //     } else {

  //       // if(value > SubTotal) {
  //       //   Restock = SubTotal - +value < 0 ? +value - SubTotal : 0;
  //       // }else {

  //       //   InStore = +item.ActualQuantity - +item.NewQty
  //       //   SubTotal = NewQty + InStore;
  //       //   Restock = +value - SubTotal  ;
  //       // }
  //       // NewQty = +item.NewQty;
  //       InStore = +item.ActualQuantity
  //       // SubTotal = NewQty + InStore;
  //       OldQty = +value
  //     }
  //   }

  //   const result = Requireqty.map((doc) => {
  //     if (doc.SKU === item.SKU) {
  //       return {
  //         ...doc,
  //         NewQty: item.NewQty,
  //         Restock: name === "Oldparts" ? OldQty ? doc.Restock - OldQty : doc.Restock + doc.OldQty : Restock || 0 ,
  //         InStore: InStore,
  //         OldQty : OldQty || 0,
  //         RequireQty: RequireQty || doc.RequireQty,
  //         error: error,
  //       };
  //     }
  //     return doc;
  //   });

  //   setRequireqty(result);
  // };

  //   const handleQuantityChange = (event, item) => {
  //   const { value, name } = event.target;
  // if(name === "NewQty"){
  //   if(value > item.NewQty){
  //     setError({...Error ,[item.SKU]:"Enter a value less than or equal to New Parts Qty"})
  //   }else{
  //     setError({...Error ,[item.SKU]:""})
  //     setNewQty({...NewQty ,[item.SKU]:+value})
  //   }

  // }else if(name === "OldQty"){
  //   if(value > item.OldQty){
  //     setError({...Error ,[item.SKU]:"Enter a value less than or equal to Old Parts Qty"})
  //   }else{
  //     setError({...Error ,[item.SKU]:""})
  //     setOldQty({...Oldqty,[item.SKU]:+value})
  //   }

  // }else if(name === "StoreQty"){
  //   if(value > item.InStock){
  //     setError({...Error ,[item.SKU]:"Enter a value less than or equal to In Store Qty"})
  //   }else{
  //     setError({...Error ,[item.SKU]:""})
  //     setStoreQty({...StoreQty,[item.SKU]:+value})
  //   }

  // }

  //   }

  const handleQuantityChange = (event, item) => {
    const { value, name } = event.target;

    setUpdatedreq((prev) =>
      prev.map((req) => {
        if (req.SKU === item.SKU) {
          // Ensure you update the correct item
          let newReq = { ...req };

          if (name === "NewQty") {
            if (value > item.Newqty) {
              newReq.NewQtyError = "Enter valid New Parts Qty";
              setError(true);
            } else {
              newReq[name] = value;
              newReq.NewQtyError = "";
              setError(false);
            }
          } else if (name === "OldQty") {
            if (value > item.Oldqty) {
              newReq.OldQtyError = "Enter valid Old Parts Qty";
              setError(true);
            } else {
              newReq[name] = value;
              newReq.OldQtyError = "";
              setError(false);
            }
          } else if (name === "StoreQty") {
            if (value > item.ActualQuantity) {
              newReq.StoreQtyError = "Enter valid In Store Qty";
              setError(true);
            } else {
              newReq[name] = value;
              newReq.StoreQtyError = "";
              setError(false);
            }
          }

          newReq.Total =
            Number(newReq.NewQty || 0) +
            Number(newReq.OldQty || 0) +
            Number(+newReq.StoreQty || 0);

          return newReq;
        }
        return req;
      })
    );
  };

  console.log(updatedreq);

  // useEffect(()=>{
  // let result = Requireqty.map((doc)=>{

  // return{
  // SKU:doc.SKU,
  // ReqQTY,
  // OldQTY,
  // error,
  // useRNDNewparts,
  // useRNDOldparts,
  // fromStore,
  // }

  // },
  // )
  // setUpdatedreq(result)
  // }, [setStoreQty, setOldQty, setNewQty, OldQty , NewQty, StoreQty]);

  useEffect(() => {
    return () => {
      removeSelectedItems([]);
      setUpdatedreq([]);
    };
  }, [setOpen]);

  // handling send query
  const handleSubmit = async () => {
    try {
      let info = {
        id: id,
        items: updatedreq,
      };
      console.log(info);
      if (Error) return toast.error("Missing Require Quantiy");
      const result = await addProjectItems(info).unwrap();

      toast.success("Parts add successfully");
      dispatch(removeSelectedCreateQuery());
      dispatch(removeSelectedSkuQuery());
      removeSelectedItems([]);
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
            <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
              Project Id :{" "}
              <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>
                {id}
              </Typography>
            </Typography>
            <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
              Project Name :{" "}
              <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>
                {name}
              </Typography>
            </Typography>
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
                {updatedreq.map((item, index) => {
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
                        {item.ActualQuantity}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {item.Newqty}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {item.Oldqty}
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
                          name="StoreQty"
                          value={item.StoreQty}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error={item.StoreQtyError}
                          helperText={
                            item.StoreQtyError ? (
                              <span style={{ fontSize: "9px" }}>
                                Enter valid Qty!
                              </span>
                            ) : (
                              ""
                            )
                          }
                        />
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
                          name="NewQty"
                          value={item.NewQty}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error={item.NewQtyError}
                          helperText={
                            item.NewQtyError ? (
                              <span style={{ fontSize: "9px" }}>
                                Enter valid Qty!
                              </span>
                            ) : (
                              ""
                            )
                          }
                        />
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
                          name="OldQty"
                          disabled={item.Oldqty == "" || item.Oldqty < 0}
                          value={item.OldQty}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error={item.OldQtyError}
                          helperText={
                            item.OldQtyError ? (
                              <span style={{ fontSize: "9px" }}>
                                Enter valid Qty!
                              </span>
                            ) : (
                              ""
                            )
                          }
                        />
                      </StyleTable>

                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {item.Total}
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
                            handleDelete(item.SKU);
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
                <CircularProgress size={24} color="#fff" />
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

export default CreateReqDial;
