import { React, useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
  InputAdornment,
  CircularProgress,
  InputBase,
  IconButton,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetSingleOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import DeleteIcon from "@mui/icons-material/Delete";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

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

const StyledBox = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: ".4rem",
  padding: ".2rem",
  border: "2px solid #3385ff",
  justifyContent: "space-between",
  borderRadius: ".4rem",
  boxShadow: "-3px 3px 4px 0px #404040",
  height: "2rem",
  backgroundColor: "#00508D",
  color: "#fff",
}));

const infoDetail = [
  {
    name: "Save",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/save_costCalculator.png?updatedAt=1703223683718"
        height={"50%"}
        width={"50%"}
      />
    ),
    instruction:
      "If you click 'View,' you can save the price for that particular price list",
  },
];

const SubPIList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [ProductData, setProductData] = useState([]);
  const [ConversionRate, setConversionRate] = useState(null);
  const [prevConversionRate, setPrevConversionRate] = useState(null);
  const [totalAmount, setTotalamount] = useState(null);
  const [totalQty, setTotalqty] = useState(null);
  const [shortFall, setShortfall] = useState(null);

  const { data: getSingleData, isLoading } = useGetSingleOrderQuery(id);

  // useEffect(() => {
  //   if (getSingleData?.data?.products) {
  //     setProductData((prev) => [...getSingleData?.data?.products]);
  //   }
  // }, [getSingleData]);

  useEffect(() => {
    if (getSingleData?.data?.products) {
      setProductData(
        getSingleData.data.products.map((item) => {
          if (item.RMB > 0) {
            setPrevConversionRate(item.USD / item.RMB);

            return {
              ...item,
              originalRMB: item.RMB,
            };
          }
        })
      );
    }
  }, [getSingleData]);

  const { isInfoOpen } = useSelector((state) => state.ui);
  useEffect(() => {
    dispatch(setHeader(`Sub List`));
  }, []);
  const description1 =
    "This is a Price Calculator where you can calculate the price ";
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  const handleInputChange = (e, SKU) => {
    const { name, value } = e.target;

    if (name === "USD") {
      setProductData((prev) => {
        const newData = prev.map((item) => {
          if (item.SKU === SKU) {
            return {
              ...item,
              USD: +value,
              
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
    }
  };

  useEffect(()=>{
    const TotalValue = ProductData.reduce((acc , cur)=>{
return (+acc.Orderqty) + (+cur.USD)
    },0)
console.log(TotalValue)
  },[setProductData])

  useEffect(() => {
    setProductData((prev) => {
      const newData = prev.map((item) => {
        if (item.RMB && item.RMB > 0) {
          return {
            ...item,
            RMB:
              ConversionRate > 0
                ? +item.originalRMB * +ConversionRate
                : +item.originalRMB,
          };
        } else {
          return item;
        }
      });
      return newData;
    });
  }, [setConversionRate, ConversionRate]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0, width: "100%" }}>
      <DrawerHeader />

      <Box
        sx={{
          marginTop: "10px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            gap: "10px",
            width: "100%",
            height: "8vh",
            paddingX: "10px",
          }}
        >
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Date :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {formatDate(getSingleData?.data?.paymentDate)}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Assigned to :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data.vendorCompany}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Concern Person :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data?.vendorConcernPerson}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              PI NO :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              {getSingleData?.data.piNo}
            </Typography>
          </StyledBox>
          <StyledBox>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              Paid Amount :
            </Typography>
            <Typography
              sx={{
                fontSize: ".7rem",
                marginTop: "3px",
                marginRight: "3px",
              }}
            >
              $ {getSingleData?.data.totalUSDAmount}
            </Typography>
          </StyledBox>
          <StyledBox>
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
              }}
            >
              $ {getSingleData?.data.restUSDAmount}
            </Typography>
          </StyledBox>
        </Box>
        <Box>
          <Accordion
            sx={{
              border: "2px solid #3385ff",
              backgroundImage:
                "linear-gradient(to right top, #dae5ff , #e8f0ff)",
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
                      {formatDate(getSingleData?.data?.paymentDate)}
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
                      Sub PI :
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
                      {getSingleData?.data?.piNo}
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
                      Product Amount
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
                      QTY
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box>
                <Box display={"flex"}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: ".7rem",
                      marginTop: "3px",
                      marginRight: "3px",
                    }}
                  >
                    RMB convertion rate
                  </Typography>
                  <input
                    name="converion"
                    placeholder="%"
                    style={{
                      background: "#fff",
                      border: "none",
                      textAlign: "center",
                      width: "30px",
                      border: "none",
                    }}
                    value={ConversionRate || prevConversionRate}
                    onChange={(e) => setConversionRate(e.target.value)}
                  />
                </Box>
                <TableContainer sx={{ maxHeight: 450 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledCellHeader>Sno</StyledCellHeader>
                        <StyledCellHeader>SKU</StyledCellHeader>
                        <StyledCellHeader>Name</StyledCellHeader>
                        <StyledCellHeader>USD $</StyledCellHeader>
                        <StyledCellHeader>RMB ¥</StyledCellHeader>
                        <StyledCellHeader>Order Quantity</StyledCellHeader>
                        <StyledCellHeader>Total Order amount</StyledCellHeader>

                        <StyledCellHeader>Delete</StyledCellHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ProductData?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledCell>{index + 1}</StyledCell>
                          <StyledCell>{item.SKU}</StyledCell>
                          <StyledCell>{item.Name}</StyledCell>
                          <StyledCell
                            sx={{ textAlign: "center", width: "150px" }}
                          >
                            <input
                              name="USD"
                              placeholder="$"
                              value={item.USD}
                              style={{
                                background: "#fff",
                                border: "none",
                                padding: "5px",
                                width: "100px",
                                border: "none",
                                textAlign: "center",
                              }}
                              onChange={(e) => handleInputChange(e, item.SKU)}
                            />
                          </StyledCell>
                          <StyledCell
                            sx={{ textAlign: "center", width: "150px" }}
                          >
                            ¥ {item.RMB}
                          </StyledCell>
                          <StyledCell>
                            <input
                              name="QTY"
                              value={item.Orderqty}
                              style={{
                                background: "#fff",
                                border: "none",
                                padding: "5px",
                                width: "50px",
                                border: "none",
                                textAlign: "center",
                              }}
                              onChange={(e) => handleInputChange(e, item.SKU)}
                            />
                          </StyledCell>
                          <StyledCell>$ {item.Orderqty * item.USD}</StyledCell>

                          <StyledCell>
                            <DeleteIcon
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                              sx={{
                                textAlign: "center",
                                cursor: "pointer", // Add the pointer cursor on hover
                              }}
                            />
                          </StyledCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "#e6e6e6",
                    alignItems: "end",
                  }}
                >
                  {/* Main Content */}
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
                    {/* Box Marking */}
                    <input
                      name="boxMarking"
                      placeholder="Box Marking"
                      style={{
                        marginTop: "1.5rem",
                        background: "#fff",
                        border: "none",
                        padding: "5px",
                      }}
                      //   value={formData.boxMarking}
                      //   onChange={handleInputChange}
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

                          //   value={formData.length}
                          //   onChange={handleInputChange}
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
                          //   value={formData.width}
                          //   onChange={handleInputChange}
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
                          //   value={formData.height}
                          //   onChange={handleInputChange}
                        />
                      </Box>
                    </Box>

                    {/* Weight in kg */}
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
                      //   value={formData.weight}
                      //   onChange={handleInputChange}
                    />

                    {/* File Input */}
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
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description1}
        open={isInfoOpen}
        close={handleClose1}
      />
    </Box>
  );
};

export default SubPIList;
