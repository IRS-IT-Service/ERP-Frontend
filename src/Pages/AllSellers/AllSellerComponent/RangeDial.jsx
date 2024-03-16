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
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAddBulkSellerPriceMutation } from "../../../features/api/productApiSlice";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
const RangeDial = ({ data, open, close, refetch }) => {
  const [isVerify, setIsverify] = useState(null);
  const sellerWithGst = ((+data.SellerPrice / 100) * (100 + +data.GST)).toFixed(
    0
  );
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
    { from: data.Mqr + 1, to: "", price: "",priceWithGST:"", discount: "" },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (data.bulkSellerPrice.length > 0) {
      setInputData([...data.bulkSellerPrice]);
    }
  }, []);


    const handleAddRow = () => {
      if (inputData.length > 0 && inputData[inputData.length - 1].to < inputData[inputData.length - 1].from) {
        setError("Please fill maximum range");
        return;
      }
    
      const newFrom = inputData.length > 0 ? inputData[inputData.length - 1].to + 1 : data.Mqr + 1;
    
      setInputData([...inputData, { from: newFrom, to: "", price: "", priceWithGST: "", discount: "" }]);
      setError("");
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
      let newPrice = sellPrice - (sellPrice * (+value / 100)).toFixed(0);
      newData[index]["discount"] = +value;
      newData[index]["price"] =newPrice
      newData[index]["priceWithGST"] =(+(+newPrice / 100) * (100 + +data.GST))
      setInputData(newData);
    } else{
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
      setError(
        "Input value is not less than the minimum quantity requested."
      );
      return;
    }
    if (inputData.length > 0 && inputData[inputData.length - 1].to < inputData[inputData.length - 1].from) {
      setError("Please fill maximum range");
      return;
    }
    if (!isValid) {
      setError("Please fill all the required feildes.");
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
      setError("")
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "12px", fontWeigth: "bold", marginTop: 2 }}
              >
                Landing Cost:{" "}
                <span style={{ color: "red" }}>
                  ₹ {(+data.LandingCost).toFixed(0)}
                </span>
              </Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeigth: "bold", marginTop: 2 }}
              >
                Seller Price:{" "}
                <span style={{ color: "red" }}>
                  ₹ {(+data.SellerPrice).toFixed(0)}
                </span>
              </Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeigth: "bold", marginTop: 2 }}
              >
                Profit:{" "}
                <span style={{ color: "red" }}>
                  {(
                    ((+data.SellerPrice - +data.LandingCost) /
                      +data.LandingCost) *
                    100
                  ).toFixed(0)}{" "}
                  %
                </span>
              </Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeigth: "bold", marginTop: 2 }}
              >
                MQR: <span style={{ color: "red" }}>{+data?.Mqr}</span>
              </Typography>
              <Typography
                sx={{ fontSize: "12px", fontWeigth: "bold", marginTop: 2 }}
              >
                Seller Price Inc({`GST ${(+data?.GST).toFixed(0)}%`}):{" "}
                <span style={{ color: "red" }}>₹ {sellerWithGst}</span>
              </Typography>

              <Button
                variant="contained"
                sx={{ background: "green" }}
                onClick={() => handleAddRow()}
              >
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
                      Price Inc({`GST ${(+data?.GST).toFixed(0)}%`})
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Discount %
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Profit %
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inputData?.map((datas, index) => (
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
                            readOnly={inputData.length - 1 > index ? true : false}
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
                    {(inputData[index].priceWithGST && (+(inputData[index].priceWithGST)).toFixed(0) )}
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
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {(
                          ((+inputData[index]?.price - +data?.LandingCost) /
                            +data?.LandingCost) *
                          100
                        ).toFixed(0)}{" "}
                        %
                      </TableCell>
                      <TableCell>
                        {inputData.length > 0 && (
                          <DeleteIcon
                            onClick={() => handleDeleteRow(index)}
                            sx={{
                              color: "gray",
                              "&:hover": {
                                color: "red",
                                cursor: "pointer",
                              },
                            }}
                          />
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
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Typography sx={{color:"red" , fontSize:"0.8rem"}}>{error}</Typography>
          <Box sx={{
            display: "flex",
         
            gap:1
          }}>
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
          </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RangeDial;
