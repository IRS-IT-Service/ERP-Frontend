import React, { useEffect, useState, useRef } from "react";
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
import {
  useGetAllGroupInfoQuery,
  useDeleteGroupByIdMutation,
} from "../../features/api/marketingApiSlice";
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
import { Portal } from "@mui/base/Portal";
import Iphone from "../../../public/iphone.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useGetAllClientQuery } from "../../features/api/clientAndShipmentApiSlice";
import Nodata from "../../assets/error.gif";
import CachedIcon from "@mui/icons-material/Cached";
import { useSelector } from "react-redux";
import Addgroup from "./Addgroup";
import { ConstructionOutlined } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ScheduleIcon from '@mui/icons-material/Schedule';
const PreviewChat = () => {
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const textColor = themeColor.textColor;

  const [sendMsg, { isLoading: sendMsgLoading }] =
    useSendBulkMessagesWithPicMutation();

  const [sendMsgText, { isLoading: sendMsgTextLoading }] =
    useSendBulkWithoutMediaMutation();

  const [scheduledTask, { isLoading: scheduledTaskLoading }] =
    useAddScheduledTaskMessageMutation();

  const {
    data: GroupData,
    isLoading: useGetAllGroupQueryLoading,
    refetch: GroupRefetch,
  } = useGetAllGroupInfoQuery();

  const {
    data,
    isLoading: GetScheduledTaskLoading,
    refetch,
  } = useGetAllScheduleMessageQuery();

  const [DeleteTask, { isLoading: DeleteTaskTaskLoading }] =
    useDeleteScheduledTaskMutation();

  const [DeleteGroup, { isLoading: DeleteGroupLoading }] =
    useDeleteGroupByIdMutation();

  const {
    data: clientData,
    refetch: clientrefetch,
    isLoading: clientLoading,
  } = useGetAllClientQuery();

  const [selectedDate, setSelectedDate] = useState();

  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [whatsmessage, setWhatsMessage] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [grouprows, setGroupRows] = useState([]);
  const [ConversionType, setConversionType] = useState("Media");
  const [customerNumber, setCustomerNumber] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [OpenAddgroup, setOpenAddgroup] = useState(false);
  const [memberNumber, setMemberNumber] = useState([]);
  const [GroupInfo, setGroupInfo] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [popOver ,setPopover] = useState(null);
  const [addTitle,setTitle] = useState(null);
  const contentRef = useRef(null);
  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleClose_addgroup = () => {
    setOpenAddgroup(false);
  };

  const handleGroupView = (info) => {
    setGroupInfo(info);
    setOpenAddgroup(true);
  };

  const handleOpenpop = (event) => {
    console.log(event)
    setPopover(event.currentTarget);
  };

  const handleOpenpopClose = () => {
    setPopover(null);
  };

  const open = Boolean(popOver);
  const id = open ? 'simple-popover' : undefined;

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

    // Handle paragraph breaks
    // html = html.replace(/<\/p>\s*<p>/gi, '\n\n');
    // Add newline at the start of paragraphs
    html = html.replace(/<\/p>/gi, "\n");
    console.log(html);
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
    if(!addTitle){
      return toast.error("Title is required")
    }
    setAnchorEl(true);
    setPopover(null)
  };

  useEffect(() => {
    const whatsappText = convertHtmlToWhatsAppFormat(editorContent);
    console.log(whatsappText);
    setConvertedText(whatsappText);
  }, [editorContent]);

  const handleSend = async () => {
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
      setCustomerNumber([]);
      setSelectionModel([]);
      setMemberNumber([]);
      // window.location.reload();
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (clientData?.client.length > 0) {
      const row = clientData?.client.map((item, index) => {
        return {
          ...item,
          id: item._id,
          sn: index + 1,
          ContactName: item.ContactName,
        };
      });

      setRows(row);
      refetch();
    }

    if (GroupData?.data?.length > 0) {
      const grouprow = GroupData?.data.map((item, index) => {
        return {
          ...item,
          id: item._id,
          sn: index + 1,
          Members: item.Members,
        };
      });

      setGroupRows(grouprow);
      refetch();
    }
  }, [clientData, GroupData]);

  const handleAccept = async (value, context) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    const isoString = newDate.toISOString();
    let Newvalue = {};
    console.log(addTitle)

    try {
      const formdataText = new FormData();
      formdataText.append("title", addTitle);
      formdataText.append("message", convertedText);
      formdataText.append("contacts", JSON.stringify(customerNumber));
      formdataText.append("scheduledTime", isoString);
      formdataText.append("Type", ConversionType);

      const formdataMedia = new FormData();
      formdataMedia.append("title", addTitle);
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
      setCustomerNumber([]);
      setSelectionModel([]);
      setMemberNumber([]);
      setTitle(null)
      // window.location.reload();
      refetch();
    } catch (err) {
      console.log(err);
    }

    setSelectedDate(newDate);
    // You can add any additional logic here
  };



  const handleMouseEnter = (item) => {
    if (data?.data.length > 0) {
      const WhatsappTohtml = whatsappToHTML(item.message);
      setWhatsMessage(WhatsappTohtml);
      setConversionType(item.Type);
      if (ConversionType === "Media") {
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

  const handleSelectionChange = (selectionModel) => {
    let setPrevious = [];
    const finalData = rows.filter((row) => selectionModel.includes(row.id));
    const GroupData = grouprows.filter((row) =>
      selectionModel.includes(row.id)
    );

    const MembersData = GroupData.flatMap((item) => item.Members);

    const mergeValues = [...finalData, ...MembersData];
    const uniqueMembers = Array.from(new Set(MembersData)).map(
      (item) => item.ContactNumber
    );

    const Selectivevalue = mergeValues.flatMap((row) => {
      if (row.groupName) {
        const groupMembers = row.Members.map((item) => item.ContactNumber);

        setPrevious = [...setPrevious, ...groupMembers];
        return groupMembers;
      } else {
        return row.ContactNumber;
      }
    });
    const uniqueNumbers = Array.from(new Set(Selectivevalue));
    setMemberNumber(uniqueMembers);
    setCustomerNumber(uniqueNumbers);
    setSelectionModel(selectionModel);
  };

  // Delete group
  const handleError = (e, id) => {
    
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
          const result = await DeleteGroup(id).unwrap();
          toast.success("Group deleted successfully");
          GroupRefetch();
        } catch (error) {
          console.log(error);
        } finally {
          Swal.hideLoading(); // Hide loading spinner
        }
      }
    });
  };

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 308) {
        // Change this value to the specific height
        setShowReadMore(true);
      } else {
        setShowReadMore(false);
      }
    }
  }, [editorContent, whatsmessage]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const columns = [
    {
      field: "sn",
      headerName: "Sno.",
      flex: 0.1,
      minWidth: 10,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "ContactName",
      headerName: "Customer Name",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
      field: "ContactNumber",
      headerName: "Mobile No",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        if (params.row.groupName) {
          return (
            <Button onClick={() => handleGroupView(params.row)}>View</Button>
          );
        } else {
          {
            params.row.ContactNumber;
          }
        }
      },
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

  const columns2 = [
    {
      field: "sn",
      headerName: "Sno.",
      flex: 0.1,
      minWidth: 10,
      maxWidth: 50,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "groupName",
      headerName: "Group Name",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",

      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
      field: "groupDescription",
      headerName: "Group Description",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 400,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Members",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "No of members",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return params.row.Members.length;
      },
    },
    {
      field: "Edit",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Edit",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const id = params.row._id;

        return (
          <EditIcon
            onClick={() => navigate(`/AddGroupComp/${id}`)}
            sx={{
              cursor: "pointer",
              color: "#0d2e00",
              "&:hover": {
                color: "#040f00",
              },
            }}
          />
        );
      },
    },
    {
      field: "Action",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerName: "Action",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <DeleteIcon
          onClick={()=>handleError(params.row.groupName ,params.row._id)}
            sx={{
              cursor: "pointer",
              color: "#0d2e00",
              "&:hover": {
                color: "red",
              },
            }}
          />
        );
      },
    },
  ];

  function MyCustomToolbar1(prop) {
    return (
      <React.Fragment>
        <Portal container={() => document.getElementById("filter-panel1")}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <GridToolbarQuickFilter />
            <Button
              size="small"
              sx={{
                backgroundColor: "#32a852",
                color: "white",
                borderRadius: "5px",
                margin: "2px",
                "&:hover": {
                  backgroundColor: "#032b0e",
                },
              }}
              onClick={() => navigate(`/AddGroupComp`)}
            >
              Create Group
            </Button>
          </Box>
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </React.Fragment>
    );
  }

  function MyCustomToolbar2(prop) {
    return (
      <React.Fragment>
        <Portal container={() => document.getElementById("filter-panel2")}>
          <GridToolbarQuickFilter />
        </Portal>
        {/* <GridToolbar {...prop} /> */}
      </React.Fragment>
    );
  }

  return (
    <Box
      id="Main dev"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",

        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "2px 2px 5px 5px #eee",
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          overflow: "hidden",
          width: "100%",
          height: "82vh",
          gap: "20px",
        }}
      >
        <Box
          id="Main Iphone div"
          sx={{
            flexBasis: "20%",
          }}
        >
          <Box
            sx={{
              width: "20vw",
              borderRadius: "50px",
            }}
          >
            {/* inner layer of iphone */}

            <Box
              sx={{
                position: "relative",
              }}
            >
              <img
                src={Iphone}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  backgroundImage: `url(${chatBg})`,
                  width: "90%",
                  height: "96%",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: "auto",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "25px",
                  zIndex: -1,
                }}
              ></Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 30,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: "auto",
                  height: "84%",
                  width: "87%",
                  borderRadius: "10px",
                  overflow: "auto",
                  padding: 2,

                  zIndex: 100,
                }}
              >
                <Box
                  sx={{
                    marginTop: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    border: "2px solid #eee",
                    justifyContent: "center",
                    backgroundColor: "whitesmoke",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width:
                        ConversionType === "Text"
                          ? "calc(40vw - 20vw)"
                          : "100%",
                      maxHeight: isExpanded ? "auto" : "31rem",

                      overflow: "hidden",
                    }}
                  >
                    {ConversionType === "Media" && (
                      <div style={{ width: "100%", marginBottom: "5px" }}>
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
                      </div>
                    )}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "12px",
                        padding: "10px 5px 10px 2px",
                        textAlign: "start",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        listStyleType: "disc",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: editorContent || whatsmessage,
                        }}
                        ref={contentRef}
                      />
                    </div>
                  </Box>

                  <Box>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        position: "absolute",
                        bottom: 1,
                        right: 8,
                        color: "grey",
                      }}
                    >
                      {formatTime(new Date())}
                    </p>
                  </Box>
                  {showReadMore && (
                    <div onClick={toggleReadMore}>
                      <span
                        style={{
                          color: "#05175e",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {isExpanded ? "Read Less" : "... Read More"}
                      </span>
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          id="Main Text Editor dev"
          sx={{
            flexBasis: "20%",
            paddingTop: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* preview */}

            <Box
              sx={{
                width: "17vw",
                "& .ql-container": {
                  height: "435px",
                },
                "& .ql-editor": {
                  height: "100%",
                },
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "5px",
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
                {ConversionType === "Media" && (
                  <Button
                    component="label"
                    size="small"
                    sx={{ width: "40%", fontSize: "8px" }}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      backgroundColor: fileUploaded ? "green" : undefined,
                    }}
                  >
                    {fileUploaded ? "File Uploaded" : "Upload File"}
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                )}
              </Box>
              <TextEditor
                setEditorContent={setEditorContent}
                editorContent={editorContent}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                paddingX: "10px",
              }}
            >
              <Button
                variant="outlined"
                disabled={
                  sendMsgLoading ||
                  sendMsgTextLoading ||
                  scheduledTaskLoading ||
                  !customerNumber.length > 0
                }
                onClick={handleSend}
                sx={{ margin: "4px", width: "100%" }}
              >
                {sendMsgLoading || sendMsgTextLoading ? (
                  <CircularProgress size={30} />
                ) : (
                  "Send"
                )}
              </Button>
              <Button
                variant="outlined"
                disabled={
                  sendMsgLoading ||
                  sendMsgTextLoading ||
                  !customerNumber.length > 0
                }
                onClick={(event)=>handleOpenpop(event)}
                sx={{ margin: "4px", width: "100%" }}
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
          </Box>

          <Box
            sx={{
              display: "none",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" flexDirection="column" gap={2}>
                   <MobileDateTimePicker
                defaultValue={dayjs(Date.now())}
                onAccept={handleAccept}
                renderInput={(params) => <TextField {...params} />}
                onClose={handleClose}
                open={Boolean(anchorEl)}
                
              />
              </Box>
            </LocalizationProvider>
            <Popover
        id={id}
        open={open}
        anchorEl={popOver}
        onClose={handleOpenpopClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          background: "#f5f5f5",
          borderRadius: "5px",
          width: "250px",
          height: "100px",
        }}>
          <TextField
            size="small"
            label="Add Title"
            value={addTitle}
            onChange={(e)=>setTitle(e.target.value)}
            fullWidth
          />
          <Box sx={{
            display: "flex",
            justifyContent: "center",
          }}>
            <Button variant="contained" onClick={handleClick} startIcon={<ScheduleIcon />}>
              OK
            </Button>
          </Box>
        </Box>
      </Popover>
          </Box>
        </Box>

        <Box
          id="Main data grid dev"
          sx={{
            display: "flex",
            flexBasis: "60%",
            overflow: "hidden",
            flexDirection: "column",

            paddingX: "5px",
          }}
        >
          <Box
            sx={{
              height: "50%",
              overflow: "auto",
              width: "100%",

              "& .super-app-theme--header": {
                background: "#eee",
                color: "black",
                textAlign: "center",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "90%",
              }}
            >
              <Box id="filter-panel1" />

              <DataGrid
                rows={grouprows}
                columns={columns2}
                loading={clientLoading}
                slots={{
                  toolbar: MyCustomToolbar1,
                }}
                rowHeight={35}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50,
                    },
                  },
                  filter: {
                    filterModel: {
                      items: ["Group"],
                      quickFilterExcludeHiddenColumns: true,
                    },
                  },
                }}
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
                }}
                autoPageSize={true}
                pageSizeOptions={[50]}
                checkboxSelection
                selectionModel={selectionModel}
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                isRowSelectable={(params) =>
                  !memberNumber.includes(params.row.ContactNumber)
                }
                rowSelectionModel={selectionModel}
                keepNonExistentRowsSelected
              />
            </Box>
          </Box>

          <Box
            sx={{
              height: "45%",
              width: "100%",
              overflow: "hidden",
              "& .super-app-theme--header": {
                background: "#eee",
                color: "black",
                textAlign: "center",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "30vh",
              }}
            >
              <Box id="filter-panel2" />
              <DataGrid
                rows={rows}
                columns={columns}
                loading={clientLoading}
                slots={{
                  toolbar: MyCustomToolbar2,
                }}
                rowHeight={40}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50,
                    },
                  },
                  filter: {
                    filterModel: {
                      items: ["Individual"],
                      quickFilterExcludeHiddenColumns: true,
                    },
                  },
                }}
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
                }}
                autoPageSize={true}
                pageSizeOptions={[50]}
                checkboxSelection
                selectionModel={selectionModel}
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                isRowSelectable={(params) =>
                  !memberNumber.includes(params.row.ContactNumber)
                }
                rowSelectionModel={selectionModel}
                keepNonExistentRowsSelected
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* <Box
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
      </Box> */}
      {OpenAddgroup && (
        <Addgroup
          open={OpenAddgroup}
          handleClose={handleClose_addgroup}
          color={color}
          data={clientData?.client}
          GroupRefetch={GroupRefetch}
          refetch={refetch}
          GroupInfo={GroupInfo}
        />
      )}
    </Box>
  );
};

export default PreviewChat;
