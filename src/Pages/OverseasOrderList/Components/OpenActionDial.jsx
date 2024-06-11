import { React, useEffect, useState, useRef } from "react";
import { CloudUpload } from "@mui/icons-material";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import noData from "../../../assets/no-data-found.jpg";
import { useUpdatePaymentForOrderMutation } from "../../../features/api/RestockOrderApiSlice";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { ref } from "firebase/storage";

const OpenActionDial = ({ open, close, selectedDetails, selectedInfo ,refetch}) => {
  console.log(selectedInfo)
  let piPdf =
    selectedInfo && selectedInfo?.piCopy?.url?.split("/").pop().includes("pdf");
  let swiftPdf =
    selectedInfo &&
    selectedInfo?.swiftCopy?.url?.split("/").pop().includes("pdf");

  const [selectedFile, setSelectedFile] = useState({
    Swift: "",
    PI: "",
  });

  const [selectedData, setSelectedData] = useState({
    RemittanceNO: "",
    RemittanceAmount: "",
    PINO: "",
    date:"",
  });

  // rtk query api callings
  const [updatePayment, { isLoading }] = useUpdatePaymentForOrderMutation();

  const handleOnChangeFile = (event, targetValue) => {
    const { name, value, files } = event.target;
    if (targetValue === "file") {
      const file = files[0];
      setSelectedFile({
        ...selectedFile,
        [name]: file,
      });
    } else {
      setSelectedData({
        ...selectedData,
        [name]: value,
      });
    }
  };

  const handleSubmitPayment = async () => {
    try {
      const formdata = new FormData();
      formdata.append("paymentDate", selectedData.date);
      formdata.append("swiftCopy", selectedFile.Swift);
      formdata.append("piCopy", selectedFile.PI);
      formdata.append("paymentAmount", +selectedData.RemittanceAmount);
      formdata.append("remitanceNo", selectedData.RemittanceNO);
      formdata.append("orderId", selectedDetails?.orderId);
      formdata.append("piNo", selectedData.PINO);
      const result = await updatePayment(formdata).unwrap();
      toast.success("Payment updated successfully");
      refetch()
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle
        sx={{
          background: "grey",
          textAlign: "center",
          color: "white",
          padding: 1,
        }}
      >
        {selectedDetails?.name}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: selectedDetails?.name === "Add Amount" ? "45vh" : "60vh",
          width: selectedDetails?.name === "Add Amount" ? "20vw" : "50vw",
        }}
      >
        {selectedDetails?.name === "Add Amount" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              border: "0.5px solid #ccc",
              borderRadius: "25px",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                paddingX: "10px",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "5px",
                  width: "100%",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <TextField
                  name="RemittanceNO"
                  label="Remittance No"
                  size="small"
                  value={selectedData.RemittanceNO}
                  onChange={handleOnChangeFile}
                  required
                />
                <TextField
                  name="RemittanceAmount"
                  label="Remittance Amount in USD"
                  type="number"
                  size="small"
                  value={selectedInfo?.orderAmount}
                  // onChange={handleOnChangeFile}
                  disabled
             
                />
                <TextField
                  name="PINO"
                  label="PI NO"
                  size="small"
                  value={selectedData.PINO}
                  onChange={handleOnChangeFile}
                  required
                />
                <label htmlFor="date">
                  {" "}
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Payment Date
                  </span>{" "}
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={selectedData.date}
                    onChange={(e) => handleOnChangeFile(e)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "0.1rem solid #ccc",
                      borderRadius: "5px",
                    }}
                  ></input>
                </label>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  marginTop: "5px",
                  width: "100%",
                  height: "100%",
                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    gap: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upload PI copy
                    </Typography>
                    <label htmlFor="fileInput">
                      <CloudUpload
                        sx={{
                          cursor: "pointer",
                          color: `${selectedFile?.PI ? "green" : ""}`,
                          fontSize: "2rem",
                        }}
                      />
                      <input
                        id="fileInput"
                        type="file"
                        name="PI"
                        style={{ display: "none" }}
                        onChange={(e) => handleOnChangeFile(e, "file")}
                      ></input>
                    </label>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upload Swift copy
                    </Typography>
                    <label htmlFor="swift">
                      <CloudUpload
                        sx={{
                          cursor: "pointer",
                          color: `${selectedFile?.Swift ? "green" : ""}`,
                          fontSize: "2rem",
                        }}
                      />
                      <input
                        id="swift"
                        type="file"
                        name="Swift"
                        style={{ display: "none" }}
                        onChange={(e) => handleOnChangeFile(e, "file")}
                      ></input>
                    </label>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        {/* View Swift copy */}
        {/* {selectedDetails?.name === "Swift copy" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",

              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "80%",
                width: "30vw",
                objectFit: "contained",
              }}
            >
              <img
                src={pdf}
                alt="uploaded File"
                style={{ height: "100%", width: "100%" }}
              ></img>
            </div>
          </Box>
        )} */}
        {/* View PI copy */}
        {/* {selectedDetails?.name === "PI copy" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",

              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "80%",
                width: "30vw",
                objectFit: "contained",
              }}
            >
              <img
                src={pdf}
                alt="uploaded File"
                style={{ height: "100%", width: "100%" }}
              ></img>
            </div>
          </Box>
        )} */}
        {selectedDetails?.name === "Document View" && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              overflow: "hidden",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                border: "1px solid",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  background: "lightblue",
                  padding: "4px",
                }}
              >
                Swift Copy
              </h3>
              {swiftPdf ? (
                <iframe
                  src={selectedInfo.swiftCopy?.url || noData}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <img
                  src={selectedInfo.swiftCopy?.url || noData}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                border: "1px solid black",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  background: "lightblue",
                  padding: "4px",
                }}
              >
                PI Copy
              </h3>

              {piPdf ? (
                <iframe
                  src={selectedInfo.piCopy?.url || noData}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <img
                  src={selectedInfo.piCopy?.url || noData}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          border: "2px s",
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            background: "#9E242A",
          }}
          onClick={() => close()}
        >
          Close
        </Button>
        {selectedDetails?.name === "Add Amount" && (
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "#056210",
            }}
            onClick={() => handleSubmitPayment()}
          >
            {isLoading ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "#fff",
                }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OpenActionDial;
