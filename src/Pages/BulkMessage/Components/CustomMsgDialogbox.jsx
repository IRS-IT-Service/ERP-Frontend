import React, { useEffect, useState } from "react";
import {
  styled,
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import {
  useSendBulkMessagesWithPicMutation,
  useSendBulkWithoutMediaMutation,
  useAddScheduledTaskMessageMutation,
} from "../../../features/api/whatsAppApiSlice";

import TextEditor from "./TextEditor";
import NoImage from "../../../assets/Noimage.jpeg";
import CancelIcon from "@mui/icons-material/Cancel";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

// import { Value } from 'slate';
const CustomMsgDialogbox = ({
  msgDialogbox,
  handleCloseMsgDialogbox,
  sendingType,
  title,
  customerNumber,
  setCustomerNumber,
}) => {
  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();

  const [sendMsgText, { isLoading: sendMsgTextLoading }] =
    useSendBulkWithoutMediaMutation();

  const [scheduledTask, { isLoading: scheduledTaskLoading }] =
    useAddScheduledTaskMessageMutation();

  const [selectedDate, setSelectedDate] = useState();

  const [anchorEl, setAnchorEl] = useState(false);

  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
        return p1.replace(/<li>(.*?)<\/li>/gi, "* $1\n");
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
  const handleClick = () => {
    setAnchorEl(true);
  };

  const whatsappText = convertHtmlToWhatsAppFormat(editorContent);

  // const processContent = (html) => {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(html, 'text/html');

  //   const textParts = [];
  //   const imageUrls = [];

  //   // Extract text content
  //   const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
  //   while (walker.nextNode()) {
  //     textParts.push(walker.currentNode.nodeValue.trim());
  //   }

  //   // Extract image URLs
  //   const images = doc.getElementsByTagName('img');
  //   for (let img of images) {
  //     imageUrls.push(img.src);
  //   }

  //   const text = textParts.join(' ').trim();
  //   console.log('Text:', text);
  //    console.log('Images:', imageUrls);

  // };

  // useEffect(()=>{
  //   if(editorContent){
  //     processContent(editorContent);
  //   }
  // },[editorContent])
  const handleSend = async () => {
    console.log(whatsappText)
    try {
      // if (!file || !message) {
      //   return toast.error("Please provide both field");
      // }
      const formdata = new FormData();
      formdata.append("message", whatsappText);
      formdata.append("file", file);
      formdata.append("contacts", JSON.stringify(customerNumber));

      const Info = {
        message: whatsappText,
        contacts: JSON.stringify(customerNumber),
      };
      if (sendingType === "Text") {
        const res = await sendMsgText(Info).unwrap();
      } else {
        const res = await sendMsg(formdata).unwrap();
      }

      toast("Successfully Send message");
      handleCloseMsgDialogbox();
      setMessage();
      setFile(null);
      setCustomerNumber([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (value, context) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    const isoString = newDate.toISOString();

    console.log(isoString);

    try {
      if (!file || !whatsappText || customerNumber.length === 0) {
        return toast.error("Please provide both field");
      }
      const formdata = new FormData();
      formdata.append("message", whatsappText);
      formdata.append("file", file);
      formdata.append("contacts", JSON.stringify(customerNumber));
      formdata.append("scheduledTime", isoString);
      const result = await scheduledTask(formdata).unwrap();
      toast("Successfully scheduled");
      handleCloseMsgDialogbox();
      setMessage();
      setFile(null);
      setCustomerNumber([]);
    } catch (err) {
      console.log(err);
    }

    setSelectedDate(newDate);
    // You can add any additional logic here
  };
  const openPop = Boolean(anchorEl);
  const idPop = openPop ? "simple-popover" : undefined;

  return (
    <Box>
      <Dialog open={msgDialogbox} onClose={handleCloseMsgDialogbox}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            paddingTop: ".5rem",
            paddingX: ".7rem",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              flex: "1",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {title}
          </Typography>
          <CancelIcon onClick={handleCloseMsgDialogbox} />
        </Box>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-around",
          }}
        ></DialogTitle>

        <DialogContent>
          <Box
            sx={{
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {sendingType === "Link" && (
                <TextField
                  label=" Link"
                  variant="outlined"
                  sx={{ width: "100%", marginTop: "12px", width: "30vw" }}
                  name="Link"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
              )}
              {sendingType === "Text" && (
                <textarea
                  style={{
                    width: "30vw",
                    height: "20vh",
                    resize: "none",
                    paddingTop: 5,
                    textIndent: "20px",
                  }}
                  value={message}
                  // minRows={8}
                  placeholder="Enter your message"
                  aria-label="maximum height"
                  onChange={(e) => setMessage(e.target.value)}
                />
              )}
              {sendingType === "File" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
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
                  </Box>
                  {/* <textarea
                    style={{
                      width: "15.5vw",
                      height: "20vh",
                      resize: "none",
                      paddingTop: 5,
                      // textIndent: "20px",
                    }}
                    value={message}
                    // minRows={8}
                    placeholder="Enter your message"
                    aria-label="maximum height"
                    onChange={(e) => setMessage(e.target.value)}
                  /> */}
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
                  <Button
                    component="label"
                    sx={{ width: "50%" }}
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    style={{
                      backgroundColor: fileUploaded ? "green" : undefined,
                    }}
                  >
                    {fileUploaded ? "File Uploaded" : "Upload File"}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
              )}
              <Box sx={{ display: "flex" }}>
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
                    <Box sx={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}>
                      Schedule
                      <ScheduleSendIcon />
                    </Box>
                  )}
                </Button>
                {/* <Popover
          id={idPop}
            open={openPop}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "left",
              horizontal: "right",
            }}
          >
<Box>
  
  <Typography sx={{
    display: "flex",
    gap:"10px",
    alignItems: "center",
    width: "100%",
    height: "100%",
   fontSize: "14px",
    fontWeight: "bold",
    margin: "5px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "#FFB822",
    color: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "#FFA500",
    },
    "&:focus": {
      backgroundColor: "#FFA500",
    },
    "&:active": {
      backgroundColor: "#FF9900",
    },
  }}> <ScheduleSendIcon /> Pick a date and time </Typography>
  
 
 


</Box>

          </Popover> */}

                <Box
                  sx={{
                    display: "none",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  {" "}
                  {/* Day.js */}
                  {/* Day.js */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker
                      defaultValue={dayjs(Date.now())}
                      onAccept={handleAccept}
                      renderInput={(params) => <TextField {...params} />}
                      onClose={handleClose}
                      open={anchorEl}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomMsgDialogbox;
