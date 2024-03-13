import React from "react";
import { Box, styled } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetCommonDroneRepairDataQuery,
  useAddCommonDroneRepairDataMutation,
  useDeleteCommonRepairDataMutation,
} from "../../features/api/dscApiSlice";
import Loading from "../../components/Common/Loading";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const AddCommonRepair = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  /// local state
  const [hardware, setHardware] = useState([]);
  const [software, setSoftware] = useState([]);
  const [part, setPart] = useState([]);
  const [hardwareInput, setHardwareInput] = useState("");
  const [softwareInput, setSoftwareInput] = useState("");
  const [partInput, setPartInput] = useState("");

  /// rtk query
  const { data, isLoading, refetch, isFetching } =
    useGetCommonDroneRepairDataQuery();
  const [addCommonApi, { isLoading: addCommmonLoading }] =
    useAddCommonDroneRepairDataMutation();
  const [deleteCommonApi, { isLoading: deleteLoading }] =
    useDeleteCommonRepairDataMutation();

  /// useEffect
  useEffect(() => {
    if (data?.success) {
      setHardware(data.data.hardware);
      setSoftware(data.data.software);
      setPart(data.data.part);
    }
  }, [data, isFetching]);

  /// handler

  const handleChange = (value, type) => {
    const regex = new RegExp(value, "i");
    if (type === "hardware") {
      setHardwareInput(value);

      const sortedArray = [...hardware].sort((a, b) => {
        const aMatch = regex.test(a.name);
        const bMatch = regex.test(b.name);

        // Sort by whether the item's name matches the input
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        // If both or neither match, maintain the original order
        return 0;
      });

      // Update the state with the sorted array
      setHardware(sortedArray);
    }
    if (type === "software") {
      setSoftwareInput(value);

      const sortedArray = [...software].sort((a, b) => {
        const aMatch = regex.test(a.name);
        const bMatch = regex.test(b.name);

        // Sort by whether the item's name matches the input
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        // If both or neither match, maintain the original order
        return 0;
      });

      // Update the state with the sorted array
      setSoftware(sortedArray);
    }
    if (type === "part") {
      setPartInput(value);

      const sortedArray = [...part].sort((a, b) => {
        const aMatch = regex.test(a.name);
        const bMatch = regex.test(b.name);

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

  const handleSubmit = async (name, type) => {
    try {
      if (!name) {
        toast.error("Please enter Issue First");
        return;
      }
      const params = {
        name: name.split(",").map((item) => item.trim()),
        type,
      };

      const res = await addCommonApi(params).unwrap();
      toast.success("Success");
      setHardwareInput("");
      setSoftwareInput("");
      setPartInput("");
      refetch();
    } catch (err) {
      console.log(err);
      console.log("Error at Add Common Repair");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCommonApi(id).unwrap();
      toast.success("Success Fully Deleted");
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Add Common Repair Issues`));
  }, []);
  
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      <Loading
        loading={isLoading || isFetching || addCommmonLoading || deleteLoading}
      />

      {/* <Box sx={{ marginTop: "2px", padding: "6px", background: "#D5D9E5" }}>
        <h3 style={{ textAlign: "center" }}>Add Common Repair Issues</h3>
      </Box> */}

      <Box
        sx={{
          width: "100%",
          height: "84vh",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            width: "99%",
            display: "flex",
            justifyContent: "space-between",
            margin: "8px 2px 0 4px",
            gap: "30px",
          }}
        >
          <Box
            sx={{
              width: "33%",
              height: "82vh",
              m: "5px",
              padding: "4px",
              border: "2px solid",
              borderColor: color,
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              background: "#E7F1FD",
              scrollbarColor: color,
            }}
          >
            <div
              style={{
                padding: "10px",
                background: color,
                border: "2px solid #fff",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  padding: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "white",
                  border: "2px solid #fff",
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <input
                  type="text"
                  placeholder="Add Hardware Issue"
                  value={hardwareInput}
                  onChange={(e) => {
                    handleChange(e.target.value, "hardware");
                  }}
                  className="custom-input"
                  style={{
                    width: "85%",
                    border: "none",
                    outline: "none",
                    fontSize: "20px",
                    fontWeight: "bold",
                    "::placeholder": {
                      fontSize: "20px",
                      fontWeight: "bolder",
                    },
                  }}
                />{" "}
                <div
                  onClick={() => handleSubmit(hardwareInput, "hardware")}
                  style={{
                    color: "white",
                    background: color,
                    marginRight: "10px",
                    // padding: "2px",
                    cursor: "pointer",
                    border: "1px solid #fff",
                    borderRadius: "4px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <AddOutlinedIcon sx={{}} />{" "}
                </div>
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "72vh" }}>
              {hardware.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    border: "1px solid",
                    borderColor: color,
                    background: "#fff",
                    margin: "20px 10px",
                    borderRadius: "7px",
                    lineHeight: "30px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span
                    style={{
                      color: color,
                      fontFamily: "inherit",
                      fontWeight: "bolder",
                      fontSize: "22px",
                      marginLeft: "6px",
                    }}
                  >
                    {item.name}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleDelete(item.Id);
                    }}
                    sx={{
                      background: color,
                      color: "white",
                      padding: "2px",
                      marginRight: "4px",
                      width: "7%",
                      border: "1px solid",
                      borderRadius: "4px",
                      boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </Box>

          <Box
            sx={{
              width: "33%",
              height: "82vh",
              m: "5px",
              padding: "4px",
              border: "2px solid ",
              borderColor: color,
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              background: "#E7F1FD",
            }}
          >
            <div
              style={{
                padding: "10px",
                background: color,
                border: "2px solid #fff",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  padding: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "white",
                  border: "2px solid #fff",
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <input
                  type="text"
                  className="custom-input"
                  value={softwareInput}
                  onChange={(e) => {
                    handleChange(e.target.value, "software");
                  }}
                  placeholder="Add Software Issue"
                  style={{ width: "85%", border: "none", outline: "none" }}
                />{" "}
                <div
                  onClick={() => handleSubmit(softwareInput, "software")}
                  style={{
                    color: "white",
                    background: color,
                    marginRight: "10px",
                    // padding: "2px",
                    cursor: "pointer",
                    border: "1px solid #fff",
                    borderRadius: "4px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <AddOutlinedIcon sx={{}} />{" "}
                </div>{" "}
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "72vh" }}>
              {software.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    border: "1px solid ",
                    borderColor: color,
                    background: "#fff",
                    margin: "20px 10px",
                    borderRadius: "7px",
                    lineHeight: "30px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span
                    style={{
                      color: color,
                      fontFamily: "inherit",
                      fontWeight: "bolder",
                      fontSize: "22px",
                      marginLeft: "6px",
                    }}
                  >
                    {item.name}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleDelete(item.Id);
                    }}
                    sx={{
                      background: color,
                      color: "white",
                      padding: "2px",
                      marginRight: "4px",
                      width: "7%",
                      border: "1px solid",
                      borderRadius: "4px",
                      boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </Box>
          <Box
            sx={{
              width: "33%",
              height: "82vh",
              m: "5px",
              padding: "4px",
              border: "2px solid ",
              borderColor: color,
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              background: "#E7F1FD",
            }}
          >
            <div
              style={{
                padding: "10px",
                background: color,
                border: "2px solid #fff",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  padding: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "white",
                  border: "2px solid #fff",
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <input
                  type="text"
                  className="custom-input"
                  value={partInput}
                  onChange={(e) => {
                    handleChange(e.target.value, "part");
                  }}
                  placeholder="Add Parts Received with drone"
                  style={{ width: "85%", border: "none", outline: "none" }}
                />{" "}
                <div
                  onClick={() => handleSubmit(partInput, "part")}
                  style={{
                    color: "white",
                    background: color,
                    marginRight: "10px",
                    // padding: "2px",
                    cursor: "pointer",
                    border: "1px solid #fff",
                    borderRadius: "4px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <AddOutlinedIcon sx={{}} />{" "}
                </div>{" "}
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "72vh" }}>
              {part?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    border: "1px solid ",
                    borderColor: color,
                    background: "#fff",
                    margin: "20px 10px",
                    borderRadius: "7px",
                    lineHeight: "30px",
                    boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span
                    style={{
                      color: color,
                      fontFamily: "inherit",
                      fontWeight: "bolder",
                      fontSize: "22px",
                      marginLeft: "6px",
                    }}
                  >
                    {item.name}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleDelete(item.Id);
                    }}
                    sx={{
                      background: color,
                      color: "white",
                      padding: "2px",
                      marginRight: "4px",
                      width: "7%",
                      border: "1px solid",
                      borderRadius: "4px",
                      boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCommonRepair;
