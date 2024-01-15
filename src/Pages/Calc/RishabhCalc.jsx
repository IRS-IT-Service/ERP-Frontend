import React from "react";
import { Typography, InputBase, Box } from "@mui/material";
import { useSelector } from "react-redux";

const RishabhCalc = () => {
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "30%",
          // border: "1px solid blue",
          margin: "2px 12px 12px 12px",
          alignItems: "center",
          flexDirection: "column",
          boxShadow: 4,
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            backgroundColor: color,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            borderRadius: "4px",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "white" }}>
            Calculator
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // border: "1px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              // border: "1px solid black",
              alignItems: "center",
              margin: "2px",
            }}
          >
            {/* 1 */}
            <Typography sx={{ textAlign: "center", margin: "15px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Unit
              </Typography>
              <select
                id="pet-select"
                style={{ width: "60px", borderRadius: "4px" }}
              >
                <option value="">select</option>
                <option style={{ width: "70px" }} value="cm">
                  cm
                </option>
                <option value="mm">mm</option>
              </select>
            </Typography>
            {/* 2*/}
            <Typography sx={{ textAlign: "center", margin: "15px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Payment Terms
              </Typography>
              <select
                id="pet-select"
                style={{ width: "60px", borderRadius: "4px" }}
              >
                <option value="">select</option>
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
              </select>
            </Typography>
            {/* 3*/}
            <Typography sx={{ textAlign: "center", margin: "15px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Mode
              </Typography>
              <select
                id="pet-select"
                style={{ width: "60px", borderRadius: "4px" }}
              >
                <option value="">select</option>
                <option value="Cargo">Cargo</option>
                <option value="Courier">Courier</option>
              </select>
            </Typography>
            {/* 4*/}
            <Typography sx={{ textAlign: "center", margin: "15px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Weight Unit
              </Typography>
              <select
                id="pet-select"
                style={{ width: "60px", borderRadius: "4px" }}
              >
                <option value="">select</option>
                <option value="kg">kg</option>
                <option value="gm">gm</option>
              </select>
            </Typography>
            {/* 5 */}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Extra Weight
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 6*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Frieght %
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 7*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Frieght Value
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 8*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Insurance %
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 9*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                SW Charge %
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 10*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                L O V %
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 11*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                C Rate BOE
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 12*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                GST O S %
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 13*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                C Rate Payment
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 14*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Late Fee
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 15*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Shipping Fee
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 16*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                R B O E C
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 17*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Warehouse Charge
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 18*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                Bank Charge
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
            {/* 19*/}
            <Typography sx={{ textAlign: "center", margin: "5px" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>
                O C A
              </Typography>
              <InputBase
                sx={{
                  width: "60px",
                  borderRadius: "4px",
                  outline: "1px solid black",
                  height: "17px",
                  ontWeight: "bold",
                  fontSize: "0.6rem",
                }}
              ></InputBase>
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            {/* First Box */}
            <Box
              sx={{
                // border: "1px solid red",
                display: "flex",
                flexDirection: "column",
                width: "30%",
              }}
            >
              <Box
                sx={{
                  border: "1px solid black ",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "4px",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>Weight</Typography>

                <Box
                  sx={{
                    boxShadow: 2,
                    width: "90%",
                    borderRadius: "4px",
                    textAlign: "center",

                    color: color,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem" }}>
                    Volume weight
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem" }}>0.000</Typography>
                </Box>
                <Box
                  sx={{
                    boxShadow: 2,
                    width: "90%",
                    borderRadius: "4px",
                    textAlign: "center",
                    marginTop: "2px",
                    color: color,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem" }}>
                    Actual Weight
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem" }}>0.000</Typography>
                </Box>
                <Box
                  sx={{
                    boxShadow: 2,
                    width: "90%",
                    borderRadius: "4px",
                    textAlign: "center",
                    marginTop: "2px",
                    color: color,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem" }}>
                    Final Weight
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem" }}>0.000</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  border: "1px solid black ",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "4px",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>Shipping</Typography>

                <Box
                  sx={{
                    boxShadow: 2,
                    width: "90%",
                    borderRadius: "4px",
                    textAlign: "center",
                    color: color,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem" }}>Shipping</Typography>
                  <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  border: "1px solid black ",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "4px",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>
                  OtherCharges
                </Typography>

                <Box
                  sx={{
                    boxShadow: 2,
                    width: "90%",
                    borderRadius: "4px",
                    textAlign: "center",
                    color: color,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem" }}>
                    Total Other Charges
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                </Box>
              </Box>
            </Box>
            {/* Second Box */}
            <Box
              sx={{
                // border: "1px solid green",
                width: "70%",
                display: "flex",
              }}
            >
              {/* A */}
              <Box
                sx={{
                  width: "60%",
                  border: "1px solid black ",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "4px",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>Price</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total USD
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total Boe
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total Payment
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total Frieght
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total Insurance
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total Assesable
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total BasicDuty
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total GST value
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "45%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      Total CD value
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                </Box>
              </Box>
              {/* B */}
              <Box
                sx={{
                  width: "40%",
                  border: "1px solid black ",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "4px",
                  alignItems: "center",
                  padding: "4px",
                }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>Final Calc</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "100%",
                      borderRadius: "4px",
                      textAlign: "center",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      FinalLanding Cost EX
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "100%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      GST Recover
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "100%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      LandingCost Ex GST
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: 2,
                      width: "100%",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "2px",
                      color: color,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem" }}>
                      LandingCost w GST
                    </Typography>
                    <Typography sx={{ fontSize: "0.6rem" }}>₹0.00</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RishabhCalc;
