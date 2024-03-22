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
  Autocomplete
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
  { field: "InStock", headerName: "In Stock" },
  { field: "R&DStock", headerName: "In R&D Stock" },
  { field: "Requirement", headerName: "Requirement" },
//   { field: "Shortfall", headerName: "Shortfall" },
  { field: "Delete", headerName: "Remove" },
];
import { useCreateDiscountQueryMutation } from "../../../features/api/discountQueryApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
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
}) => {
  /// initialize
  const socket = useSocket();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  /// local state

  const [quantity, setQuantity] = useState({});
  const [Requireqty, setRequireqty] = useState({});

  const [formData, setFormData] = useState({
    description: "",
    customerName: "",
  });

  /// rtk query

  const [createQueryApi, { isLoading }] = useCreateDiscountQueryMutation();

  // handlers
 
  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      description: "",
      customerName: "",

    });
  };

  const handleQuantityChange = (event, item) => {
    // const updatedQTY = {};
    const oldQuantity = { ...quantity };
    oldQuantity[item.SKU] = +event.target.value;

    // data.forEach((item) => {
    //   const addValue = 20 + 3;
    //   if (!isNaN(oldQuantity[item.SKU])) {
    //     if (oldQuantity[item.SKU] > addValue) {
    //       updatedQTY[item.SKU] = oldQuantity[item.SKU] - addValue;
    //     }
    //   }
    // });

    setRequireqty(oldQuantity);
  
  };

  const handleSelectedChange = (event, newValue) => {
    if(newValue){
      setDatas({...datas,DroneModel:newValue.ModelName})
    }
  };
  // handling send query
  const handleSubmit = async (status) => {
    let cancel = false;
    if (data.length) {
      const newProceesedData = data.map((item) => {
        if (!quantity[item.SKU]) {
          cancel = true;
        }
        return {
          ...item,
          reqQty: quantity[item.SKU],
          discountPercent: discountPercent[item.SKU]
            ? discountPercent[item.SKU]
            : 0,
        };
      });

      if (cancel) {
        toast.error("Quantity missing for some product");
        return;
      }

      if (!formData.mobileNo || !formData.customerName) {
        toast.error("please enter a customer name and mobile number");
        return;
      }
      if (!isValidMobileNumber(formData.mobileNo)) {
        toast.error("Please enter a valid mobile number");
        return;
      }
      const productsWithDiscount = newProceesedData.map((product, index) => {
        const discountPercentage = product.discountPercent;
        const salesPrice = product.SalesPrice;
        const discountAmount = (discountPercentage / 100) * salesPrice;
        const discountPrice = salesPrice - discountAmount;

        return {
          ...product,
          discountPrice: discountPrice,
          totalPrice: calculatedValue[product.SKU],
        };
      });

      try {
        const params = {
          Data: productsWithDiscount,
          CustomerName: formData.customerName,
          MobileNo: formData.mobileNo,
          Message: formData.description,
          status: status,
          GST: gstAgg,
        };

        const res = await createQueryApi(params).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created a New DiscountQuery for Customer ${formData.customerName} `,
          time: new Date(),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success(res.message);
        setQuantity({});

        setFormData({
          description: "",
          customerName: "",
        });
        dispatch(removeSelectedCreateQuery());
        dispatch(removeSelectedSkuQuery());
        handleCloseDialog();
      } catch (e) {
        console.log("error at Discount Query create ", e);
      }
    }
  };

  return (
    <div style={{}}>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
        
        }}>
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
            Create Requirement
          </Typography>
          <CancelIcon
            onClick={(event) => {
              setOpen(false);
            }}
          />
        </Box>
        <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      px:3
                  
                    }}
                  >
                    {/* <h3 style={{ margin: "0 0 0 100px" }}>Select</h3> */}
                    <Autocomplete
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255)",
                      }}
              
                      options={data?.data || []}
                      getOptionLabel={(option) => option.ModelName}
                      onChange={handleSelectedChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Project Name"
                          size="small"
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                
                        />
                      )}
                    />
                  </Box>
        </Box>

        <DialogContent>
      
          <TableContainer sx={{ maxHeight: "60vh" }}>
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
                        ₹ {item.SalesPrice.toFixed(2)}
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
                          value={
                            Requireqty[item?.SKU] === 0 ? "" : Requireqty[item?.SKU]
                          }
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                        />
                      </StyleTable>

                      {/* <StyleTable>
                        {isNaN(quantity[item.SKU]) ? "" : Requireqty[item.SKU]}
                      </StyleTable> */}

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
          {/* <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#80bfff",
              }}
            >
              
            </Typography>
         
          </Box> */}

          {/* another section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: " 2rem",
              marginTop: ".7rem",
              paddingX: "2rem",
              paddingBottom: ".6rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "50%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1.4rem", fontWeight: "bold" }}
              >
                Descriptions :
              </Typography>
              <textarea
                style={{ height: "3rem", resize: "none" }}
                placeholder="Kindly write your customer-related query here"
                value={formData.description}
                name="description"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
            </Box>
            <Box
              sx={{
                flexBasis: "25%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "1.7rem",
                gap: ".5rem",
              }}
            >
              {" "}
              <Button
                disabled={isLoading}
                variant="contained"
                onClick={() => {
                  handleSubmit("pending");
                }}
                sx={{
                    width: "150px"
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Send Request"
                )}
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => {
                  handleSubmit("close");
                }}
                variant="contained"
                color="primary"
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show loading indicator
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
            <Box
              sx={{
                flexBasis: "30%",
                marginTop: "2rem",
              }}
            >
              <TextField
                sx={{ backgroundColor: "#fff" }}
                placeholder="Initiator Name"
                size="small"
                fullWidth
                value={formData.customerName}
                name="customerName"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  });
                }}
              />
            </Box>
          </Box>
        </StyledBox>
      </Dialog>
    </div>
  );
};

export default CreateReqDial;
