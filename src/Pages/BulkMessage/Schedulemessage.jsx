import { React, useEffect, useState } from "react";
import {
    DataGrid,
    useGridApiRef,
    GridToolbarContainer,
    GridToolbarExport,
    GridPagination,
    GridToolbarQuickFilter,
  } from "@mui/x-data-grid";
import {
  Grid,
  Box,
  Button,
  styled,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Loading from "../../components/Common/Loading";
import { useGetDiscountQueryQuery } from "../../features/api/discountQueryApiSlice";

import { useLocation, useNavigate } from "react-router-dom";
import Nodata from "../../../src/assets/error.gif";
import {
  formatDate,
  formateDateAndTime,
} from "../../commonFunctions/commonFunctions";
import Header from "../../components/Common/Header";
import InfoDialogBox from "../../components/Common/InfoDialogBox";
import { useDispatch, useSelector } from "react-redux";
import { setHeader, setInfo } from "../../features/slice/uiSlice";
import NoImage from "../../assets/Noimage.jpeg";
import {

  useGetAllScheduleMessageQuery,
  useDeleteScheduledTaskMutation,
  useGetAllScheduleMessageHistoryQuery
} from "../../features/api/whatsAppApiSlice";
import { toast } from "react-toastify";
import { Portal } from "@mui/base/Portal";

import CountDown from "./Components/CountDown";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: "rgb(4,4,61) !important",
    color: "white !important",
  },
}));

