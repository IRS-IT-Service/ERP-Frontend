import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useGetAllUserHistoryQuery } from "../../features/api/usersApiSlice";
import Loading from "../../components/Common/Loading";
import { formateDateAndTime } from "../../commonFunctions/commonFunctions";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useSelector } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const menuData = [
  { id: 1, name: "Login", type: "login" },
  { id: 2, name: "User", type: "user" },
  { id: 3, name: "Product", type: "product" },
  { id: 4, name: "WholeSale", type: "wholesale" },
  { id: 5, name: "Sales Query", type: "salesQuery" },
  { id: 6, name: "Approval", type: "approval" },
  { id: 7, name: "Overseas", type: "overseas" },
  { id: 8, name: "Calc", type: "calc" },
  { id: 9, name: "Logistic", type: "logistic" },
];
// infoDialog box data
const infoDetail = [
  {
    name: "Date",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/date_history%20png.png?updatedAt=1703057614788"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "You can review the date-wise login history for login, user, product, wholesale, sale query, approval, overseas, calc, and logistic",
  },
  {
    name: "Login",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/login_history%20png.png?updatedAt=1703057614864"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "You can check Under the history category, choose 'Login' to access the login history within the portal",
  },
  {
    name: "User ",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/user_history%20png.png?updatedAt=1703057614859"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'User' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Product  ",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/product_history%20png.png?updatedAt=1703057614942"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      " If you select 'Product' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Wholesales",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/wholeSale_history%20png.png?updatedAt=1703057614476"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Wholesales' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Sales query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/salesQuery_history%20png.png?updatedAt=1703057614926"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Sales query' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Approval",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/approval_history%20png.png?updatedAt=1703057614868"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Approval' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Overseas",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Overseas_history%20png.png?updatedAt=1703057614794"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Overseas' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Calc",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/calc_histroy%20png.png?updatedAt=1703057614798"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Calc' in the history category, you can view the login history of that specific user",
  },
  {
    name: "Logistic",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Logistic_history%20png.png?updatedAt=1703057614938"
        height={"90%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you select 'Logistic' in the history category, you can view the login history of that specific user",
  },
];

const ERPHistory = () => {
  /// initialize

  /// local state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [type, setType] = useState("login");
  const [selectedTaskMessage, setSelectedTaskMessage] = useState({});

  //Global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;

  /// rtk query
  const { data, isLoading, isFetching } = useGetAllUserHistoryQuery({
    date: selectedDate?.toISOString()?.substr(0, 10),
    type,
  });

  /// handlers
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  // infodialog state
  const description =
    "This is User Section helps manage user control, allowing the admin to grant or revoke access as needed";

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClose = () => {
    setInfoOpen(!infoOpen);
  };
  const handleOpen = () => {
    setInfoOpen(true);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        width: "100%",
        overflow: "hidden",
        height: "97vh",
      }}
    >
      <DrawerHeader />
      <Header Name={"History Portal"} info={true} customOnClick={handleOpen} />

      <Loading loading={isLoading || isFetching} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          mt: "10px",
          alignItems: "center",
        }}
      >
        <Box>
          <span style={{ marginRight: "12px", fontWeight: "bold" }}>To:</span>
          <input
            placeholder="Date"
            type="date"
            id="date"
            label="Select Date"
            value={selectedDate.toISOString().substr(0, 10)}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            style={{
              width: "12rem",
              padding: "10px 25px",
              margin: "2px 0",
              borderRadius: "5px",
              fontSize: "18px",
              height: "6vh",
            }}
          />
        </Box>
        <Box
          sx={{
            width: "250px",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: color, // Set the outline color when focused
              },
            },
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              History Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Select History Category"
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              {menuData.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.type}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box>
        {data?.data?.length ? (
          <TableContainer
            component={Paper}
            sx={{ overflow: "auto", height: "78vh" }}
          >
            <Table>
              <TableHead
                sx={{
                  backgroundColor: themeColor.sideBarColor1,
                  color: "white",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  textAlign: "center",
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Sno
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {formateDateAndTime(row.createdAt)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {row.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <h1>No Data</h1>
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

export default ERPHistory;
