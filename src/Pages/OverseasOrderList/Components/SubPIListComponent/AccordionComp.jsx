import { React, useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Box,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { formatDate } from "../../../../commonFunctions/commonFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddshipmentDial from "../../../PackagingAndClient/createOrderShipment/AddshimentpartsDial";
import ViewImageDialog from "./ViewImageDialog";
import {
  useUpdateSubOrderMutation,
  useCreateSubOrderMutation,
  useUpdateOrderOverseasMutation,
  usePassPrevPriceMutation,
  useCreateOrderBoxDetailsMutation,
} from "../../../../features/api/RestockOrderApiSlice";
import { toast } from "react-toastify";

const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
}));

const StyledDiv = styled("div")(({ theme }) => ({
 display:"flex",
 flexDirection:"column",
 alignItems: "center",
 fontSize:"12px",
 color:"#666",

}));


const StyledCellHeader = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  background: "#5E95FE",
  color: "black",
  padding: 1.5,
  fontWeight: "thin",
  fontSize: ".8rem",
}));

const AccordionComp = ({ getSingleData, item, AccordFor, refetch, index }) => {
  const [ProductData, setProductData] = useState([]);
  const [ConversionRate, setConversionRate] = useState(null);
  const [prevConversionRate, setPrevConversionRate] = useState(null);
  const [totalAmount, setTotalamount] = useState(null);
  const [totalRMBAmount, setTotalRMBamount] = useState(null);
  const [totalQty, setTotalqty] = useState(null);
  const [totalReqQty, setTotalReqqty] = useState(null);
  const [viewImage, setViewImage] = useState(false);
  const [isSubItem, setIsSubItem] = useState(
    AccordFor === "SubPI" ? true : false
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [images, setImages] = useState(null);
  const [FinalData, setFinalData] = useState([]);
  const [BoxData, setBoxData] = useState({
    boxMarking: "",
    length: "",
    width: "",
    height: "",
    file: "",
    weight: "",
  });
  const [Enabled, setEnabled] = useState(false);
  const [ConversionType, setConversionType] = useState("USD");

  const [updateproducts, { isLoading: updateLoading }] =
    useUpdateOrderOverseasMutation();

  const [updatesuborder, { isLoading: updatesuborderLoading }] =
    useUpdateSubOrderMutation();

  const [createsuborder, { isLoading: suborderLoading }] =
    useCreateSubOrderMutation();

  const [createBoxOrder, { isLoading: orderBoxLoading }] =
    useCreateOrderBoxDetailsMutation();

  function checkNegative(value) {
    if (value < 0) {
      return false;
    }
    return true;
  }

  const dataSub = item?.finalProducts;

  const dataMain = item;
  const Image = item?.BoxDetails?.boxImage?.url || null;

  const intailAmount = +getSingleData?.data?.totalUSDAmount;
  const intailUtilize = +getSingleData?.data?.utilzedUSDAmount;

  const shortFallamount =
    index === 0 ? intailAmount - totalAmount : item?.shortFall - totalAmount;
  const isNegative = checkNegative(shortFallamount);

  useEffect(() => {
    let prevConv = 0;
    if (dataSub) {
      setProductData(
        dataSub.map((item) => {
          if (item.USD || item.RMB || item.RMB > item.USD) {
            if (ConversionType === "USD") {
              prevConv = item.RMB / item.USD;
            } else if (ConversionType === "RMB") {
              prevConv = item.USD / item.RMB;
            }
          }
          return {
            ...item,
            originalRMB: item.RMB,
            updatedQTY: item.updateQTY || 0,
          };
        })
      );
      setConversionRate(prevConv.toFixed(2));
    }
    if (item?.isBoxFilled) {
      setBoxData({
        boxMarking: item?.BoxDetails?.boxMarking,
        length: item?.BoxDetails?.dimension.length,
        width: item?.BoxDetails?.dimension.width,
        height: item?.BoxDetails?.dimension.height,
        file: item?.BoxDetails?.boxImage?.url,
        weight: item?.BoxDetails?.weight,
      });
    }
  }, [item, getSingleData, ConversionType]);

  useEffect(() => {
    const selectedSKU = ProductData.map((item) => {
      return item.SKU;
    });
    setFinalData(selectedSKU);
  }, [setProductData, ProductData]);

  const handleInputChange = (e, SKU) => {
    const { name, value } = e.target;
    if (name === "USD") {
      setProductData((prev) => {
        const newData = prev.map((item) => {
          if (item.SKU === SKU) {
            return {
              ...item,
              USD: +value,
              RMB: (ConversionRate * +value).toFixed(3),
            };
          } else {
            return item;
          }
        });
        return newData;
      });
    }
    if (name === "RMB") {
      setProductData((prev) => {
        const newData = prev.map((item) => {
          if (item.SKU === SKU) {
            return {
              ...item,
              RMB: +value,
              USD: (+value * ConversionRate).toFixed(3),
            };
          } else {
            return item;
          }
        });
        return newData;
      });
    } else if (name === "QTY") {
      setProductData((prev) => {
        const newData = prev.map((item) => {
          if (item.SKU === SKU) {
            return {
              ...item,
              Orderqty: +value,
            };
          } else {
            return item;
          }
        });
        return newData;
      });
    } else if (name === "updatedQTY") {
      setProductData((prev) => {
        const newData = prev.map((item) => {
          if (item.SKU === SKU) {
            return {
              ...item,
              updatedQTY: +value,
            };
          } else {
            return item;
          }
        });
        return newData;
      });
    }
  };

  useEffect(() => {
    const TotalValue = ProductData.reduce((acc, cur) => {
      return acc + +cur?.updatedQTY * +cur?.USD;
    }, 0);
    const TotalQuantity = ProductData.reduce((acc, cur) => {
      return acc + +cur?.updatedQTY;
    }, 0);
    const TotalReqQuantity = ProductData.reduce((acc, cur) => {
      return acc + +cur?.Orderqty;
    }, 0);
    const TotalRMB = ProductData.reduce((acc, cur) => {
      return acc + +cur?.updatedQTY * +cur?.RMB;
    }, 0);

    setTotalamount(TotalValue?.toFixed(2));
    setTotalqty(TotalQuantity);
    setTotalRMBamount(TotalRMB);
    setTotalReqqty(TotalReqQuantity);
  }, [ProductData]);

  useEffect(() => {
    setProductData((prev) => {
      const newData = prev.map((item) => {
        if (item?.USD && item?.USD > 0) {
          return {
            ...item,
            RMB:
              ConversionRate > 0
                ? (ConversionType === "RMB"
                    ? +item?.USD / +ConversionRate
                    : +item?.USD * +ConversionRate
                  ).toFixed(2)
                : "",
          };
        } else if (item?.RMB && item?.RMB > 0) {
          return {
            ...item,
            USD:
              ConversionRate > 0
                ? (ConversionType === "USD"
                    ? +item?.RMB * +ConversionRate
                    : +item?.RMB / +ConversionRate
                  ).toFixed(2)
                : "",
          };
        }

        return item;
      });
      return newData;
    });
  }, [ConversionRate]);

  const handleRemoveRestockItem = (SKU) => {
    const newSelectedItems = ProductData.filter((item) => item?.SKU !== SKU);
    setProductData(newSelectedItems);
  };

  useEffect(() => {
    if (selectedData.length > 0) {
      const updatedData = selectedData.map((item) => ({
        SKU: item.SKU,
        Orderqty: "",
        USD: "",
        RMB: "",
        prevRMB: item.prevRMB,
        prevUSD: item.prevUSD,
        Name: item.Name,
        originalRMB: "",
        updatedQTY: 0,
      }));

      setProductData((prev) => [...prev, ...updatedData]);
    }
  }, [selectedData]);

  const handleOpenDial = () => {
    setOpenDialog(true);
  };

  const isEnabled = (index) => {
    const isValue =
      getSingleData?.data?.subOrders.length - 1 - index || intailUtilize === 0
        ? true
        : false;
    return isValue;
  };

  const handleSubmitMain = async () => {
    try {
      if (!isNegative) {
        return toast.error("The price should not exceed the shortfall value.");
      }

      const UpdateOrder = [];
      const order = getSingleData?.data?.subOrders;
      const processedData = ProductData.map((item) => {
        const remainingQty = item.Orderqty - item.updatedQTY;

        return {
          final:
            remainingQty !== 0 && remainingQty > 0
              ? {
                  SKU: item.SKU,
                  Orderqty: remainingQty,
                  USD: item.USD,
                  RMB: item.RMB,
                  Name: item.Name,
                  prevRMB: item.prevRMB,
                  prevUSD: item.prevUSD,
                }
              : null,
          updated: {
            SKU: item.SKU,
            Orderqty: item.Orderqty,
            updateQTY: item.updatedQTY,
            USD: item.USD,
            RMB: item.RMB,
            Name: item.Name,
            prevRMB: item.prevRMB,
            prevUSD: item.prevUSD,
          },
        };
      });
      const finalValue = processedData
        .filter((data) => data.final !== null)
        .map((data) => data.final);
      const updateValue = processedData
        .filter((data) => data.updated !== null)
        .map((data) => data.updated);
      const updateProduct = {
        id: order[order.length - 1]._id,
        orderId: getSingleData?.data?.overseaseOrderId,
        piNo: getSingleData?.data?.piNo,
        products: updateValue,
        totalUSDAmount: shortFallamount,
      };
      const suborder = {
        orderId: getSingleData?.data?.overseaseOrderId,
        products: finalValue,
        totalUSDAmount: shortFallamount,
      };
      if (shortFallamount > 0) {
        const result = await createsuborder(suborder).unwrap();

        const result1 = await updatesuborder(updateProduct).unwrap();
        toast.success("Order Updated successfully");
        // console.log(updateProduct)
        // console.log(suborder)
      } else {
        const result = await updatesuborder(updateProduct).unwrap();
        toast.success("Order updated successfully");
        // console.log(updateProduct)
      }

      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeType = (e, value) => {
    if (value !== null) {
      setConversionType(value);
    }
  };

  const handleBoxInput = (e) => {
    const { value, name, files, type } = e.target;

    if (type === "file") {
      const file = files[0];
      setBoxData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setBoxData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBoxSubmit = async () => {
    try {
      const { boxMarking, length, width, height, file, weight } = BoxData;
      const OrderID = getSingleData?.data?.overseaseOrderId;
      const subOrderID = dataMain?.piNo || getSingleData?.data.piNo;

      const formData = new FormData();
      formData.append("boxImage", file);
      formData.append("marking", boxMarking);
      formData.append("subPI", subOrderID);
      formData.append("orderId", OrderID);
      formData.append("weight", weight);

      const dimension = { length, width, height };
      formData.append("dimension", JSON.stringify(dimension));

      const result = await createBoxOrder(formData).unwrap();
      toast.success("Box details added successfully");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Accordion
        sx={{
          border: "2px solid #3385ff",
          backgroundImage: isSubItem
            ? "linear-gradient(to right top, #a1c4fd, #c2e9fb)"
            : "linear-gradient(to right top, #dae5ff , #e8f0ff)",
          // marginBottom: "4px",
          "& .MuiAccordionSummary-content": {
            margin: "0px 0px",
          },
        }}
        // expanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "black" }} />}
          sx={{
            padding: "0",
            margin: "0px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              // marginBottom: "4px",
              paddingLeft: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "",
                padding: ".2rem",
                border: "2px solid #3385ff",
                justifyContent: "space-between",
                paddingX: "5px",
                borderRadius: ".4rem",
                boxShadow: "-3px 3px 4px 0px #404040",
              }}
            >
              {/* <Box display={"flex"}>
              <Typography
                sx={{
                  fontSize: ".6rem",
                  fontWeight: "600",
                  marginTop: "3px",
                  marginRight: "3px",
                }}
              >
                Sno
              </Typography>
            </Box> */}
              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontSize: ".8rem",
                    fontWeight: "600",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  Date:
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".6rem",
                    fontWeight: "600",
                    marginTop: "6px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  {formatDate(dataMain?.createdAt)}
                </Typography>
              </Box>

              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: ".8rem",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  {dataMain?.piNo ? "Sub PI :" : "PI :"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".6rem",
                    fontWeight: "600",
                    marginTop: "6px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  {dataMain?.piNo || getSingleData?.data.piNo}
                </Typography>
              </Box>
              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: ".8rem",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  Product Amount :
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".7rem",
                    fontWeight: "600",
                    marginTop: "5px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  $ {totalAmount}
                </Typography>
              </Box>
              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: ".7rem",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  ShortFall :
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".7rem",
                    marginTop: "3px",
                    marginRight: "3px",
                    fontWeight: "bold",
                    background: !isNegative ? "red" : "green",
                    paddingX: "0.2rem",
                    borderRadius: "0.2rem",
                    color: "#fff",
                  }}
                >
                  $ {shortFallamount.toFixed(2)}
                </Typography>
              </Box>
              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: ".7rem",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  Total Required QTY :
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".7rem",
                    fontWeight: "600",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  {totalReqQty} pcs
                </Typography>
              </Box>

              <Box display={"flex"}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: ".7rem",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  Total Updated QTY :
                </Typography>
                <Typography
                  sx={{
                    fontSize: ".7rem",
                    fontWeight: "600",
                    marginTop: "3px",
                    marginRight: "3px",
                  }}
                >
                  {" "}
                  {totalQty} pcs
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Box>
            <Box display={"flex"} gap={"0.5rem"} alignItems={"center"}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: ".7rem",
                  marginTop: "3px",
                  marginRight: "3px",
                }}
              >
                {ConversionType === "RMB"
                  ? "1 RMB equal to USD"
                  : "1 USD equal to RMB"}
              </Typography>

              <input
                name="conversion"
                placeholder="%"
                disabled={isEnabled(index)}
                style={{
                  background: "#fff",
                  border: "none",
                  textAlign: "center",
                  width: "45px",
                  border: "none",
                  padding: "3px",
                  backgroundColor: isEnabled(index) ? "#ccc" : "#fff",
                }}
                value={ConversionRate || ""}
                onChange={(e) => setConversionRate(e.target.value)}
              />

              <Box>
                <AddIcon
                  onClick={isEnabled(index) ? null : handleOpenDial}
                  sx={{
                    cursor: "pointer",

                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </Box>
              <Box>
                <ToggleButtonGroup
                  value={ConversionType}
                  disabled={isEnabled(index)}
                  exclusive
                  sx={{
                    width: "100px",
                    height: "30px",
                    border: "none",
                    borderRadius: "0.2rem",
                    padding: "0.2rem",
                    color: "#fff",

                    "& .Mui-selected": {
                      color: "#fff !important",
                      background: "black !important",
                    },
                  }}
                  onChange={handleChangeType}
                  aria-label="Platform"
                >
                  <ToggleButton
                    value="USD"
                    sx={{ color: "black", border: "0.5px solid black" }}
                  >
                    USD
                  </ToggleButton>
                  <ToggleButton
                    value="RMB"
                    sx={{ color: "black", border: "0.5px solid black" }}
                  >
                    RMB
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 450 }}>
              <Box
                sx={{
                  position: "absolute",
                }}
              ></Box>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledCellHeader>Sno</StyledCellHeader>
                    <StyledCellHeader>SKU</StyledCellHeader>
                    <StyledCellHeader>Name</StyledCellHeader>
                    <StyledCellHeader>Prev USD</StyledCellHeader>
                    <StyledCellHeader>Prev RMB</StyledCellHeader>
                    <StyledCellHeader>USD $</StyledCellHeader>
                    <StyledCellHeader>RMB ¥</StyledCellHeader>
                    <StyledCellHeader>Order Quantity</StyledCellHeader>
                    <StyledCellHeader>Updated Quantity</StyledCellHeader>
                    <StyledCellHeader>Total Order Amount</StyledCellHeader>
                    <StyledCellHeader>Delete</StyledCellHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ProductData?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledCell>{i + 1}</StyledCell>
                        {item?.SKU && item?.Name ? (
                          <>
                            <StyledCell>{item.SKU}</StyledCell>
                            <StyledCell>{item.Name}</StyledCell>
                            <StyledCell>
                              {item?.prevUSD !== "NA"
                                ? "$" + item.prevUSD
                                : "N/A"}
                            </StyledCell>
                            <StyledCell>
                              {item?.prevRMB !== "NA"
                                ? "¥" + item.prevRMB
                                : "N/A"}
                            </StyledCell>
                          </>
                        ) : (
                          <StyledCell colSpan={4}>
                            <input
                              name="USD"
                              value={item.USD || ""}
                              style={{
                                background: "#fff",
                                border: "none",
                                padding: "5px",
                                width: "100px",
                                textAlign: "center",
                              }}
                              onChange={(e) => handleInputChange(e, item.SKU)}
                            />
                          </StyledCell>
                        )}
                        <StyledCell
                          sx={{ textAlign: "center", width: "150px" }}
                        >
                          <input
                            name="USD"
                            value={item.USD || ""}
                            disabled={
                              ConversionType === "RMB" || isEnabled(index)
                            }
                            type="number"
                            style={{
                              background: "#fff",
                              border: "none",
                              padding: "5px",
                              width: "100px",
                              textAlign: "center",
                              backgroundColor:
                                ConversionType === "RMB" || isEnabled(index)
                                  ? "#ccc"
                                  : "#fff",
                            }}
                            onChange={(e) => handleInputChange(e, item.SKU)}
                          />
                        </StyledCell>
                        <StyledCell
                          sx={{ textAlign: "center", width: "150px" }}
                        >
                          <input
                            name="RMB"
                            disabled={
                              ConversionType === "USD" || isEnabled(index)
                            }
                            value={item.RMB || ""}
                            type="number"
                            style={{
                              background: "#fff",
                              border: "none",
                              padding: "5px",
                              width: "100px",
                              textAlign: "center",
                              backgroundColor:
                                ConversionType === "USD" || isEnabled(index)
                                  ? "#ccc"
                                  : "#fff",
                            }}
                            onChange={(e) => handleInputChange(e, item.SKU)}
                          />
                        </StyledCell>
                        <StyledCell>{item.Orderqty}</StyledCell>
                        <StyledCell>
                          <input
                            name="updatedQTY"
                            disabled={isEnabled(index)}
                            value={item.updatedQTY || ""}
                            style={{
                              backgroundColor: isEnabled(index)
                                ? "#ccc"
                                : "#fff",
                              border: "none",
                              padding: "5px",
                              width: "50px",
                              textAlign: "center",
                            }}
                            onChange={(e) => handleInputChange(e, item.SKU)}
                          />
                        </StyledCell>
                        <StyledCell>${item.updatedQTY * item.USD}</StyledCell>
                        <StyledCell>
                          <DeleteIcon
                            onClick={() =>
                              isEnabled(index)
                                ? null
                                : handleRemoveRestockItem(item.SKU)
                            }
                            sx={{
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          />
                        </StyledCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {isEnabled(index) && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",

                  gap: "1rem",
                  padding: "0.5rem",
                  backgroundColor: "TRANSPARENT",
                  alignItems: "end",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "end",
                    width: "100%",
                    gap: "20px",
                
                   justifyContent: "center",
                  }}
                  onChange={handleInputChange}
                >
              <StyledDiv >
              <label>Box Marking</label>
                  <input
                    name="boxMarking"
                    placeholder="Box Marking"
                    disabled={item.isBoxFilled}
                    style={{
                      
                      backgroundColor: item.isBoxFilled ? "#ccc" : "#fff",
                      border: "none",
                      padding: "5px",
                    }}
                    value={BoxData.boxMarking}
                    onChange={handleBoxInput}
                  />
</StyledDiv>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ fontWeight: "bold", paddingBottom: "0.5rem" }}
                    >
                      Dimension
                    </span>
                    <Box
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <StyledDiv >
                      <label>Length<sup>cm</sup></label>
                      <input
                        name="length"
                        type="number"
                        disabled={item.isBoxFilled}
                        size="small"
                        placeholder="L"
                        style={{
                          width: "80px",
                          backgroundColor: item.isBoxFilled ? "#ccc" : "#fff",
                          border: "none",
                          padding: "5px",
                        }}
                        value={BoxData.length}
                        onChange={handleBoxInput}
                      />
                      </StyledDiv>
                      <span>X</span>
                      <StyledDiv >
                      <label>Width<sup>cm</sup></label>
                      <input
                        name="width"
                        type="number"
                        size="small"
                        disabled={item.isBoxFilled}
                        placeholder="W"
                        style={{
                          width: "80px",
                          backgroundColor: item.isBoxFilled ? "#ccc" : "#fff",
                          border: "none",
                          padding: "5px",
                        }}
                        variant="outlined"
                        value={BoxData.width}
                        onChange={handleBoxInput}
                      />
                      </StyledDiv>
                      <span>X</span>
                      <StyledDiv >
                      <label>Height<sup>cm</sup></label>
                      <input
                        name="height"
                        type="number"
                        disabled={item.isBoxFilled}
                        size="small"
                        placeholder="H"
                        style={{
                          width: "80px",
                          backgroundColor: item.isBoxFilled ? "#ccc" : "#fff",
                          border: "none",
                          padding: "5px",
                        }}
                        variant="outlined"
                        value={BoxData.height}
                        onChange={handleBoxInput}
                      />
                      </StyledDiv>
                    </Box>
                  </Box>
                  <StyledDiv >
                  <label>Weight <sup>kg</sup></label>
                  <input
                    name="weight"
                    disabled={item.isBoxFilled}
                    type="number"
                    size="small"
                    placeholder="Weight in kg"
                    style={{
                      width: "150px",
          
                      backgroundColor: item.isBoxFilled ? "#ccc" : "#fff",
                      border: "none",
                      padding: "5px",
                    }}
                    value={BoxData.weight}
                    onChange={handleBoxInput}
                  />
</StyledDiv>
                  {item.isBoxFilled ? (
                    <Box
                      sx={{
                     
                      }}
                    >
                      <Button size="small" onClick={() => setViewImage(true)}>
                        view
                      </Button>{" "}
                    </Box>
                  ) : (
                    <input
                      type="file"
                      name="file"
                      style={{
                        marginTop: "1rem",
                        border: "none",
                        padding: "5px",
                      }}
                      onChange={handleBoxInput}
                      accept=".jpeg, .jpg, .png"
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "#067074",
              color: "#fff",
            }}
            disabled={
              updateLoading ||
              suborderLoading ||
              updatesuborderLoading ||
              orderBoxLoading ||
              item.isBoxFilled
            }
            onClick={isEnabled(index) ? handleBoxSubmit : handleSubmitMain}
          >
            {updateLoading ||
            suborderLoading ||
            updatesuborderLoading ||
            orderBoxLoading ? (
              <CircularProgress size="25px" sx={{ color: "#fff" }} />
            ) : isEnabled(index) ? (
              "Submit Box details"
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </Accordion>

      {openDialog && (
        <AddshipmentDial
          open={openDialog}
          data={FinalData}
          setOpen={setOpenDialog}
          setSelectedData={setSelectedData}
          FinalData={FinalData}
          Query={"SubList"}
        />
      )}

      {viewImage && (
        <ViewImageDialog
          open={viewImage}
          setOpen={setViewImage}
          image={Image}
        />
      )}
    </Box>
  );
};

export default AccordionComp;
