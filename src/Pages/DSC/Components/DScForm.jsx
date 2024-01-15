import {
  Grid,
  Button,
  Box,
  TextField,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Common/Header";
import Autocomplete from "@mui/material/Autocomplete";
import {
  useGetFormDynamicDataQuery,
  useSaveRepairingFormMutation,
} from "../../../features/api/dscApiSlice";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Loading from "../../../components/Common/Loading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DSCFormTab from "./DSCFormTab";
import { useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";

import InfoDialogBox from "../../../components/Common/InfoDialogBox";

const infoDetail = [
  {
    name: "Submit Button",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/dscSubmit.png?updatedAt=1703231258665"
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
    instruction: `When you click on Submit Button, it will show you the Final Repair Form Details GUI`,
  },

  {
    name: "Final Repair Form Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/final%20repair.png?updatedAt=1703231658883"
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
    instruction: `When we click on create query Discount GUI open and you can save all customize discount detail for future `,
  },

  {
    name: "Shipment Detail Tracking",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/descriptionModule.png?updatedAt=1702965703590"
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
    instruction: `This is a tracking details section where we monitor products using their tracking ID, select the courier name, etc.`,
  },
];

const DScForm = () => {
  const description = `The Entry Form for Repairs Module is for the drone service center. Here, we enter customer details for drone services. After clicking the submit button, the data will be submitted.`;

  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
  /// initialize
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();

  const { isAdmin, userInfo } = useSelector((state) => state.auth);
  /// local state
  const [form, setForm] = useState({
    CustomerName: "",
    CompanyName: "",
    MobileNo: "",
    alternateNumber:"",
    address: "",
    pincode: "",
    city: "",
    state: "",
    district: "",
    date: "",
    droneModel: "",
    hardwareIssues: [],
    softwareIssues: [],
    partsRecieved: [],
    serviceRemark: "",
    costEstimation: "",
    receivedBy: {
      name: "",
      contact: "9289111052",
      date: new Date().toISOString().split("T")[0],
    },
    customerBy: {
      name: "",
      contact: "",
      date: new Date().toISOString().split("T")[0],
    },
  });
  const [hardwareIssue, setHardwareIssue] = useState(null);
  const [softwareIssue, setSoftwareIssue] = useState(null);
  const [part, setPart] = useState(null);
  const [hardwareInput, setHardwareInput] = useState("");
  const [softwareInput, setSoftwareInput] = useState("");
  const [partInput, setPartInput] = useState("");

  const [open, setOpen] = useState(false);
  const [partsQty, setPartsQty] = useState({});

  const [isTabletView, setIsTabletView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTabletView(window.innerWidth <= 805);
    };

    // Check initial size on component mount
    setIsTabletView(window.innerWidth <= 805);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /// RTK query
  const { data, isLoading, refetch, isFetching } = useGetFormDynamicDataQuery();
  const [saveFormApi, { isLoading: saveFormLoading }] =
    useSaveRepairingFormMutation();

  /// useEffect

  /// handlers
  const handleSelectedChange = (event, newValue) => {
    if (!newValue?.ModelName) {
      setHardwareIssue(null);
      setSoftwareIssue(null);
      setForm((prev) => {
        return {
          ...prev,

          softwareIssues: [],
          hardwareIssues: [],
          partsRecieved: [],
        };
      });
      return;
    }
    if (form.droneModel !== newValue.ModelName) {
      setForm((prev) => {
        return {
          ...prev,
          droneModel: newValue?.ModelName,
          softwareIssues: [],
          hardwareIssues: [],
          partsRecieved: [],
        };
      });

      const { Hardware, Software, Parts } = data.data.find(
        (item) => newValue?.ModelName === item.ModelName
      );

      setHardwareIssue(Hardware);
      setPart(Parts);
      setSoftwareIssue(Software);
    }
  };

  const handleChange = (value, name, nested, parent) => {
    if (name === "pincode") {
      if (value.length === 0) {
        setForm((prevForm) => ({
          ...prevForm,
          city: "",
          state: "",
          district: "",
        }));
      } else if (value.length === 6) {
        const fetchPincodeDetails = async (pincode) => {
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
                  city: postOffice.Name,
                  state: postOffice.State,
                  district: postOffice.District,
                }));
              } else {
                console.log("Pincode Details not found");
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

    if (nested) {
      setForm((prev) => {
        return { ...prev, [parent]: { ...prev[parent], [name]: value } };
      });
      return;
    }
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmitForm = async () => {
    try {
      if (!form.CustomerName) {
        toast.error("Customer Name is required");
        setOpen(false);
        return;
      }
      if (!form.droneModel) {
        toast.error("please select droneModel is required");
        setOpen(false);
        return;
      }
      if (!form.MobileNo) {
        toast.error("MobileNo is required");
        setOpen(false);
        return;
      }

      let partsRecievedWithQty = [];

      let error = "";
      if (form.partsRecieved.length) {
        form.partsRecieved.forEach((item) => {
          if (!partsQty[item]) {
            error = `Part Recieved ${item} qty is missing , Please enter Qty`;
          }
          partsRecievedWithQty.push(`${item}-${partsQty[item]}`);
        });
      }

      if (error) {
        toast.error(error);
        setOpen(false);
        return;
      }
      const params = {
        CustomerName: form.CustomerName,
        MobileNo: form.MobileNo,
        CompanyName: form.CompanyName,
        DroneModel: form.droneModel,
        alternateMobile:form.alternateNumber,
        Address: {
          Pincode: form.pincode,
          City: form.city,
          District: form.district,
          State: form.state,
          Address: form.address,
        },
        Date: new Date(),
        Hardware: form.hardwareIssues,
        Software: form.softwareIssues,
        PartsWithProducts: partsRecievedWithQty,
        ReceivedBy: form.receivedBy,
        ReceivedByCustomer: form.customerBy,
        costEstimation: form.costEstimation,
        serviceRemark: form.serviceRemark,
      };

      const res = await saveFormApi(params).unwrap();

      const liveStatusData = {
        message: `${userInfo.name} Created DSC Form With Token Id : ${res?.data?.Token}`,
        time: new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
      socket.emit("liveStatusServer", liveStatusData);

      setForm({
        CustomerName: "",
        CompanyName: "",
        MobileNo: "",
        address: "",
        alternateNumber:"",
        pincode: "",
        city: "",
        state: "",
        district: "",
        date: "",
        droneModel: "",
        hardwareIssues: [],
        softwareIssues: [],
        partsRecieved: [],
        receivedBy: {
          name: "",
          contact: "",
          date: new Date().toISOString().split("T")[0],
        },
        customerBy: {
          name: "",
          contact: "",
          date: new Date().toISOString().split("T")[0],
        },
      });
      setOpen(false);

      Swal.fire({
        icon: "success",
        title: `Token Generated ${res.data.Token}`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        timer: 3700,
        willClose: () => {
          navigate("/FormViewMain");
        },
      });
    } catch (err) {
      console.log(err);
      console.log("erroe At DSC form Submit");
    }
  };

  const handleSearchSort = (value, type) => {
    const regex = new RegExp(value, "i");
    if (type === "hardware") {
      setHardwareInput(value);

      const sortedArray = [...hardwareIssue].sort((a, b) => {
        const aMatch = regex.test(a);
        const bMatch = regex.test(b);

        // Sort by whether the item's name matches the input
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        // If both or neither match, maintain the original order
        return 0;
      });

      // Update the state with the sorted array
      setHardwareIssue(sortedArray);
    }
    if (type === "software") {
      setSoftwareInput(value);

      const sortedArray = [...softwareIssue].sort((a, b) => {
        const aMatch = regex.test(a);
        const bMatch = regex.test(b);

        // Sort by whether the item's name matches the input
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        // If both or neither match, maintain the original order
        return 0;
      });

      // Update the state with the sorted array
      setSoftwareIssue(sortedArray);
    }
    if (type === "part") {
      setPartInput(value);

      const sortedArray = [...part].sort((a, b) => {
        const aMatch = regex.test(a);
        const bMatch = regex.test(b);

        // Sort by whether the item's name matches the input
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        // If both or neither match, maintain the original order
        return 0;
      });

      // Update the state with the sorted array
      setPart(sortedArray);
    }
  };

  return (
    <>
      <Box sx={{ textAlign: "center", padding: "4px", background: "grey" }}>
        <Loading loading={isLoading || saveFormLoading} />
        <Header
          Name={`Entry Form For Repairing`}
          info={true}
          customOnClick={handleOpen}
        />

        {/* Dialog info Box */}
        <InfoDialogBox
          infoDetails={infoDetail}
          description={description}
          open={infoOpen}
          close={handleClose}
        />
      </Box>
      {!isTabletView ? (
        <Box sx={{ minHeight: "84vh", overflowX: "hidden" }}>
          {/* this is main box for customer name */}
          <Box
            // container
            sx={{
              border: "1px solid ",
              borderColor: color,
              margin: "2px",
              padding: "8px",
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              borderStyle: "solid",
              display: "flex-column",
              direction: "column",
            }}
          >
            {/* First Row */}
            <Box
              sx={{
                display: "flex",
                padding: "4px",
                width: "100%",
                gap: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  gap: "4px",
                  alignItems: "center",
                  width: "35%",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Customer Name</h3>
                <input
                  value={form.CustomerName}
                  onChange={(e) => {
                    handleChange(e.target.value, "CustomerName");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 4px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  gap: "4px",
                  alignItems: "center",
                  width: "35%",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Company Name</h3>
                <input
                  value={form.CompanyName}
                  onChange={(e) => {
                    handleChange(e.target.value, "CompanyName");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 8px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  // gap: "4px",
                  alignItems: "center",
                  width: "30%",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Number</h3>
                <input
                  value={form.MobileNo}
                  type="number"
                  onChange={(e) => {
                    handleChange(e.target.value, "MobileNo");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 35px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  // gap: "4px",
                  alignItems: "center",
                  width: "30%",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Alt-Number</h3>
                <input
                  value={form.alternateNumber}
                  type="number"
                  onChange={(e) => {
                    handleChange(e.target.value, "alternateNumber");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 35px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
            </Box>
            {/* Second Row */}
            <Box
              sx={{
                display: "flex",
                padding: "4px",
                width: "100%",
                gap: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "30%",
                  gap: "4px",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                  border: "1px solid #fff",
                }}
              >
                <h3>Pincode</h3>
                <input
                  type="number"
                  value={form.pincode}
                  onChange={(e) => {
                    handleChange(e.target.value, "pincode");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 20px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "30%",
                  gap: "4px",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                  border: "1px solid #fff",
                }}
              >
                <h3>City</h3>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => {
                    handleChange(e.target.value, "city");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 20px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "30%",
                  gap: "4px",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                  border: "1px solid #fff",
                }}
              >
                <h3>State</h3>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => {
                    handleChange(e.target.value, "state");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "65%",
                    height: "120%",
                    margin: "0 0 0 20px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "30%",
                  gap: "4px",
                  boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                  border: "1px solid #fff",
                }}
              >
                <h3>Address</h3>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    handleChange(e.target.value, "address");
                  }}
                  style={{
                    border: "2px solid ",
                    borderColor: color,
                    borderRadius: "7px",
                    width: "70%",
                    height: "120%",
                    margin: "0 0 0 20px",
                    boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    fontSize: "18px",
                  }}
                />
              </div>
            </Box>
          </Box>
          {/* For select model box */}
          <Box
            sx={{
              margin: "10px 2px",
              padding: "8px",
              border: "1px solid #fff",
              borderRadius: "8px",
              background: color,
              boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              borderWidth: "1px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "white",
              }}
            >
              <h3 style={{ margin: "0 0 0 100px" }}>Select</h3>
              <Autocomplete
                style={{
                  width: "50%",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                options={data?.data || []}
                getOptionLabel={(option) => option.ModelName}
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
            </div>
          </Box>
          {/* for hardware and software part  */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: "10px",
              margin: "0 2px 0 2px",
              padding: "4px",
              height: "35vh",
            }}
          >
            {/* hardware part */}
            <Box
              sx={{
                width: "50%",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                borderWidth: "2px",
                border: "2px solid ",
                borderColor: color,
              }}
            >
              <div
                style={{
                  padding: "4px",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  borderWidth: "1px",
                  background: color,
                  color: "white",
                  borderStyle: "solid",
                  display: "flex",
                  // flexDirection: "column",
                  // alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input
                  style={{
                    width: "200px",
                    border: "none",
                    outline: "none",
                    fontSize: "20px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    "::placeholder": { fontSize: "20px", fontWeight: "bolder" },
                  }}
                  value={hardwareInput}
                  placeholder="search"
                  onChange={(e) => {
                    handleSearchSort(e.target.value, "hardware");
                  }}
                />
                <h4 style={{ textAlign: "center" }}>
                  Hardware Damage Part List
                </h4>
              </div>
              {/* items */}
              <Grid
                container
                // xs={12}
                sx={{ height: "30vh", overflowY: "scroll" }}
              >
                {hardwareIssue?.map((item, index) => (
                  <Grid item key={index} xs={4}>
                    <div
                      style={{
                        padding: "2px",
                        paddingLeft: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        lineHeight: "20px",
                      }}
                    >
                      <FormControlLabel
                        label={item}
                        control={
                          <Checkbox
                            checked={form.hardwareIssues.includes(item)}
                            onChange={(event) => {
                              let currentHardwareIssues = [
                                ...form.hardwareIssues,
                              ];

                              if (event.target.checked) {
                                currentHardwareIssues.push(item);
                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    hardwareIssues: currentHardwareIssues,
                                  };
                                });
                              } else {
                                const filterArray =
                                  currentHardwareIssues.filter(
                                    (data) => data !== item
                                  );

                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    hardwareIssues: filterArray,
                                  };
                                });
                              }
                            }}
                          />
                        }
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* software part */}
            <Box
              sx={{
                width: "50%",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                borderWidth: "2px",
                border: "2px solid ",
                borderColor: color,
              }}
            >
              <div
                style={{
                  padding: "4px",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  borderWidth: "1px",
                  background: color,
                  color: "white",
                  borderStyle: "solid",
                  display: "flex",
                  // flexDirection: "column",
                  // alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <input
                  style={{
                    width: "200px",
                    border: "none",
                    outline: "none",
                    fontSize: "20px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    "::placeholder": { fontSize: "20px", fontWeight: "bolder" },
                  }}
                  value={softwareInput}
                  placeholder="search"
                  onChange={(e) => {
                    handleSearchSort(e.target.value, "software");
                  }}
                />
                <h4 style={{ textAlign: "center" }}>
                  Software Warning & Error
                </h4>
              </div>

              <Grid container sx={{ height: "30vh", overflowY: "scroll" }}>
                {softwareIssue?.map((item, index) => (
                  <Grid item key={index} xs={4}>
                    <div
                      style={{
                        padding: "2px",
                        paddingLeft: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        lineHeight: "20px",
                      }}
                    >
                      <FormControlLabel
                        label={item}
                        control={
                          <Checkbox
                            checked={form.softwareIssues.includes(item)}
                            onChange={(event) => {
                              let currentSoftwareIssues = [
                                ...form.softwareIssues,
                              ];

                              if (event.target.checked) {
                                currentSoftwareIssues.push(item);
                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    softwareIssues: currentSoftwareIssues,
                                  };
                                });
                              } else {
                                const filterArray =
                                  currentSoftwareIssues.filter(
                                    (data) => data !== item
                                  );

                                setForm((prev) => {
                                  return {
                                    ...prev,
                                    softwareIssues: filterArray,
                                  };
                                });
                              }
                            }}
                          />
                        }
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          {/* with the drone for reparing */}
          <Box
            sx={{
              margin: "10px 4px",

              justifyContent: "space-between",
              height: "20vh",
              borderRadius: "7px",
              boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              borderWidth: "2px",
              border: "2px solid ",
              borderColor: color,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px",
                borderRadius: "8px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                borderWidth: "1px",
                background: color,
                color: "white",
                borderStyle: "solid",
              }}
            >
              <input
                style={{
                  width: "200px",
                  border: "none",
                  outline: "none",
                  fontSize: "20px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "::placeholder": { fontSize: "20px", fontWeight: "bolder" },
                }}
                value={partInput}
                placeholder="search"
                onChange={(e) => {
                  handleSearchSort(e.target.value, "part");
                }}
              />
              <h4
                style={{
                  textAlign: "center",
                  display: "inline-block",
                  marginRight: "150px",
                }}
              >
                Parts Received With Products
              </h4>
              <div></div>
            </div>
            {/* items */}
            <Grid container sx={{ height: "15vh", overflowY: "scroll" }}>
              {part?.map((item, index) => (
                <Grid item key={index} xs={2}>
                  <div
                    style={{
                      padding: "2px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      lineHeight: "50px",
                    }}
                  >
                    <FormControlLabel
                      label={item}
                      control={
                        <Checkbox
                          checked={form.partsRecieved.includes(item)}
                          onChange={(event) => {
                            let currentPartRecieved = [...form.partsRecieved];

                            if (event.target.checked) {
                              currentPartRecieved.push(item);
                              setForm((prev) => {
                                return {
                                  ...prev,
                                  partsRecieved: currentPartRecieved,
                                };
                              });
                            } else {
                              const filterArray = currentPartRecieved.filter(
                                (data) => data !== item
                              );

                              setForm((prev) => {
                                return {
                                  ...prev,
                                  partsRecieved: filterArray,
                                };
                              });
                            }
                          }}
                        />
                      }
                    />
                    {form.partsRecieved.includes(item) ? (
                      <TextField
                        sx={{
                          width: "65px",
                        }}
                        placeholder="Qty"
                        value={partsQty[item] || ""}
                        onChange={(e) => {
                          setPartsQty((prev) => {
                            return { ...prev, [item]: e.target.value };
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                setOpen(true);
              }}
              variant="outlined"
              sx={{
                color: "white",
                background: color,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      ) : (
        <DSCFormTab
          softwareIssue={softwareIssue}
          hardwareIssue={hardwareIssue}
          setOpen={setOpen}
          form={form}
          setForm={setForm}
          setPart={setPart}
          part={part}
          data={data}
          handelSelectedChange={handleSelectedChange}
          handleChange={handleChange}
          setHardwareIssue={setHardwareIssue}
          setSoftwareIssue={setSoftwareIssue}
          partsQty={partsQty}
          setPartsQty={setPartsQty}
        />
        // <CustomerForm
        //   softwareIssue={softwareIssue}
        //   hardwareIssue={hardwareIssue}
        //   setOpen={setOpen}ia
        //   form={form}
        //   setForm={setForm}
        //   setPart={setPart}
        //   part={part}
        //   data={data}
        //   handelSelectedChange={handleSelectedChange}
        //   handleChange={handleChange}
        //   setHardwareIssue={setHardwareIssue}
        //   setSoftwareIssue={setSoftwareIssue}
        // />
      )}
      <Dialog
        open={open}
        width="xl"
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            backgroundColor: "#040678",
            color: "#fff",
          }}
        >
          Final Repair Form Details
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "5px",
            }}
          >
            <Box display={"flex"} flexDirection={"column"}>
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                Recieved By
              </Typography>
              <TextField
                placeholder="Name"
                value={form.receivedBy.name}
                onChange={(e) => {
                  handleChange(e.target.value, "name", true, "receivedBy");
                }}
              />
              <TextField
                placeholder="Contact"
                value={form.receivedBy.contact}
                type="number"
                onChange={(e) => {
                  handleChange(e.target.value, "contact", true, "receivedBy");
                }}
              />
              <TextField
                placeholder="Date"
                type="date"
                value={form.receivedBy.date}
                onChange={(e) => {
                  handleChange(e.target.value, "date", true, "receivedBy");
                }}
              />
            </Box>

            {/* <Box>
              <Typography sx={{ fontWeight: "bold" }}>Customer By</Typography>
              <TextField
                placeholder="Name"
                value={form.customerBy.name}
                onChange={(e) => {
                  handleChange(e.target.value, "name", true, "customerBy");
                }}
              />
              <TextField
                placeholder="Contact"
                type="number"
                value={form.customerBy.contact}
                onChange={(e) => {
                  handleChange(e.target.value, "contact", true, "customerBy");
                }}
              />
              <TextField
                placeholder="Date"
                type="date"
                value={form.customerBy.date}
                onChange={(e) => {
                  handleChange(e.target.value, "date", true, "customerBy");
                }}
              />
            </Box> */}
          </Box>
          <Box
            sx={{
              marginBottom: "5px",
              minWidth: "400px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Service Remark
            </Typography>
            <TextField
              sx={{
                width: "100%",
              }}
              value={form.serviceRemark}
              onChange={(e) => {
                handleChange(e.target.value, "serviceRemark");
              }}
              type="description"
              placeholder="Enter Remark"
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Cost Estimation
            </Typography>
            <TextField
              sx={{
                width: "50%",
              }}
              value={form.costEstimation}
              onChange={(e) => {
                handleChange(e.target.value, "costEstimation");
              }}
              type="number"
              placeholder="Enter Cost Estimation"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmitForm}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DScForm;
