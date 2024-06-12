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
} from "@mui/material";
import { formatDate } from "../../../../commonFunctions/commonFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddshipmentDial from "../../../PackagingAndClient/createOrderShipment/AddshimentpartsDial";
import {
  useUpdateSubOrderMutation,
  useCreateSubOrderMutation,
  useUpdateOrderOverseasMutation,
  usePassPrevPriceMutation,
} from "../../../../features/api/RestockOrderApiSlice";
import { toast } from "react-toastify";

const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
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
  const [isSubItem, setIsSubItem] = useState(
    AccordFor === "SubPI" ? true : false
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [FinalData, setFinalData] = useState([]);

  const [updateproducts, { isLoading: updateLoading }] =
    useUpdateOrderOverseasMutation();

  const [updatesuborder, { isLoading: updatesuborderLoading }] =
    useUpdateSubOrderMutation();

  const [createsuborder, { isLoading: suborderLoading }] =
    useCreateSubOrderMutation();

  function checkNegative(value) {
    if (value < 0) {
      return false;
    }
    return true;
  }

  const dataSub = item?.finalProducts;

  const dataMain = item;

  const intailAmount = +getSingleData?.data?.totalUSDAmount;
  const intailUtilize = +getSingleData?.data?.utilzedUSDAmount;



  const shortFallamount =
    index === 0 ? intailAmount - totalAmount : item?.shortFall - totalAmount;
  const isNegative = checkNegative(shortFallamount);

  useEffect(() => {
    let prevConv = 0
    if (dataSub) {
      setProductData(
        dataSub.map((item) => {
          if(item.USD || item.RMB || item.RMB > item.USD){
            prevConv = item.RMB / item.USD
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
  }, [item, getSingleData]);

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
              RMB: (ConversionRate * +value).toFixed(2),
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
              USD: (+value / ConversionRate).toFixed(2),
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
            RMB:ConversionRate > 0 ? (+item?.USD * +ConversionRate).toFixed(2) : "",
          };
        } else if (item?.RMB && item?.RMB > 0) {
          return {
            ...item,
            USD: ConversionRate > 0 ? (+item?.RMB / +ConversionRate).toFixed(2) : "",
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
        toast.success("Sub order created successfully");
        const result1 = await updatesuborder(updateProduct).unwrap();
        toast.success("Order updated successfully");
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

  //   const handleSubmitSubPI = async () => {
  //     try {
  //       const finalValue = ProductData.map((item) => {
  //         return {
  //           SKU: item.SKU,
  //           Orderqty: item.Orderqty,
  //           USD: item.USD,
  //           RMB: item.RMB,
  //           Name: item.Name,
  //         };
  //       });
  // console.log(finalValue)
  //       const finalUpdate = {
  //         id: item?._id,
  //         products: finalValue,
  //       };
  //       const suborder = {
  //         orderId: getSingleData?.data?.overseaseOrderId,
  //         piNo: item?.piNo,
  //         products: finalValue,
  //       };
  //       if (shortFallamount > 0) {
  //         const result = await createsuborder(suborder).unwrap();
  //         toast.success("Sub order created successfully");

  //       } else {
  //         const result = await updatesuborder(finalUpdate).unwrap();
  //         toast.success(" sub Order updated successfully");
  //       }

  //       refetch();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

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
            margin: "3px 0px",
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
                marginTop: ".4rem",
                // marginBottom: ".4rem",
                // border: '2px solid yellow',
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
            <Box display={"flex"} gap={"0.5rem"}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: ".7rem",
                  marginTop: "3px",
                  marginRight: "3px",
                }}
              >
               USD to RMB Conversion Rate
              </Typography>
              <input
                name="conversion"
                placeholder="%"
                style={{
                  background: "#fff",
                  border: "none",
                  textAlign: "center",
                  width: "30px",
                  border: "none",
                }}
                value={ConversionRate || ""}
                onChange={(e) => setConversionRate(e.target.value)}
              />
              <Box>
                <AddIcon
                  onClick={handleOpenDial}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 450 }}>
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
      {ProductData?.map((item, index) => (
        <TableRow key={index}>
          <StyledCell>{index + 1}</StyledCell>
          {item?.SKU && item?.Name ? (
            <>
              <StyledCell>{item?.SKU}</StyledCell>
              <StyledCell>{item?.Name}</StyledCell>
              <StyledCell>
                {item?.prevUSD !== "NA" ? "$" + item?.prevUSD : "N/A"}
              </StyledCell>
              <StyledCell>
                {item?.prevRMB !== "NA" ? "¥" + item?.prevRMB : "N/A"}
              </StyledCell>
            </>
          ) : (
            <StyledCell colSpan={4}>
              <input
                name="USD"
                value={item?.USD || ""}
                style={{
                  background: "#fff",
                  border: "none",
                  padding: "5px",
                  width: "100px",
                  textAlign: "center",
                }}
                onChange={(e) => handleInputChange(e, item?.SKU)}
              />
            </StyledCell>
          )}
          <StyledCell sx={{ textAlign: "center", width: "150px" }}>
            <input
              name="USD"
              value={item?.USD || ""}
              type="number"
              style={{
                background: "#fff",
                border: "none",
                padding: "5px",
                width: "100px",
                textAlign: "center",
              }}
              onChange={(e) => handleInputChange(e, item?.SKU)}
            />
          </StyledCell>
          <StyledCell sx={{ textAlign: "center", width: "150px" }}>
            <input
              name="RMB"
              value={item?.RMB || ""}
              type="number"
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
          <StyledCell>{item?.Orderqty}</StyledCell>
          <StyledCell>
            <input
              name="updatedQTY"
              value={item?.updatedQTY || ""}
              style={{
                background: "#fff",
                border: "none",
                padding: "5px",
                width: "50px",
                textAlign: "center",
              }}
              onChange={(e) => handleInputChange(e, item?.SKU)}
            />
          </StyledCell>
          <StyledCell>$ {item?.updatedQTY * item?.USD}</StyledCell>
          <StyledCell>
            <DeleteIcon
              onClick={() => handleRemoveRestockItem(item?.SKU)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
              }}
            />
          </StyledCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


            {/* <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              padding: "0.5rem",
              backgroundColor: "#e6e6e6",
              alignItems: "end",
            }}
          >
          
            <Box
              style={{
                display: "flex",
                width: "100%",
                gap: "20px",
                alignItems: "center",
                justifyContent: "center",
              }}
              onChange={handleInputChange}
            >
           
              <input
                name="boxMarking"
                placeholder="Box Marking"
                style={{
                  marginTop: "1.5rem",
                  background: "#fff",
                  border: "none",
                  padding: "5px",
                }}
                  value={formData.boxMarking}
                  onChange={handleInputChange}
              />

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
                  <input
                    name="length"
                    type="number"
                    size="small"
                    placeholder="L"
                    style={{
                      width: "80px",
                      background: "#fff",
                      border: "none",
                      padding: "5px",
                    }}

                      value={formData.length}
                      onChange={handleInputChange}
                  />
                  <span>X</span>
                  <input
                    name="width"
                    type="number"
                    size="small"
                    placeholder="W"
                    style={{
                      width: "80px",
                      background: "#fff",
                      border: "none",
                      padding: "5px",
                    }}
                    variant="outlined"
                      value={formData.width}
                      onChange={handleInputChange}
                  />
                  <span>X</span>
                  <input
                    name="height"
                    type="number"
                    size="small"
                    placeholder="H"
                    style={{
                      width: "80px",
                      background: "#fff",
                      border: "none",
                      padding: "5px",
                    }}
                    variant="outlined"
                      value={formData.height}
                      onChange={handleInputChange}
                  />
                </Box>
              </Box>

            
              <input
                name="weight"
                type="number"
                size="small"
                placeholder="Weight in kg"
                style={{
                  width: "150px",
                  marginTop: "1.5rem",
                  background: "#fff",
                  border: "none",
                  padding: "5px",
                }}
                  value={formData.weight}
                  onChange={handleInputChange}
              />

     
              <input
                type="file"
                name="fileInput"
                style={{
                  marginTop: "1rem",
                  border: "none",
                  padding: "5px",
                }}
                onChange={handleInputChange}
                accept=".jpeg, .jpg, .png"
              />
            </Box>
          </Box> */}
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
              intailUtilize === 0 ||
              getSingleData?.data?.subOrders.length - 1 - index
                ? true
                : false
            }
            onClick={handleSubmitMain}
          >
            {updateLoading || suborderLoading || updatesuborderLoading ? (
              <CircularProgress size="25px" sx={{ color: "#fff" }} />
            ) : (
              "Submit "
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
    </Box>
  );
};

export default AccordionComp;
