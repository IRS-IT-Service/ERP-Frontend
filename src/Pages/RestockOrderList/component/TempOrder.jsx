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
  styled,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
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
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  padding: 0,
}));

const StyledCellHeader = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  backgroundColor: "#5E95FE",
  color: "black",
  padding: 1.5,
  fontWeight: "thin",
  fontSize: ".8rem",
}));

const TempOrder = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { selectedOverseaseOrder } = useSelector(
    (state) => state.SelectedItems
  );

  const [conversionRate, setConversionRate] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [piNo, setPINumber] = useState(null);
  const [ConversionType, setConversionType] = useState("USD");

  // rtk queries
  const { data: getVendor, isLoading } = useGetSingleVendorQuery(id);
  const [assignOrder, { isLoading: assignOrderLoading }] =
    useAssignOrderVendorMutation();

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
      if (ConversionType === "RMB") {
        updatedItem.usdValue = parseFloat(
          ((item.rmbValue || 0) * rate * (item.orderQty || 1)).toFixed(2)
        );
      } else if (ConversionType === "USD") {
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
    if (field === "rmbValue" && ConversionType === "RMB") {
      updatedData[index].usdValue = parseFloat(
        (value * conversionRate * (updatedData[index].orderQty || 1)).toFixed(2)
      );
    } else if (field === "usdValue" && ConversionType === "USD") {
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

  const handleChangeType = (e, value) => {
    if (value !== null) {
      setConversionType(value);
    }
  };

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
      vendorId: id,
      products: products,
      piNo: piNo,
    };
    try {
      const result = await assignOrder(data).unwrap();
      toast.success("Order added successfully");
      navigate("/OverseasorderList");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0, width: "100%" }}>
      <DrawerHeader />
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          justifyContent: "space-around",
          background: "#ccc",

          padding: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap:"10px"
          }}
        >
          <h4>Company Name :</h4>
          {""}
          <span>{getVendor && getVendor?.data?.CompanyName}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
                gap:"10px"
          }}
        >
          <h4>Concern Person : </h4>
          <span>{getVendor && getVendor?.data?.ConcernPerson}</span>
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2px 12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: "black",
              padding: "0.1rem",
            }}
          >
            PI No
          </Typography>
          <input
            value={piNo}
            style={{ padding: "5px" }}
            onChange={(e) => setPINumber(e.target.value)}
          />
        </Box>

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
          </Typography>
          <input
            value={conversionRate || ""}
            onChange={handleConversionRateChange}
            type="number"
            style={{ width: "60px", padding: "4px" }}
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

        <div>
          <span style={{ fontWeight: "bold", color: "blue" }}>TOTAL USD:</span>{" "}
          <span>$ {totalUSDValues}</span>
        </div>
      </Box>
      <TableContainer
        sx={{
          width: "100%",
          height: "73vh",
          border: "0.5px solid #ccc",
          overflow: "auto",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledCellHeader>SKU</StyledCellHeader>
              <StyledCellHeader>Name</StyledCellHeader>
              <StyledCellHeader>GST</StyledCellHeader>
              <StyledCellHeader>Sld C</StyledCellHeader>
              <StyledCellHeader>Threshold</StyledCellHeader>
              <StyledCellHeader>Prev RMB</StyledCellHeader>
              <StyledCellHeader>Prev USD</StyledCellHeader>
              <StyledCellHeader>Store Qty</StyledCellHeader>
              <StyledCellHeader>Order Qty</StyledCellHeader>
              <StyledCellHeader>RMB Value</StyledCellHeader>
              <StyledCellHeader>USD Value</StyledCellHeader>
              <StyledCellHeader>Delete</StyledCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData.map((item, index) => (
              <TableRow key={item.SKU}>
                <StyledCell>{item.SKU}</StyledCell>
                <StyledCell>{item.Name}</StyledCell>
                <StyledCell>{item.GST}</StyledCell>
                <StyledCell>{item.SoldCount}</StyledCell>
                <StyledCell>{item.Threshold}</StyledCell>
                <StyledCell>{item.prevRMB}</StyledCell>
                <StyledCell>{item.prevUSD}</StyledCell>
                <StyledCell>{item.Quantity}</StyledCell>
                <StyledCell>
                  <input
                    type="number"
                    style={{
                      textAlign: "center",
                      width: "45px",
                      padding: "3px",
                    }}
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
                </StyledCell>
                <StyledCell sx={{ textAlign: "center", padding: "4px" }}>
                  <input
                    type="number"
                    style={{
                      textAlign: "center",
                      width: "110px",
                      padding: "3px",
                    }}
                    value={item.rmbValue}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "rmbValue",
                        parseFloat(e.target.value)
                      )
                    }
                    autoFocus={ConversionType === "RMB"}
                    disabled={ConversionType === "USD"}
                  />
                </StyledCell>
                <StyledCell sx={{ textAlign: "center", padding: "4px" }}>
                  <input
                    type="number"
                    value={item.usdValue}
                    style={{
                      textAlign: "center",
                      width: "110px",
                      padding: "3px",
                    }}
                    autoFocus={ConversionType === "USD"}
                    color="secondary"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "usdValue",
                        parseFloat(e.target.value)
                      )
                    }
                    disabled={ConversionType === "RMB"}
                  />
                </StyledCell>
                <StyledCell>
                  <Box
                    sx={{
                      color: "black",
                      "&:hover": {
                        color: "red",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleDeleteRow(index)}
                  >
                    <Delete />
                  </Box>
                </StyledCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "5px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAssignOrder()}
          disabled={assignOrderLoading}
        >
          {assignOrderLoading ? <CircularProgress /> : "Order"}
        </Button>
      </Box>
    </Box>
  );
};

export default TempOrder;
