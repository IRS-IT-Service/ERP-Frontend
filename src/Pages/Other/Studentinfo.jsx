import { React, useEffect, useState, useRef } from "react";
import {
  DataGrid,

} from "@mui/x-data-grid";

import { Grid, Box,  styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetStudentinfoQuery } from "../../features/api/otherSlice";
import Loading from "../../components/Common/Loading";

import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { formatDate } from "../../commonFunctions/commonFunctions";
// for refresh data
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: "Student Listing",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/details_wholesale%20order.png?updatedAt=1703064824324"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "This table helps in tracking and managing student or Event data details efficiently",
  },

];

const Studentinfo = ({ autoHeight, text }) => {
  const description = "Student Submissions Table is designed to provide a comprehensive and organized view of the information submitted by students";
  const dispatch = useDispatch();

  /// local state
  const [rows, setRows] = useState([]);

  const { isInfoOpen } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Student Info`));
  }, []);

  /// rtk query

  const {
    data: allStudentData,
    isLoading: productLoading,
    refetch,
    isFetching,
  } = useGetStudentinfoQuery();

  /// handlers

  /// useEffect
  useEffect(() => {
    if (allStudentData?.status) {
      const data = allStudentData?.data?.map((item, index) => {
        return {
          ...item,
          id: index,
          Sno: index + 1,
          date: formatDate(item.createdAt),
        };
      });

      setRows(data);
    }
  }, [allStudentData]);

  ///Columns*******************
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Submit Date",
      flex: 0.3,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "name",
      headerName: "Student Name",
      flex: 0.3,
      minWidth: 200,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      flex: 0.2,
      minWidth: 100,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.3,
      minWidth: 400,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
        field: "mobileNo",
        headerName: "Mobile No",
        flex: 0.3,
        minWidth: 200,
        maxWidth: 300,
        align: "center",
        headerAlign: "center",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
      },
    {
      field: "department",
      headerName: "Department",
      flex: 0.3,
      minWidth: 300,
      maxWidth: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <Grid container>
        <Loading loading={productLoading || isFetching} />

        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Box
            sx={{
              width: "100%",
              height: "90vh",
              "& .super-app-theme--header": {
                background: "#eee",
                color: "black",
                textAlign: "center",
              },
              "& .vertical-lines .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },
              "& .supercursor-app-theme--cell:hover": {
                background:
                  "linear-gradient(180deg, #AA076B 26.71%, #61045F 99.36%)",
                color: "white",
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                background: "#eee",
              },
              position: "relative",
            }}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              rowHeight={40}
              autoHeight={autoHeight}
            />
          </Box>
        </Grid>
      </Grid>

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />
    </Box>
  );
};

export default Studentinfo;
