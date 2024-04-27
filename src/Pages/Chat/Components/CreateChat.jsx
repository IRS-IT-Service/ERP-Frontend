import { Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useGetAllUsersQuery,
  useGetChatMessageMutation,
} from "../../../features/api/usersApiSlice";
import noImage from "../../../assets/NoImage.jpg";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector } from "react-redux";
import { useSocket } from "../../../CustomProvider/useWebSocket";

const CreateChat = () => {
  // redux data
  const { adminId } = useSelector((state) => state.auth.userInfo);

  // local state;
  const [singleUserData, setSingleUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);

  // rtk query calling
  const { data: allUsers } = useGetAllUsersQuery();
  const [getMessage] = useGetChatMessageMutation();

  const socket = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { senderId: adminId, receiverId: singleUserData?.adminId };
        const result = await getMessage(data);
        setMessageData(result.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchData();
  }, [singleUserData?.adminId]);

  useEffect(() => {
    if (socket) {
      socket.on("newChatMessage", (message) => {
        console.log(message, socket)
        if (
          message.data._id &&
          !messageData.some((msg) => msg._id === message.data._id)
        ) {
          setMessageData((prevData) => [...prevData, message.data]);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("newChatMessage");
      }
    };
  }, [socket, messageData]);

  // functions
  const handleOnClickUser = (user) => {
    setSingleUserData(user);
  };

  const handleSubmit = async () => {
    if (!message) return;
    try {
      const messageData = {
        senderId: adminId,
        receiverId: singleUserData?.adminId,
        content: message,
        type: "text",
      };

      socket.emit("newChatMessage", messageData);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ height: "91vh", width: "85vw", mt: "2px" }}>
      <Box
        sx={{
          display: "flex",
          gap: "22%",
          height: "50px",
          padding: "2px",
        }}
      >
        <h3>Chats</h3>
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
              <span>online</span>
            </div>
          </div>
        )}
      </Box>
      {/* To show the users */}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ height: "83vh", width: "25%" }}>
          {allUsers?.data.map((docs, i) => {
            return (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "3px",
                  margin: "1px",
                  cursor: "pointer",
                  background: `${
                    singleUserData?._id === docs._id ? "#ced5ff" : ""
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
                    border: "1px solid green",
                    borderRadius: "20px",
                  }}
                  alt=""
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{docs.name}</span>
                  <span>{docs.ContactNo}</span>
                </div>
              </div>
            );
          })}
        </Box>

        {/* For message field */}
        <Box
          sx={{
            width: "72%",
            height: "83vh",
            display: "flex",
            backgroundColor: "#767fff",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* to show message */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              padding: "5px",
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
                  {msg.Content.message}
                </div>
              </div>
            ))}
          </Box>

          {/* to send message */}
          <div
            style={{
              height: "32px",
              padding: "3px",
              background: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <AttachFileIcon sx={{ cursor: "pointer" }} />
              <input
                placeholder="Enter text"
                style={{
                  width: "85%",
                  marginBottom: "20px",
                  outline: "none",
                  marginTop: "2px",
                  border: "none",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              ></input>
              <SendIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleSubmit()}
              />
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateChat;
