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
import { useEffect } from "react";
import { toast } from "react-toastify";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "Stock in Logistics" },
  { field: "R&DStock", headerName: "New Parts" },
  { field: "Old", headerName: "Old Parts" },
  { field: "Require QTY", headerName: "Require QTY" },
  { field: "UseOld", headerName: "Use Old Parts" },
  { field: "Pre Order QTY", headerName: "Pre Order QTY" },

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

import { useSelector } from "react-redux";
import { TabOutlined } from "@mui/icons-material";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));

const CreateReqDial = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
  removeSelectedCreateQuery,
  removeSelectedSkuQuery,
  dispatch,
  id ,
  name
}) => {
  /// initialize
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state

  const [Requireqty, setRequireqty] = useState([]);
  const [preOrder , setPreorder] = useState(null);
  const[Error , setError] = useState({})

  /// rtk query

  const [createQueryApi, { isLoading }] = useCreateRandDInventryMutation();

  // handlers

  const handleCloseDialog = () => {
    setOpen(false);
  };
  useEffect(() => {
let newData = []

newData = data.map(data => {
  return {
    SKU: data.SKU,

  }
})

  
setRequireqty(newData)
    
  }, [data]);


  const handleQuantityChange = (event, item) => {
    const { value, name } = event.target;

    const result = Requireqty.map(doc => {
      if (doc.SKU === item.SKU) {
        if (item.Quantity !== undefined) {
          if (item.Quantity < value) {
            let preOrder = value - +item.Quantity;
            return {
              ...doc,
              Quantity: +item.Quantity,
              OldQty: 0,
              PreOrder: preOrder
            };
          } else if (item.Quantity >= value) {
            return {
              ...doc,
              Quantity: +value,
              OldQty: 0,
              PreOrder: 0
            };
          }
        } else if (item.Newqty !== undefined) {
          if (item.Newqty >= value && name === "reqQTY") {
           
            return {
              ...doc,
              Quantity: +value,
              OldQty: 0,
              PreOrder: 0
            };
          } else if (item.Newqty < value && name === "reqQTY" ) {
            let preOrder = value - +item.Newqty;
            setPreorder(preOrder)
            return {
              ...doc,
              Quantity: item.Newqty,
              OldQty: 0,
              PreOrder: preOrder
            };
          }else if (item.Oldqty !== undefined && name === "Oldparts") {
         
            let error = +value > item.Oldqty ? +value : 0
            if (item.Oldqty > 0 ) {
            let isPreorder = preOrder && preOrder >= +value ? preOrder - +value : preOrder;
       
        
            return {
              ...doc,
              Quantity: item.Newqty,
              OldQty: +value > item.Newqty ? 0 : +value,
              PreOrder: isPreorder || 0 ,
              error: error
              
            };
          }
        
        }
        }
    }
      return doc;
    });
  
    setRequireqty(result);
  };
  

  // handling send query
  const handleSubmit = async () => {
    try {
      const requestData = data.map((item) => ({
        ...item,
        ReqQty: Number(Requireqty[item.SKU]) || 0,
      }));
      const filterData = requestData.filter((item) => item.ReqQty === 0);
      if (filterData.length > 0) return toast.error("Missing Require Quantiy");
      const result = await createQueryApi({ datas: requestData }).unwrap();
      const resultMessage = requestData.map((item) => {
        const Name = item.Name;
        const Req = item.ReqQty;
        return ` ${Name} of ${Req} pcs`;
      });

      const liveStatusData = {
        message: `${userInfo.name} has created requirement for ${resultMessage.join(", ")}`,
        time: new Date(),
      };
      socket.emit("liveStatusServer", liveStatusData);
      toast.success("Request Query Sent Successfully");
      dispatch(removeSelectedCreateQuery());
      dispatch(removeSelectedSkuQuery());
      removeSelectedItems([]);
      handleCloseDialog();
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
            sx={{cursor:"pointer" ,"&:hover":{color:"red"}}}
              onClick={(event) => {
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <Box sx={{display:"flex" ,justifyContent:"space-between"}}>
          <Typography variant="span" fontWeight="bold" fontSize={"12px"}>Project Id : <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>{id}</Typography></Typography>
          <Typography variant="span" fontWeight="bold" fontSize={"12px"}>Project Name : <Typography variant="span" fontWeight="lighter" fontSize={"12px"}>{name}</Typography></Typography>
          </Box>
          <TableContainer sx={{ maxHeight: "60vh" ,marginTop:"0.3rem" }}>
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
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {item.Newqty}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {item.Oldqty}
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
                          name="reqQTY"
                          // value={Requireqty[index].Quantity}
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
                          name="Oldparts"
                          disabled={item.Oldqty === 0 || !item.Oldqty}
                          value={Requireqty[item.SKU]}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error ={Requireqty[index]?.error > 0}
                          helperText ={Requireqty[index]?.error > 0 ? <spna style={{fontSize:"9px"}}>Enter valid Qty!</spna> : ""}
                        />
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "99px" }}>
                        {Requireqty[index]?.PreOrder}
                      </StyleTable>
                      <StyleTable>
                        <DeleteIcon
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

export default CreateReqDial;
