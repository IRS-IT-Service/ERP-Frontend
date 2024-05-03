import { Box, Button } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useGetAllUsersQuery,
  useGetChatMessageMutation,
} from "../../../features/api/usersApiSlice";
import noImage from "../../../assets/NoImage.jpg";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";
import chatLogo from "../../../../public/ChatLogo.png";
import { removeChatNotification } from "../../../features/slice/authSlice";
import { usePeerContext } from "../../../CustomProvider/useWebRtc";


const CreateChat = () => {
  // using react hooks
  const dispatch = useDispatch();
  const socket = useSocket();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // gettting data from usePeer context
  const {peerConnection,createCallOffer,createAnswer,setRemoteAnswer} = usePeerContext()

  // redux data
  const { adminId } = useSelector((state) => state.auth.userInfo);
  const datas = useSelector((state) => state.auth);
  const onLineUsers = datas.onlineUsers;
  const messageDatas = datas.chatMessageData;

  // local state;
  const [singleUserData, setSingleUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);

  // setting redux message which is live text data to locat state
  useEffect(() => {
    setMessageData((previousData) => {
      return [...previousData, messageDatas];
    });
  }, [messageDatas]);

  // rtk query calling
  const { data: allUsers } = useGetAllUsersQuery();
  const [getMessage] = useGetChatMessageMutation();

  // getting online user from redux and showing whether they are online or offline
  const online = onLineUsers.includes(singleUserData?.adminId);

  // for showing notification on all the users data div
  const notificationData = datas?.chatNotificationData;
  let [messageCountsBySender, setMessageCountsBySender] = useState();

  useEffect(() => {
    const messageCountsBySender = notificationData.reduce((counts, message) => {
      const senderId = message.SenderId;
      counts[senderId] = (counts[senderId] || 0) + 1;
      return counts;
    }, {});

    setMessageCountsBySender(messageCountsBySender);
  }, [notificationData, notificationData?.length > 0, allUsers]);

  // for curor on input box 
  useEffect(() => {
    inputRef?.current?.focus();
  }, [singleUserData?.adminId]);

  // for like when user comes to chat then the div scroll down to bottom 
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [singleUserData?.adminId]);

  // calling message like all the messages which is end to end from data base
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { senderId: adminId, receiverId: singleUserData?.adminId };
        const result = await getMessage(data);
        setMessageData([...result.data]);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchData();
  }, [singleUserData?.adminId]);



  // this functio is for removing notification icon from user div
  const handleOnClickUser = (user) => {
    setSingleUserData(user);
    const filterData = notificationData.filter(
      (data) => data.SenderId !== user.adminId
    );

    dispatch(removeChatNotification(filterData));
  };

  // functio for sending message
  const handleSubmit = async () => {
    if (!message) return;
    try {
      const messageData = {
        _id: Math.random().toString(36).substring(2),
        senderId: adminId,
        receiverId: singleUserData?.adminId,
        content: message,
        type: "text",
      };

      setMessageData((prevData) => [
        ...prevData,
        {
          _id: Math.random().toString(36).substring(2),
          SenderId: adminId,
          ReceiverId: singleUserData?.adminId,
          Content: { message: message },
          Type: "text",
        },
      ]);
      socket.emit("newChatMessage", messageData);
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleIncommingCall = useCallback(async (data) => {
    const {from ,offer} = data;
    const answer = await createAnswer(offer)
    console.log("incomming call",from ,offer)
    socket.emit("callAccepted",{from ,answer})
  },[])

  const handleCallAccepted = useCallback(async (data) => {
    const {answer} = data;
    console.log("call go accepted")
   await  setRemoteAnswer(answer)
   
  },[])




  useEffect(() =>{
    if(socket){
      socket.on("incommingCall",handleIncommingCall)
      socket.on("callAccepted",handleCallAccepted)

      return () => {
        socket.off("incommingCall",handleIncommingCall)
        socket.off("callAccepted",handleCallAccepted)
      }
    }
   
  
  },[handleIncommingCall,socket,handleCallAccepted])

  

  return (
    <Box
      sx={{
        height: "91vh",
        width: "95%",
        mt: "10px",
        border: "0.2px solid grey",
        borderRadius: "10px",
        background: "#eceff1",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "22%",
          height: "50px",
          padding: "2px",
        }}
      >
        <span
          style={{
            fontFamily: "cursive",
            padding: "15px",
            fontWeight: "bold",
            // color: " rgb(138, 43, 226)",
          }}
        >
          IRS-Chat
        </span>
        {singleUserData && (
          <div style={{ display: "flex", gap: "5px" }}>
            <img
              src={noImage}
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "20px",
              }}
              alt=""
            ></img>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{singleUserData?.name}</span>
              <span style={{ color: `${online ? "blue" : "red"}` }}>
                {online ? "online" : "offline"}
              </span>
            </div>
          </div>
        )}
      </Box>
      {/* to show the users */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ height: "100%", width: "25%", overflowY: "auto" }}>
          {Array.isArray(allUsers?.data) &&
            allUsers?.data.map((docs, i) => {
              const isAdminUser = docs.adminId === adminId;

              const userName = isAdminUser ? "You" : docs.name;

              return (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "3px",
                    margin: "2px",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow:
                      "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    background: `${
                      singleUserData?._id === docs._id ? "#b0bec5" : ""
                    }`,
                  }}
                  key={i}
                  onClick={() => handleOnClickUser(docs)}
                >
                  <img
                    src={noImage}
                    style={{
                      height: "40px",
                      width: "40px",
                      // border: "1px solid green",
                      borderRadius: "20px",
                    }}
                    alt=""
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{ color: `${userName === "You" ? "green" : ""}` }}
                    >
                      {userName}
                    </span>
                    <span>{docs.ContactNo}</span>
                  </div>
                  {messageCountsBySender &&
                    messageCountsBySender[docs?.adminId] && (
                      <span
                        style={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          background: "green",
                          height: "20px",
                          width: "25px",
                          borderRadius: 50,
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        {messageCountsBySender[docs?.adminId] || 1}
                      </span>
                    )}
                </div>
              );
            })}
        </Box>

        {/* For message field */}
        {singleUserData?.adminId ? (
          <Box
            sx={{
              width: "75%",
              height: "84.8vh",
              display: "flex",
              backgroundColor: "#cfd8dc",
              flexDirection: "column",
            }}
          >
            {/* to show message */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: "5px",
                "&::-webkit-scrollbar": {
                  width: "2px",
                },
              }}
            >
              {messageData?.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    textAlign: msg.SenderId === adminId ? "right" : "left",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px",
                      background: msg.SenderId === adminId ? "#dcf8c6" : "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {msg?.Content?.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* to send message */}
            <div
              style={{
                height: "42px",
                padding: "3px",
                background: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <AttachFileIcon sx={{ cursor: "pointer", marginTop: "5px" }} />
                <input
                  placeholder="Enter Message Here"
                  style={{
                    width: "85%",
                    marginBottom: "20px",
                    outline: "none",
                    marginTop: "2px",
                    border: "none",
                    height: "30px",
                  }}
                  value={message}
                  ref={inputRef}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                ></input>
                <SendIcon
                  sx={{ cursor: "pointer", marginTop: "6px" }}
                  onClick={() => handleSubmit()}
                />
              </div>
            </div>
          </Box>
        ) : (
          <Box
            sx={{
              width: "75%",
              height: "84.8vh",
              display: "flex",
              backgroundColor: "#fff",
              justifyContent: "center",
              // flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <img
                src={chatLogo}
                style={{ height: "300px", width: "300px" }}
              ></img>
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CreateChat;
