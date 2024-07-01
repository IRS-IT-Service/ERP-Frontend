import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Popover,
  Grid,
  styled,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import {
  useSendBulkMessagesWithPicMutation,
  useSendBulkWithoutMediaMutation,
  useAddScheduledTaskMessageMutation,
  useGetAllScheduleMessageQuery,
  useDeleteScheduledTaskMutation,
} from "../../features/api/whatsAppApiSlice";
import TextEditor from "../../Pages/BulkMessage/Components/TextEditor";
import NoImage from "../../assets/Noimage.jpeg";
import CancelIcon from "@mui/icons-material/Cancel";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import chatBg from "../../../public/ChatBackground.jpeg";
import dscImage from "../../../public/dscImage.jpg";
import { formatDateForWhatsApp } from "../../commonFunctions/commonFunctions";
import { formatTime } from "../../commonFunctions/commonFunctions";
import CountDown from "./Components/CountDown";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetAllClientQuery,
} from "../../features/api/clientAndShipmentApiSlice";

const columns = [
  { field: "sn", headerName: "ID", width: 90 },
  {
    field: "CustomerName",
    headerName: "Customer Name /Group Name",
    flex:1,
    width: 180,
    editable: true,
  },
  // {
  //   field: "CompanyName",
  //   headerName: "Company Name",
  //   headerClassName: "super-app-theme--header",
  //   cellClassName: "super-app-theme--cell",
  //   flex: 0.3,
  //   width: 210,
  // },
  {
    field: "CustomerNumber",
    headerName: "Mobile No",
    width: 150,
    editable: true,
  },
  // {
  //   field: "Address",
  //   headerClassName: "super-app-theme--header",
  //   cellClassName: "super-app-theme--cell",
  //   flex: 0.3,
  //   headerName: "Address",
  //   width: 250,
  // },
];

