import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
  styled,
  InputAdornment,
  Autocomplete,
  Popover,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import { setAddparts } from "../../../features/slice/R&DSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const columns = [
  { field: "Sno", headerName: "S.No" },
  { field: "SKU", headerName: "SKU" },
  { field: "Name", headerName: "Name" },
  { field: "Brand", headerName: "Brand" },
  { field: "GST", headerName: "GST (%)" },
  { field: "InStock", headerName: "In Store" },
  { field: "Require QTY", headerName: "Require QTY" },
  { field: "Delete", headerName: "Remove" },
];
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useCreateRandDInventryMutation } from "../../../features/api/barcodeApiSlice";

import { useGetAllClientQuery } from "../../../features/api/clientAndShipmentApiSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#eee",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));

const StyleTable = styled(TableCell)(({ theme }) => ({
  fontSize: ".777rem",
  padding: "5px !important",
  textAlign: "center",
}));

import { InfoRounded, TabOutlined } from "@mui/icons-material";
const StyledCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "	 #0d0d0d" : "#80bfff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
  textAlign: "center",
}));
import {
  useUpdateCustomershippingAddressMutation,
  useCreateShipmentOrderMutation,
} from "../../../features/api/clientAndShipmentApiSlice";
import { useNavigate } from "react-router-dom";

