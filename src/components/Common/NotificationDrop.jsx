import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Draggable from "react-draggable";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Translate } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../CustomProvider/useWebSocket";
import {
  useUpdateSeenMutation,
  useGetTasksByEmpIdQuery,
} from "../../features/api/taskManagementApiSilce";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NotificationDrop = () => {
  const { isAdmin, userRole, userInfo, chatNotificationData } = useSelector(
    (state) => state.auth
  );

  const id = isAdmin ? "admin" : userInfo.adminId;
  const {
    data: TaskCount,
    refetch: Taskrefetch,
    isLoading,
  } = useGetTasksByEmpIdQuery(id);

  const [isOpen, setIsopen] = useState(false);

  const socket = useSocket();
  const draggableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (draggableRef.current && !draggableRef.current.contains(event.target)) {
        setIsopen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [setIsopen]);

  const handleOpen = (event) => {
    event.stopPropagation()
    if (isAdmin) {
       setIsopen(!isOpen);
    } else {
      navigate("/TaskScheduledList");
    }
  };



  useEffect(() => {
    socket?.on("Livetask", (data) => {
      Taskrefetch();
    });

    return () => {
      if (socket) {
        socket.off("Livetask");
      }
    };
  }, [[socket]]);

  const TaskQty = TaskCount?.data.TaskSchedule;

  return (
    <>
      {TaskQty && (
        <Draggable nodeRef={draggableRef}>
      <Box
  ref={draggableRef}
  sx={{
    width: "500px",
    height: isOpen && isAdmin ? "500px" : "40px",
    transition: "height 0.5s ease",
    position: "absolute",
    background: "rgba( 0, 0, 0, 0.35 )",
    boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur( 1.5px )",
    WebkitBackdropFilter: "blur( 1.5px )",
    borderRadius: "10px",
    top: 20,
    right: "28rem",
    zIndex: 3000,
    cursor: "pointer",
  }}
>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  color: "#ffff",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "yellow",
                    fontSize: "15px",
                    padding: "10px",
                  }}
                >{`${isAdmin ? "There are" : "You have"} ${
                  TaskQty.length
                } tasks that have not been started or archived yet.`}</Typography>{" "}
                <KeyboardArrowDownIcon
                  sx={{
                    transition: "transform 0.5s ease",
                    display: isAdmin ? "inline-block" : "none",
                    transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                  onClick={handleOpen}
                />{" "}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",

                  gap: "5px",
                  paddingX: "10px",
                  overflowY: "auto",
                }}
              >
                {isLoading ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <CircularProgress
                      size={30}
                      sx={{
                        color: "#ffff",
                      }}
                    />
                  </Box>
                ) : (
                  TaskQty.map((items, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid red",
                          borderRadius: "10px",
                          background: "#ffff",
                          color: "black",
                          padding: 0.5,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.01)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                          }}
                          onClick={() => navigate("/TaskScheduledList")}
                        >
                          {`${index + 1}. ${items.userName} has (${
                            items.taskTitle
                          }) tasks that have not been started or archived yet.`}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>
        </Draggable>
      )}
    </>
  );
};

export default NotificationDrop;
