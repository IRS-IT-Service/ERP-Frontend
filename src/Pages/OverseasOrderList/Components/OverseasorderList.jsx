import React, { useEffect, useState, useRef } from "react";

import {
  Button,
  Box,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableRow,
  TableCell,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Nodata from "../../../assets/error.gif";
import Loading from "../../../components/Common/Loading";
import { makeStyles } from "@mui/styles";
import { formatDate } from "../../../commonFunctions/commonFunctions";
import { useGetAllCreatedOrderQuery } from "../../../features/api/RestockOrderApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../../features/slice/uiSlice";
import InfoDialogBox from "../../../components/Common/InfoDialogBox";

import OpenActionDial from "./OpenActionDial";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
}));
const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

//Todo
const infoDetail = [
  {
    name: "Status",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/image.png?updatedAt=1717246052254"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here You Can See Status of Your all Overseas Shipment",
  },
  {
    name: "Details",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065319338"
        height={"100%"}
        width={"100%"}
      />
    ),
    instruction:
      "If you click to View Button Under Details so you can see One overseas Shipment with all the Shipment Details",
  },
];

const OverseasorderList = () => {
  /// initialize
  const navigate = useNavigate();

  const classes = useStyles();
  const id = useParams().id;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyName = queryParams.get("companyName");
  const concernPerson = queryParams.get("concernPerson");
  const mobile = queryParams.get("mobile");

  /// local state
  const [toggleValue, setToggleValue] = useState("pending");
  const [rows, setRows] = useState([]);
  const [OpenAction, setOpenAction] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const handleOpen = (e) => {
    setOpenAction(true);
    setSelectedDetails({ name: e.name, orderId: e.orderId });
    setSelectedInfo(e);
  };

  /// RTK query
  const {
    refetch,
    data: overseasShipment,
    isLoading: overseasShipmentLoading,
  } = useGetAllCreatedOrderQuery();

  useEffect(() => {
    if (overseasShipment?.status) {
      const data = overseasShipment.data?.map((item, index) => ({
        ...item,
        paymentDate: formatDate(item.paymentDate),
        id: item._id,
        Sno: index + 1,
        orderId: item.overseaseOrderId,
      }));

      setRows(data);
    }
  }, [overseasShipment, toggleValue]);

  /// handler


  // Define the columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 10,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "vendorName",
      headerName: "Assigned To",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "piNo",
      headerName: "PI No:",
      flex: 0.3,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "paymentDate",
      headerName: "Payement Date",
      flex: 0.3,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      // renderCell: (params) => {
      //   const swiftCopy = params.row.swiftCopy;
      //   const piCopy = params.row.piCopy;
      //   return (
      //     <Button
      //       size="small"
      //       onClick={(e) => {
      //         handleOpen({piCopy:piCopy,swiftCopy:swiftCopy});
      //       }}
      //     >
      //       View
      //     </Button>
      //   );
      // },
    },
    {
      field: "Documents",
      headerName: "Documents",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const piCopy = params.row.piCopy;
        const swiftCopy = params.row.swiftCopy;
        return (
          <Button
            size="small"
            onClick={() => {
              handleOpen({
                piCopy,
                swiftCopy,
                name: "Document View",
              });
            }}
          >
            View
          </Button>
        );
      },
    },

    {
      field: "noOfBoxes",
      headerName: "Action",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              handleOpen({
                name: "Add Amount",
                orderId: params.row.overseaseOrderId,
              });
            }}
          >
            Add Amount
          </Button>
        );
      },
    },

    {
      field: "totalUSDAmount",
      headerName: "Paid Amount",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `$ ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "restUSDAmount",
      headerName: "Shortfall",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => `$ ${Number(params.value).toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "details",
      headerName: "Details",
      sortable: false,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              navigate(`/SubPIList/${params.row.overseaseOrderId}`);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];
  // infodialog state
  //Todo
  const description =
    "This is Employee Task where you can view the employee's daily tasks";

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Overseas Order List`));
  }, []);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />
      {/* <Header
        Name={"Incoming Shipment"}
        info={true}
        customOnClick={handleOpen}
      /> */}

      <StyledBox>
        <Loading loading={overseasShipmentLoading} />
        <Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            {companyName ? (
              <Box sx={{ display: "flex" }}>
                <Table sx={{ background: "#024d70", borderRadius: "15px" }}>
                  <tbody>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Company Name :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {companyName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Concern Person :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {concernPerson}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          color: "#9198ed",
                        }}
                      >
                        Mobile :
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>{mobile}</TableCell>
                    </TableRow>
                  </tbody>
                </Table>
              </Box>
            ) : (
              <Box> </Box>
            )}

            <ToggleButtonGroup
              color="primary"
              value={toggleValue}
              exclusive
              onChange={(e) => {
                setToggleValue(e.target.value);
              }}
              aria-label="Platform"
            >
              <ToggleButton
                classes={{ selected: classes.selected }}
                value="pending"
              >
                Pending
              </ToggleButton>
              <ToggleButton
                classes={{ selected: classes.selected }}
                value="recieved"
              >
                Recieved
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "68vh",
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
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      // border: '2px solid blue',
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "150px",
                      height: "150px",
                    }}
                  >
                    <img
                      src={Nodata}
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      No data found !
                    </Typography>
                  </Box>
                </Box>
              ),
              // Toolbar:CustomToolbar,
            }}
            // checkboxSelection={toggleValue === "pending" ? true : false}
            // disableRowSelectionOnClick
            // onRowSelectionModelChange={handleSelectionChange}
            // rowSelectionModel={selectedItems}
            columns={columns}
            rows={rows}
            rowHeight={40}
            Height={"85vh"}
          />
        </Box>

        <InfoDialogBox
          infoDetails={infoDetail}
          description={description}
          open={isInfoOpen}
          close={handleClose}
        />
      </StyledBox>
      {OpenAction && (
        <OpenActionDial
          open={OpenAction}
          close={() => setOpenAction(false)}
          selectedDetails={selectedDetails}
          selectedInfo={selectedInfo}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default OverseasorderList;