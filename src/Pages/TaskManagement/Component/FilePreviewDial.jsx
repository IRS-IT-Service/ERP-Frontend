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
  Grid
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
import excel from "../../../assets/DrivePNG/excel.png";
import image from "../../../assets/DrivePNG/image.png";
import pdf from "../../../assets/DrivePNG/pdf.png";
import unknown from "../../../assets/DrivePNG/unknown.png";
import word from "../../../assets/DrivePNG/word.png";
import txt from "../../../assets/DrivePNG/txt.jpg";
import { formateDateAndTime } from "../../../commonFunctions/commonFunctions";
import { useCreateTaskMutation } from "../../../features/api/taskManagementApiSilce";

import {
    useGetAllTasksManagementQuery,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
  } from "../../../features/api/taskManagementApiSilce";

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
let fileName = ""
const FilePreviewDial = ({ open, handleClose, details, refetch ,FindName }) => {

const [loading, setLoading] = useState(false);
const [formState, setFormState] = useState({
     file:null,
     fileUploaded: false,
  });




const [updateData, { isLoading: UpdateLoading }] = useUpdateTaskMutation();

  function getFileExtension(filename) {
  
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        return image;
      case "pdf":
        return pdf;
      case "csv":
      case "xlsx":
        return excel;
      case "docx":
        return word;
      case "txt":
        return txt;

      default:
        return unknown;
    }
  }

  const handleUpdate = async () => {
    const id = details.file.id;
    const fileData = formState.file

    try {
      const formDataQuery = new FormData();
      formDataQuery.append("id", id);
      formDataQuery.append("file", fileData);

      const info = {
        query: "file",
        body: formDataQuery,
      };

      const result = await updateData(info).unwrap();
      toast.success(`File updated successfully`);
      refetch();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const getFilenameFromUrl = (url) => {
   if(!url){
    return
   }

    const pathSegments = url.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return decodeURIComponent(lastSegment);
  };

  const DownloadButton = ({ url , setFilename }) => {
    // Function to extract filename from URL
    if(!url){
      return "No file or image has been uploaded !"
    }
 

    // const filename = getFilenameFromUrl(url);
    
   const handleDownload = () => {
      setLoading(true);
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setLoading(false);
          })
          .catch(error => console.error('Error downloading file:', error));
      };
    
      return (
        <Button
          variant="contained"
          size="small"
          sx={{
            background:"#d51157",

          }}
          onClick={handleDownload}
         
        >
             {loading ? (<CircularProgress size="25px" sx={{ color: "#fff" }} />
            ) : (
              "Click to download"
            )}
        </Button>
      );
    };


  const FilePreview = ({ filename, file }) => {
    if(!file){
      return
    }
    const parts = file?.split(".");
    const extension = parts[parts?.length - 1];

    const extensionFile = () => {
      switch (extension) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
          return "image";
        case "pdf":
          return "pdf";
        default:
          return "unknown";
      }
    }

    const fileType = extensionFile();

    if (fileType === "image") {
      return (
        <Box
          sx={{
            height: "90%",
            width: "100%",
          }}
        >
          <img
            alt={file}
            src={file}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              objectPosition: "center",
            }}
          />
          
        </Box>
      );
    } else if (fileType === "pdf") {
      return (
        <Box
          sx={{
            height: "90%",
            width: "100%",
          }}
        >
          {" "}
          <iframe
            title="Preview"
            style={{ width: "100%", height: "100%" }}
            src={file}
          />{" "}
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            height: "30%",
            width: "30%",
          }}
        >
          <img
            alt={file}
            src={getFileExtension(file)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              objectPosition: "center",
            }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {getFilenameFromUrl(file)}
          </Typography>
        </Box>
      );
    }
  };


  const extensionFile = (extension) => {
    switch (extension) {
      case "Notstarted":
     return "Not started";
      case "Inprogress":
        return "In progress";
      default:
        return extension;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (event.target.files.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        fileUploaded: true,
        file:file,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        fileUploaded: false,
      }));
    }
  };

 


  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      sx={{ backdropFilter: "blur(5px)" }}
      maxWidth="xl"
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
              Preview
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
            sx={{
              display: "flex",
              gap: "5px",
              width: "70vw",
              height: "70vh",
            }}
          >
            <Box
              sx={{
                flexBasis: "50%",
                borderRight:"2px solid gray"
              
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <FilePreview file={details?.file?.files.url} />
                <Typography variant="body2" fontSize={"12px"}>
                {getFilenameFromUrl(details?.file?.files.url)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {details?.file?.files.filename}
                </Typography>
                <DownloadButton url={details?.file?.files.url}  />
              </Box>
            </Box>
            <Box
              sx={{
                flexBasis: "50%",
                
              }}
            >
 <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>

          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Task Title:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {details.file.taskTitle}
          </Typography>
   
        </Paper>
        <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Summary:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {details.file.description}
          </Typography>
          </Paper>
          <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Due Date:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {formateDateAndTime(details.file.dueDate)}
          </Typography>
          </Paper>
          <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
  
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Assignee By:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {FindName(details.file.assigneeBy)}
          </Typography>
          </Paper>
          <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Assignee To:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {details.file.userName}
          </Typography>
          </Paper>
          <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Status:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {extensionFile(details.file.status)}
          </Typography>
          </Paper>
          <Paper elevation={3} sx={{p:1,width: '100%',display: 'flex',gap:"20px", mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Priority:
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            {details.file.priority}
          </Typography>
          </Paper>
          <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        border: '2px dashed grey',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: formState.fileUploaded ? "#e0ffe0" : "transparent", // Change background color on file upload
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
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          opacity: 0,
          position: 'relative',
        
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
      <Typography variant="body1" color="textSecondary">
                  {formState.fileUploaded
                    ? "File Uploaded"
                    : "click to upload"}
                </Typography>
      </Box>
   
   
   
 
  </Box>

    </Box>


            </Box>

          
          </Box>
        </Paper>
        <Box sx={{
            display: "flex",
            justifyContent: "center",
              alignItems: "center",
           width:"100%",
            mb: 2,
  
        }}>
      {formState.fileUploaded && <Button
              variant="contained"
              color="primary"
              disabled ={UpdateLoading}
              onClick={handleUpdate}
              sx={{ mt: 2 }}
            >
               {UpdateLoading ? (<CircularProgress size="25px" sx={{ color: "#fff" }} />
            ) : (
              "Upload"
            )}
            </Button>
}
            </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default FilePreviewDial;
