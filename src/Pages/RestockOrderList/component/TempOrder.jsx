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
  TextField,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { useAssignOrderToVendorMutation, useGetSingleVendorQuery } from "../../../features/api/RestockOrderApiSlice";
import { setOverseaseSelectedOrder } from "../../../features/slice/selectedItemsSlice";
import { toast } from "react-toastify";

const TempOrder = () => {
  const params = useParams();
  const id = params.id;

  const dispatch = useDispatch();
  const { selectedOverseaseOrder } = useSelector(
    (state) => state.SelectedItems
  );
  const [useRMB, setUseRMB] = useState(true);
  const [conversionRate, setConversionRate] = useState(null);
  const [orderData, setOrderData] = useState([]);

  // rtk queries
  const { data: getVendor, isLoading } = useGetSingleVendorQuery(id);
  const [assignOrder , {isLoading:assignOrderLoading}] = useAssignOrderToVendorMutation()

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

  // getting the value after changint the c rates
  const handleConversionRateChange = (e) => {
    const rate = e.target.value;
    setConversionRate(rate);
    const updatedData = orderData.map((item) => {
      if (useRMB) {
        return {
          ...item,
          usdValue: item.rmbValue * rate,
        };
      } else {
        return {
          ...item,
          rmbValue: item.usdValue / rate,
        };
      }
    });

    setOrderData(updatedData);
  };

  console.log(useRMB)

  // changeing input value then we get the data
  const handleInputChange = (index, field, value) => {
    const updatedData = [...orderData];
    updatedData[index][field] = value;
    if (field === "rmbValue" && useRMB) {
      console.log("hielle")
      updatedData[index].usdValue = value / conversionRate;
    } else if (field === "usdValue" && !useRMB) {
      console.log("ussdd")
      updatedData[index].rmbValue = value * conversionRate;
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

  // get the totalvalue of usd
  const totalUSDValues = useMemo(() => {
    return orderData.reduce(
      (total, item) => total + parseFloat(item.usdValue || 0),
      0
    );
  }, [orderData]);

  // assign order
  const handleAssignOrder = async() => {
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
      Gst: item.GST,
      Brand: item.Brand,
      prevRMB:item.prevRMB,
      prevUSD:item.prevUSD
    }));
   try{
    const result= await assignOrder(products).unwrap();
    toast.success("Order added successfully")

   }catch(error){
    console.log(error)
   }
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
            control={<Switch checked={useRMB} onChange={handleToggleChange} />}
            label={useRMB ? "RMB" : "USD"}
          />
          <input
            placeholder={useRMB ? "1USD Per RMB": "1RMB Per USD"  }
            value={conversionRate}
            onChange={handleConversionRateChange}
            type="number"
            style={{ ml: 2, width: "50%", padding: "4%" }}
          />
        </div>

        <div>
          <span style={{ fontWeight: "bold", color: "blue" }}>TOTAL USD:</span>{" "}
          <span>{totalUSDValues}</span>
        </div>
        <Button variant="contained" onClick={() => handleAssignOrder()}>
          Order
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
              <TableRow key={item.sku}>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.SKU}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "4px" }}>
                  {item.Name}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.GST}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.SoldCount}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.Threshold}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.prevRMB}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.prevUSD}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  {item.Quantity}
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  <input
                    style={{ width: "40%", padding: "4%" }}
                    value={item.orderQty}
                    onChange={(e) =>
                      handleInputChange(index, "orderQty", e.target.value)
                    }
                    type="number"
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", padding: "0px" }}>
                  <input
                    style={{ width: "40%", padding: "4%" }}
                    value={item.rmbValue}
                    onChange={(e) =>
                      handleInputChange(index, "rmbValue", e.target.value)
                    }
                    type="number"
                    disabled={!useRMB}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <input
                    style={{ width: "40%", padding: "4%" }}
                    value={item.usdValue}
                    onChange={(e) =>
                      handleInputChange(index, "usdValue", e.target.value)
                    }
                    type="number"
                    disabled={useRMB}
                  />
                </TableCell>
                <TableCell>
                  <Delete
                    sx={{ color: "red" }}
                    onClick={() => handleDeleteRow(index)}
                  />
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
