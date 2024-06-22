import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import {
  useAssignOrderVendorMutation,
  useGetSingleVendorQuery,
  useUpdateOrderOverseasMutation,
} from "../../../features/api/RestockOrderApiSlice";
import {
  setOverseaseSelectedOrder,
  removeSelectedOverseaseOrder,
} from "../../../features/slice/selectedItemsSlice";
import { useGetSingleOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import AddshipmentDial from "../../PackagingAndClient/createOrderShipment/AddshimentpartsDial";

import { toast } from "react-toastify";
import { skSK } from "@mui/x-data-grid";
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
  const isEditable = id.slice(0, 2) === "OV";

  const {
    data: getSingleData,
    isLoading: dataLoading,
    refetch,
  } = useGetSingleOrderQuery(id, {
    skip: !isEditable,
  });

  const dispatch = useDispatch();
  const { selectedOverseaseOrder } = useSelector(
    (state) => state.SelectedItems
  );

  const [conversionRate, setConversionRate] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [piNo, setPINumber] = useState(null);
  const [ConversionType, setConversionType] = useState("USD");
  const [showPrevColumns, setShowPrevColumns] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [FinalData, setFinalData] = useState([]);
  const [totalAmount, setTotalamount] = useState(0);
  const [totalRMBAmount, setTotalRMBamount] = useState(0);
  const [totalQty, setTotalqty] = useState(0);
  const [vendoreDetails, setVendoreDetails] = useState({
    companyName: "",
    concernPerson: "",
  });

  const togglePrevColumns = () => {
    setShowPrevColumns(!showPrevColumns);
  };

  // rtk queries
  const { data: getVendor, isLoading } = useGetSingleVendorQuery(id);
  const [
    assignOrder,
    { isLoading: assignOrderLoading, refetch: assignreftech },
  ] = useAssignOrderVendorMutation();

  const [updateassignOrder, { isLoading: updateassignOrderLoading }] =
    useUpdateOrderOverseasMutation();

  useEffect(() => {
    let prevConv = 0;
    if (isEditable) {
      const initializedData =
        getSingleData?.data?.subOrders[0].finalProducts.map((item) => {
          if (item.USD || item.RMB || item.RMB > item.USD) {
            if (ConversionType === "USD") {
              prevConv = item.RMB / item.USD;
            } else if (ConversionType === "RMB") {
              prevConv = item.USD / item.RMB;
            }
          }
          setConversionRate(prevConv.toFixed(2));
          return {
            ...item,
            orderQty: item.Orderqty || 0,
            rmbValue: item.RMB || 0,
            usdValue: item.USD || 0,
            GST: item.Gst || 0,
          };
        });
      setOrderData(initializedData);
    } else if (!isEditable && !conversionRate) {
      const initializedData = selectedOverseaseOrder.map((item) => ({
        ...item,
        orderQty: item.orderQty || item.RestockQuantity,
        rmbValue: item.rmbValue || null,
        usdValue: item.usdValue || null,
      }));
      setOrderData(initializedData);
    }
  }, [getSingleData, selectedOverseaseOrder, ConversionType]);

  useEffect(() => {
    const handleLoad = () => {
      navigate("/RestockOrderList");
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // getting the value after changing the c rates
  const handleConversionRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setConversionRate(rate);
    const updatedData = orderData.map((item) => {
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

    setOrderData(updatedData);
  };

  // changing input value then we get the data
  const handleInputChange = (index, field, value) => {
    const updatedData = [...orderData];
    updatedData[index][field] = value;
    if (field === "rmbValue" && ConversionType === "RMB") {
      updatedData[index].usdValue = parseFloat(
        (value * conversionRate).toFixed(2)
      );
    } else if (field === "usdValue" && ConversionType === "USD") {
      updatedData[index].rmbValue = parseFloat(
        (value * conversionRate).toFixed(2)
      );
    }
    setOrderData(updatedData);
  };

  // delete the order data
  const handleDeleteRow = (SKU) => {
    const newSelectedItems = orderData.filter((item) => item?.SKU !== SKU);
    setOrderData(newSelectedItems);
    // dispatch(setOverseaseSelectedOrder(newSelectedItems));
  };

  // get the total value of usd

  const handleChangeType = (e, value) => {
    if (value !== null) {
      setConversionType(value);
    }
  };

  useEffect(() => {
    if (isEditable) {
      setVendoreDetails({
        companyName: getSingleData?.data?.vendorCompany,
        concernPerson: getSingleData?.data?.vendorConcernPerson,
      });

      setPINumber(getSingleData?.data.piNo);
      dispatch(removeSelectedOverseaseOrder());
      setFinalData((data) => {});
    } else {
      setVendoreDetails({
        companyName: getVendor?.data?.CompanyName,
        concernPerson: getVendor?.data?.ConcernPerson,
      });
    }
  }, [getSingleData, getVendor]);

  useEffect(() => {
    if (isEditable && selectedData.length > 0) {
      const initializedData = selectedData.map((item) => ({
        ...item,
        orderQty: item.Orderqty || null,
        rmbValue: item.RMB || null,
        usdValue: item.USD || null,
        GST: item.GST || null,
      }));

      setOrderData((prev) => [...prev, ...initializedData]);
    }
  }, [selectedData]);
  console.log(selectedData);
  useEffect(() => {
    const TotalValue = orderData?.reduce((acc, cur) => {
      return acc + +cur?.orderQty * +cur?.usdValue || 0;
    }, 0);
    const TotalQuantity = orderData?.reduce((acc, cur) => {
      return acc + +cur?.orderQty;
    }, 0);
    const TotalRMB = orderData?.reduce((acc, cur) => {
      return acc + +cur?.orderQty * +cur?.rmbValue || 0;
    }, 0);

    setTotalamount(TotalValue?.toFixed(2));
    setTotalqty(TotalQuantity);

    setTotalRMBamount(TotalRMB?.toFixed(2));
  }, [orderData, conversionRate]);

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
    const update = {
      orderId: id,
      piNo: piNo,
      totalRMBAmount: totalRMBAmount,
      totalUSDAmount: totalAmount,
      products: products,
    };

    try {
      if (isEditable) {
        const result = await updateassignOrder(update).unwrap();

        toast.success("Order updated successfully");
        navigate("/OverseasorderList");
        window.location.reload();
      } else {
        const result = await assignOrder(data).unwrap();
        toast.success("Order added successfully");
        navigate("/OverseasorderList");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const selectedSKU = orderData?.map((item) => {
      return item.SKU;
    });
    setFinalData(selectedSKU);
  }, [setOrderData, orderData]);

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
            gap: "10px",
          }}
        >
          <h4>Company Name :</h4>
          {""}
          <span>{vendoreDetails.companyName}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <h4>Concern Person : </h4>
          <span>{vendoreDetails.concernPerson}</span>
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
          {isEditable && (
            <Box
              sx={{
                width: "25px",
                height: "25px",
                backgroundColor: "#5E95FE",
                color: "white",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "15px",
                "&:hover": {
                  backgroundColor: "#0842B1",
                  color: "white",
                },
              }}
              onClick={() => setOpenDialog(true)}
            >
              <AddIcon />
            </Box>
          )}
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
          </Typography>{" "}
          {"="}
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
        <Button
          size="small"
          onClick={togglePrevColumns}
          sx={{
            color: showPrevColumns ? "green" : "red",
          }}
        >
          {showPrevColumns ? "Hide prev columns" : "Show prev columns"}
        </Button>

        <div>
          <span style={{ fontWeight: "bold", color: "blue" }}>TOTAL RMB:</span>{" "}
          <span>¥ {totalRMBAmount}</span>
        </div>
        <div>
          <span style={{ fontWeight: "bold", color: "blue" }}>TOTAL USD:</span>{" "}
          <span>$ {totalAmount}</span>
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
              {!isEditable && <StyledCellHeader>Sold Count</StyledCellHeader>}
              {!isEditable && <StyledCellHeader>Threshold</StyledCellHeader>}
              {showPrevColumns && <StyledCellHeader>Prev RMB</StyledCellHeader>}
              {showPrevColumns && <StyledCellHeader>Prev USD</StyledCellHeader>}
              {!isEditable && <StyledCellHeader>Store Qty</StyledCellHeader>}
              <StyledCellHeader>Order Qty</StyledCellHeader>
              <StyledCellHeader>RMB Value</StyledCellHeader>
              <StyledCellHeader>USD Value</StyledCellHeader>
              <StyledCellHeader>Delete</StyledCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData?.map((item, index) => (
              <TableRow key={item.SKU}>
                <StyledCell>{item.SKU}</StyledCell>
                <StyledCell>{item.Name}</StyledCell>
                <StyledCell>{item.GST && item.GST + "%"}</StyledCell>
                {!isEditable && <StyledCell>{item.SoldCount}</StyledCell>}
                {!isEditable && <StyledCell>{item.Threshold}</StyledCell>}
                {showPrevColumns && <StyledCell>{item.prevRMB}</StyledCell>}
                {showPrevColumns && <StyledCell>{item.prevUSD}</StyledCell>}
                {!isEditable && <StyledCell>{item.Quantity}</StyledCell>}
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
                    onClick={() => handleDeleteRow(item.SKU)}
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
          disabled={assignOrderLoading || updateassignOrderLoading}
        >
          {assignOrderLoading || updateassignOrderLoading ? (
            <CircularProgress />
          ) : isEditable ? (
            "update"
          ) : (
            "Order"
          )}
        </Button>
      </Box>
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

export default TempOrder;
