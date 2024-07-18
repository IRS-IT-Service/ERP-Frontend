import React, { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import { Portal } from "@mui/base/Portal";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  formatDate,
  formatIndianPrice,
  formatUSDPrice,
  formateDateAndTime
} from "../../commonFunctions/commonFunctions";

import { setHeader, setInfo } from "../../features/slice/uiSlice";
import { useGetAllProformaQuery } from "../../features/api/proformaApiSlice";
// import PreviewDial from "./PreviewDial";
import {
  useGetAllTasksManagementQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../features/api/taskManagementApiSilce";
import { useGetAllUsersQuery } from "../../features/api/usersApiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import AddTaskDial from "./Component/AddTaskDial";
import FilePreviewDial from "./Component/FilePreviewDial";
import { useSelector, useDispatch } from "react-redux";
import { useSendMessageToAdminMutation } from "../../features/api/whatsAppApiSlice";
import { useSocket } from "../../CustomProvider/useWebSocket";

import {
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  styled,
  Button,
  List,
  Popover,
  Typography,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

import NotStartedIcon from "@mui/icons-material/NotStarted";
import InProgressIcon from "@mui/icons-material/HourglassEmpty";
import DoneIcon from "@mui/icons-material/CheckCircle";
import ArchivedIcon from "@mui/icons-material/Archive";

import LowPriorityIcon from "@mui/icons-material/LowPriority";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ReportIcon from "@mui/icons-material/Report";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const priorityOptions = [
  {
    id: 1,
    name: "Low",
    value: "Low",
    gradient:
      "linear-gradient(to right top, #004d40, #004438, #003b31, #003229, #002922)",
    icon: <LowPriorityIcon />,
  },
  {
    id: 2,
    name: "Medium",
    value: "Medium",
    gradient:
      "linear-gradient(to right top, #f57f17, #dd7011, #c5620a, #ae5404, #974700)",
    icon: <PriorityHighIcon />,
  },
  {
    id: 3,
    name: "High",
    value: "High",
    gradient:
      "linear-gradient(to right top, #b71c1c, #971219, #790914, #5b040e, #3f0101)", // deep red to light red
    icon: <ReportIcon />,
  },
];

const statusOptions = [
  {
    id: 1,
    name: "Not Started",
    value: "Notstarted",
    gradient: "linear-gradient(to right, #808080, #404040)",
    icon: <NotStartedIcon />,
  },
  {
    id: 2,
    name: "In Progress",
    value: "Inprogress",
    gradient: "linear-gradient(to right, #0000ff, #00008b)",
    icon: <InProgressIcon />,
  },
  {
    id: 3,
    name: "Done",
    value: "Done",
    gradient: "linear-gradient(to right, #008000, #004d00)",
    icon: <DoneIcon />,
  },
  {
    id: 4,
    name: "Archived",
    value: "Archived",
    gradient: "linear-gradient(to right, #800080, #4b0082)",
    icon: <ArchivedIcon />,
  },
];

const TaskScheduledList = () => {
  const [rows, setRows] = useState([]);
  const [previewDialOpen, setPreviewDialOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [OpenAddTask, setAddTask] = useState(false);
  const [OpenFilePreview, setFilePreview] = useState(false);
  const [UserName, setUserName] = useState([]);
  const socket = useSocket();
  const {
    refetch: refetchAllUser,
    data: AllUserData,
    isFetching,
  } = useGetAllUsersQuery();
  const { isAdmin, userInfo } = useSelector((state) => state.auth);
  const adminid = userInfo?.adminId;

  useEffect(() => {
    if (AllUserData?.status) {
      const UserName = AllUserData?.data.map((item) => ({
        name: item.name,
        adminId: item.adminId,
        value: item.name,
        contact:item.ContactNo,
        Email: item.email,

      }));
      setUserName(UserName);
    }
  }, [AllUserData]);

  const FindName = (id) => {
    const Name = UserName?.find((item) => item.adminId === id);
    return id === adminid ? (
      <span
        style={{
          textAlign: "center",
          width: "7vw",
          fontSize: "13px",
         
      
        }}
      >
        My Self
      </span>
    ) : (
      <span
        style={{
          display: "inline-block",
          width: "7vw",
          fontSize: "13px",
          textAlign: "center",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        
        }}
      >
        {Name?.name}
      </span>
    );
  };

  const [deleteById, { isLoading: delteLoading }] = useDeleteTaskMutation();

  // API
  const { data: allData, isLoading, refetch } = useGetAllTasksManagementQuery();
  const [updateData, { isLoading: UpdateLoading }] = useUpdateTaskMutation();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation()

  const handleUpdate = async (id, query, data,taskTitle) => {
    let changeData = data
    try {
      const formDataQuery = new FormData();
      formDataQuery.append("id", id);
      formDataQuery.append("data", data);

      const info = {
        query: query,
        body: formDataQuery,
      };

      const result = await updateData(info).unwrap();
      if(query === "dueDate" || query === "warningTime"){
         changeData = formateDateAndTime(data)
      }
      const liveStatusData = {
        message: `${userInfo.name} updated ${query} to ${changeData} of Task-${taskTitle}`
        ,
        time: new Date(),
      };
      socket.emit("liveStatusServer", liveStatusData);
      const whatsappMessage = { message:liveStatusData.message,contact:import.meta.env.VITE_ADMIN_CONTACT}
     await sendMessageToAdmin(whatsappMessage).unwrap()
      // toast.success(`${query} updated successfully`);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenTask = () => {
    setAddTask(true);
  };

  const handleCloseTask = () => {
    setAddTask(false);
  };

  const handleCloseFile = () => {
    setFilePreview(false);
  };

  const handleDeleteByid = (e, id) => {
    Swal.fire({
      title: "Are you sure want to delete?",
      text: `${e}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d11e06",
      cancelButtonColor: "black",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.showLoading();

        try {
          const result = await deleteById(id).unwrap();
          toast.success("Task deleted successfully");
          refetch();
        } catch (error) {
          console.log(error);
        } finally {
          Swal.hideLoading();
        }
      }
    });
  };

  const handlePreviewOpen = (details) => {
    setDetails(details);
    setFilePreview(true);
  };

  useEffect(() => {
    if (allData?.status) {
      const filteredData = isAdmin
        ? allData.data
        : allData.data.filter((item) => item.userId === adminid);

      const data = filteredData.map((item, index) => ({
        ...item,
        id: item._id,
        Sno: index + 1,
        file: item.files?.url,
        dueDate: item.dueDate,
        userId: item.userId,
      }));

      setRows(data);
    }
  }, [allData, isAdmin, adminid]);

  const CustomToolbar = (prop) => {
    /// global state
    const { themeColor } = useSelector((state) => state.ui);

    return (
      <>
        <Portal container={() => document.getElementById("filter-panel")}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <GridToolbarQuickFilter style={{ paddingTop: "20px" }} />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                marginTop: "10px",
                paddingRight: "10px",
              }}
            >
              <Button variant="contained" size="small" onClick={handleOpenTask}>
                Add Task
              </Button>{" "}
            </Box>
          </Box>
        </Portal>
      </>
    );
  };

  const RoleSelect = (params) => {
    const { id, field, value } = params;

    const isEligible = params.row.assigneeBy === adminid;

    const handleChange = (event) => {
      const newValue = event.target.value;

      const Name = UserName?.find((item) => item.value === newValue);

      if (field === "userName") {
        handleUpdate(id, "userId", Name.adminId,params.row.taskTitle);
        handleUpdate(id, "userName", Name.name,params.row.taskTitle);
      } else {
        handleUpdate(id, field, newValue,params.row.taskTitle);
      }
    };

    const NewColumn =
      field === "status"
        ? [...statusOptions]
        : field === "userName"
        ? [...UserName]
        : [...priorityOptions];

    return (
      <Select
        value={value}
        onChange={handleChange}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        IconComponent={null}
      >
        {NewColumn.map((role, index) => (
          <MenuItem
            disabled={
              field === "status" || isAdmin
                ? false
                : field === "userName" ||
                  !isEligible ||
                  (!isEligible && field === "priority")
            }
            key={index}
            value={role.value}
          >
            {field === "userName" ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "7vw",
                    fontSize: "13px",
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    
                  }}
                >
                  {role.name}
                </span>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  width: "7vw",
                  fontSize: "13px",
                  paddingY: "2px",
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  border: `1px solid ${role.gradient}`,
                  color: "#ffff",
                  backgroundImage: role.gradient,
                }}
              >
                <span style={{ marginTop: "5px" }}>{role.icon}</span>
                <span>{role.name}</span>
              </Box>
            )}
          </MenuItem>
        ))}
      </Select>
    );
  };

  // const DatePickerComp = (params) => {
  //   const { id, field, value } = params;
  //   const handleAccept = (newValue) => {
  //     handleUpdate(id, field, newValue);
  //     setAnchorEl(null);
  //   };

  //   return (
  //     <Box>
  //       <LocalizationProvider dateAdapter={AdapterDayjs}>
  //         <Box>
  //           <MobileDatePicker
  //             sx={{
  //               "& .MuiOutlinedInput-notchedOutline": {
  //                 border: "none",
  //               },
  //               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //                 border: "none",
  //               },
  //             }}
  //             defaultValue={dayjs(params.row.dueDate)}
  //             onAccept={handleAccept}
  //             renderInput={(params) => <TextField {...params} />}
  //           />
  //         </Box>
  //       </LocalizationProvider>
  //     </Box>
  //   );
  // };

  const PopOver = (params) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [textValue, setTextValue] = useState(null);
    const { id, field, value } = params;

    const handleChangeText = (event) => {
      setTextValue(event.target.value);
    };

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setTextValue(value);
    };

    const handleCloseText = () => {
      if (textValue !== null && textValue !== "") {
        handleUpdate(id, field, textValue,params.row.taskTitle);
      }
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const ids = open ? "simple-popover" : undefined;

    return (
      <div>
        <div
          onClick={(e) => handleClick(e)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "50px",
            cursor: "pointer",
            textWrap: "wrap",
          
          }}
        >
          <Typography
            style={{
       
                display: "inline-block",
                width: "7vw",
                fontSize: "13px",
                textAlign: "center",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
             
       
            }}
          >
            {params.row[field]}
          </Typography>
        </div>
        <Popover
          id={ids}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseText}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <textarea
            style={{
              border: "none",
              focused: "none",
              resize: "none",
              width: "15vw",
              height: "20vh",
              padding: "10px",
            }}
            onChange={handleChangeText}
            onFocus={(e) => (e.target.style.outline = "none")}
            onBlur={(e) => (e.target.style.outline = "")}
            value={textValue}
          ></textarea>
        </Popover>
      </div>
    );
  };

  const MobileTimePicker = (params) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { id, field, value } = params;

    const defaultValue =
      field === "dueDate" ? params.row.dueDate : params.row.warningTime;

    const handleOpen = (e) => {
      setAnchorEl(true);
    };

    const handleClose = () => {
      setAnchorEl(false);
    };

    const handleAccept = (value,taskTitle) => {
      const newDate = new Date(value);
      newDate.setSeconds(0, 0);
      const isoString = newDate.toISOString();
      handleUpdate(id, field, isoString,params.row.taskTitle);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} onClick={handleOpen}>
        <Box display="flex" flexDirection="column" gap={2}>
          <MobileDateTimePicker
            defaultValue={dayjs(defaultValue)}
            onAccept={handleAccept}
            renderInput={(params) => <TextField {...params} />}
            onClose={handleClose}
            open={anchorEl}
            disablePast
            ampm={false}
            sx={{
                                    
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiInputBase-input": {
                fontSize: "13px", // Adjust font size here
                textAlign: "center",
          
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    );
  };

  // Column definitions
  const columns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.1,
      minWidth: 20,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "taskTitle",
      headerName: "Task",
      flex: 0.1,
      minWidth: 200,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {" "}
          <PopOver {...params} />{" "}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => <RoleSelect {...params} />,
    },
    {
      field: "userName",
      headerName: "Assignee To",
      flex: 0.1,
      minWidth: 150,
      maxWidth: 250,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => <RoleSelect {...params} />,
    },
    {
      field: "assigneeBy",
      headerName: "Assignee By",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => FindName(params.value),
    },
    {
      field: "dueDate",
      headerName: "Due date & time",
      flex: 0.1,
      minWidth: 220,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => <MobileTimePicker {...params} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => <RoleSelect {...params} />,
    },
    {
      field: "description",
      headerName: "Summary",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {" "}
          <PopOver {...params} />{" "}
        </Box>
      ),
    },
    {
      field: "warningTime",
      headerName: "Alarm",
      flex: 0.1,
      minWidth: 220,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => <MobileTimePicker {...params} />,
    },

    {
      field: "file",
      headerName: "File",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const file = params.row;
        return (
          <Button onClick={() => handlePreviewOpen({ file })}>View</Button>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      flex: 0.1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const id = params.row.id;
        const title = params.row.taskTitle;
        const isEligible = params.row.assigneeBy === adminid;

        return (
          <Button
            disabled={isAdmin ? false : !isEligible}
            onClick={() => handleDeleteByid(title, id)}
          >
            <DeleteIcon
              sx={{
                cusrsor: "poiner",
                color: "black",
                "&:hover": {
                  color: "red",
                },
              }}
            />
          </Button>
        );
      },
    },
  ];

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Task Schedule`));
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 0, width: "100%", overflowY: "hidden" }}
    >
      <DrawerHeader />

      {/* <Header Name={"Proforma List"} /> */}

      {/* Add the DataGrid */}
      <Box id="filter-panel" />
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          "& .super-app-theme--header": {
            background: "#eee",
            color: "black",
            textAlign: "center",
          },
          "& .vertical-lines .MuiDataGrid-cell": {
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          initialState={{
            filter: {
              filterModel: {
                items: ["Group"],
                quickFilterExcludeHiddenColumns: true,
              },
            },
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
      {/* {previewDialOpen && (
        <PreviewDial
          open={previewDialOpen}
          setOpen={setPreviewDialOpen}
          details={details}
        />
      )} */}

      {OpenAddTask && (
        <AddTaskDial
          open={OpenAddTask}
          handleOpenTask={handleOpenTask}
          handleClose={handleCloseTask}
          UserName={UserName}
          RoleSelect={RoleSelect}
          refetch={refetch}
          isAdmin={isAdmin}
          adminid={adminid}
          formateDateAndTime={formateDateAndTime}
        />
      )}

      {OpenFilePreview && (
        <FilePreviewDial
          details={details}
          open={OpenFilePreview}
          UserName={UserName}
          handleClose={handleCloseFile}
          refetch={refetch}
          adminid = {adminid}
        />
      )}
    </Box>
  );
};

export default TaskScheduledList;