const infoDetail = [
  {
    name: "Open Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/open%20query.png?updatedAt=1702962275516"
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
    instruction: `When you click on Open Query, it will show you the column of Status like "pending" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order `,
  },

  {
    name: "Closed Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/closed%20query.png?updatedAt=1702962740744"
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
    instruction:
      'When you click on Close Query, it will show you the column of Status like "close" "reject" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order',
  },

  {
    name: "Sold Query",
    screenshot: (
      <img
        src="https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/sold%20query.png?updatedAt=1702962761484"
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
    instruction: `When you click on Sold Query, it will show you the column of Status like "sold" and Action for "details" when you click on details it will show you the saved Calculate Discounted Price in Bulk Order`,
  },
];

const Schedulemessage = () => {
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNoData(true);
    }, 10000);
  }, []);

  // local state
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [openDial, setOpenDial] = useState(false);
   const [rowData, setRowData] = useState();
  const [showNewData, setShowNewData] = useState(true);


  const CustomToolbar = (prop) => {
    /// global state
    const { themeColor } = useSelector((state) => state.ui);
 

    return (
    <>
          <Portal container={() => document.getElementById("filter-panel")}>
              <Box style={{ display: "flex", justifyContent: "space-between",marginTop:"10px" }}>
         <GridToolbarQuickFilter style={{paddingTop:"20px"}} />
         <ToggleButtonGroup
          value={alignment}
          exclusive
          size="small"
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="Schedule"
            size="small"
          >
            Schedule
          </ToggleButton>
          <ToggleButton
            classes={{ selected: classes.selected }}
            value="SendHistory"
            size="small"
          >
            Send History
          </ToggleButton>
        </ToggleButtonGroup>
        </Box>
       </Portal>
      
      </>
 
 
    
    );
  };
  // additional
  const location = useLocation();
  const isOnAdminRoute = location.pathname.includes("/admin");
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState("Schedule");

  const {
    data,
    isLoading: GetScheduledTaskLoading,
    refetch,
  } = useGetAllScheduleMessageQuery();

  const {
    data:historyData,
    isLoading: GetAllScheduleMessageHistoryLoading,
    refetch: historyRefetch,
  } = useGetAllScheduleMessageHistoryQuery();

 const isHistory = alignment === "Schedule" ? false : true;    

  // Handlers for toggling data

  ///toggle chnage


  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  // rtk query

  const [DeleteTask, { isLoading: DeleteTaskTaskLoading }] =
    useDeleteScheduledTaskMutation();

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

  useEffect(() => {
    if (data?.message === "Successful fetch schedule" && alignment === "Schedule" ) {
      const filteredRows = data.data.map((item, index) => {
       return {
          ...item,
          id: item._id,
          Sno: index + 1,
          Recipients:item?.contacts?.length
        };
      });
      setRows(filteredRows);
    }else if (historyData?.message === "Successful fetch schedule" && alignment === "SendHistory" ) {
        const filteredRows = historyData.data.map((item, index) => {
           
            return {
               ...item,
               id: item._id,
               Sno: index + 1,
               scheduledTime:item.sendTime,
               Recipients:item?.contacts?.length
             };
           });
           setRows(filteredRows);
           }
  }, [data, showNewData, isOnAdminRoute, alignment ,historyData]);

  const handleClose = () => {
    setOpenDial(false);
  };

  const handleOpen = () => {
    setOpenDial(true);
  };

  // useEffect(() => {
  //   refetch();
  // }, [data]);

  // Columns for normal user view
  const userColumns = [
    {
      field: "Sno",
      headerName: "Sno",
      flex: 0.3,
      minWidth: 70,
      maxWidth: 80,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.1,
      minWidth: 50,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "message",
      headerName: "Message",
      flex: 0.1,
      minWidth: 200,
      maxWidth: 500,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const message = whatsappToHTML(params.row.message);
        return (
          <>
              <div
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        textAlign: "center"
                      
                      }}
                    >
            <div
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
            </div>
          </>
        );
      },
    },

    {
        field: "Recipients",
        headerName: "Recipients",
        flex: 0.1,
        minWidth: 50,
        maxWidth: 100,
        align: "center",
        headerAlign: "center",
        headerClassName: "super-app-theme--header",
        cellClassName: "super-app-theme--cell",
      },
        {
          field: "Image",
          headerName: "Image",
          flex: 0.1,
          minWidth:50,
          maxWidth: 150,
          align: "center",
          headerAlign: "center",
          headerClassName: "super-app-theme--header",
          cellClassName: "super-app-theme--cell",
          renderCell: (params) => {

            return (
              <>
               <Box sx={{
                display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width:"100px",
                  height:"50px",
                  overflow: "hidden",
                  borderRadius: "5px",
                  padding:1,

               }}>
                { params.row.image ?
    <img src ={params.row.image.url} style={{objectFit:"cover" ,objectPosition:"center" ,width:"100%" ,height:"100%"}}/> :<span style={{color:"red"}}>No Image</span> }
               </Box>
              </>
            );
          },
        },
    {
      field:"scheduledTime"  ,
      headerName: isHistory ? "Send Time" : "Scheduled Time",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueFormatter: (params) => formateDateAndTime(params.value),
      
    },

    {
      field: "CountDown",
      headerName: isHistory ? "Status" : "Count Down",
      flex: 0.1,
      minWidth: 150,
      maxWidth: 300,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const time = params.row.scheduledTime;
        const isHistory = params.row.isHistory;
     
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              textWrap: "wrap",
            }}
          >
           {!isHistory ? <CountDown targetDate={time} refetch={refetch} historyRefetch = {historyRefetch} /> : <span style={{color:"green"}}>Send</span> }
          </Box>
        );
      },
    },
    {
      field: "Type",
      headerName: "Message Type",
      flex: 0.1,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    // {
    //     field: "View",
    //     headerName: "Preview",
    //     flex: 0.1,
    //     minWidth:90,
    //     maxWidth: 150,
    //     align: "center",
    //     headerAlign: "center",
    //     headerClassName: "super-app-theme--header",
    //     cellClassName: "super-app-theme--cell",
    //     renderCell: (params) => {
    //     const id =  params.row.id
    //     console.log(id)
    //       return (
    //         <>
    //           <Button
    //             style={{
    //               height: "100%",
    //               width: "100%",
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //             onClick={() => {
    //               handleDeleteScheduledMessage(id)
    //             }}
    //           >
    //             View
    //           </Button>
    //         </>
    //       );
    //     },
    //   },

    // valueFormatter: (params) => `₹ ${params.value}`,

    {
      field: "Action",
      headerName: "Action",
      flex: 0.1,
      minWidth: 90,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const isHistory = params.row.isHistory;
        const id = params.row.id;
          return (
          <>
            <Button
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                handleDeleteScheduledMessage(id);
              }}
            >
           {isHistory ? "Delete"  :  "Cancel" }
            </Button>
          </>
        );
      },
    },
  ];

  // Merge columns based on isAdminRoute
  const finalColumns = isOnAdminRoute ? adminColumns : userColumns;

  const description = `Schedule Message`;

  const dispatch = useDispatch();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Schedule Message`));
  }, []);

  const handleDeleteScheduledMessage = async (taskId) => {
    try {
      const result = await DeleteTask(taskId).unwrap();
      toast("Successfully deleted scheduled message");
     
      if(isHistory){
        historyRefetch()
      }else{
    refetch();
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <Box sx={{ width: "100%", minHeight: "93vh", overflowY: "hidden" }}>
      <DrawerHeader />
      {/* <Header Name={"Barcode Stick"} info={true} customOnClick={handleOpen1} /> */}

      {/* Dialog info Box */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description}
        open={isInfoOpen}
        close={handleClose1}
      />

      <Grid container>
        {GetScheduledTaskLoading || GetAllScheduleMessageHistoryLoading ? (
          <Loading loading={GetScheduledTaskLoading || GetAllScheduleMessageHistoryLoading} />
        ) : (
          <Grid item xs={12} sx={{}}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: "1rem",
                // marginBottom: "1rem",
              }}
            ></Box>
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
                 <Box id="filter-panel" />
              <DataGrid
                columns={finalColumns}
                rows={rows}
                rowHeight={40}
          
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
                  NoRowsOverlay: () => (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {showNoData && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            style={{
                              width: "20%",
                            }}
                            src={Nodata}
                          />

                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            No data found !
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
      {openDial ? (
        <ViewQueryDialog
          openDial={openDial}
          handleClose={handleClose}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default Schedulemessage;
