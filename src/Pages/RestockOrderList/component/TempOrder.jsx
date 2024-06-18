import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import {
  useAssignOrderVendorMutation,
  useGetSingleVendorQuery,
} from "../../../features/api/RestockOrderApiSlice";
import { setOverseaseSelectedOrder } from "../../../features/slice/selectedItemsSlice";
import { toast } from "react-toastify";

const TempOrder = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const { selectedOverseaseOrder } = useSelector(
    (state) => state.SelectedItems
  );
  const [useRMB, setUseRMB] = useState(false);
  const [conversionRate, setConversionRate] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [piNo,setPINumber] = useState(null)

  // rtk queries
  const { data: getVendor, isLoading } = useGetSingleVendorQuery(id);
  const [assignOrder, { isLoading: assignOrderLoading }] =
  useAssignOrderVendorMutation();

  const handleToggleChange = () => {
    setUseRMB(!useRMB);
  };

  useEffect(() => {
    const initializedData = selectedOverseaseOrder.map((item) => ({
      ...item,
      orderQty: item.orderQty || null,
      rmbValue: item.rmbValue || null,
      usdValue: item.usdValue || null,
    }));
    setOrderData(initializedData);
  }, [selectedOverseaseOrder]);

  // getting the value after changing the c rates
  const handleConversionRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setConversionRate(rate);
    const updatedData = orderData.map((item) => {
      const updatedItem = { ...item };
      if (useRMB) {
        updatedItem.usdValue = parseFloat(
          ((item.rmbValue || 0) * rate * (item.orderQty || 1)).toFixed(2)
        );
      } else {
        updatedItem.rmbValue = parseFloat(
          ((item.usdValue || 0) * rate * (item.orderQty || 1)).toFixed(2)
        );
      }
      return updatedItem;
    });

    setOrderData(updatedData);
  };

  // changing input value then we get the data
  const handleInputChange = (index, field, value) => {
    const updatedData = [...orderData];
    updatedData[index][field] = value;
    if (field === "rmbValue" && useRMB) {
      updatedData[index].usdValue = parseFloat(
        (value * conversionRate * (updatedData[index].orderQty || 1)).toFixed(2)
      );
    } else if (field === "usdValue" && !useRMB) {
      updatedData[index].rmbValue = parseFloat(
        (value * conversionRate * (updatedData[index].orderQty || 1)).toFixed(2)
      );
    }
    setOrderData(updatedData);
  };

  // delete the order data
  const handleDeleteRow = (index) => {
    const updatedData = [...orderData];
    updatedData.splice(index, 1);
    setOrderData(updatedData);
    dispatch(setOverseaseSelectedOrder(updatedData));
  };

  // get the total value of usd
  const totalUSDValues = useMemo(() => {
    return orderData
      .reduce(
        (total, item) =>
          total + parseFloat(parseFloat(item.usdValue || 0).toFixed(2)),
        0
      )
      .toFixed(2);
  }, [orderData]);

  // assign order
  const handleAssignOrder = async () => {
    for (let order of orderData) {
      const { SKU, orderQty, rmbValue, usdValue } = order;
      if (!SKU || !rmbValue || !usdValue || !orderQty)
        return toast.error("Plz don't miss required fields");
    }
    const products = orderData.map((product) => ({
      SKU: product.SKU,
      Name: product.Name,
      Orderqty: +product.orderQty,
      RMB: +product.rmbValue,
      USD: +product.usdValue,
      Gst: product.GST,
      Brand: product.Brand,
      prevRMB: product.prevRMB,
      prevUSD: product.prevUSD,
    }));
    const data = {
      vendorId:id,
      products:products,
      piNo:piNo
    }
    try {
      const result = await assignOrder(data).unwrap();
      toast.success("Order added successfully");
      navigate("/OverseasorderList")
    } catch (error) {
      console.log(error);
    }
  };

  const getPlaceholderText = () => {
    if (useRMB && conversionRate) {
      return `1 RMB = ${(1 / conversionRate).toFixed(2)} USD`;
    } else if (!useRMB && conversionRate) {
      return `1 USD = ${(1 / conversionRate).toFixed(2)} RMB`;
    }
    return useRMB ? "1 RMB = ? USD" : "1 USD = ? RMB";
  };

  return (
    <Box sx={{ marginTop: "70px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          border: "0.5px solid black",
          padding: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4>Company Name : </h4>
          {""}
          <span>{getVendor && getVendor?.data?.CompanyName}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4>Concern Person : </h4>
          <span>{getVendor && getVendor?.data?.ConcernPerson}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={!useRMB}
                onChange={handleToggleChange}
                color={useRMB === false ? "secondary" : "warning"}
              />
            }
            label={useRMB ? "RMB" : "USD"}
          />
          <input
            placeholder={getPlaceholderText()}
            value={conversionRate || ""}
            onChange={handleConversionRateChange}
            type="number"
            style={{ ml: 2, width: "50%", padding: "4%" }}
          />
        </div>
        <div>
          <TextField size="small" label={"Enter PI Number"} value={piNo} onChange={(e) => setPINumber(e.target.value)}></TextField>
        </div>

        <div>
          <span style={{ fontWeight: "bold", color: "blue" }}>TOTAL USD:</span>{" "}
          <span>{totalUSDValues}</span>
        </div>
        <Button variant="contained" onClick={() => handleAssignOrder()} disabled={assignOrderLoading}>
          {assignOrderLoading? <CircularProgress/> : "Order"}
        </Button>
      </div>
      <TableContainer component={Paper} sx={{ mt: 2, width: "88vw" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                SKU
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Name
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                GST
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Sld C
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Threshold
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Prev RMB
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Prev USD
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Store Qty
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Order Qty
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                RMB Value
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                USD Value
              </TableCell>
              <TableCell sx={{ textAlign: "center", background: "grey" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData.map((item, index) => (
              <TableRow key={item.SKU}>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.SKU}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.Name}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.GST}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.SoldCount}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.Threshold}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.prevRMB}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.prevUSD}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.Quantity}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: "50px" }}
                    required
                    value={item.orderQty}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "orderQty",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: "110px" }}
                    value={item.rmbValue}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "rmbValue",
                        parseFloat(e.target.value)
                      )
                    }
                    autoFocus={useRMB}
                    disabled={!useRMB}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  <TextField
                    type="number"
                    value={item.usdValue}
                    size="small"
                    sx={{ width: "110px" }}
                    autoFocus={!useRMB}
                    color="secondary"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "usdValue",
                        parseFloat(e.target.value)
                      )
                    }
                    disabled={useRMB}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  <Button onClick={() => handleDeleteRow(index)}>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TempOrder;
