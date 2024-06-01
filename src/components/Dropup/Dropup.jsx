import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { formatDate, formateDateAndTime } from "../../commonFunctions/commonFunctions";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Typography, Switch, createTheme } from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useGetAllUsersHistoryQuery } from "../../features/api/usersApiSlice";
import { useSelector } from "react-redux";

import {
  clearAllLiveStatus,
  setAutoOpenStatus,
  clearOneLiveStatus,
  toggleNotificationSound,
  clearAllLiveWholeSaleStatus,
  clearOneLiveWholeSaleStatus,
  toggleChatNotificationSound,
} from "../../features/slice/authSlice";

/// switch color
const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "green", // Change to the desired color when checked
          },
        },
      },
    },
  },
});
const Dropup = () => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);
  const color = themeColor.sideBarColor1;
  const color2 = themeColor.sideBarColor2;

  /// initialize
  const dispatch = useDispatch();
  const draggableRef = useRef(null);

  /// global state
  const {
    allUsers,
    onlineUsers,
    liveStatus,
    autoOpenStatus,
    initialDropUpControl,
    notificationSound,
    liveWholeSaleStatus,
    allWholeSaleUsers,
    onlineWholeSaleUsers,
    chatNotificationSound,
  } = useSelector((state) => state.auth);

  /// local state
  const [onlineUsersData, setOnlineUsersData] = useState([]);
  const [onlineWholeSaleUsersData, setOnlineWholeSaleUsersData] = useState([]);
  const [dropType, setDropType] = useState([
    "live status",
    "Online Users",
    "live WholeSale Status",
    "Online WholeSale Users",
    "settings",
  ]);
  const [dropUp, openDropUp] = useState(false);
  const [value, setValue] = useState("live status");
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item === selectedItem ? null : item);
    setValue(item);
  };

  /// rtk query

  useEffect(() => {
    const resultArray = Object.keys(allUsers).map((key) => {
      const entry = allUsers[key];

      return {
        name: entry.name,
        isOnline: onlineUsers.includes(key) ? true : entry.isOnline,
      };
    });

    setOnlineUsersData(resultArray);
  }, [allUsers, onlineUsers]);

  useEffect(() => {
    const resultArray = Object.keys(allWholeSaleUsers).map((key) => {
      const entry = allWholeSaleUsers[key];

      return {
        name: entry.name,
        isOnline: onlineWholeSaleUsers.includes(key) ? true : entry.isOnline,
      };
    });

    setOnlineWholeSaleUsersData(resultArray);
  }, [allWholeSaleUsers, onlineWholeSaleUsers]);
  useEffect(() => {
    if (initialDropUpControl && autoOpenStatus) {
      setValue("live status");
      openDropUp(true);
    }
  }, [liveStatus]);

  useEffect(() => {
    if (initialDropUpControl && autoOpenStatus) {
      setValue("live WholeSale Status");
      openDropUp(true);
    }
  }, [liveWholeSaleStatus]);

  return (
    <Draggable nodeRef={draggableRef}>
      <Box
        ref={draggableRef}
        sx={{
          userSelect: "none",
          position: "absolute",
          cursor: "pointer",
          bottom: ".5rem",
          right: "1.4rem",
          zIndex: "2000",
          borderRadius: "1.5rem",
          backgroundImage:
            "linear-gradient(to top, #020b5c, #000e82, #0510aa, #160cd3, #2b00fd)",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
          background: color,
        }}
      >
        <Box
          onClick={() => {
            openDropUp(!dropUp);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem",
            // cursor: "pointer",
          }}
        >
          <ChevronLeftIcon
            sx={{
              fontSize: "15px",
              color: "#fff",
              transform: dropUp ? "rotate(90deg)" : "rotate(0deg)",
              transition: ".3s",
            }}
          />
          <Typography
            sx={{ color: "#fff", paddingRight: ".4rem", fontSize: "12px" }}
          >
            Status
          </Typography>
        </Box>
        {dropUp && (
          <Box
            sx={{
              position: "absolute",
              bottom: "3rem",
              right: ".2rem",
              boxShadow: " rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
              height: "30rem",
              width: "25rem",
              display: "flex",
            }}
          >
            <Box sx={{ flexBasis: "35%" }}>
              {dropType.map((items, index) => {
                return (
                  <Box
                    key={index}
                    onClick={() => handleItemClick(items)}
                    sx={{
                      flexBasis: '70%',
                      backgroundColor:
                        selectedItem === items ? 'grey' : color2,
                      color: 'black',
                      backdropFilter: 'blur(9px)',
                      paddingX: '.3rem',
                      paddingY: '.3rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderTopLeftRadius: '.5rem',
                      borderBottomLeftRadius: '.5rem',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: 'smaller',
                      }}
                    >
                      {items}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                flexBasis: "70%",
                backgroundColor: color2, // Adjust the color and opacity as needed
                color: "white",
                backdropFilter: "blur(9px)",
                padding: ".3rem",
                overflow: "auto",
              }}
            >
              <Box>
                {value === "Online Users" ? (
                  onlineUsersData.map((items, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(0, 89, 179, 0.5)",
                          alignItems: "center",
                          padding: ".3rem",
                          background: color,
                          marginTop: ".3rem",
                        }}
                      >
                        <Box
                          sx={{
                            border: ".6px solid",
                            paddingX: ".9rem",
                            paddingY: ".6rem",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {items.name[0].toUpperCase()}
                          </span>
                        </Box>
                        <Typography
                          variant="paragraph"
                          sx={{
                            fontWeight: "500",
                            color: "#010101",
                            textTransform: "capitalize",
                            cursor: "pointer",
                          }}
                        >
                          {items.name}
                        </Typography>
                        {items.isOnline ? (
                          <span
                            style={{
                              color: "#33ff33",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            online
                          </span>
                        ) : (
                          <span style={{ color: "red", cursor: "pointer" }}>
                            offline
                          </span>
                        )}
                      </Box>
                    );
                  })
                ) : value === "live status" ? (
                  liveStatus.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: " rgba(204, 230, 255, 0.7)",
                          color: "#010101",
                          background: color,
                        }}
                      >
                        <Box
                          sx={{
                            marginTop: ".3rem",
                            padding: ".2rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: ".3rem",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontSize=".9rem"
                              color=" #666666"
                            >
                              {formateDateAndTime(item.time)}
                            </Typography>
                            <CloseIcon
                              onClick={() => {
                                dispatch(clearOneLiveStatus(index));
                              }}
                              sx={{ fontSize: "1rem", color: "	 #666666" }}
                            />
                          </Box>

                          <Typography
                            variant="paragraph"
                            sx={{
                              fontSize: ".99rem",
                              wordSpacing: "1px",
                              cursor: "pointer",
                            }}
                          >
                            {item.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : value === "settings" ? (
                  <Box
                    sx={{
                      marginTop: ".3rem",
                      padding: ".2rem",
                      background: color,
                    }}
                  >
                    <Box
                      // key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: color,
                        alignItems: "center",
                        padding: ".3rem",

                        marginTop: ".3rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "500",
                          color: "white",
                          textTransform: "capitalize",
                          cursor: "pointer",
                        }}
                      >
                        AutoOpen
                      </Typography>

                      <Switch
                        checked={autoOpenStatus}
                        onChange={() => {
                          dispatch(setAutoOpenStatus(!autoOpenStatus));
                        }}
                        style={{ color: color2 }}
                      />
                    </Box>
                    <Box
                      // key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: color,
                        alignItems: "center",
                        padding: ".3rem",
                        marginTop: ".3rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "500",
                          color: "white",
                          textTransform: "capitalize",
                          cursor: "pointer",
                        }}
                      >
                        Notification Sound
                      </Typography>

                      <Switch
                        checked={notificationSound}
                        onChange={() => {
                          dispatch(toggleNotificationSound(!notificationSound));
                        }}
                        style={{ color: color2 }}
                      />

                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: color,
                        alignItems: "center",
                        padding: ".3rem",

                        marginTop: ".3rem",
                      }}
                    >
                      <Typography
                        variant="paragraph"
                        sx={{
                          fontWeight: "500",
                          color: "white",
                          textTransform: "capitalize",
                          cursor: "pointer",
                        }}
                      >
                        Chat Notification Sound
                      </Typography>

                      <Switch
                        checked={chatNotificationSound}
                        onChange={() => {
                          dispatch(
                            toggleChatNotificationSound(!chatNotificationSound)
                          );
                        }}
                        style={{ color: color2 }}
                      />
                    </Box>
                  </Box>
                ) : value === "live WholeSale Status" ? (
                  liveWholeSaleStatus.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          background: color,
                          color: "#010101",
                        }}
                      >
                        <Box sx={{ marginTop: ".3rem", padding: ".2rem" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: ".3rem",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontSize=".9rem"
                              color=" #666666"
                            >
                              {item.time}
                            </Typography>
                            <CloseIcon
                              onClick={() => {
                                dispatch(clearOneLiveWholeSaleStatus(index));
                              }}
                              sx={{ fontSize: "1rem", color: "	 #666666" }}
                            />
                          </Box>

                          <Typography
                            variant="paragraph"
                            sx={{
                              fontSize: ".99rem",
                              wordSpacing: "1px",
                              cursor: "pointer",
                            }}
                          >
                            {item.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                ) : value === "Online WholeSale Users" ? (
                  onlineWholeSaleUsersData.map((items, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          background: color,
                          alignItems: "center",
                          padding: ".3rem",

                          marginTop: ".3rem",
                        }}
                      >
                        <Box
                          sx={{
                            border: ".6px solid",
                            paddingX: ".9rem",
                            paddingY: ".6rem",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {items.name?.[0].toUpperCase()}
                          </span>
                        </Box>
                        <Typography
                          variant="paragraph"
                          sx={{
                            fontWeight: "500",
                            color: "#010101",
                            textTransform: "capitalize",
                            cursor: "pointer",
                          }}
                        >
                          {items.name}
                        </Typography>
                        {items.isOnline ? (
                          <span
                            style={{
                              color: "#33ff33",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            online
                          </span>
                        ) : (
                          <span style={{ color: "red", cursor: "pointer" }}>
                            offline
                          </span>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  ""
                )}
              </Box>
              {value === "live status" && liveStatus.length ? (
                <Button
                  onClick={() => {
                    dispatch(clearAllLiveStatus());
                  }}
                >
                  Clear All
                </Button>
              ) : (
                ""
              )}
              {value === "live WholeSale Status" &&
              liveWholeSaleStatus.length ? (
                <Button
                  onClick={() => {
                    dispatch(clearAllLiveWholeSaleStatus());
                  }}
                >
                  Clear All
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Draggable>
  );
};

export default Dropup;
