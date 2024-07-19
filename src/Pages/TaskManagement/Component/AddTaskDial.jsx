import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ReportIcon from "@mui/icons-material/Report";
import { toast } from "react-toastify";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import { useCreateTaskMutation } from "../../../features/api/taskManagementApiSilce";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "600px",
  },
}));

const statusOptions = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "inprogress" },
  { label: "Done", value: "done" },
];

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
      "linear-gradient(to right top, #b71c1c, #971219, #790914, #5b040e, #3f0101)",
    icon: <ReportIcon />,
  },
];

const AddTaskDial = ({
  open,
  handleClose,
  UserName,
  refetch,
  adminid,
  isAdmin,
  formateDateAndTime,
}) => {
  const [formState, setFormState] = useState({
    userName: null,
    taskTitle: "",
    description: "",
    priority: "Low",
    file: null,
    dueDate: dayjs(new Date()),
    fileUploaded: false,
  });

 

  const [createTask, { isLoading: createTaskLoading }] =
    useCreateTaskMutation();
  const socket = useSocket();

  const AssineeBy = UserName.find((item) => item.adminId === adminid);
  const ContactNo = UserName.find((item) => item.adminId === (formState.userName?.adminId || AssineeBy.adminId));
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const handleSubmit = async () => {
    try {
      const newDate = new Date(formState.dueDate);
      newDate.setSeconds(0, 0);
      const isoString = newDate.toISOString();
      let userId = formState.userName?.adminId || AssineeBy.adminId;
      let userName = formState.userName?.name || AssineeBy.name;

      const formDataQuery = new FormData();
      formDataQuery.append("userId", userId);
      formDataQuery.append("userName", userName);
      formDataQuery.append("taskTitle", formState.taskTitle);
      formDataQuery.append("description", formState.description);
      formDataQuery.append("priority", formState.priority);
      formDataQuery.append("dueDate", isoString);
      formDataQuery.append("file", formState.file);
      formDataQuery.append("assigneeBy", AssineeBy.adminId);

   
      const result = await createTask(formDataQuery).unwrap();
      toast.success(`Task create successfully`);

      const liveStatusData = {
        message: `${AssineeBy.name} assigned the task ${formState.taskTitle}
        to ${
          formState.userName?.name || "Self"
        } with a due date & time of ${formateDateAndTime(formState.dueDate)}.`,
        time: new Date(),
        UserID:userId,
      };
      socket.emit("TASK_ADDED", liveStatusData);
      const whatsappMessage = {
        message: liveStatusData.message,
        contact: import.meta.env.VITE_ADMIN_CONTACT,
      };
      const whatsappMessageUser = {
        message: liveStatusData.message,
        contact: +ContactNo.contact ,
      };

      
      await sendMessageToAdmin(whatsappMessage).unwrap();
      await delay(500);
      await sendMessageToAdmin(whatsappMessageUser).unwrap();

      refetch();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserNameChange = (event, newValue) => {
    setFormState((prevState) => ({
      ...prevState,
      userName: newValue,
    }));
  };

  const handlePriorityChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      priority: event.target.value,
    }));
  };

  const handleStatusChange = (event) => {
    setFormState((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        fileUploaded: true,
        file: file,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        fileUploaded: false,
      }));
    }
  };

  const RoleSelect = ({ value, setFormState }) => {
    const handleChange = (event) => {
      const newValue = event.target.value;
      const Name = UserName?.find((item) => item.value === newValue);
      setFormState((prevState) => ({
        ...prevState,
        priority: newValue,
      }));
    };

    return (
      <Select
        value={value}
        onChange={handleChange}
        sx={{
          width: "100%",
        }}
      >
        {priorityOptions.map((role, index) => (
          <MenuItem key={index} value={role.value}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                padding: "1px 10px",
                gap: "10px",
                borderRadius: "4px",
                fontSize: "12px",
                border: `1px solid ${role.gradient}`,
                color: "#ffff",
                backgroundImage: role.gradient,
              }}
            >
              <span style={{ marginTop: "5px" }}>{role.icon}</span>
              <span>{role.name}</span>
            </Box>
          </MenuItem>
        ))}
      </Select>
    );
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Add Task
            </Typography>
          </Box>
          <CloseIcon
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              background: "#32a852",
              color: "#fff",
              borderRadius: "5rem",
              padding: ".1rem",
            }}
          />
        </Box>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "100%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isAdmin && (
              <Autocomplete
                options={UserName}
                getOptionLabel={(option) => option.name}
                value={formState.userName}
                onChange={handleUserNameChange}
                renderInput={(params) => (
                  <TextField {...params} label="User Name" />
                )}
              />
            )}
            <TextField
              label="Task Title"
              name="taskTitle"
              value={formState.taskTitle}
              onChange={handleInputChange}
            />
            <TextField
              label="Summary"
              name="description"
              value={formState.description}
              multiline
              rows={4}
              onChange={handleInputChange}
            />
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                  Priority
                </Typography>
                <RoleSelect
                  field="priority"
                  value={formState.priority}
                  setFormState={setFormState}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                  Due date & Time
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    value={formState.dueDate}
                    disablePast
                    ampm={false}
                    onChange={(newValue) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        dueDate: newValue,
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{
                      padding: 0,
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                border: "2px dashed grey",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: formState.fileUploaded
                  ? "#e0ffe0"
                  : "transparent", // Change background color on file upload
                "&:hover": {
                  borderColor: "blue",
                },
              }}
            >
              <input
                type="file"
                accept=".pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .png, .jpg, .jpeg"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  opacity: 0,
                  position: "relative",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  {formState.fileUploaded ? "File Uploaded" : "click to upload"}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              disabled={createTaskLoading}
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              {createTaskLoading ? (
                <CircularProgress size="25px" sx={{ color: "#fff" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Paper>
      </DialogContent>
    </StyledDialog>
  );
};

export default AddTaskDial;
