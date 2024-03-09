import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useGetTaskUpdateQuery } from "../../features/api/usersApiSlice";
import Loading from "../../components/Common/Loading";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, formatTime, formateDateAndTime } from "../../commonFunctions/commonFunctions";
import axios from "axios";
import { USERS_URL } from "../../constants/ApiEndpoints";
import BASEURL from "../../constants/BaseApi";
import { flushSync } from "react-dom";
import { setHeader } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Date",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/date_png.png?updatedAt=1703056945657"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "The employee task date feature enables you to easily check all tasks assigned to employees in a date-wise manner",
  },
];
const ViewTask = () => {
  /// local state
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedTaskMessage, setSelectedTaskMessage] = useState({});
  const [loading, setLoading] = useState(false);
  //Global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  const dispatch = useDispatch()

  /// rtk query
  const { data, isLoading, isFetching } = useGetTaskUpdateQuery(
    {
      from: selectedDate?.start?.toISOString().substr(0, 10),
      to: selectedDate?.end?.toISOString().substr(0, 10),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !selectedDate.start,
    }
  );
  /// handlers
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // forn download task excel file
  const handleDownloadClick = async () => {
    try {
      if (!selectedDate?.start || !selectedDate?.end) {
        window.alert("Please select date first");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}${USERS_URL}/getTaskDownload?from=${selectedDate?.start
          ?.toISOString()
          .substr(0, 10)}&to=${selectedDate?.end?.toISOString().substr(0, 10)}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Tasks.xlsx");

      toast.success("Download Started...", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("An error occurred during download:", error);
    }
  };

  // infodialog state
  const description =
    "This is Employee Task where you can view the employee's daily tasks";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };
  /// use effect
  useEffect(() => {
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(startDate.getDate() - 5);
    setSelectedDate({ end: startDate, start: endDate });
  }, []);

  useEffect(()=>{
    dispatch(setHeader({
      Name:"Employee Tasks",
      handleClick:handleOpen
    }))
  },[])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflow: "hidden",
        height: "96vh",
      }}
    >
      <DrawerHeader />
      {/* <Header Name={"Employee Tasks"} info={true} customOnClick={handleOpen} /> */}

      <Loading loading={isLoading || isFetching} />
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          mt: "5px",
        }}
      >
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: color, // Set the outline color when focused
              },
            },
          }}
          id="date"
          label="From"
          type="date"
          value={selectedDate?.start?.toISOString().substr(0, 10)}
          onChange={(e) => {
            setSelectedDate({
              ...selectedDate,
              start: new Date(e.target.value),
            });
          }}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginBottom: "16px" }}
        />
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: color, // Set the outline color when focused
              },
            },
          }}
          id="date"
          label="To"
          type="date"
          value={selectedDate?.end?.toISOString().substr(0, 10)}
          onChange={(e) => {
            setSelectedDate({ ...selectedDate, end: new Date(e.target.value) });
          }}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginBottom: "16px" }}
        />

      </Box> */}
      <Box
        sx={{
          display: "flex",
          marginLeft: "8rem",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: "10px",
          fontWeight: "bold",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "12px" }}>From:</span>
          <input
            placeholder="Date"
            type="date"
            id="date"
            label="From"
            value={selectedDate?.start?.toISOString().substr(0, 10)}
            onChange={(e) => {
              setSelectedDate({
                ...selectedDate,
                start: new Date(e.target.value),
              });
            }}
            style={{
              width: "10rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "12px" }}>To:</span>
          <input
            placeholder="Date"
            type="date"
            id="date"
            label="To"
            value={selectedDate?.end?.toISOString().substr(0, 10)}
            onChange={(e) => {
              setSelectedDate({
                ...selectedDate,
                end: new Date(e.target.value),
              });
            }}
            style={{
              width: "10rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
        </Box>

        <Box>
          <Button
            onClick={handleDownloadClick}
            disabled={loading}
            variant="outlined"
            sx={{
              color: "white",
              background: color,
              "&:hover": {
                color: "black",
              },
            }}
          >
            Download-Excel
          </Button>
        </Box>
      </Box>
      <Box>
        {data?.data?.length ? (
          <TableContainer
            component={Paper}
            sx={{ overflow: "auto", height: "76vh" }}
          >
            <Table>
              <TableHead
                sx={{
                  backgroundColor: themeColor.sideBarColor1,
                  color: "white",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Sno</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", widht: "50px" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>Task Hour</TableCell>
                  <TableCell sx={{ color: "white" }}>Create Time</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Task Description
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>{row.type.toUpperCase()}</TableCell>
                    <TableCell>{formatTime(row.createdAt)}</TableCell>
                    <TableCell>{row.message}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setSelectedTaskMessage({
                            name: row.name,
                            message: row.message,
                          });
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <center>
            <h1
              style={{
                backgroundColor: color,
                color: "white",
              }}
            >
              No Task Update For Today
            </h1>
          </center>
        )}
      </Box>

      <Dialog
        open={selectedTaskMessage.name ? true : false}
        onClose={() => {
          setSelectedTaskMessage({});
        }}
      >
        <DialogTitle>{selectedTaskMessage.name}</DialogTitle>
        <DialogContent>
          <p>{selectedTaskMessage.message}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedTaskMessage({});
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={infoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default ViewTask;
