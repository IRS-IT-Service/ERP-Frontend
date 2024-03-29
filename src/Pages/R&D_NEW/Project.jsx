import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  styled,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  tableCellClasses,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TableCell from "@mui/material/TableCell";
import { useLocation } from "react-router-dom";
import {
  useUpdateBoxOpenApprovalMutation,
  useGetBoxOpenApprovalQuery,
} from "../../features/api/barcodeApiSlice";
import { useGetUnApprovedCountQuery } from "../../features/api/productApiSlice";
import { useEffect } from "react";
import { formatDate } from "../../commonFunctions/commonFunctions";
import Loading from "../../components/Common/Loading";
import { toast } from "react-toastify";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import ProjectAddDial from "./Dialogues/ProjectAddDial";
import { useGetAllProjectDataQuery } from "../../features/api/RnDSlice";
import AddpartsDial from "./Dialogues/AddpartsDial";
import { Add } from "@mui/icons-material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditUpdateDial from "./Dialogues/EditupdateDial";
import StatusDial from "./Dialogues/StatusDial";

/// styles
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(0deg, #01127D, #04012F)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const infoDetail = [
  {
    name: "Approval Status Button",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/approvalStatus.png?updatedAt=1703075709896"
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
    instruction: `All three are status buttons through which you can check the status of the product component.`,
  },
  {
    name: "Approval Status View",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/approvalStatus.png?updatedAt=1703075709896"
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
    instruction: `After clicking on View button a dialog box of approval status pop-up `,
  },
];

const Project = () => {
  const description = `"In R&D, new projects and previous projects are developed. We add materials used in the projects and provide status updates indicating whether the project is complete or ongoing.`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`R&D Project`));
  }, []);

  /// initialize
  const classes = useStyles();
  const { search } = useLocation();

  /// local state
  const [queryParams, setQueryParams] = useState("Started");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState({});
  const [openAddProject, setOpenAddProject] = useState(false);
  const [skip, setSkip] = useState(true);
  const [AddpartsDialopen, setAddpartsDialopen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [projectDetails, setprojectDetails] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [projectId, setProjectId] = useState("");

  /// rtk query
  const { data, isLoading, refetch, isFetching } = useGetAllProjectDataQuery();

  const [updateApprovalApi, { isLoading: updateLoading }] =
    useUpdateBoxOpenApprovalMutation();

  const { refetch: refetchUnApprovedCount } = useGetUnApprovedCountQuery(null, {
    skip: skip,
  });

  /// handlers

  const handleChange = (event, newQuery) => {
    setQueryParams(newQuery);
  };

  const handleStatusOpen = (id) => {
    setStatusOpen(true), 
    setProjectId(id);
  };

  const handleClose = () => {
    setOpenAddProject(false);
    setAddpartsDialopen(false);
    setprojectDetails({});
    setSelected({});
  };

  const handleSubmitQuery = async (status) => {
    setSkip(false);
    try {
      const params = {
        id: selected["_id"],
        status: status,
      };

      const res = await updateApprovalApi(params);
      toast.success(`Successfully ${status ? "Accepted" : "Rejected"}`);
      setOpen(false);
      if (status) {
        setQueryParams("accepted");
      } else {
        setQueryParams("rejected");
      }

      refetchUnApprovedCount();
    } catch (e) {
      console.log("Error at Open Box Approval Status");
      console.log(e);
    }
    setSkip(true);
    setSelected({});
  };

  /// useEffects
  useEffect(() => {
    if (data?.status) {
      const filterData = data.data.filter(
        (item) => item.status === queryParams
      );
      const newRows = filterData.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          date: formatDate(item.createdAt),
        };
      });

      setRows(newRows);
    }
  }, [data, isFetching, queryParams]);

  /// columns

  const columns = [
    {
      field: "id",
      headerName: "Sno",
      minWidth: 40,
      maxWidth: 50,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "projectId",
      headerName: "Project ID",
      minWidth: 100,
      maxWidth: 80,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Name",
      flex: 0.3,
      headerName: "Project Name",
      minWidth: 350,
      maxWidth: 800,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date",
      flex: 0.3,
      headerName: "Created At",
      minWidth: 150,
      maxWidth: 150,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 250,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const id = params.row.projectId;
        const color =
          params.row.status === "Started"
            ? "green"
            : params.row.status === "Processing"
            ? "orange"
            : "red";
        return (
          <div
            style={{
              color: color,
            }}
          >
            <Button
              sx={{ color: `${color}` }}
              onClick={() => handleStatusOpen(id)}
            >
              {params.row.status}
            </Button>
          </div>
        );
      },
    },
    {
      field: "action",
      flex: 0.3,
      headerName: "Add Parts",
      minWidth: 200,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const paramsData = params.row;

        return (
          <Add
            onClick={() => {
              setAddpartsDialopen(true);
              setprojectDetails(paramsData);
            }}
            sx={{ "&:hover": { color: "red" }, cursor: "pointer" }}
          ></Add>
        );
      },
    },
    {
      field: "Edit",
      flex: 0.3,
      headerName: "Update & View Projects",
      minWidth: 150,
      maxWidth: 250,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const paramsData = params.row;
        return (
          <ModeEditIcon
            sx={{ "&:hover": { color: "red" }, cursor: "pointer" }}
            onClick={() => {
              setOpenEdit(true);
              setprojectDetails(paramsData);
            }}
          />
        );
      },
    },
  ];

  /// Custom toolbar
  const CustomToolbar = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "10px",
        }}
      >
        <Box>
          <Button variant="contained" onClick={() => setOpenAddProject(true)}>
            <i className="fa-solid fa-plus" style={{ marginRight: "10px" }} />{" "}
            Add Project
          </Button>
        </Box>
        <ToggleButtonGroup
          color="primary"
          value={queryParams}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="Started"
          >
            Start Project
          </ToggleButton>
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="Processing"
          >
            Processing Project
          </ToggleButton>
          <ToggleButton classes={{ selected: classes.selected }} value="Closed">
            Closed Project
          </ToggleButton>
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

      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose1}
      />

      <Loading loading={isLoading || isFetching} />

      <Box
        sx={{
          width: "100%",
          height: "82vh",
          "& .super-app-theme--header": {
            background: "#eee",
            color: "black",
            alignItems: "center",
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
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
      {openAddProject && (
        <ProjectAddDial
          open={openAddProject}
          close={handleClose}
          refetch={refetch}
        />
      )}
      {AddpartsDialopen && (
        <AddpartsDial
          open={AddpartsDial}
          close={handleClose}
          data={projectDetails}
          refetch={refetch}
        />
      )}
      {openEdit && (
        <EditUpdateDial
          open={openEdit}
          setOpen={setOpenEdit}
          data={projectDetails}
          refetch={refetch}
        />
      )}
      {statusOpen && (
        <StatusDial
          setProjectId={setProjectId}
          projectId={projectId}
          setStatusOpen={setStatusOpen}
          open={statusOpen}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default Project;