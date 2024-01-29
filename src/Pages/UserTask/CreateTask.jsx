import React, { useState, useEffect } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextareaAutosize,
  Button,
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import {
  useCreateTaskUpdateMutation,
  useGetTaskUpdateQuery,
} from "../../features/api/usersApiSlice";
import { toast } from "react-toastify";
import taskManagerImg from "../../assets/eagle-blue-removebg-preview.png";
import Autocomplete from "@mui/material/Autocomplete";
import Loading from "../../components/Common/Loading";

const CreateTask = () => {
  /// initialize

  /// RTK query

  const [createTaskApi, { isLoading }] = useCreateTaskUpdateMutation();

  /// lcoal state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [taskTime, setTaskTime] = useState("firsthalf");
  const [taskDescription, setTaskDescription] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /// rtk query
  const {
    data,
    isLoading: getTaskUpdateLoading,
    refetch,
    isFetching,
  } = useGetTaskUpdateQuery({from:selectedDate.toISOString(),to:selectedDate.toISOString()}, {
    refetchOnMountOrArgChange: true,
  });

  /// function
  const formatTime = (time) => {
    const formattedTime = new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Specify Indian Standard Time (IST)
    });
    return formattedTime;
  };

  const formatDate = (dateTime) => {
    const formattedDate = new Date(dateTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata", // Specify Indian Standard Time (IST)
    });
    return formattedDate;
  };

  /// handlers

  const handleAutocompleteChange = (event, newValue) => {
    console.log("trigger");

    if (!newValue?.label) {
      setName("");
      setTaskTime("");
      setTaskDescription("");
      setSelectedUser(null);
      return;
    }
    setName(newValue.label);
    attendanceData.forEach((item) => {
      if (item.label === newValue.label) {
        setSelectedUser(item);
      }
    });
  };
  const handleTaskTimeChange = (e) => {
    setTaskTime(e.target.value);
  };

  const handleTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !taskTime || !taskDescription) {
        toast.error("All Fields are required");
        return;
      }

      const params = {
        name: name,
        type: taskTime,
        message: taskDescription,
        userId: selectedUser.userId,
      };

      const res = await createTaskApi(params).unwrap();
      toast.success("Task Successfully Submitted");
      setName("");
      setTaskTime("");
      setTaskDescription("");
      setSelectedUser(null);
      refetch();
    } catch (err) {
      console.log(err);
      console.log("error at Create Task");
    }
  };

  /// useEffects
  useEffect(() => {
    setLoading(true);
    const apiUrl =
      "https://api.hr.irs.org.in/attendence/getAttendenceCurrentDay";

    axios
      .get(apiUrl)
      .then((response) => {
        if (response?.data?.success) {
          setAttendanceData(
            response.data.data.map((item) => {
              return {
                label: item.username,
                userId: item.userId,
                image: item.entryImage ? item.entryImage.url : "No Image",
              };
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  useEffect(() => {
    if (data?.status) {
      const newRows = data.data.reduce((acc, entry) => {
        const existingRow = acc.find((row) => row.name === entry.name);
        if (existingRow) {
          if (entry.type === "first half") {
            existingRow.firstHalf = true;
          } else if (entry.type === "second half") {
            existingRow.secondHalf = true;
          }
        } else {
          const newRow = {
            name: entry.name,
            firstHalf: entry.type === "first half",
            secondHalf: entry.type === "second half",
          };
          acc.push(newRow);
        }
        return acc;
      }, []);
      setRows(newRows);
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "97vh",
        display: "flex",
        justifyContent: "center",
        mt: "20px",
        // alignItems: "center",

        // paddingY: "10rem",
        // overflow: "hidden",
        // backgroundImage:
        //   'radial-gradient(circle, #2e82dc, #1e7ade, #0c72df, #006ae0, #0061e0)',
      }}
    >
      <Loading loading={isLoading || getTaskUpdateLoading || loading} />
      <Box sx={{ m: "30px" }}>
        <Box
          sx={{
            display: "flex",
            // backgroundColor: (theme) => theme.palette.warning.light,
            backgroundColor: "#5D98E5",
            textAlign: "center",
            fontWeight: "bold",
            width: "15rem",
            height: "12rem",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "1rem",
            boxShadow: "3px 4px 5px 1px #010101",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "1rem",
              backgroundColor: "#fff",
              width: "13rem",
              height: "10rem",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                backgroundColor: "transparent",
                textShadow: "2px 2px 5px gray",
              }}
            >
              {formatTime(currentTime)}
            </Typography>
            <Typography>{formatDate(currentTime)}</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        style={{
          width: "50%",
          margin: "auto",
          padding: ".6rem",
          backgroundImage:
            "linear-gradient(to right top, #2e82dc, #3d88de, #498de1, #5593e3, #5f99e5)",
          borderRadius: "1rem",
          boxShadow: "3px 4px 5px 1px #010101",
          position: "relative",

          // zIndex: '999',
          // transform: "rotate(10deg)"
        }}
      >
        <img
          style={{
            width: "12rem",
            position: "absolute",
            left: 0,
            top: "-10.999rem",
            // transform: "rotate(30deg)"
            zIndex: "",
          }}
          src={taskManagerImg}
          alt=""
        />

        <Box
          sx={{
            textAlign: "center",
            marginY: "1rem",
          }}
        >
          <Typography sx={{}} fontWeight="400" variant="h2">
            Task Manager
          </Typography>
          {selectedUser?.image && (
            <Box
              sx={{
                border: "10px solid white",
                width: "8rem",
                height: "8rem",
                position: "absolute",
                right: 10,
                top: 8,
                borderRadius: "20px",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={selectedUser?.image}
                alt=""
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {attendanceData ? (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={attendanceData}
              value={name}
              onChange={handleAutocompleteChange}
              sx={{ width: 400, backgroundColor: "#fff" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Name"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                />
              )}
            />
          ) : (
            ""
          )}
        </Box>

        <FormControl sx={{ display: "block" }} component="fieldset">
          <FormLabel
            sx={{ color: "#010101", fontWeight: "bold" }}
            component="legend"
          >
            Task Time
          </FormLabel>
          <RadioGroup
            row
            aria-label="taskTime"
            name="taskTime"
            value={taskTime}
            onChange={handleTaskTimeChange}
          >
            <FormControlLabel
              value="first half"
              control={<Radio />}
              label="First Half"
            />
            <FormControlLabel
              value="second half"
              control={<Radio />}
              label="Second Half"
            />
          </RadioGroup>
        </FormControl>

        <TextareaAutosize
          minRows={4}
          placeholder="Describe the task you were working on"
          value={taskDescription}
          onChange={handleTaskDescriptionChange}
          style={{
            marginTop: "16px",
            marginBottom: "16px",
            width: "100%",
            resize: "none",
            height: "10rem",
            padding: ".4rem",
            borderRadius: ".5rem",
          }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
          style={{ display: "block", margin: "auto" }}
        >
          {isLoading ? <CircularProgress /> : "Submit"}
        </Button>
      </Box>
      <Box
        sx={{
          width: "30%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <TableContainer
          component={Paper}
          sx={{ height: "65vh", overflow: "auto" }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#5D98E5",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  First Half
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Second Half
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ textAlign: "center" }}>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center" }}>{row.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.firstHalf ? "✔" : "❌"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.secondHalf ? "✔" : "❌"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CreateTask;
