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
import { formatDate } from '../../../../commonFunctions/commonFunctions';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddshipmentDial from "../../../PackagingAndClient/createOrderShipment/AddshimentpartsDial";

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
  

const AccordionComp = ({
  getSingleData,
  item,
  AccordFor,
}) => {

  const [ProductData, setProductData] = useState([]);
  const [ConversionRate, setConversionRate] = useState(null);
  const [prevConversionRate, setPrevConversionRate] = useState(null);
  const [totalAmount, setTotalamount] = useState(null);
  const [totalQty, setTotalqty] = useState(null);
  const [isSubItem, setIsSubItem] = useState(AccordFor === "SubPI" ? true : false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [FinalData, setFinalData] = useState([]);

  function checkNegative(value) {
    if (value < 0) {
        return false;
    }
    return true;
}

  const dataSub = AccordFor === "SubPI" ? item?.finalProducts : getSingleData?.data?.products

  const dataMain = AccordFor === "SubPI" ? item : getSingleData?.data

  const shorFallamount = isSubItem ? getSingleData?.data.restUSDAmount - totalAmount :
  dataMain?.totalUSDAmount - totalAmount

  const isNegative = checkNegative(shorFallamount)

  useEffect(() => {
    if (dataSub) {
      setProductData(
        dataSub.map((item) => {
          if (item.RMB > 0) {

            return {
              ...item,
              originalRMB: item.RMB,
            };
          }
        })
      );
      const selectedSKU = dataSub.map((item) => {
        return item.SKU;
      });
      setFinalData(selectedSKU);
    }
  }, [item,getSingleData]);





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

  useEffect(() => {
    const TotalValue = ProductData.reduce((acc, cur) => {
      return acc + +cur.Orderqty * +cur.USD;
    }, 0);
    const TotalQuantity = ProductData.reduce((acc, cur) => {
      return acc + +cur.Orderqty;
    }, 0);

    setTotalamount(TotalValue);
    setTotalqty(TotalQuantity);
  }, [ProductData]);

  useEffect(() => {
    setProductData((prev) => {
      const newData = prev.map((item) => {
        if (item.RMB && item.RMB > 0) {
          return {
            ...item,
            RMB:
              ConversionRate > 0
                ? +item.originalRMB * + ConversionRate
                : +item.originalRMB,
          };
        }else if(item.USD && item.USD > 0){
          return {
            ...item,
            RMB:
              ConversionRate > 0
                ? +item.USD * + ConversionRate
                : "",
          };
        }
  
        return item;
      });
      return newData;
    });
  }, [ConversionRate]);

  const handleRemoveRestockItem = (SKU) => {
    const newSelectedItems = ProductData.filter((item) => item.SKU !== SKU);
    setProductData(newSelectedItems);
  };



  useEffect(() => {
    if (selectedData.length > 0) {
      const updatedData = selectedData.map((item) => ({
        SKU: item.SKU,
        Orderqty: "",
        USD: "",
        RMB: "",
        Name: item.Name,
        originalRMB: "",
      }));

      setProductData((prev) => [...prev, ...updatedData]);
    }
  }, [selectedData]);

  const handleOpenDial = () => {
    setOpenDialog(true);
  };

  const handleSubmitMain = () => {


  }

  const handleSubmitSubPI = () => {


  }



  return (
    <Box>
    <Accordion
      sx={{
        border: "2px solid #3385ff",
        backgroundImage:isSubItem ? "linear-gradient(to right top, #a1c4fd, #c2e9fb)" : 
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
                { 
                formatDate(isSubItem ?dataMain?.createdAt : dataMain?.paymentDate)
                }
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
              {isSubItem ?"Sub PI :" : "PI :"}
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
                { 
                
                dataMain?.piNo}
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
                  background:
           
                     !isNegative ? "red"
                      : "green",
                  paddingX: "0.2rem",
                  borderRadius: "0.2rem",
                  color: "#fff"
                   
                }}
              >
                ${" "}
                {shorFallamount}
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
                Total QTY :
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
              value={ConversionRate}
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
                  <StyledCellHeader>USD $</StyledCellHeader>
                  <StyledCellHeader>RMB ¥</StyledCellHeader>
                  <StyledCellHeader>Order Quantity</StyledCellHeader>
                  <StyledCellHeader>Total Order amount</StyledCellHeader>

                  <StyledCellHeader>Delete</StyledCellHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {( ProductData)?.map((item, index) => (
                  <TableRow key={index}>
                    <StyledCell>{index + 1}</StyledCell>
                    {item.SKU && item.Name ? (
                      <>
                        <StyledCell>{item.SKU}</StyledCell>
                        <StyledCell>{item.Name}</StyledCell>{" "}
                      </>
                    ) : (
                      <>
                        <StyledCell>{item.SKU}</StyledCell>
                        <StyledCell>
                          <input
                            name="USD"
                            value={item.USD}
                            style={{
                              background: "#fff",
                              border: "none",
                              padding: "5px",
                              width: "100px",
                              border: "none",
                              textAlign: "center",
                            }}
                            onChange={(e) =>
                              handleInputChange(e, item.SKU)
                            }
                          />
                        </StyledCell>
                      </>
                    )}

                    <StyledCell
                      sx={{ textAlign: "center", width: "150px" }}
                    >
                      <input
                        name="USD"
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
                          handleRemoveRestockItem(item.SKU);
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
      <Box sx={{
        display:"flex",
        justifyContent:"center",
        padding:"10px"
      }}>
        <Button variant="contained" size="small" sx={{
          background:"#067074",
          color:"#fff"
        }}
        onClick={isSubItem ? handleSubmitSubPI : handleSubmitMain}
        >
       { false ? <CircularProgress size="25px" sx={{color:"#fff"}}/> :"Submit "}
        </Button>
      </Box>
    </Accordion>

    {openDialog && (
        <AddshipmentDial
          open={openDialog}
          data={selectedData}
          setOpen={setOpenDialog}
          setSelectedData={setSelectedData}
          FinalData={FinalData}
        />
      )}
  </Box>
  )
}

export default AccordionComp