const PreviewChat = () => {
  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();

  const [sendMsgText, { isLoading: sendMsgTextLoading }] =
    useSendBulkWithoutMediaMutation();

  const [scheduledTask, { isLoading: scheduledTaskLoading }] =
    useAddScheduledTaskMessageMutation();

  const {
    data,
    isLoading: GetScheduledTaskLoading,
    refetch,
  } = useGetAllScheduleMessageQuery();

  const [DeleteTask, { isLoading: DeleteTaskTaskLoading }] =
    useDeleteScheduledTaskMutation();

  const { data: clientData, refetch: clientrefetch } = useGetAllClientQuery();

  const [selectedDate, setSelectedDate] = useState();

  const [anchorEl, setAnchorEl] = useState(false);

  const [message, setMessage] = useState("");
  const [whatsmessage, setWhatsMessage] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ConversionType, setConversionType] = useState("Media");
  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
    setFileUploaded(true);
    setFile(file);
  };
  const [editorContent, setEditorContent] = useState("");

  //File upload
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  

  function convertHtmlToWhatsAppFormat(html) {
    // Replace bold tags with WhatsApp bold format
    html = html.replace(/<strong>(.*?)<\/strong>/gi, "*$1*");
    html = html.replace(/<b>(.*?)<\/b>/gi, "*$1*");

    // Replace italic tags with WhatsApp italic format
    html = html.replace(/<em>(.*?)<\/em>/gi, "_$1_");
    html = html.replace(/<i>(.*?)<\/i>/gi, "_$1_");

    // Replace strikethrough tags with WhatsApp strikethrough format
    html = html.replace(/<del>(.*?)<\/del>/gi, "~$1~");
    html = html.replace(/<s>(.*?)<\/s>/gi, "~$1~");

    // Replace monospace tags with WhatsApp monospace format
    html = html.replace(/<code>(.*?)<\/code>/gi, "```$1```");
    html = html.replace(/<pre>(.*?)<\/pre>/gi, "```$1```");

    // Handle bulleted lists
    html = html.replace(
      /<ul>\s*(<li>.*?<\/li>)\s*<\/ul>/gi,
      function (match, p1) {
        return p1.replace(/<li>(.*?)<\/li>/gi, "• $1\n");
      }
    );

    // Handle numbered lists
    html = html.replace(
      /<ol>\s*(<li>.*?<\/li>)\s*<\/ol>/gi,
      function (match, p1) {
        let index = 1;
        return p1.replace(/<li>(.*?)<\/li>/gi, function (match, p1) {
          return index++ + ". " + p1 + "\n";
        });
      }
    );

    // Handle line breaks
    html = html.replace(/<br\s*\/?>/gi, "\n");

    // Remove any remaining HTML tags
    html = html.replace(/<\/?[^>]+(>|$)/g, "");

    return html.trim();
  }

  function whatsappToHTML(text) {
    // Replace WhatsApp bold format with HTML bold tags
    text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

    // Replace WhatsApp italic format with HTML italic tags
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");

    // Replace WhatsApp strikethrough format with HTML strikethrough tags
    text = text.replace(/~(.*?)~/g, "<del>$1</del>");

    // Replace WhatsApp monospace format with HTML code tags
    text = text.replace(/```(.*?)```/g, "<code>$1</code>");

    // Handle bulleted lists
    text = text.replace(/^•\s*(.*)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
    text = text.replace(/<\/li>\n<li>/g, "</li><li>");

    // Handle numbered lists
    text = text.replace(/^\d+\.\s*(.*)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>\n?)+/g, "<ol>$&</ol>");
    text = text.replace(/<\/li>\n<li>/g, "</li><li>");

    // Handle line breaks
    text = text.replace(/\n/g, "<br>");

    return text.trim();
  }

  const handleClick = () => {
    setAnchorEl(true);
  };

  useEffect(() => {
    const whatsappText = convertHtmlToWhatsAppFormat(editorContent);
    setConvertedText(whatsappText);
  });

  const handleSend = async () => {
    const customerNumber = ["9205777123"];

    try {
      // if (!file || !message) {
      //   return toast.error("Please provide both field");
      // }
      const formdata = new FormData();
      formdata.append("message", convertedText);
      formdata.append("file", file);
      formdata.append("contacts", JSON.stringify(customerNumber));

      const Info = {
        message: convertedText,
        contacts: JSON.stringify(customerNumber),
      };

      if (ConversionType === "Text") {
        await sendMsgText(Info).unwrap();
      } else {
        const res = await sendMsg(formdata).unwrap();
      }

      setFileUploaded(false);
      setSelectedDate(null);
      setImagePreview(null);
      setFile(null);
      setMessage(null);
      setEditorContent("");
      setConvertedText(null);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };
  console.log()

  useEffect(() => {
    if (clientData?.message === "Customer Successfully fetched") {
      const row = clientData?.data.map((item, index) => {
        return {
          ...item,
          id: item._id,
          sn: index + 1,
        };
      });

      setRows(row);
      refetch();
    }
  }, [clientData]);

  const handleAccept = async (value, context) => {
    const customerNumber = ["9205777123"];
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    const isoString = newDate.toISOString();
    let Newvalue = {};

    try {
      const formdataText = new FormData();
      formdataText.append("message", convertedText);
      formdataText.append("contacts", JSON.stringify(customerNumber));
      formdataText.append("scheduledTime", isoString);
      formdataText.append("Type", ConversionType);

      const formdataMedia = new FormData();
      formdataMedia.append("message", convertedText);
      formdataMedia.append("file", file);
      formdataMedia.append("contacts", JSON.stringify(customerNumber));
      formdataMedia.append("scheduledTime", isoString);
      formdataMedia.append("Type", ConversionType);

      if (ConversionType === "Media") {
        if (!file || !convertedText || customerNumber.length === 0) {
          return toast.error("Please provide both field");
        }
        Newvalue = formdataMedia;
      } else {
        if (!convertedText) {
          return toast.error("Please provide Text");
        }
        Newvalue = formdataText;
      }
      const result = await scheduledTask(Newvalue).unwrap();

      toast("Successfully scheduled");
      setFileUploaded(false);
      setSelectedDate(null);
      setImagePreview(null);
      setFile(null);
      setMessage();
      setEditorContent("");
      setConvertedText(null);
      refetch();
    } catch (err) {
      console.log(err);
    }

    setSelectedDate(newDate);
    // You can add any additional logic here
  };

  const handleDeleteScheduledMessage = async (taskId) => {
    console.log(taskId);
    try {
      await DeleteTask(taskId);
      toast("Successfully deleted scheduled message");
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMouseEnter = (item) => {
    if (data?.data.length > 0) {
     
     const WhatsappTohtml = whatsappToHTML(item.message);
      setWhatsMessage(WhatsappTohtml);
      setConversionType(item.Type)
      if(ConversionType === "Media"){
        setImagePreview(item.image?.url);

      }
    }
  };

  const handleMouseLeave = () => {
    setWhatsMessage(null);
    setImagePreview(null);
  };

  const handleChangeType = (e, value) => {
    if (value !== null) {
      setConversionType(value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "10px",

        boxShadow: "2px 2px 5px 5px #eee",
         
      }}
    >
      <Box
        sx={{
          display: "flex",
         justifyContent: "center",
         width: "100%",
          gap: "20px",
    

        }}
      >
        <Box
          sx={{
            marginTop: "2rem",
        
          }}
        >
          <ToggleButtonGroup
            value={ConversionType}
            exclusive
            sx={{
              width: "200px",
              height: "50px",
              border: "none",
              borderRadius: "0.2rem",
              padding: "0.2rem",
              color: "#fff",

              "& .Mui-selected": {
                color: "#fff !important",
                background: "black !important",
              },
            }}
            onChange={handleChangeType}
            aria-label="Platform"
          >
            <ToggleButton
              value="Media"
              sx={{
                color: "black",
                border: "0.5px solid black",
                fontSize: "0.6rem",
              }}
            >
              Text with Media
            </ToggleButton>
            <ToggleButton
              value="Text"
              sx={{
                color: "black",
                border: "0.5px solid black",
                fontSize: "0.6rem",
              }}
            >
              Only Text
            </ToggleButton>
          </ToggleButtonGroup>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Box
                sx={{
                  width: "17vw",
                  height: "30vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  overflow: "hidden",
                  padding: "5px",
                }}
              >
                <div style={{ width: "100%", height: "100%" }}>
                  <img
                    src={imagePreview || NoImage}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </Box> */}

            <Box
              sx={{
                width: "17vw",
                "& .ql-container": {
                  height: "300px",
                },
                "& .ql-editor": {
                  height: "100%",
                },
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
              }}
            >
              <TextEditor
                setEditorContent={setEditorContent}
                editorContent={editorContent}
              />
            </Box>
            {ConversionType === "Media" &&  <Button
              component="label"
              size="small"
              sx={{ width: "50%" }}
              variant="contained"
              startIcon={<CloudUploadIcon />}
              style={{
                backgroundColor: fileUploaded ? "green" : undefined,
              }}
            >
              {fileUploaded ? "File Uploaded" : "Upload File"}
              <input type="file" hidden onChange={handleFileUpload} />
            </Button> }
          </Box>

          <Box sx={{ display: "flex",marginTop:ConversionType === "Text" ? "3.2rem" : "" }}>
            <Button
              variant="outlined"
              disabled={
                sendMsgLoading || sendMsgTextLoading || scheduledTaskLoading
              }
              onClick={handleSend}
              sx={{ margin: "4px", width: "50%" }}
            >
              {sendMsgLoading || sendMsgTextLoading ? (
                <CircularProgress size={30} />
              ) : (
                "Send"
              )}
            </Button>
            <Button
              variant="outlined"
              disabled={sendMsgLoading || sendMsgTextLoading}
              onClick={handleClick}
              sx={{ margin: "4px", width: "50%" }}
            >
              {scheduledTaskLoading ? (
                <CircularProgress size={30} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  Schedule
                  <ScheduleSendIcon />
                </Box>
              )}
            </Button>
          </Box>

          <Box
            sx={{
              display: "none",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDateTimePicker
                defaultValue={dayjs(Date.now())}
                onAccept={handleAccept}
                renderInput={(params) => <TextField {...params} />}
                onClose={handleClose}
                open={Boolean(anchorEl)}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundImage: `url(${chatBg})`,
            height: "60vh",
            width: "30vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #eee",
            borderRadius: "10px",
            overflow: "auto",
            paddingY: "5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              border: "2px solid #eee",
              padding: "2px",
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: 1,
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: ConversionType === "Text" ? "calc(45vw - 20vw)" : "18vw",
                height: "auto",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
             {ConversionType === "Media" && <div style={{ width: "100%", marginBottom: "5px" }}>
                <img
                  src={imagePreview || NoImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "10px",
                    background: "#fff",
                  }}
                />
              </div> }
              <div
                style={{
                  fontSize: "15px",
                  padding: "10px 5px 20px 2px",
                  textAlign: "start",
                  width: "100%",
                  listStyleType: "disc",
                }}
              >
                {" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: editorContent || whatsmessage,
                  }}
                />
              </div>
            </Box>

            <Box>
              <p
                style={{
                  fontSize: "0.8rem",
                  position: "absolute",
                  bottom: 10,
                  right: 8,
                  color: "grey",
                }}
              >
                {formatTime(new Date())}
              </p>
            </Box>
          </Box>
         
        </Box>
  
          <Box sx={{ height: "60vh",width:"50%" ,overflow:"hidden" }}>
            <DataGrid
              rows={[]}
              columns={columns}
              // loading={getloading}
              rowHeight={50}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 50,
                  },
                },
              }}
              pageSizeOptions={[50]}
              checkboxSelection
              disableRowSelectionOnClick
              // onRowSelectionModelChange={handleSelectionChange}
            />
          </Box>
 
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          marginTop: "50px",
          // boxShadow: "2px 1px 4px 2px grey",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            {data?.data?.map((item, index) => (
              <Grid item md={3} lg={1.5} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #cccc",
                    gap: "10px",
                    padding: "5px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
                    "&:hover": {
                      boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Box sx={{ width: "70px" }}>
                    <img
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "50%",
                      }}
                      src={item.image?.url || NoImage}
                      alt="item"
                    />
                  </Box>
                  <Box>
                    <CountDown
                      targetDate={item.scheduledTime}
                      refetch={refetch}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "black",
                      padding: "10px",
                      "& :hover": {
                        backgroundColor: "red",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                      },
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteScheduledMessage(item._id)}
                  >
                    <CloseIcon
                      sx={{
                        fontSize: "15px",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PreviewChat;
