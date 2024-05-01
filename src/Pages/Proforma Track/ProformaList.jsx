import { Box, styled, Button } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../../components/Common/Header";
import { DataGrid } from "@mui/x-data-grid";
import { formatDate } from "../../commonFunctions/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const ProformaList = () => {
  // Sample data
  const rows = [
    {
      id: 1,
      vendorName: "Hilda",
      performaNo: "PF84332",
      amount: 6000,
      amountLeft: 3000,
      date: formatDate(new Date()),
    },
    {
      id: 2,
      vendorName: "Xinjian",
      performaNo: "PF84234",
      amount: 5000,
      amountLeft: 0,
      date: formatDate(new Date()),
    },
    // Add more data as needed
  ];

  // Column definitions
  const columns = [
    { field: "id", headerName: "Sno", flex: 1 },
    { field: "vendorName", headerName: "Vendor", flex: 2 },
    { field: "performaNo", headerName: "performaNo", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "amount", headerName: "Total Amount", flex: 2 },
    { field: "amountLeft", headerName: "Amount Left", flex: 2 },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              width: "50%",
              height: "50%",
              backgroundColor: "lightblue",
              alignSelf: "center",
              borderRadius: "5px",
            }}
          ></Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params) => {
        return <Button>Details</Button>;
      },
    },
  ];


  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };
  
  useEffect(() => {
    dispatch(setHeader(`Proforma List`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header Name={"Proforma List"} /> */}

      {/* Add the DataGrid */}
      <Box sx={{ height: "88vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5} // Adjust as needed
          rowsPerPageOptions={[5, 10, 20]} // Adjust as needed
        //   checkboxSelection
        //   disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default ProformaList;
