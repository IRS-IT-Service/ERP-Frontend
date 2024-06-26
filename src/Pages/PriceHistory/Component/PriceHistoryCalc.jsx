import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useAddPriceHistoryMutation } from "../../../features/api/PriceHistoryApiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

function PriceHistoryCalc({
  data,
  successdisplay,
  open,
  setOpen,
  handleSelectionChange,
  selectedItems,
}) {
  /// local state

  const [usdCommon, setUSDcommon] = useState("");
  const [qty, setQty] = useState({});
  const [usdValue, setUSDValue] = useState({});
  const [rmbValue, setRMBValue] = useState({});
  const [ConversionType, setConversionType] = useState("USD");
  const [conversionRate, setConversionRate] = useState(null);
  const [datas, setDatas] = useState();

  /// rtk query
  const [addpriceHistory, { isLoading: addpriceHistoryLoading }] =
    useAddPriceHistoryMutation();

  /// handlers
  useEffect(() => {
    if (data) {
      const initializeData = data.map((item, index) => ({
        ...item,
        usdValue: null,
        rmbValue: null,
      }));
      setDatas(initializeData);
    }
  }, [data]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...datas];
    updatedData[index][field] = value;

    if (field === "rmbValue" && ConversionType === "RMB") {
      updatedData[index].usdValue = parseFloat(
        (value * conversionRate).toFixed(2)
      );
    } else if (field === "usdValue" && ConversionType === "USD") {
      updatedData[index].rmbValue = parseFloat(
        (+value * conversionRate).toFixed(2)
      );
    }

    setDatas(updatedData);
  };

  const handleDelete = (id) => {
    const newSelectedItems = selectedItems.filter((row) => row !== id);
    handleSelectionChange(newSelectedItems);
    if (!newSelectedItems.length) {
      setOpen(false);
    }
    console.log(newSelectedItems);
  };

  const handleHistoryUpdate = async () => {
    try {
      if (!conversionRate) {
        toast.error("Please add Conversion Rate");
        return;
      }

      let apiData = [];

      datas.forEach((item, index) => {
        if (!item.rmbValue || !item.usdValue) {
          toast.error(`Missing field for SKU: ${item.SKU}`);
          return;
        }

        apiData.push({
          SKU: item.SKU,
          priceHistory: [
            {
              conversionRate: conversionRate,
              Quantity: item.QTY,
              RMB: +item.rmbValue,
              USD: +item.usdValue,
            },
          ],
        });
      });

      if (apiData.length !== datas.length) {
        return;
      }

      const res = await addpriceHistory(apiData).unwrap();

      successdisplay();
      handleSelectionChange([]);
      setDatas([])
      setConversionRate()
      setOpen(false);
    } catch (err) {
      handleSelectionChange([]);
      setDatas([])
      setConversionRate()
      console.error(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeType = (e, value) => {
    if (value !== null) {
      setConversionType(value);
    }
  };

  // getting the value after changing the c rates
  const handleConversionRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setConversionRate(rate);
    const updatedData = datas.map((item) => {
      const updatedItem = { ...item };
      if (ConversionType === "RMB") {
        updatedItem.usdValue = parseFloat(
          ((item.rmbValue || 0) * rate).toFixed(2)
        );
      } else if (ConversionType === "USD") {
        updatedItem.rmbValue = parseFloat(
          ((item.usdValue || 0) * rate).toFixed(2)
        );
      }
      return updatedItem;
    });

    setDatas(updatedData);
  };

  return (
    <div style={{ backgroundColor: "green" }}>
      <Dialog sx={{}} open={open} onClose={handleClose} maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <h2 style={{ flex: "1", textAlign: "center" }}>
            Enter conversion rate
          </h2>
        </Box>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "black",
                padding: "0.1rem",
              }}
            >
              {ConversionType === "RMB"
                ? "1 RMB equal to USD"
                : "1 USD equal to RMB"}
            </Typography>{" "}
            {"="}
            <input
              value={conversionRate || ""}
              onChange={handleConversionRateChange}
              type="number"
              style={{ width: "80px", padding: "4px" }}
            />
            <ToggleButtonGroup
              value={ConversionType}
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
          <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ backgroundColor: "#03084E" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Sno
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    GST %
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    RMB
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    USD
                  </TableCell>
                  <TableCell sx={{ color: "#fff", backgroundColor: "#03084E" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datas?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ padding: ".5rem" }}>{index + 1}</TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>{row.SKU}</TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>{row.Name}</TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>{row.Brand}</TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>{row.GST} %</TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>
                      <input
                        style={{
                          width: "4rem",
                          height: "2rem",
                          padding: ".6rem",
                        }}
                        name="qty"
                        type="number"
                        value={row.QTY || ""}
                        onChange={(e) => {
                          handleInputChange(index, "QTY", e.target.value);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>
                      <input
                        style={{
                          width: "4rem",
                          height: "2rem",
                          padding: ".6rem",
                        }}
                        name="rmb"
                        type="number"
                        value={row.rmbValue || ""}
                        onChange={(e) => {
                          handleInputChange(index, "rmbValue", e.target.value);
                        }}
                        disabled={ConversionType === "USD"}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>
                      <input
                        style={{
                          width: "4rem",
                          height: "2rem",
                          padding: ".6rem",
                        }}
                        type="number"
                        name="usdValue"
                        value={row.usdValue || ""}
                        onChange={(e) => {
                          handleInputChange(index, "usdValue", e.target.value);
                        }}
                        disabled={ConversionType === "RMB"}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: ".5rem" }}>
                      <Button
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            padding: ".6rem",
            gap: "1rem",
          }}
        >
          <Button variant="contained" onClick={handleHistoryUpdate}>
            {addpriceHistoryLoading ? <CircularProgress /> : "Save"}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}

export default PriceHistoryCalc;
