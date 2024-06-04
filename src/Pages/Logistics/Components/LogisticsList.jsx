import { React, useState, useEffect } from "react";
import { Box, Button, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useGetAllLogisticsQuery } from "../../../features/api/logisticsApiSlice";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
import Loading from "../../../components/Common/Loading";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import Header from "../../../components/Common/Header";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";

const infoDetail = [
  {
    name: "Details Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/Courier%20Type.png?updatedAt=1717245477227"
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
    instruction: `Here you can see the details of the logistic box, it will show you the GUI where you enter the Box Data and check Status and Courier Type`,
  },
];

const LogisticsList = () => {
  const description = `In this Logistics Box Module, all details of the shipments are visible. To enter box details, click on the 'Details' button. This will open a (GUI) where you can input all the box data. After entering the data, click on the 'Submit' button to save the box details.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Logistics Box Entry`));
  }, []);
  /// initialize
  const navigate = useNavigate();

  /// local state
  const [rows, setRows] = useState([]);

  /// rtk query

  const { data: allLogisticsData, isLoading: getLogisticLoading } =
    useGetAllLogisticsQuery(null, {
      refetchOnMountOrArgChange: true,
    });

  /// useEffects
  useEffect(() => {
    if (allLogisticsData?.status === "success") {
      const newRows = allLogisticsData?.data.map((item, index) => {
        return {
          id: index,
          logisticId: item.logisticId,
          Sno: index + 1,
          date: formatDate(item.Date),
          HAWB: item.Hawb,
          PI: item.Pi,
          CI: item.Ci,
          Boxes: item.Box,
          Courier: item.CourierType,
          LogisticDate: formatDate(item.LogisticDate)
            ? formatDate(item.LogisticDate)
            : "N/A",
          Note: item.Note,
        };
      });
      setRows(newRows);
    }
  }, [allLogisticsData]);
  /// data grid columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 20,
      maxWidth: 50,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "date",
      headerName: "Current Date",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "LogisticDate",
      headerName: "Logistic Date",
      flex: 0.2,
      width: 180,
      editable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "HAWB",
      headerName: "HAWB/MAWB",
      flex: 0.2,
      width: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "PI",
      headerName: "PI",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CI",
      headerName: "CI",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Boxes",
      headerName: "No of Boxes",
      flex: 0.2,
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Courier",
      headerName: "Courier Type",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <p>{params.row.Note === "inOffice" ? "Pending" : "Submitted"}</p>
        );
      },
    },
    {
      field: "Details",
      headerName: "Details",
      flex: 0.2,
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              onClick={() => {
                navigate(`/addBoxDetails/${params.row.logisticId}`);
              }}
            >
              Details
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Logistics Box Entry"}
        info={true}
        customOnClick={handleOpen}
      /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose}
      />

      <Box
        sx={{
          width: "100%",
          height: "82vh",
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
        {getLogisticLoading ? (
          <Loading loading={getLogisticLoading} />
        ) : (
          <DataGrid rows={rows} columns={columns} />
        )}
      </Box>
    </Box>
  );
};

export default LogisticsList;
