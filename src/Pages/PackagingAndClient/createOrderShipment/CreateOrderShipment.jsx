import React, { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  styled,
  Autocomplete,
  Popover,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Select,
  MenuItem,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "In Store" },
  { field: "Assigned QTY", headerName: "Assigned QTY" },
  { field: "QTY", headerName: "QTY" },
  { field: "Delete", headerName: "Remove" },
];
import { useSocket } from "../../../CustomProvider/useWebSocket";
import {
  useGetAllClientQuery,
  useGetAllPackagesQuery,
  useGetCustomerOrderShipmentQuery,
} from "../../../features/api/clientAndShipmentApiSlice";
import {
  removedSelectedItems,
  removeSelectedSkus,
  setSelectedItems,
  setSelectedSkus,
} from "../../../features/slice/selectedItemsSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
}));

import {
  ConnectingAirportsOutlined,
  ConstructionOutlined,
  InfoRounded,
  TabOutlined,
} from "@mui/icons-material";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));
import {
  useUpdateCustomershippingAddressMutation,
  useCreateShipmentOrderMutation,
  useUpdateCustomerShipmentMutation,
  useDeleteShipmentProductMutation,
} from "../../../features/api/clientAndShipmentApiSlice";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { tableCellClasses } from "@mui/material/TableCell";
import AddshipmentDial from "./AddshimentpartsDial";
import RandDShipmentDial from "./RandDShipmentDial";
import { useGetPendingRequestQuery } from "../../../features/api/barcodeApiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundImage: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  padding: 5,
  textAlign: "center",
}));

const infoDetail = [
  {
    name: "Billing Address",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/billingAddress.png?updatedAt=1717393210078"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Here we can see Customer Billing Address  `,
  },

  {
    name: "Shipping Address",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/shippingAddress.png?updatedAt=1717393174193"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Here we can see Customer Shipping Address `,
  },

  {
    name: "Upload Invoice",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/uploadInvoice.png?updatedAt=1717393146926"
        height={"100%"}
        width={"100%"}
        style={
          {
            // width: '10vw',
            // height: '10vh'
          }
        }
      />
    ),
    instruction: `Here we can see Customer Upload Invoice`,
  },
];

