import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  colors,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetSingleRepairingFormQuery,
  useUpdateRepairFormMutation,
  useGetFormDynamicDataQuery,
} from "../../../features/api/dscApiSlice";
// import Dateformat from "../../../components/Common/Dateformat";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { useSelector } from "react-redux";
import Loading from "../../../components/Common/Loading";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";


const ViewForm = () => {
  /// initialization
  const token = useParams().token;

  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// local state
  const [editMode, setEditMode] = useState(false);
  const [datas, setDatas] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [currentIssues, setCurrentIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openIssues, setOpenIssues] = useState(false);
  const [type, setType] = useState("");
  const [partRecievedCount, setPartRecievedCount] = useState({});
  const [droneModel,setDroneModel] = useState("")

  /// RTK query
  const {
    data: singleRepairFormData,
    isLoading,
    refetch,
    isFetching,
  } = useGetSingleRepairingFormQuery(token);

  const [updateFormApi, { isLoading: updateLoading }] =
    useUpdateRepairFormMutation();

  const { data } = useGetFormDynamicDataQuery();

  /// handlers
  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const handleUpdateForm = async () => {
    try {
      const processedReceivedWithProducts = datas.ReceivedWithProducts.map(
        (item) => {
          return `${item}-${
            partRecievedCount[item] ? partRecievedCount[item] : "1"
          }`;
        }
      );

      const processedData = {
        CustomerName: datas.CustomerName,
        MobileNo: datas.MobileNo,
        AlternateMobile: datas.AlternateMobile,
        DroneModel:datas.DroneModel,
        CompanyName: datas.CompanyName,
        ServiceRemark: datas.ServiceRemark,
        Address: datas.Address,
        ReceivedBy: datas.ReceivedBy,
        Hardware: datas.Hardware,
        Software: datas.Software,
        ReceivedWithProducts: processedReceivedWithProducts,
      };
      const params = {
        token: token,
        data: processedData,
      };

      const res = await updateFormApi(params).unwrap();
      toast.success("Successfully updated Form");
      setOpenIssues(false);
      refetch();
    } catch (e) {
      console.log("error at update Repair Form");
      console.log(e);
    }
  };
  const handleSearch = (value) => {
    const regex = new RegExp(value, "i");

    const sortedArray = [...selectedIssues].sort((a, b) => {
      const aMatch = regex.test(a);
      const bMatch = regex.test(b);

      // Sort by whether the item's name matches the input
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;

      // If both or neither match, maintain the original order
      return 0;
    });

    setSelectedIssues(sortedArray);
    setSearchTerm(value);
  };

  const handleOpenEditIssues = (type) => {
    if (type === "hardware") {
      setType("Hardware Damage List");
      setSelectedIssues(datas?.droneModelData?.Hardware);
      setCurrentIssues(datas?.Hardware);
      setOpenIssues(true);
    }
    if (type === "software") {
      setType("Software List");
      setSelectedIssues(datas?.droneModelData?.Software);
      setCurrentIssues(datas?.Software);
      setOpenIssues(true);
    }
    if (type === "parts") {
      setType("Parts Recived List");
      setSelectedIssues(datas?.droneModelData?.Parts);
      setCurrentIssues(datas?.ReceivedWithProducts.map((item) => item));

      setOpenIssues(true);
    }
  };

  const handleClose = () => {
    setSelectedIssues([]);
    setCurrentIssues([]);
    setOpenIssues(false);
  };

  const handleCheckboxChange = (event, value) => {
    const { checked } = event.target;

    if (type === "Hardware Damage List") {
      if (checked) {
        const currentHardware = [...datas.Hardware];
        currentHardware.push(value);

        setCurrentIssues(currentHardware);
        setDatas({ ...datas, Hardware: currentHardware });
      } else {
        const currentHardware = datas.Hardware.filter((item) => item !== value);
        setCurrentIssues(currentHardware);
        setDatas({ ...datas, Hardware: currentHardware });
      }
    }
    if (type === "Software List") {
      if (checked) {
        const currentSoftware = [...datas.Software];
        currentSoftware.push(value);

        setCurrentIssues(currentSoftware);
        setDatas({ ...datas, Software: currentSoftware });
      } else {
        const currentSoftware = datas.Software.filter((item) => item !== value);
        setCurrentIssues(currentSoftware);
        setDatas({ ...datas, Software: currentSoftware });
      }
    }

    if (type === "Parts Recived List") {
      if (checked) {
        const currentParts = [...datas.ReceivedWithProducts];

        currentParts.push(value);

        setCurrentIssues(currentParts);
        setDatas({ ...datas, ReceivedWithProducts: currentParts });
      } else {
        const currentParts = datas.ReceivedWithProducts.filter(
          (item) => item.slice(0, -2) !== value
        );
        setCurrentIssues(currentParts);
        setDatas({ ...datas, ReceivedWithProducts: currentParts });
      }
    }
  };
  const handleSelectedChange = (event, newValue) => {
    if(newValue){
      setDatas({...datas,DroneModel:newValue.ModelName})
    }
  };
  /// use Effect
  useEffect(() => {
    if (singleRepairFormData?.status) {
      const newPartRecievedCount = {};
      const processedReceivedWithProducts = setDatas({
        ...singleRepairFormData.data,
        ReceivedWithProducts:
          singleRepairFormData.data?.ReceivedWithProducts?.map((item) => {
            newPartRecievedCount[item.split("-")[0]] = item.split("-")[1];
            return item.split("-")[0];
          }),
      });

      setPartRecievedCount(newPartRecievedCount);
    }
  }, [singleRepairFormData]);

  return (
    <>
      <Box
        sx={{
          mt: "65px",
          padding: "6px",
          textAlign: "center",
          boxShadow: 3,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Loading loading={isLoading || isFetching || updateLoading} />
        <h3>Final Repairing Form Submission</h3>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            background: color,
            "&:hover": {
              color: "black",
            },
          }}
          onClick={toggleEditMode}
        >
          {editMode ? "Edit On" : "Edit Off"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleUpdateForm}
          disabled={!editMode}
          sx={{
            color: "white",
            background: color,
            "&:hover": {
              color: "black",
            },
          }}
        >
          {" "}
          Save
        </Button>
      </Box>
      {/* MAIN BOX */}
      <Box
        sx={{
          // border: "1px solid black",
          width: "99%",
          height: "85vh",
          margin: "6px 3px",
        }}
      >
        <Box
          sx={{
            // height: "65vh",
            width: "100%",
            // border: "1px solid green",
            display: "flex",
          }}
        >
          <Box sx={{ width: "35%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "15px",
                height: "",
              }}
            >
              <div
                style={{
                  background: color,
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40%",
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  boxShadow: " -4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <input
                  style={{
                    width: "100%",
                    height: "30px",
                    background: "white",
                    borderRadius: "5px",
                    border: "1px solid",
                    boxShadow: " -4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                    outline: "none",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  placeholder="Token Id"
                  className="custom-input"
                  value={datas?.Token || ""}
                  disabled
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  background: color,
                  padding: "10px",
                  color: "white",
                  width: "60%",
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  boxShadow: " -4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: "bolder", alignItems: "center" }}>
                    Drone
                  </div>
                  <div style={{ fontWeight: "bolder", alignItems: "center" }}>
                    Model No.
                  </div>
                </div>
                {!editMode ? (
                  <div style={{ flexGrow: 1 }}>
                    <input
                      style={{
                        padding: "10px",
                        width: "100%",
                        borderRadius: "5px",
                        border: "1px solid",
                        boxShadow: " -4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                        outline: "none",
                        background: "white",
                        fontSize: "17px",
                        fontWeight: "bold",
                      }}
                      placeholder="Drone Model No."
                      className="custom-input"
                      value={datas?.DroneModel || ""}
                      disabled={!editMode}
                    ></input>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    {/* <h3 style={{ margin: "0 0 0 100px" }}>Select</h3> */}
                    <Autocomplete
                      style={{
                        width: "100%",
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
                
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: "30px",
                padding: "8px 10px",
                border: "2px solid",
                borderColor: color,
                borderRadius: "8px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: color,
                  marginBottom: "10px",
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Customer Name</h3>
                <input
                  style={{
                    width: "65%",
                    padding: "4px",
                    background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                    border: "1px solid white",
                    borderRadius: "7px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  className="custom-input"
                  disabled={!editMode}
                  value={datas?.CustomerName || ""}
                  onChange={(e) =>
                    setDatas({ ...datas, CustomerName: e.target.value })
                  }
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: color,
                  marginBottom: "10px",
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Company Name</h3>
                <input
                  style={{
                    width: "65%",
                    padding: "4px",
                    background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                    border: "1px solid white",
                    borderRadius: "7px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  className="custom-input"
                  disabled={!editMode}
                  onChange={(e) =>
                    setDatas({ ...datas, CompanyName: e.target.value })
                  }
                  value={datas?.CompanyName || ""}
                ></input>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: color,
                  marginBottom: "10px",
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Number</h3>
                <input
                  style={{
                    width: "65%",
                    padding: "4px",
                    background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                    border: "1px solid white",
                    borderRadius: "7px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  className="custom-input"
                  disabled={!editMode}
                  onChange={(e) =>
                    setDatas({ ...datas, MobileNo: e.target.value })
                  }
                  value={datas?.MobileNo || ""}
                ></input>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: color,
                  marginBottom: "10px",
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>Alt-Number</h3>
                <input
                  style={{
                    width: "65%",
                    padding: "4px",
                    background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                    border: "1px solid white",
                    borderRadius: "7px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  className="custom-input"
                  disabled={!editMode}
                  onChange={(e) =>
                    setDatas({ ...datas, AlternateMobile: e.target.value })
                  }
                  value={datas?.AlternateMobile || ""}
                ></input>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: color,
                  marginBottom: "10px",
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                }}
              >
                <h3>dd-mm-yy</h3>
                <input
                  style={{
                    width: "65%",
                    padding: "4px",
                    background: "#E8F0FF",
                    border: "1px solid white",
                    borderRadius: "7px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                  disabled
                  value={formatDate(datas?.Date)}
                />
              </div>

              <div
                style={{
                  padding: "8px 10px",
                  background: color,
                  color: "white",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  marginTop: "30px",
                  // height:"30vh"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Address</h3>
                  <input
                    style={{
                      width: "65%",
                      height: "40px",
                      padding: "4px",
                      background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                      border: "1px solid white",
                      borderRadius: "7px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    className="custom-input"
                    disabled={!editMode} // Enable input when editMode is true
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        Address: { ...datas.Address, Address: e.target.value },
                      })
                    }
                    value={datas?.Address?.Address || ""}
                  ></input>{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Pincode</h3>
                  <input
                    style={{
                      width: "65%",
                      padding: "4px",
                      background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                      border: "1px solid white",
                      borderRadius: "7px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    className="custom-input"
                    disabled={!editMode} // Enable input when editMode is true
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        Address: { ...datas.Address, Pincode: e.target.value },
                      })
                    }
                    value={datas?.Address?.Pincode || ""}
                  ></input>{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>City</h3>
                  <input
                    style={{
                      width: "65%",
                      padding: "4px",
                      background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                      border: "1px solid white",
                      borderRadius: "7px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    className="custom-input"
                    disabled={!editMode} // Enable input when editMode is true
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        Address: { ...datas.Address, City: e.target.value },
                      })
                    }
                    value={datas?.Address?.City || ""}
                  ></input>{" "}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>State</h3>
                  <input
                    style={{
                      width: "65%",
                      padding: "4px",
                      background: editMode ? "#fff" : "#E8F0FF", // Change background color in edit mode
                      border: "1px solid white",
                      borderRadius: "7px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    className="custom-input"
                    disabled={!editMode} // Enable input when editMode is true
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        Address: { ...datas.Address, State: e.target.value },
                      })
                    }
                    value={datas?.Address?.State || ""}
                  ></input>{" "}
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Country</h3>
                  <input
                    style={{
                      width: "65%",
                      padding: "4px",
                      background: "#fff",
                      border: "1px solid white",
                      borderRadius: "7px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                    }}
                    disabled
                    value={datas?.Address?.Country}
                  ></input>{" "}
                </div> */}
              </div>
            </div>
          </Box>
          <Box sx={{ width: "65%", marginLeft: "12px" }}>
            <Box
              sx={{
                height: "30%",
                border: "2px solid",
                borderColor: color,
                borderRadius: "8px",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                background: "#E8F0FF",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "4px",
                  background: color,
                  color: "white",
                  border: "1px solid",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <h3>Hardware Damage Part List</h3>
                {editMode ? (
                  <button
                    onClick={() => {
                      handleOpenEditIssues("hardware");
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div
                style={{
                  // background: "#E8F0FF",
                  overflowY: "scroll",
                  height: "70%",
                }}
              >
                <Grid container>
                  {datas?.Hardware?.map((item, index) => (
                    <Grid item key={index} xs={4}>
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          lineHeight: "40px",
                          padding: "4px",
                          gap: "10px",
                          justifyItems: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bolder",
                            marginTop: "-7px",
                          }}
                        >
                          .
                        </span>
                        <h3>{item}</h3>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Box>
            <Box
              sx={{
                height: "30%",
                border: "2px solid",
                borderColor: color,
                borderRadius: "8px",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                background: "#E8F0FF",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "4px",
                  background: color,
                  color: "white",
                  border: "1px solid",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <h3>Software Warning And Errors</h3>
                {editMode ? (
                  <button
                    onClick={() => {
                      handleOpenEditIssues("software");
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div
                style={{
                  // background: "#E8F0FF",
                  overflowY: "scroll",
                  height: "70%",
                }}
              >
                <Grid container>
                  {datas?.Software?.map((item, index) => (
                    <Grid item key={index} xs={4}>
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          lineHeight: "40px",
                          padding: "4px",
                          gap: "10px",
                          justifyItems: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bolder",
                            marginTop: "-7px",
                          }}
                        >
                          .
                        </span>
                        <h3 style={{}}>{item}</h3>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Box>
            <Box
              sx={{
                height: "30%",
                border: "2px solid",
                borderColor: color,
                borderRadius: "8px",
                boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                background: "#E8F0FF",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "4px",
                  background: color,
                  color: "white",
                  border: "1px solid",
                  borderRadius: "8px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <h3>Parts Received With Products</h3>
                {editMode ? (
                  <button
                    onClick={() => {
                      handleOpenEditIssues("parts");
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div
                style={{
                  // background: "#E8F0FF",
                  overflowY: "scroll",
                  height: "70%",
                }}
              >
                <Grid container>
                  {datas?.ReceivedWithProducts?.map((item, index) => (
                    <Grid item key={index} xs={4}>
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          lineHeight: "40px",
                          padding: "4px",
                          gap: "10px",
                          justifyItems: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bolder",
                            marginTop: "-7px",
                          }}
                        >
                          .
                        </span>
                        <h3 style={{ whiteSpace: "nowrap" }}>
                          {item} - {partRecievedCount[item]}
                        </h3>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: "19vh" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
              border: "2px solid",
              borderColor: color,
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
              marginTop: "10px",
            }}
          >
            <div style={{ width: "45%", display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  background: color,
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                  height: "100%",
                  width: "25%",
                }}
              >
                <h3
                  style={{
                    background: "white",
                    padding: "25px",
                    border: "1px",
                    borderRadius: "5px",
                    boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                  }}
                >
                  Received By
                </h3>
              </div>
              <div
                style={{
                  padding: "10px",
                  background: color,
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                  height: "100%",
                  width: "73%",
                  marginLeft: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ color: "white" }}>Name</h3>
                  <input
                    style={{
                      width: "80%",
                      padding: "2px",
                      border: "1px solid",
                      borderRadius: "8px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      background: editMode ? "#fff" : "#E8F0FF",
                      fontSize: "17px",
                      fontWeight: "bolder",
                      textAlign: "center",
                    }}
                    className="custom-input"
                    disabled={!editMode}
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        ReceivedBy: {
                          ...datas.ReceivedBy,
                          name: e.target.value,
                        },
                      })
                    }
                    value={datas?.ReceivedBy?.name || ""}
                  ></input>
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ color: "white" }}>Number</h3>
                  <input
                    style={{
                      width: "80%",
                      padding: "2px",
                      border: "1px solid",
                      borderRadius: "8px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      background: editMode ? "#fff" : "#E8F0FF",
                      fontSize: "17px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    className="custom-input"
                    disabled={!editMode}
                    onChange={(e) =>
                      setDatas({
                        ...datas,
                        ReceivedBy: {
                          ...datas.ReceivedBy,
                          contact: e.target.value,
                        },
                      })
                    }
                    value={datas?.ReceivedBy?.contact || ""}
                  ></input>
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ color: "white" }}>Date</h3>
                  <input
                    style={{
                      width: "80%",
                      padding: "2px",
                      border: "1px solid",
                      borderRadius: "8px",
                      boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                      textAlign: "center",
                      background: "#E8F0FF",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    disabled
                    value={formatDate(datas?.ReceivedBy?.date)}
                  ></input>
                </div>
              </div>
            </div>
            {/* second container */}
            <div style={{ width: "45%", display: "flex" }}>
              <div
                style={{
                  padding: "10px",
                  background: color,
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  boxShadow: "-4px 4px 4px -1px rgba(0, 0, 0, 0.48)",
                  height: "100%",
                  width: "73%",
                  marginLeft: "16px",
                }}
              >
                <center>
                  <h1 style={{ color: "white" }}>Description</h1>
                  <textarea
                    name=""
                    id=""
                    style={{
                      width: "100%",
                      height: "10vh",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                    value={datas?.ServiceRemark || ""}
                    className="custom-input"
                    disabled={!editMode}
                    onChange={(e) =>
                      setDatas({ ...datas, ServiceRemark: e.target.value })
                    }
                    sx={{ backgroundColor: "#E8F0FF" }}
                  ></textarea>
                </center>
              </div>
            </div>
          </Box>
        </Box>
        <Dialog open={openIssues} maxWidth="xl" onClose={handleClose}>
          <DialogTitle
            sx={{
              backgroundColor: color,
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            {type}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                paddingY: "10px",
              }}
            >
              <input
                style={{
                  height: "28px",
                  borderRadius: "5px",
                  padding: "2px",
                }}
                value={searchTerm}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                placeholder="search"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                minWidth: "560px",
                flexWrap: "wrap",
                gap: "2px",
                justifyContent: "space-between",
              }}
            >
              {selectedIssues.map((item, index) => {
                return (
                  <Box
                    sx={{
                      padding: "8px",
                      width: "30%",
                      marginLeft: "3px",
                      flexBasis: "calc(33.33% - 16px)",
                    }}
                    key={index}
                  >
                    <FormControlLabel
                      label={item}
                      control={
                        <>
                          <Checkbox
                            checked={currentIssues.includes(item)}
                            onChange={(event) =>
                              handleCheckboxChange(event, item)
                            }
                          />
                        </>
                      }
                    />
                    {type === "Parts Recived List" &&
                    currentIssues.includes(item) ? (
                      <input
                        style={{
                          width: "34px",
                          height: "35px",
                          fontSize: "20px",
                          paddingLeft: "4px",
                        }}
                        value={partRecievedCount[item] || ""}
                        onChange={(e) => {
                          setPartRecievedCount({
                            ...partRecievedCount,
                            [item]: e.target.value,
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </Box>
                );
              })}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{
                backgroundColor: color,
              }}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              sx={{
                backgroundColor: color,
              }}
              variant="contained"
              onClick={handleUpdateForm}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ViewForm;
