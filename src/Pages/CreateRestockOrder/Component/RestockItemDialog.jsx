import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  selectClasses,
} from "@mui/material";
import {
  useCreateRestockMutation,
  useCreatePriceComparisionMutation,
} from "../../../features/api/RestockOrderApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
const RestockItemDialog = ({
  items,
  open,
  onClose,
  handleDelete,
  setSelectedItems,
  setItems,
  selectedItems,
}) => {
  /// intialize
  const socket = useSocket();

  /// global state
  const { isAdmin, productColumns, userInfo } = useSelector(
    (state) => state.auth
  );

  /// local state
  const [orderQuantities, setOrderQuantities] = useState({});
  const [description, setDescription] = useState("");

  /// rtk query
  const [createRestockOrderApi, { isLoading }] = useCreateRestockMutation();
  const [createPriceComparision, { isLoading: compareLoading }] =
    useCreatePriceComparisionMutation();

  /// useEffects

  useEffect(() => {
    let oldOrderQuantities = { ...orderQuantities };

    if (items.length) {
      items.forEach((item) => {
        if (!oldOrderQuantities[item.SKU]) {
          oldOrderQuantities[item.SKU] = 1;
        }
      });
    }
    setOrderQuantities(oldOrderQuantities);

  }, [items]);


  /// handlers
  const handleQuantityChange = (itemId, value) => {
    const quantity = +value;
    if (quantity >= 0) {
      setOrderQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: +value,
      }));
    } else {
      toast.warning("Quantity cannot be less than 0");
    }
  };

  const handleConfirm = async () => {
    if (items.length > 0) {
      const processedItems = items.map((item) => ({
        ...item,
        NewQuantity: orderQuantities[item.SKU] || 0,
      }));

      const hasZeroQuantity = processedItems.some(
        (item) => item.NewQuantity === 0
      );

      if (hasZeroQuantity) {
        toast.error("Please add orderQuantity first ");
        return; // Return from the function
      }

      if (!description) {
        toast.error("Please Add Order Description first");
        return; // Return from the function
      }

      try {
        const data = {
          restocks: processedItems,
          description,
        };
        const res = await createRestockOrderApi(data).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created Restock Order `,
          time: new Date(),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success("Restock order was successfully processed");
        setSelectedItems([]);
        setOrderQuantities({});
        setItems([]);
        setDescription("");
        onClose();
      } catch (err) {
        console.error("Error at Creating Restock Order: " + err);
      }
    } else {
      toast.error("Please select a product.");
    }
  };

  const handlePriceComparision = async () => {
    if (items.length > 0) {
      const processedItems = items.map((item) => ({
        ...item,
        NewQuantity: orderQuantities[item.id] || 0,
      }));

      const hasZeroQuantity = processedItems.some(
        (item) => item.NewQuantity === 0
      );

      if (hasZeroQuantity) {
        toast.error("Please add orderQuantity first ");
        return; // Return from the function
      }
      if (!description) {
        toast.error("Please Add Order Description first");
        return; // Return from the function
      }

      try {
        const data = {
          priceComparision: processedItems,
          description,
        };
        const res = await createPriceComparision(data).unwrap();
        const liveStatusData = {
          message: `${userInfo.name} Created Price Comparison Order `,
          time: new Date(),
        };
        socket.emit("liveStatusServer", liveStatusData);
        toast.success("Price comparision has successfully processed");
        setSelectedItems([]);
        setOrderQuantities({});
        setItems([]);
        setDescription("");
        onClose();
      } catch (err) {
        console.error("Error at Creating Price Comparision: " + err);
      }
    } else {
      toast.error("Please select a product.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      sx={{ backdropFilter: "blur(5px)" }}
      fullWidth
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "3rem",
        }}
      >
        <DialogTitle
          sx={{
            flex: "1",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Order Items
        </DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
          }}
        />
      </Box>
      <DialogContent sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Sno
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  SKU
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Sold Count
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Stock
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Threshold Qty
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Brand
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Order Quantity
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    background: "linear-gradient(0deg, #01127D, #04012F)",
                    color: "#fff",
                  }}
                >
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.SKU}</TableCell>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>{item.soldCount}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell sx={{ textAlign: "center", width: "150px" }}>
                    {item.ThresholdQty}
                  </TableCell>
                  <TableCell>{item.Brand}</TableCell>
                  <TableCell>{item.Category}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={orderQuantities[item.SKU] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.SKU, e.target.value)
                      }
                      sx={{
                        "& input": {
                          height: "10px",
                          width: "50px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DeleteIcon onClick={() => handleDelete(item.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Box
        sx={{
          // border: '2px solid green',
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: ".6rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#80bfff",
            marginTop: ".4rem",
            // border: '2px solid yellow',
            padding: ".2rem",
            border: "2px solid #3385ff",
            borderRadius: ".4rem",
            boxShadow: "-3px 3px 4px 0px #404040",
          }}
        >
          Enter Description For Order
        </Typography>
        <TextField
          placeholder="order description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          gap: "1rem",
          padding: "0.5rem",
          backgroundColor: " #e6e6e6",
        }}
      >
        <Button variant="outlined" onClick={handlePriceComparision}>
          {compareLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Price Comparison"
          )}
        </Button>
        <Button variant="outlined" onClick={handleConfirm}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading indicator
          ) : (
            "Create Restock"
          )}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Add More
        </Button>
      </Box>
    </Dialog>
  );
};

export default RestockItemDialog;
