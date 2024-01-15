import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import {
  useAddIssuesToModelMutation,
  useGetOneFormDynamicDataQuery,
  useRemoveIssuesToModelMutation,
  useGetCommonDroneRepairDataQuery,
} from "../../../features/api/dscApiSlice";
import Loading from "../../../components/Common/Loading";
import { useSelector } from "react-redux";

const OneModelDetailInput = () => {
  //global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  /// initialization
  const id = useParams().id;

  /// local state
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [type, setType] = useState(null);
  /// rtk query
  const { data, isLoading, refetch } = useGetOneFormDynamicDataQuery(id);

  const { data: commonRepairData } = useGetCommonDroneRepairDataQuery();

  const [addIssuesApi, { isLoading: addIssueLoading }] =
    useAddIssuesToModelMutation();

  const [removeIssuesApi, { isLoading: removeIssueLoading }] =
    useRemoveIssuesToModelMutation();

  const handleRemoveIssue = async (name, type) => {
    try {
      let params = { modelId: id, type: type };

      if (type === "software") {
        const newSoftwareList = data.data.Software.filter(
          (item) => item !== name
        );
        params.issues = newSoftwareList;
      }

      if (type === "hardware") {
        const newHardwareList = data.data.Hardware.filter(
          (item) => item !== name
        );
        params.issues = newHardwareList;
      }

      if (type === "part") {
        const newPartsList = data.data.Parts.filter((item) => item !== name);
        params.issues = newPartsList;
      }

      const res = await removeIssuesApi(params).unwrap();
      toast.success("Successfully added issues");
      refetch();
    } catch (e) {
      console.log(e);
      console.log("Error at Model issues add");
    }
  };

  const handleSearchInput = (inputValue) => {
    setSearchInput(inputValue);
  };

  const filteredDatas = selectedData.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleCheckboxChange = (itemName) => {
    const updatedSelectedItems = selectedItems.includes(itemName)
      ? selectedItems.filter((item) => item !== itemName)
      : [...selectedItems, itemName];

    setSelectedItems(updatedSelectedItems);
  };

  const handleSubmits = async () => {
    if (selectedItems.length < 1) {
      return toast.error("Pls Selected Items Before Submit");
    }
    try {
      let params = { modelId: id, issues: selectedItems, type: type };
      const res = await addIssuesApi(params).unwrap();
      console.log(res.success);
      if (res.success === true) {
        toast.success("Successfully added issues");
        setSelectedItems([]);
        refetch();
      } else {
        toast.error("Some error occured plz try again");
      }
    } catch (e) {
      console.log(e);
      console.log("Error at Model issues add");
    }
  };

  return (
    <>
      <Box sx={{ marginTop: "2px", padding: "6px", background: "#D5D9E5" }}>
        <h3 style={{ textAlign: "center" }}>Drone Models</h3>
      </Box>
      <Loading loading={isLoading || addIssueLoading || removeIssueLoading} />
      <Box
        sx={{
          //   border: "1px solid red",
          width: "100%",
          height: "85vh",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px 10px",
            margin: "0px 15px",
            border: "2px solid",
            borderColor: color,
            borderRadius: "8px",
            boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
            height: "20vh",
          }}
        >
          <div
            style={{
              padding: "20px 30px",
              background: color,
              width: "35%",
              textAlign: "center",
              border: "1px solid #fff",
              borderRadius: "8px",
              boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
            }}
          >
            <h3
              style={{
                background: "white",
                padding: "20px",
                border: "1px solid",
                borderRadius: "7px",
                boxShadow: "-4px 4px 4px 1px rgba(0, 0, 0, 0.48)",
                color: "#706161",
                fontSize: "25px",
                fontWeight: "20px",
                fontFamily: "inherit",
              }}
            >
              {data?.data.ModelName}
            </h3>
          </div>
          {/* <div >
            <img style={{height:"100px",width:"150px"}} src="https://www.shutterstock.com/shutterstock/photos/404078368/display_1500/stock-photo-dji-phantom-drone-ready-for-take-off-standing-on-a-case-during-sunset-404078368.jpg"></img>
            /
          </div> */}
        </Box>
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
              height: "62vh",
              m: "5px",
              padding: "4px",
              border: "2px solid",
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
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <Button
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                  onClick={() => {
                    setOpen(true);
                    setType("hardware");
                    setSelectedData(commonRepairData?.data.hardware);
                  }}
                >
                  Add Hardware <AddOutlinedIcon sx={{}} />
                </Button>
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "52vh" }}>
              {data?.data.Hardware.map((item, index) => (
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
                    {item}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleRemoveIssue(item, "hardware");
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
              height: "62vh",
              m: "5px",
              padding: "4px",
              border: "2px solid",
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
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <Button
                  onClick={() => {
                    setOpen(true);
                    setType("software");
                    setSelectedData(commonRepairData?.data.software);
                  }}
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                >
                  Add Sofware <AddOutlinedIcon sx={{}} />
                </Button>
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "52vh" }}>
              {data?.data.Software.map((item, index) => (
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
                    {item}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleRemoveIssue(item, "software");
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
              height: "62vh",
              m: "5px",
              padding: "4px",
              border: "2px solid",
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
                  borderRadius: "7px",
                  boxShadow: "-4px 4px 4px 0 rgba(0, 0, 0, 0.4)",
                }}
              >
                <Button
                  sx={{
                    width: "100%",
                  }}
                  variant="outlined"
                  onClick={() => {
                    setOpen(true);
                    setType("parts");
                    setSelectedData(commonRepairData?.data.part);
                  }}
                >
                  Add Parts <AddOutlinedIcon sx={{}} />
                </Button>
              </div>
            </div>
            <div style={{ overflowY: "scroll", height: "52vh" }}>
              {data?.data.Parts.map((item, index) => (
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
                    {item}
                  </span>
                  <DeleteIcon
                    onClick={() => {
                      handleRemoveIssue(item, "part");
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
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: color,
              color: "white",
              textAlign: "center",
            }}
          >
            Select {type}
          </DialogTitle>
          <DialogContent
            // sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            sx={{ width: "36em", height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <input
                style={{ width: "60%", padding: "3px", borderRadius: "5px" }}
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search here ...."
              />
              {/* <SearchIcon sx={{ padding: "1px", cursor: "pointer" }} /> */}
            </div>

            <Grid
              container
              // spacing={2}
              style={{ height: "200px", marginTop: "2px", overflowY: "scroll" }}
            >
              {filteredDatas
                .filter((item) => {
                  return !(
                    (type === "hardware" &&
                      data?.data.Hardware.includes(item.name)) ||
                    (type === "software" &&
                      data?.data.Software.includes(item.name)) ||
                    data?.data.Parts.includes(item.name)
                  );
                })
                .map((item, index) => (
                  <Grid item xs={6} key={index}>
                    {" "}
                    <Box sx={{ padding: "8px" }}>
                      <FormControlLabel
                        label={item.name}
                        control={
                          <Checkbox
                            checked={selectedItems.includes(item.name)}
                            onChange={() => handleCheckboxChange(item.name)}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleSubmits}
              disabled={selectedItems.length < 1}
            >
              {addIssueLoading ? <CircularProgress /> : "Submit"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(false);
              }}
              sx={{
                color: "white",
                background: color,
                "&:hover": {
                  color: "black",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default OneModelDetailInput;