const createOrderShipment = ({ setOpen, id }) => {
  /// initialize

  const { isInfoOpen } = useSelector((state) => state.ui);
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { createQueryItems, selectedItems, selectedSkus } = useSelector(
    (state) => state.SelectedItems
  );

  let description = `Create order shipment`;

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const orderIdParam = queryParams.get("orderId");
    setOrderId(orderIdParam);
  }, []);

  const [Requireqty, setRequireqty] = useState([]);
  const [qty, setQty] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});
  const [addAddress, setAddaddress] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [FinalData, setFinalData] = useState([]);
  const [updateValue, setUpdateValue] = useState([]);
  const [editButton, setEditButton] = useState([]);
  const [RandDShipmentDialog, setRandDShipmentDialog] = useState(false);

  const [Clientlist, setClientlist] = useState([]);
  const [form, setForm] = useState({
    Pincode: "",
    Country: "",
    State: "",
    City: "",
    District: "",
    helperText: "",
    error: false,
    Address1: "",
    Address2: "",
  });

  useEffect(() => {
    const Header = "Create Shipment order";
    dispatch(setHeader(Header));
  }, [id]);

  const handleOpenItemsDialog = () => {
    setOpenDialog(true);
  };

  // handlers
  const [
    createShipment,
    { isLoading: createShipmentLoading, refetch: createShipmentrefetch },
  ] = useCreateShipmentOrderMutation();

  const [
    updateShipment,
    { isLoading: updateShipmentLoading, refetch: updateShipmentrefetch },
  ] = useUpdateCustomerShipmentMutation();

  const { data: shipment, isLoading: isShipmentLoading } =
    useGetCustomerOrderShipmentQuery(orderId, {
      skip: !orderId,
    });

  const {
    data: allProductData,
    isLoading: productLoading,
    isFetching,
    refetchProduct,
  } = useGetPendingRequestQuery();

  const [personType, setPersonType] = useState("Company");
  const [
    addmoreaddress,
    { isLoading: addmoreaddressLoading, refetch: addRefetch },
  ] = useUpdateCustomershippingAddressMutation();

  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteShipmentProductMutation();

  const { data: clientData, refetch: clientrefetch } = useGetAllClientQuery();
  const { data: getAllShipments, refetch: getAllShipmentsRefetch } =
    useGetAllPackagesQuery("InPackaging", { skip: !shouldFetch });

  const handleCloseDialog = () => {
    setOpen(false);
  };
  // setFinalData(shipment?.client?.Items)

  useEffect(() => {
    if (selectedItems?.length > 0) {
      let newData = [];
      // setFinalData((prevFinalData) => {
      //   const newItems = selectedItems.filter(
      //     (item) =>
      //       !prevFinalData.some((existingItem) => existingItem.SKU === item.SKU)
      //   );

      //   return [...prevFinalData, ...newItems];
      // });
      setFinalData(selectedItems);
    }
  }, [selectedItems]);

  // to call the getAllShipment

  const fetchShipments = () => {
    if (!shouldFetch) {
      setShouldFetch(true);
    } else {
      getAllShipmentsRefetch();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddaddress = (event) => {
    setAddaddress(!addAddress);
  };

  const handleEditButton = (SKU) => {
    setFinalData((prev) => {
      return prev.map((item) => {
        if (item.SKU === SKU) {
          return {
            ...item,
            isEdit: true,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    if (clientData?.client && personType === "Company") {
      const companyNames = clientData?.client?.map((customer, index) => {
        return {
          id: customer._id,
          label: customer.CompanyName,
        };
      });
      setCompanyDetails(companyNames);
    } else if (clientData?.client && personType === "Individual") {
      const ClientList = clientData?.client
        ?.map((customer, index) => {
          if (customer.ClientType === "Individual") {
            return {
              id: customer._id,
              label: customer.ContactName,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      setClientlist(ClientList);
    }
  }, [clientData, personType, setPersonType]);

  useEffect(() => {
    {
      if (!orderId) {
        setSelectedAddress({});
        setSelectedCustomer({
          ContactName: "",
          ContactNumber: "",
          AlternateNumber: "",
          Invoice: "",
        });
      }
    }
  }, [personType, setPersonType]);

  useEffect(() => {
    return () => {
      dispatch(removeSelectedSkus());
      dispatch(removedSelectedItems());
    };
  }, [dispatch]);

  const handleToggleAddress = (event) => {
    const checked = event.target.checked;
    if (checked && selectedCustomer?.PermanentAddress) {
      setSelectedAddress(selectedCustomer?.PermanentAddress);
    } else {
      setSelectedAddress({});
    }
  };

  const handleCloseInfo = () => {
    dispatch(setInfo(false));
  };

  const DeleteProduct = async (SKU) => {
    if (orderId) {
      try {
        let info = {
          shipmentId: orderId,
          SKU: SKU,
        };

        const result = await deleteProduct(info).unwrap();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const openPop = Boolean(anchorEl);
  const idPop = openPop ? "simple-popover" : undefined;

  const handleQuantityChange = (event, item) => {
    const { value } = event.target;
    const newValue = +value;
    let error = false;

    setFinalData((prev) =>
      prev.map((data) => {
        if (data.SKU === item.SKU) {
          if (!orderId) {
            if (newValue > item.ActualQuantity || newValue === 0) {
              error = true;
            }
          } else {
            if (item.prevQty) {
              if (
                !(+item.prevQty + +item.ActualQuantity >= newValue) ||
                newValue === 0
              ) {
                error = true;
              }
            } else {
              if (newValue > item.ActualQuantity || newValue === 0) {
                error = true;
              }
            }
          }

          return {
            ...data,
            error: error,
            updateQTY: newValue || "",
            Qty: newValue || item.prevQty,
          };
        }
        return data;
      })
    );
  };

  const removeSelectedItems = (id) => {
    const newSelectedItems = Requireqty.filter((item) => item.SKU !== id);
    const newSelectedRowsData = FinalData.filter((item) => item.SKU !== id);
    const NewUpdatedValue = updateValue.filter((item) => item.SKU !== id);

    DeleteProduct(id);
    // setUpdateValue(NewUpdatedValue);
    setFinalData(newSelectedRowsData);
    dispatch(setSelectedItems(id));
    dispatch(setSelectedSkus(id));
    // setSelectedItems(newSelectedItems);
    // setRequireqty(newSelectedItems)
  };

  const uniqueSKUs = new Set(createQueryItems || [].map((item) => item.SKU));
  const uniqueSKUsArray = Array.from(uniqueSKUs);
  const realData = uniqueSKUsArray?.filter((item) =>
    selectedItems.find((docs) => item.SKU === docs)
  );

  const handleSelectedChange = (event, newValue) => {
    if (newValue && newValue.id) {
      const foundItem = clientData.client.find(
        (item) => item._id === newValue.id
      );
      console.log(foundItem);
      setSelectedCustomer(foundItem);
    } else {
      console.log("ClientId not found in newValue");
    }
  };

  useEffect(() => {
    if (shipment) {
      let data = {
        ClientId: shipment?.client?.ClientId,
        _id: shipment?.client?._id,
        OrderShipmentId: shipment?.client?.OrderShipmentId,
        ClientType:
          shipment?.client?.CompanyName !== "" ? "Company" : "Individual",
        CompanyName: shipment?.client?.CompanyName,
        ContactName: shipment?.client?.ContactPerson,
        PermanentAddress: shipment?.client?.BillingAddress,
        AlternateAddress: shipment?.client?.ShippingAddress,
        ContactNumber: shipment?.client?.Contact,
        AlternateNumber: shipment?.client?.AlternateNumber,
      };
      setSelectedCustomer(data);
      setSelectedAddress(shipment?.client?.ShippingAddress);
      setPersonType(
        shipment?.client?.CompanyName !== "" ? "Company" : "Individual"
      );
    }
  }, [shipment]);

  useEffect(() => {
    if (orderId) {
      const foundItem = clientData.client.find(
        (item) => item.ClientId === shipment?.client?.ClientId
      );

      setSelectedCustomer((prev) => {
        return {
          ...prev,
          AlternateAddress: foundItem.AlternateAddress,
        };
      });
    }
  }, [anchorEl]);

  useEffect(() => {
    if (shipment?.client?.Items) {
      shipment.client.Items.forEach((item) => {
        dispatch(
          setSelectedItems({
            SKU: item.SKU,
            Qty: item.Qty,
            prevQty: item.Qty,
            Name: item.productName,
            updateQTY: "",
            GST: item.GST,
            Brand: item.Brand,
            ActualQuantity: item.ActualQuantity,
            error: false,
            isEdit: false,
          })
        );

        dispatch(setSelectedSkus(item.SKU));
      });

      const itemsData = shipment.client.Items.map((item) => ({
        SKU: item.SKU,
        Qty: item.Qty,
        prevQty: item.Qty,
        Name: item.productName,
        updateQTY: "",
        GST: item.GST,
        Brand: item.Brand,
        ActualQuantity: item.ActualQuantity,
        error: false,
        isEdit: false,
      }));

      setFinalData(itemsData);
    }
  }, [shipment, dispatch]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    handleClose();
  };

  const handleAddmoreAddress = async () => {
    try {
      if (!selectedCustomer?.ClientId) {
        return toast.error("please select a customer");
      }

      const info = {
        ClientId: selectedCustomer?.ClientId,
        City: form.City,
        District: form.District,
        State: form.State,
        Country: form.Country,
        Pincode: form.Pincode,
        AddressLine1: form.Address1,
        AddressLine2: form.Address2,
      };

      const result = await addmoreaddress(info).unwrap();

      toast.success("Parts add successfully");
      setSelectedAddress(info);
      setForm({});
      setAddaddress(false);
      clientrefetch();
      setAnchorEl(null);
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  // handling send query
  const handleSubmit = async () => {
    let isError = false;
    try {
      const info = FinalData.map((item) => {
        if (item.Qty === "") {
          isError = true;
          return toast.error("Please select quantity");
        } else if (item.error && item.error === true) {
          isError = true;
          return toast.error("Invalid quantity");
        }
        if (orderId) {
          return {
            SKU: item.SKU,
            Qty: item.Qty,
            productName: item.Name,
            barcodeGenerator: item.barcodeGenerator,
          };
        } else {
          return {
            SKU: item.SKU,
            Qty: item.Qty,
            productName: item.Name,
            barcodeGenerator: item.barcodeGenerator,
          };
        }
      });

      const isEmpty = Object.keys(selectedAddress)?.length === 0;

      if (!selectedCustomer.ClientId) {
        return toast.error("Please select Company Name");
      } else if (isEmpty) {
        return toast.error("Please select Shipping Address");
      } else if (isError) {
        return;
      }

      const formData = new FormData();
      {
        orderId &&
          formData.append("OrderShipmentId", selectedCustomer.OrderShipmentId);
      }
      formData.append("ClientId", selectedCustomer.ClientId);
      formData.append("ShippingAddress", JSON.stringify(selectedAddress));
      formData.append(
        "BillingAddress",
        JSON.stringify(selectedCustomer?.PermanentAddress)
      );
      formData.append("file", selectedCustomer.Invoice);
      formData.append("ContactPerson", selectedCustomer.ContactName);
      formData.append("Contact", selectedCustomer.ContactNumber);
      formData.append("CompanyName", selectedCustomer.CompanyName);
      formData.append("AlternateNumber", selectedCustomer.AlternateNumber);
      formData.append("Items", JSON.stringify(info));

      if (orderId) {
        console.log("info", info);
        const result = await updateShipment(formData).unwrap();
        toast.success("Order successfully updated");
      } else {
        const result = await createShipment(formData).unwrap();
        toast.success("Order successfully created");
      }
      dispatch(removedSelectedItems());
      dispatch(removeSelectedSkus());
      navigate("/shipmentList");

      window.location.reload();
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  const handleSelectType = (e) => {
    setPersonType(e.target.value);
  };

  const handleChange = (e) => {
    let helperText = "";
    const { name, value, files } = e.target;

    if (name === "address1") {
      setForm((prevForm) => ({
        ...prevForm,
        Address1: value,
      }));
    } else if (name === "address2") {
      setForm((prevForm) => ({
        ...prevForm,
        Address2: value,
      }));
    } else if (name === "ContactPerson") {
      setSelectedCustomer((prevForm) => ({
        ...prevForm,
        ContactName: value,
      }));
    } else if (name === "ContactNumber") {
      setSelectedCustomer((prevForm) => ({
        ...prevForm,
        ContactNumber: value,
      }));
    } else if (name === "AlternateNumber") {
      setSelectedCustomer((prevForm) => ({
        ...prevForm,
        AlternateNumber: value,
      }));
    } else if (name === "invoice") {
      setSelectedCustomer((prevForm) => ({
        ...prevForm,
        Invoice: files[0],
      }));
    } else if (name === "city") {
      setForm((prevForm) => ({
        ...prevForm,
        City: value,
      }));
    } else if (name === "pincode") {
      if (value?.length === 6) {
        const fetchPincodeDetails = async (pincode) => {
          console.log(pincode);
          try {
            const response = await axios.get(
              `https://api.postalpincode.in/pincode/${pincode}`
            );
            if (
              response.status === 200 &&
              response.data &&
              response.data?.length > 0
            ) {
              const data = response.data[0];
              if (data.PostOffice && data.PostOffice.length > 0) {
                const postOffice = data.PostOffice[0];

                setForm((prevForm) => ({
                  ...prevForm,
                  Country: postOffice.Country,
                  State: postOffice.State,
                  District: postOffice.District,
                  Pincode: Number(pincode),
                  error: false,
                  helperText: "",
                }));
              } else {
                setForm((prevForm) => ({
                  ...prevForm,
                  error: true,
                  helperText: "Pincode Details not found",
                }));
              }
            } else {
              console.log("No data received from the API");
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        };

        fetchPincodeDetails(value);
      }
    }
  };

  // for handling r and d shipment request in saperate precess

  const handleOpenRandDial = () => {
    setRandDShipmentDialog(true);
  };

  return (
    <div>
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleCloseInfo}
      />
      <Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
                // justifyContent: "center",

                padding: "5px",
                gap: "10px",
              }}
            >
              <Box>
                <Select
                  sx={{ width: "15rem", color: "red" }}
                  size="small"
                  value={personType}
                  disabled={orderId}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Placeholder</em>;
                    }

                    return selected;
                  }}
                  onChange={handleSelectType}
                >
                  <MenuItem value={"Company"}>Company</MenuItem>
                  <MenuItem value={"Individual"}>Individual</MenuItem>
                </Select>
              </Box>
              {personType === "Company" && (
                <Box>
                  {orderId ? (
                    <TextField
                      size="small"
                      label="Company Name"
                      InputLabelProps={{
                        shrink: !!selectedCustomer?.ContactName,
                      }}
                      variant="outlined"
                      value={selectedCustomer?.CompanyName || ""}
                      name="CompanyName"
                      sx={{
                        width: "26rem",
                      }}
                    />
                  ) : (
                    <Autocomplete
                      style={{
                        width: "26rem",
                        backgroundColor: "rgba(255, 255, 255)",
                      }}
                      options={companyDetails}
                      onChange={handleSelectedChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Company Name"
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                          size="small"
                        />
                      )}
                    />
                  )}
                </Box>
              )}
              {personType === "Company" ? (
                <Box>
                  {/* <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Contact person{" "}
                </Typography> */}
                  <TextField
                    size="small"
                    label="Contact person"
                    InputLabelProps={{
                      shrink: !!selectedCustomer?.ContactName,
                    }}
                    variant="outlined"
                    value={selectedCustomer?.ContactName || ""}
                    name="ContactPerson"
                    sx={{
                      width: "100%",
                    }}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
              ) : (
                <Box>
                  {orderId ? (
                    <TextField
                      size="small"
                      label="Contact person"
                      InputLabelProps={{
                        shrink: !!selectedCustomer?.ContactName,
                      }}
                      variant="outlined"
                      value={selectedCustomer?.ContactName || ""}
                      name="ContactPerson"
                      sx={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    <Autocomplete
                      style={{
                        width: "26rem",
                        backgroundColor: "rgba(255, 255, 255)",
                      }}
                      options={Clientlist}
                      onChange={handleSelectedChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Client Name"
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                          size="small"
                        />
                      )}
                    />
                  )}
                </Box>
              )}
              <Box>
                {/* <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Contact Number{" "}
                </Typography> */}
                <TextField
                  size="small"
                  label="Contact Number"
                  type="number"
                  InputLabelProps={{
                    shrink: !!selectedCustomer?.ContactNumber,
                  }}
                  value={selectedCustomer?.ContactNumber}
                  name="ContactNumber"
                  variant="outlined"
                  sx={{
                    width: "100%",
                  }}
                  onChange={(e) => handleChange(e)}
                />
              </Box>
              <Box>
                {/* <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Alternate Number{" "}
                </Typography> */}
                <TextField
                  size="small"
                  label="Alternate Number"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: !!selectedCustomer?.AlternateNumber,
                  }}
                  value={selectedCustomer?.AlternateNumber}
                  name="AlternateNumber"
                  type="number"
                  sx={{
                    width: "100%",
                  }}
                  onChange={(e) => handleChange(e)}
                />
              </Box>
              <Box>
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Upload Invoice{" "}
                </Typography>
                <input
                  name="invoice"
                  type="file"
                  //   value={Newqty[item.SKU]}

                  onChange={(e) => handleChange(e)}
                />
              </Box>
            </Box>
            {/* Address box */}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Billing Address:{" "}
                </Typography>
                <Box>
                  <FormControlLabel
                    label="Shipping address same as billing address"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: 13,
                        fontWeight: "bold",
                      },
                    }}
                    control={
                      <Checkbox
                        size="small"
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 15 } }}
                        onChange={handleToggleAddress}
                      />
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "16px",
                  }}
                >
                  <Table
                    sx={{
                      width: "30vw",
                      overflow: "auto",
                    }}
                  >
                    <TableBody>
                      {selectedCustomer?.PermanentAddress &&
                        Object.keys(selectedCustomer?.PermanentAddress).map(
                          (key) => {
                            if (key === "SNO" || key === "ClientId") {
                              return null;
                            }
                            return (
                              <TableRow key={key} sx={{ padding: 0 }}>
                                <TableCell
                                  sx={{ padding: 0.5, fontWeight: "bold" }}
                                >
                                  {key?.toUpperCase()}:
                                </TableCell>
                                <TableCell
                                  sx={{ padding: 0, overflow: "auto" }}
                                >
                                  {selectedCustomer?.PermanentAddress[key]}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                    </TableBody>
                  </Table>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "5px",
                      borderRadius: "25px",
                    }}
                  >
                    <Typography
                      variant="span"
                      fontWeight="bold"
                      fontSize={"12px"}
                    >
                      Shipping Address{" "}
                    </Typography>
                    <Box
                      sx={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "20px",
                        "&:hover": {
                          color: "red",
                        },
                      }}
                      onClick={handleClick}
                    >
                      {" "}
                      <i className="fa-solid fa-plus"></i>{" "}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      background: "#eee",
                      padding: "5px",
                      borderRadius: "6px",
                    }}
                  >
                    <Badge
                      badgeContent={allProductData?.data.length}
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        handleOpenRandDial();
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                        R and D Req
                      </span>
                    </Badge>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "16px",
                  }}
                >
                  {selectedAddress ? (
                    <Table
                      sx={{
                        width: "30vw",
                        overflow: "auto",
                      }}
                    >
                      <TableBody>
                        {Object.keys(selectedAddress).map((key) => {
                          if (
                            key === "SNO" ||
                            key === "ClientId" ||
                            key === "_id"
                          ) {
                            return null;
                          }
                          return (
                            <TableRow key={key} sx={{ padding: 0 }}>
                              <TableCell
                                sx={{ padding: 0.5, fontWeight: "bold" }}
                              >
                                {key?.toLocaleUpperCase()}:
                              </TableCell>
                              <TableCell sx={{ padding: 0 }}>
                                {selectedAddress[key]}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>No address selected</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          {selectedCustomer?.ClientId && (
            <Button onClick={handleOpenItemsDialog}>Add items</Button>
          )}
          <TableContainer sx={{ height: "40vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => {
                    if (column.headerName === "Assigned QTY") {
                      if (orderId) {
                        return (
                          <StyledTableCell
                            key={column.field}
                            sx={{ fontSize: ".8rem" }}
                          >
                            {column.headerName}
                          </StyledTableCell>
                        );
                      } else {
                        return <></>;
                      }
                    }
                    return (
                      <StyledTableCell
                        key={column.field}
                        sx={{ fontSize: ".7rem" }}
                      >
                        {column.headerName}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {FinalData?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <StyleTable align="center" sx={{ fontSize: ".8rem" }}>
                        {index + 1}
                      </StyleTable>
                      <StyleTable align="center" sx={{ fontSize: ".8rem" }}>
                        {item.SKU}
                      </StyleTable>
                      <StyleTable
                        align="center"
                        sx={{ fontSize: ".8rem", minWidth: "150px" }}
                      >
                        {item.Name}
                      </StyleTable>
                      <StyleTable align="center" sx={{ fontSize: ".8rem" }}>
                        {item.Brand}
                      </StyleTable>

                      <StyleTable
                        align="center"
                        sx={{ fontSize: ".8rem", minWidth: "80px" }}
                      >
                        {item.GST} %
                      </StyleTable>
                      <StyleTable align="center" sx={{ fontSize: ".8rem" }}>
                        {item.ActualQuantity}
                      </StyleTable>

                      {orderId ? (
                        <>
                          <StyleTable
                            align="center"
                            sx={{ fontSize: ".8rem", minWidth: "80px" }}
                          >
                            {item.prevQty}
                          </StyleTable>
                          {item.isEdit ? (
                            <StyleTable align="center">
                              <TextField
                                autocomplete={false}
                                size="small"
                                sx={{
                                  "& input": {
                                    height: "10px",
                                    maxWidth: "30px",
                                  },
                                }}
                                name="updateQTY"
                                value={item.updateQTY}
                                type="number"
                                onChange={(event) => {
                                  handleQuantityChange(event, item);
                                }}
                                error={item?.error}
                                helperText={
                                  item?.error ? (
                                    <spna style={{ fontSize: "9px" }}>
                                      Enter valid Qty!
                                    </spna>
                                  ) : (
                                    ""
                                  )
                                }
                              />
                            </StyleTable>
                          ) : (
                            <StyleTable align="center">
                              {" "}
                              <EditIcon
                                sx={{
                                  cursor: "pointer",
                                  color: "blue",
                                  fontSize: "20px",
                                  "&:hover": {
                                    color: "red",
                                  },
                                }}
                                onClick={() => handleEditButton(item.SKU)}
                              />{" "}
                            </StyleTable>
                          )}
                        </>
                      ) : (
                        <>
                          <StyleTable align="center">
                            <TextField
                              autocomplete={false}
                              size="small"
                              sx={{
                                "& input": {
                                  height: "10px",
                                  maxWidth: "30px",
                                },
                              }}
                              name="Qty"
                              value={item.Qty}
                              type="number"
                              onChange={(event) => {
                                handleQuantityChange(event, item);
                              }}
                              error={item?.error}
                              helperText={
                                item?.error ? (
                                  <spna style={{ fontSize: "9px" }}>
                                    Enter valid Qty!
                                  </spna>
                                ) : (
                                  ""
                                )
                              }
                            />
                          </StyleTable>{" "}
                        </>
                      )}

                      <StyleTable align="center">
                        <DeleteIcon
                          sx={{
                            "&:hover": {
                              color: "red",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            removeSelectedItems(item.SKU);
                          }}
                        />
                      </StyleTable>
                    </TableRow>
                  );
                })}

                <TableRow></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* another section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: " 2rem",
            marginTop: ".7rem",
            paddingX: "2rem",
            paddingBottom: ".6rem",
          }}
        >
          {FinalData?.length > 0 && (
            <Button
              disabled={createShipmentLoading}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
              sx={{
                width: "150px",
              }}
            >
              {createShipmentLoading || updateShipmentLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : orderId ? (
                "Update Order"
              ) : (
                "Submit Order"
              )}
            </Button>
          )}
        </Box>

        {/* Address popover */}
        {selectedCustomer._id && (
          <Popover
            id={idPop}
            open={openPop}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "left",
              horizontal: "right",
            }}
          >
            <Box>
              {addAddress ? (
                <Box
                  sx={{
                    width: "25vw",
                    height: "auto",
                    padding: "10px",
                  }}
                >
                  <Table>
                    <TableBody>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          ADDRESS-LINE-1
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={form.Address1}
                            name="address1"
                            onChange={(e) => handleChange(e)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          ADDRESS-LINE-2
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={form.Address2}
                            name="address2"
                            onChange={(e) => handleChange(e)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          CITY
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            name="city"
                            value={form.City}
                            onChange={(e) => handleChange(e)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          PINCODE
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            name="pincode"
                            helperText={form.helperText}
                            error={form.error}
                            onChange={(e) => handleChange(e)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          DISTRICT
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={form.District}
                            InputProps={{ readOnly: true }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          STATE
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={form.State}
                            InputProps={{ readOnly: true }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ padding: 0 }}>
                        <TableCell sx={{ padding: 0.5, fontWeight: "bold" }}>
                          COUNTRY
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            value={form.Country}
                            InputProps={{ readOnly: true }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              ) : selectedCustomer?.AlternateAddress?.length > 0 ? (
                selectedCustomer?.AlternateAddress?.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{
                      p: 2,
                      background:
                        selectedAddress._id === item._id
                          ? "lightblue"
                          : "white",
                    }}
                    onClick={() => handleSelectAddress(item)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedAddress._id === item._id}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        width: "400px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                      primary={`${item.AddressLine1}, ${item.AddressLine2}, ${item.City}, ${item.State}, ${item.Country}, ${item.Pincode}`}
                    />
                  </ListItemButton>
                ))
              ) : (
                <Typography
                  sx={{
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  No shipping address
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "5px",
                }}
              >
                {addAddress && <Button onClick={handleAddaddress}>Back</Button>}
                <Button
                  onClick={() =>
                    addAddress ? handleAddmoreAddress() : handleAddaddress()
                  }
                  disabled={addmoreaddressLoading}
                >
                  {addAddress ? (
                    addmoreaddressLoading ? (
                      <CircularProgress size="small" />
                    ) : (
                      "Save"
                    )
                  ) : (
                    "Add more Address"
                  )}
                </Button>
              </Box>
            </Box>
          </Popover>
        )}

        {openDialog && (
          <AddshipmentDial
            open={openDialog}
            data={selectedItems}
            setOpen={setOpenDialog}
            setSelectedData={setSelectedData}
            FinalData={FinalData}
          />
        )}

        {RandDShipmentDialog && (
          <RandDShipmentDial
            open={RandDShipmentDialog}
            setOpen={setRandDShipmentDialog}
            productData={allProductData?.data}
            refetchProduct = {refetchProduct}
          />
        )}
      </Box>
    </div>
  );
};

export default createOrderShipment;