const AddshipmentDial = ({
  data,
  removeSelectedItems,
  open,
  setOpen,
  handleOpenDialog,
  removeSelectedCreateQuery,
  removeSelectedSkuQuery,
  setSelectedItemsData,
  selectedItemsData,
  id,
  name,
  refetch,
}) => {
  /// initialize


  const socket = useSocket();
  const navigate = useNavigate();

  /// global state
  const { userInfo } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  /// local state

  const [Requireqty, setRequireqty] = useState([]);
  const [qty, setQty] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedAddress, setSelectedAddress] = useState({});
  const [addAddress, setAddaddress] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);

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

  const dispatch = useDispatch();
  // handlers
  const [
    createShipment,
    { isLoading: createShipmentLoading, refetch: createShipmentrefetch },
  ] = useCreateShipmentOrderMutation();

  const [
    addmoreaddress,
    { isLoading: addmoreaddressLoading, refetch: addRefetch },
  ] = useUpdateCustomershippingAddressMutation();

  const { data: clientData, refetch: clientrefetch } = useGetAllClientQuery();

  const handleCloseDialog = () => {
    setOpen(false);
  };
  useEffect(() => {
    let newData = [];
    newData = data.map((data) => {
      return {
        SKU: data.SKU,
        productName: data.Name,
      };
    });
    setRequireqty(newData);
  }, [setOpen, open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddaddress = (event) => {
    setAddaddress(!addAddress);
  };

  useEffect(() => {
    if (clientData?.client) {
      const companyNames = clientData?.client?.map((customer, index) => {
        return {
          id: customer._id,
          label: customer.CompanyName,
        };
      });
      setCompanyDetails(companyNames);
    }
  }, [clientData]);

  const handleToggleAddress = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedAddress(permanent);
    } else {
      setSelectedAddress({});
    }
  };

  const openPop = Boolean(anchorEl);
  const idPop = openPop ? "simple-popover" : undefined;

  const handleQuantityChange = (event, item) => {
    const { value, name } = event.target;
    let error = false;

    setQty({ ...qty, [item.SKU]: value });
    setRequireqty((prev) => {
      return prev.map((data) => {
        if (data.SKU === item.SKU) {
          if (value > item.Quantity) {
            error = true;
          }

          return {
            ...data,
            Qty: value,
            error: error,
          };
        }
        return data;
      });
    });
  };

  const handleSelectedChange = (event, newValue) => {
    console.log(newValue);
    if (newValue && newValue.id) {
      const foundItem = clientData.client.find(
        (item) => item._id === newValue.id
      );
      setSelectedCustomer(foundItem);
    } else {
      console.log("ClientId not found in newValue");
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    handleClose();
  };

  useEffect(() => {
    return () => {
      removeSelectedItems([]);

  
      setRequireqty([]);
    };
  }, [setOpen]);

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
        addressLine1: form.Address1,
        addressLine2: form.Address2,
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
    try {
      if (!selectedCustomer.ClientId) {
        return toast.error("Please select Company Name");
      }
      const formData = new FormData();
      formData.append("ClientId", selectedCustomer.ClientId);
      formData.append("ShippingAddress", JSON.stringify(selectedAddress));
      formData.append(
        "BillingAddress",
        JSON.stringify(selectedCustomer?.PermanentAddress)
      );
      formData.append("file", selectedCustomer.Invoice);
      formData.append("ContactPerson", selectedCustomer.ContactName);
      formData.append("Contact", selectedCustomer.ContactNumber);
      formData.append("Items", JSON.stringify(Requireqty));
      const result = await createShipment(formData).unwrap();

      toast.success("Parts add successfully");

      handleCloseDialog();
      // navigate("/Project");
    } catch (e) {
      console.log("error at Discount Query create ", e);
    }
  };

  const handleChange = (e) => {
    let helperText = "";
    const { name, value, files } = e.target;
    if (name === "address1") {
      console.log(value);
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
      if (value.length === 6) {
        const fetchPincodeDetails = async (pincode) => {
          console.log(pincode);
          try {
            const response = await axios.get(
              `https://api.postalpincode.in/pincode/${pincode}`
            );
            if (
              response.status === 200 &&
              response.data &&
              response.data.length > 0
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



  return (
    <div>
      <Dialog open={open} maxWidth="xl" onClose={handleCloseDialog}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              paddingTop: ".5rem",
              paddingX: ".7rem",
            }}
          >
            <Typography
              sx={{
                flex: "1",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.3rem",
              }}
            >
              ADD PARTS
            </Typography>
            <CancelIcon
              sx={{ cursor: "pointer", "&:hover": { color: "red" } }}
              onClick={(event) => {
                setOpen(false);
              }}
            />
          </Box>
        </Box>

        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Company Name{" "}
                </Typography>
                <Autocomplete
                  style={{
                    width: "80%",
                    backgroundColor: "rgba(255, 255, 255)",
                  }}
                  options={companyDetails}
                   onChange={handleSelectedChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select"
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Contact person{" "}
                </Typography>
                <TextField
                  size="small"
                  value={selectedCustomer?.ContactName}
                  name="ContactPerson"
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid
                item
                xs={2.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Contact Number{" "}
                </Typography>
                <TextField
                  size="small"
                  value={selectedCustomer?.ContactNumber}
                  name="ContactNumber"
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid
                item
                xs={2.5}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="span" fontWeight="bold" fontSize={"12px"}>
                  Upload Invoice{" "}
                </Typography>
                <input
                  name="invoice"
                  type="file"
                  //   value={Newqty[item.SKU]}

                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Box>
                  <Typography
                    variant="span"
                    fontWeight="bold"
                    fontSize={"12px"}
                  >
                    Billing Address:{" "}
                  </Typography>
                  <Box>
                    <FormControlLabel
                      label="Shipping address same as billing address"
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: 12 } }}
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
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "16px",
                      marginTop: "16px",
                    }}
                  >
                    <Table>
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
                                  <TableCell sx={{ padding: 0 }}>
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
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
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
                      borderRadius: "25px",
                      padding: "5px",
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
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "16px",
                    }}
                  >
                    {selectedAddress ? (
                      <Table>
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
              </Grid>
            </Grid>
          </Box>
          <TableContainer sx={{ maxHeight: "41vh", marginTop: "0.3rem" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledCell sx={{ fontSize: ".7rem" }} key={column.field}>
                      {column.headerName}
                    </StyledCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {index + 1}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.SKU}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "150px" }}>
                        {item.Name}
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Brand}
                      </StyleTable>

                      <StyleTable sx={{ fontSize: ".8rem", minWidth: "80px" }}>
                        {item.GST} %
                      </StyleTable>
                      <StyleTable sx={{ fontSize: ".8rem" }}>
                        {item.Quantity}
                      </StyleTable>

                      <StyleTable>
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
                          value={qty[item.SKU]}
                          type="number"
                          onChange={(event) => {
                            handleQuantityChange(event, item);
                          }}
                          error={Requireqty[index]?.error}
                          helperText={
                            Requireqty[index]?.error ? (
                              <spna style={{ fontSize: "9px" }}>
                                Enter valid Qty!
                              </spna>
                            ) : (
                              ""
                            )
                          }
                        />
                      </StyleTable>

                      <StyleTable>
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
        </DialogContent>
        <StyledBox>
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
            {" "}
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
              {createShipmentLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Parts"
              )}
            </Button>
          </Box>
        </StyledBox>
        {/* Address popover */}
        {selectedCustomer._id && (
          <Popover
            id={idPop}
            open={openPop}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Box>
              {addAddress ? (
                <Box
                  sx={{
                    width: "100%",
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
                            value={form.Country}
                            InputProps={{ readOnly: true }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                selectedCustomer?.AlternateAddress &&
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
                      primary={`${item.addressLine1}, ${item.addressLine2}, ${item.city}, ${item.state}, ${item.country}, ${item.pincode}`}
                    />
                  </ListItemButton>
                ))
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
      </Dialog>
    </div>
  );
};

export default AddshipmentDial;
