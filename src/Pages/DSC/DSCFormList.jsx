import {
  Box,
  styled,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import CartGrid from "../../components/Common/CardGrid";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import {
  useGetAllRepairingFormQuery,
  useUpdateRepairStatusMutation,
} from "../../features/api/dscApiSlice";
import SignaturePad from "./Components/SignaturePadDialog";
import Loading from "../../components/Common/Loading";
import axios from "axios";
import BASEURL from "../../constants/BaseApi";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../CustomProvider/useWebSocket";
import PdfDownloadDial from "./Components/PdfDownloadDial";
import WebStatusDial from "./Components/WebStatusDial";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { DataGrid } from "@mui/x-data-grid";
import DSCImageDial from "./Components/DSCImageDial";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const infoDetail = [
  {
    name: "Status",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/generated%20button.png?updatedAt=1717243245190"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click Generated, Here you can Update Status of Repairing",
  },
  {
    name: "WebStatus",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/view_wholesale%20request.png?updatedAt=1703065320224"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction:
      "If you click View, Here you can Update Status of Repairing for Customer",
  },
  {
    name: "View",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/details_wholesale%20order.png?updatedAt=1703064824324"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "If you click the Details, you can see Repairing Form Details",
  },
  {
    name: "Signature",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/submit%20button.png?updatedAt=1717243245103"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here You Can Put Your Signature",
  },
  {
    name: "Download PDF",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/dwonload%20icon.png?updatedAt=1717243245134"
        height={"60%"}
        width={"90%"}
      />
    ),
    instruction: "Here You Can Service Receipt PDF",
  },
];

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const DSCFormList = () => {
  /// initialize
  const navigate = useNavigate();

  /// local state
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDial, setOpenDial] = useState(false);
  const [opneWebDial, setOpenWebDial] = useState(false);
  const [openImageDial, setOpenImageDial] = useState(false);
  const [dscData, setDscData] = useState({});
  const [selectedData, setSelectedData] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [selectOptions, setSelectOptions] = useState([
    {
      value: "Completed",
      label: "Completed",
    },
    {
      value: "repairInProcess",
      label: "repair In Process",
    },
    {
      value: "rejected",
      label: "rejected",
    },
  ]);
  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState("open");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pagination, setPagination] = useState([]);
  const dispatch = useDispatch();
  const socket = useSocket();
  const [filterString, setFilterString] = useState("page=1");

  const { userInfo } = useSelector((state) => state.auth);
  /// rtk query
  const {
    data: getAllRepairingForm,
    refetch,
    isLoading,
    isFetching,
  } = useGetAllRepairingFormQuery(queryParams, { refetchOnMount: true });

  const [updateStatusApi, { isLoading: updateStatusLoading }] =
    useUpdateRepairStatusMutation();

  /// useEffects
  useEffect(() => {
    console.log(getAllRepairingForm);
    if (getAllRepairingForm && getAllRepairingForm?.data) {
      const rowss = getAllRepairingForm?.data.map((item, index) => ({
        id: item._id,
        Sno: index + 1,
        CustomerName: item.CustomerName,
        MobileNo: item.MobileNo,
        Token: item.Token,
        Status: item.Status,
        CustomerAcknowledgment: item.CustomerAcknowledgment,
        DroneModel: item.DroneModel,
        RejectRemark: item.rejectRemark,
        Images: item.defectItemImages,
      }));
      setRows(rowss);
    }
  }, [getAllRepairingForm]);

  useEffect(() => {
    if (getAllRepairingForm) {
      const paginationValues = {
        currentPage: getAllRepairingForm?.currentPage,
        itemCount: getAllRepairingForm?.itemCount,
        totalItems: getAllRepairingForm?.totalItems,
        itemsPerPage: getAllRepairingForm?.itemsPerPage,
        totalPages: getAllRepairingForm?.totalPages,
      };
      setPagination(paginationValues);
    }
    console.log(pagination);
  }, [getAllRepairingForm]);

  /// handlers

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const handleOpenSignature = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleChange = (event, newQuery) => {
    setQueryParams(newQuery);
  };

  const handleOpenPdfDial = (data) => {
    setOpenDial(!openDial);
    setDscData(data);
  };

  const handleOpenWebDial = (data) => {
    setOpenWebDial(!opneWebDial);
    setDscData(data);
  };

  const handleCloseWebDial = (data) => {
    setOpenWebDial(!opneWebDial);
    setDscData(data);
  };

  const handleClosePdfDial = () => {
    setDscData({});
    setOpenDial(!openDial);
  };

  const handleOpenImageDial = (data) => {
    setOpenImageDial(!openImageDial);
    setDscData(data);
  };

  const handleCloseImageDial = () => {
    setOpenImageDial(false);
    setDscData({});
  };

  const description =
    "This is the Product Status you can check product details  ";

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClosed = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`DSC Form View`));
  }, []);

  const handleDownloadPdf = (id) => {
    setDownloadLoading(true);
    const pdfUrl = `${BASEURL}/dsc/DSCFormPDF/${id}`;

    axios({
      url: pdfUrl,
      method: "GET",
      responseType: "blob", // important
    })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Repair_${id}.pdf`; // specify the filename
        link.click();
        setDownloadLoading(false);
      })
      .catch((error) => {
        setDownloadLoading(false);
        console.error("Error downloading PDF:", error);
        // Handle the error as needed
      });
  };

  const updateStausHandler = async (params) => {
    try {
      const res = await updateStatusApi(params).unwrap();

      const liveStatusData = {
        message: `${userInfo.name} Updated Status To ${params.status} Of DSC Form Token ${params.token}  `,
        time: new Date(),
      };
      socket.emit("liveStatusServer", liveStatusData);
      toast.success("Repair Query updated successfully");
      setStatusOpen(false);
      setSelectedData(null);
      setSelectedStatus("");
      refetch();
    } catch (e) {
      console.log(e);
      console.log("Error updating Staus DSC");
    }
  };
  /// columns
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.2,
      minWidth: 40,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Token",
      headerName: "Token",
      flex: 0.2,
      minWidth: 150,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      flex: 0.2,
      minWidth: 200,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "DroneModel",
      headerName: "Drone Model",
      flex: 0.2,
      minWidth: 200,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "MobileNo",
      headerName: "Mobile Number",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Status",
      headerName: "Status",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const color =
          params.row.Status === "Completed"
            ? "green"
            : params.row.Status === "rejected"
            ? "Red"
            : "blue";
        return (
          <Tooltip
            title={params.row.RejectRemark || "No Remark"}
            disableHoverListener={
              params.row.Status === "rejected" ? false : true
            }
          >
            <Button
              onClick={() => {
                setStatusOpen(true);
                setSelectedData(params.row);
              }}
              sx={{
                color: color,
              }}
            >
              {params.row.Status}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      field: "WebStatus",
      headerName: "WebStatus",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const data = {
          token: params.row.Token,
          model: params.row.DroneModel,
        };
        return (
          <Button
            onClick={() => {
              handleOpenWebDial(data);
            }}
          >
            View
          </Button>
        );
      },
    },

    {
      field: "Images",
      headerName: "Images",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 450,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const data = {
          id: params.row.id,
          Images: params.row.Images,
        };
        return (
          <Button
            onClick={() => {
              console.log(data);
              handleOpenImageDial(data)
            }}
          >
            {params.row.Images.length ? "View" : "Upload"}
          </Button>
        );
      },
    },
    {
      field: "view",
      headerName: "View",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        return (
          <div>
            <Button
              onClick={() => navigate(`/viewDSCForm/${params.row.Token}`)}
            >
              Details
            </Button>
          </div>
        );
      },
    },
    {
      field: "customerSign",
      headerName: "Signature",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const text = params.row.Status === "Completed" ? "View" : "Submit";
        return (
          <div>
            <Button
              onClick={() => {
                handleOpenSignature(params.row);
              }}
            >
              {text}
            </Button>
          </div>
        );
      },
    },
    {
      field: "download",
      headerName: "PDF",
      flex: 0.2,
      minWidth: 140,
      maxWidth: 350,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const Token = params.row.Token;
        const Contact = params.row.MobileNo;
        const Name = params.row.CustomerName;
        return (
          <div>
            <Button
              onClick={() => {
                handleOpenPdfDial({ Token, Contact, Name });
              }}
            >
              <DownloadIcon />
            </Button>
          </div>
        );
      },
    },
  ];
  const CustomToolbar = () => {
    return (
      <Box style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
        <ToggleButtonGroup
          color="primary"
          value={queryParams}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="open">Generated</ToggleButton>
          <ToggleButton value="closed">Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    );
  };
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "auto" }}
    >
      <DrawerHeader />

      <Loading
        loading={
          isLoading || isFetching || updateStatusLoading || downloadLoading
        }
      />
      <CustomToolbar />
      <SignaturePad
        open={open}
        handleClose={handleClose}
        data={selectedData}
        refetch={refetch}
      />
      <Box sx={{ height: "87vh", width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          rowHeight={40}
          pagination={pagination}
          filterString={filterString}
          setFilterString={setFilterString}
          page={page}
          setPage={setPage}
        />
      </Box>
      <Dialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setSelectedData(null);
          setSelectedStatus("");
        }}
      >
        <DialogTitle>Select Status</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            defaultValue="EUR"
            helperText="Please select Repair query status"
            sx={{
              margin: "5px",
            }}
          >
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {selectedStatus === "rejected" ? (
            <TextField
              placeholder="The Reason For Rejection"
              value={rejectRemark}
              onChange={(e) => {
                setRejectRemark(e.target.value);
              }}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setStatusOpen(false);
              setSelectedData(null);
              setSelectedStatus("");
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const params = {
                status: selectedStatus,
                rejectRemark: rejectRemark,
                token: selectedData.Token,
              };
              updateStausHandler(params);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {openDial && (
        <PdfDownloadDial
          open={openDial}
          close={handleClosePdfDial}
          data={dscData}
        />
      )}
      {opneWebDial && (
        <WebStatusDial
          open={opneWebDial}
          close={handleCloseWebDial}
          data={dscData}
        />
      )}

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClosed}
      />
      {openImageDial && (
        <DSCImageDial
          open={openImageDial}
          refetch={refetch}
          close={handleCloseImageDial}
          data={dscData}
        />
      )}
    </Box>
  );
};

export default DSCFormList;
