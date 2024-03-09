import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAddBulkSellerPriceMutation } from "../../../features/api/productApiSlice";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
const RangeDial = ({ data, open, close, refetch }) => {
  const [isVerify, setIsverify] = useState(null);

  const [setBulk, { isLoading }] = useAddBulkSellerPriceMutation();

  const handleCheck = (e) => {
    const { value } = e.target;

    if (value < data.Mqr) {
      alert("Input value is not less than the minimum quantity requested.");
      setIsverify(true);
      return;
    }
    setIsverify(false);
  };
  const [inputData, setInputData] = useState([
    { from: data.Mqr, to: "", price: "", discount: "" },
  ]);

  useEffect(() => {
    if (data.bulkSellerPrice.length > 0) {
      setInputData([...data.bulkSellerPrice]);
    }
  }, []);

  const handleAddRow = () => {
    setInputData([...inputData, { from: "", to: "", price: "", discount: "" }]);
  };
  const handleDeleteRow = (index) => {
    const newData = [...inputData];
    newData.splice(index, 1);
    setInputData(newData);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
     const newData = [...inputData];
    const sellPrice = +data.SellerPrice;
    if (name === "price") {
      if (value > sellPrice) {
        return;
      }
      newData[index]["price"] = +value;
      newData[index]["discount"] = (
        ((sellPrice - +value) / sellPrice) *
        100
      ).toFixed(0);
      setInputData(newData);
    } else if (name === "discount") {
      if (+value > 100) {
        return;
      }
      newData[index]["discount"] = +value;
      newData[index]["price"] =
        sellPrice - (sellPrice * (+value / 100)).toFixed(0);
      setInputData(newData);
    } else {
      newData[index][name] = +value;
      setInputData(newData);
    }
  };
  const areAllKeysFilled = (obj) => {
    for (let key in obj) {
      if (!obj[key]) {
        return false;
      }
    }
    return true;
  };

  const HandleSubmit = async () => {
    const isValid = inputData.every((item) => areAllKeysFilled(item));
    if (isVerify) {
      toast.error(
        "Input value is not less than the minimum quantity requested."
      );
      return;
    }
    if (!isValid) {
      toast.error("Please fill all the required feildes.");
      return;
    }
    try {
      const info = {
        datas: [
          {
            sku: data.SKU,
            sellerPrice: inputData,
          },
        ],
      };
      const res = await setBulk(info).unwrap();

      toast.success("Successfully submitted");
      setInputData([{ from: data.Mqr, to: "", price: "", discount: "" }]);
      close();
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* Dialog info Box */}

      <Dialog open={open} onClose={close} maxWidth="xl">
        <DialogTitle
          align="center"
          backgroundColor="#040678"
          color="white"
          fontFamily="1rem"
          sx={
            {
              // display: isClicked === this.index ? 'flex' : 'flex'
            }
          }
        >
          <Typography> SKU: {data.SKU}</Typography>
          <Typography> {data.Name} </Typography>
        </DialogTitle>

        {data?.bulkSellerPrice ? (
          <DialogContent>
            {/* columns info */}
            <Box sx={{display:"flex" ,justifyContent:"space-between" ,alignItems:"center"}}>
            <Typography sx={{ fontWeigth: "bold", marginTop: 2 }}>
              Seller Price:{" "}
              <span style={{ color: "red" }}>
                ₹ {(+data.SellerPrice).toFixed(0)}
              </span>
            </Typography>
            
                          <Button variant="contained" sx={{background:"green"}} onClick={() => handleAddRow()}>
                            <AddIcon />
                          </Button>
                          </Box>
            <TableContainer
              component={Paper}
              sx={{ height: 400, overflow: "auto", marginTop: "1rem" }}
            >
              <Table sx={{ minWidth: 350 }} size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      position: "sticky",
                      top: 0,
                      background: "white",
                      zIndex: 1,
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      QTY Range
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Discount %
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inputData?.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex" }}>
                          <input
                            type="number"
                            name="from"
                            onBlur={handleCheck}
                            value={inputData[index]?.from}
                            onChange={(e) => handleInputChange(index, e)}
                            style={{
                              width: "3rem",
                              textAlign: "center",
                            }}
                          />
                          <Typography sx={{ margin: "2px" }}>-</Typography>
                          <input
                            type="number"
                            name="to"
                            value={inputData[index]?.to}
                            onChange={(e) => handleInputChange(index, e)}
                            style={{
                              width: "3rem",
                              textAlign: "center",
                              height: "2rem",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="number"
                          name="price"
                          value={inputData[index]?.price}
                          onChange={(e) => handleInputChange(index, e)}
                          style={{
                            width: "10rem",
                            height: "2rem",
                            textAlign: "center",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="number"
                          name="discount"
                          value={inputData[index]?.discount}
                          onChange={(e) => handleInputChange(index, e)}
                          style={{
                            width: "5rem",
                            textAlign: "center",
                            height: "2rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {inputData.length > 0 && (
                      
                            <DeleteIcon onClick={() => handleDeleteRow(index)} sx={{color:"gray", "&:hover":{
                              color:"red",cursor: "pointer"
                            }}} />
                       
                        )}
                    
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        ) : (
          ""
        )}

        <DialogActions>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={HandleSubmit}
          >
            {isLoading ? (
              <CircularProgress style={{ color: "#fff" }} size={30} />
            ) : (
              "Save"
            )}
          </Button>
          <Button variant="contained" onClick={close}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RangeDial;
