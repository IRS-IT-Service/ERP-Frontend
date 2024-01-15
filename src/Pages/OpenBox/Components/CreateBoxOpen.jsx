import React from "react";
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import {
  useVerifyBarcodeForDispatchMutation,
  useCreateBoxOpenMutation,
} from "../../../features/api/barcodeApiSlice";
import { useState } from "react";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Common/Loading";

const OpenBoxGrid = () => {
  /// Initialize
  const navigate = useNavigate();

  /// local state
  const [barcode, setBarcode] = useState("");
  const [data, setData] = useState(null);
  const [openBox, setOpenBox] = useState(false);
  const [inputFields, setInputFields] = useState([""]);

  /// rtk query
  const [verifyForBoxApi, { isLoading }] =
    useVerifyBarcodeForDispatchMutation();

  const [createBoxOpenApi, { isLoading: boxOpenLoading }] =
    useCreateBoxOpenMutation();

  /// Handlers

  const handleChange = async (e) => {
    try {
      setBarcode(e.target.value);
      if (e.target.value.length > 15) {
        const params = { Sno: e.target.value, type: true };
        const res = await verifyForBoxApi(params).unwrap();

        setData(res.data);
      }
    } catch (e) {
      console.log("Error at Box Open");
      console.log(e);
    }
    setBarcode("");
  };

  const addInputField = (index) => {
    if (index) {
      console.log("trigger");
      const oldInputField = [...inputFields];
      oldInputField.splice(index, 1);
      setInputFields(oldInputField);
      return;
    }
    setInputFields([...inputFields, ""]); // Add a new input field to the array
  };

  const handleInputChange = (value, index) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);
  };

  const handleSubmit = async () => {
    try {
      const processedInput = inputFields.filter((item) => item !== "");

      if (!processedInput.length) {
        toast.error("Please Add Item which u Are taking From Box");
        return;
      }

      const params = {
        sno: data?.barcode?.serialNumber,
        items: processedInput,
      };

      if (data.barcode.isOpen) {
        params.items = [...processedInput, ...data.barcode.openItems];
      }

      const res = await createBoxOpenApi(params).unwrap();
      toast.success("Success");
      setData(null);
      setOpenBox(false);
      navigate("/openboxlist");
    } catch (e) {
      console.log("Error at Box Open");
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        paddingTop: "1rem",
        width: "100%",
        paddingRight: "",
        paddingBottom: "1rem",
      }}
    >
      <Loading loading={isLoading} />
      <Box
        sx={{
          marginLeft: "",
        }}
      >
        {/*  */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1rem",
          }}
        >
          {/* first flex */}

          {data ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: ".666rem",
                  color: "#000",
                  backgroundColor: " #80bfff",
                  paddingX: "1rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                }}
              >
                <Typography>SKU : </Typography>
                <Typography>{data.product.SKU}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: ".666rem",
                  color: "#000",
                  backgroundColor: " #80bfff",
                  paddingX: "1rem",
                  border: "2px solid #3385ff",
                  borderRadius: ".4rem",
                  boxShadow: "-3px 3px 4px 0px #404040",
                  marginTop: "1rem",
                }}
              >
                <Typography>Name : </Typography>
                <Typography>{data.product.Name}</Typography>
              </Box>
            </Box>
          ) : (
            ""
          )}

          {/* flex search bar */}
          <Box>
            <input
              style={{ borderRadius: ".4rem", padding: "1rem" }}
              value={barcode}
              onChange={handleChange}
              placeholder="Scan Barcode"
            />
          </Box>
          {/* check history */}
        </Box>

        {/* table section */}
        <Box sx={{ marginTop: "4rem" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#80bfff" }}>
                  <TableCell>SNo</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Status</TableCell>

                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data ? (
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>{data?.barcode?.serialNumber}</TableCell>
                    <TableCell>
                      {/* <IconButton color='primary'>
                    <VisibilityIcon />
                  </IconButton> */}
                      <Button variant="contained">
                        {data?.barcode?.isOpen
                          ? "Previosly Opened"
                          : "Never Opened"}
                      </Button>
                    </TableCell>

                    <TableCell>
                      {/* <IconButton color='primary'>
                    <EditIcon />
                  </IconButton> */}
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpenBox(true);
                        }}
                      >
                        open Box
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Dialog
          maxWidth="xl"
          open={openBox}
          onClose={() => {
            setOpenBox(false);
          }}
        >
          <DialogContent
            sx={{
              // border: '2px solid yellow',
              display: "flex",
              justifyContent: "space-between",
              gap: "2rem",
            }}
          >
            {data?.barcode?.openItems?.length ? (
              <Box sx={{}}>
                <h3 style={{}}>Previous Took Items</h3>

                {data.barcode.openItems.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        fontSize: ".666rem",
                        color: "#000",
                        backgroundColor: " #80bfff",
                        paddingX: "1rem",
                        paddingY: ".4rem",
                        border: "2px solid black",
                        borderRadius: ".4rem",
                        boxShadow: "-3px 3px 4px 0px #404040",
                        marginTop: "1rem",
                      }}
                    >
                      <p style={{ fontSize: "1rem", fontWeight: "600" }}>
                        {item}
                      </p>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              ""
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // border: '2px solid blue',
                gap: ".5rem",
              }}
            >
              {inputFields.map((input, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    key={index}
                    label={`Item ${index + 1}`}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    fullWidth
                  />
                  <span>
                    <Delete
                      onClick={() => {
                        addInputField(index);
                      }}
                    />
                  </span>
                </Box>
              ))}
            </div>
          </DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: ".5rem",
            }}
          >
            {/* submit button */}
            <Button
              variant="outlined"
              onClick={() => {
                handleSubmit();
              }}
            >
              {boxOpenLoading ? <CircularProgress /> : "Submit"}
            </Button>
            {/* other buttons */}
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  addInputField();
                }}
              >
                Add
              </Button>
              <Button
                sx={{ backgroundColor: "red", marginX: ".5rem" }}
                variant="contained"
                onClick={() => {
                  setOpenBox(false);
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
          <Box></Box>
        </Dialog>
      </Box>
    </Box>
  );
};

export default OpenBoxGrid;
