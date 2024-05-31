import { Box, Button, CircularProgress } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import {
  useChangeVisibilityMutation,
  useGetAllUsersQuery,
  useGetChatMessageMutation,
  useUploadFileOnImageKitMutation,
} from '../../../features/api/usersApiSlice';
import noImage from '../../../assets/NoImage.jpg';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../../../CustomProvider/useWebSocket';
import chatLogo from '../../../../public/ChatLogo.png';
import { removeChatNotification } from '../../../features/slice/authSlice';
import { usePeerContext } from '../../../CustomProvider/useWebRtc';
import CallIcon from '@mui/icons-material/Call';
import CallingDial from './callingDial';
import Toolbar from '@mui/material/Toolbar';
import { formatDateForWhatsApp } from '../../../commonFunctions/commonFunctions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { toast } from 'react-toastify';
import whatsImage from '../../../../public/ChatBackground.jpeg';
import frontImage from '../../../../public/FrontChat.png';
import MoodIcon from '@mui/icons-material/Mood';
import EmojiPicker from 'emoji-picker-react';
// import ToolbarItem from '@mui/material/ToolbarItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CreateChat = () => {
  // using react hooks
  const dispatch = useDispatch();
  const socket = useSocket();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showButton, setShowButton] = useState(true);

  // gettting data from usePeer context
  // const {
  //   peerConnection,
  //   createCallOffer,
  //   createAnswer,
  //   setRemoteAnswer,
  //   sendStream,
  //   remoteStream,
  // } = usePeerContext();
  // redux data
  const { adminId } = useSelector((state) => state.auth.userInfo);
  const datas = useSelector((state) => state.auth);
  const onLineUsers = datas.onlineUsers;
  const messageDatas = datas.chatMessageData;
  const typingData = datas.chatTyping;

  // local state;
  const [singleUserData, setSingleUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState([]);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [callDial, setCallDial] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [calling, setCalling] = useState(false);
  const [acceptCall, setAcceptCall] = useState(false);
  const [connectedTo, setConnectedTo] = useState(null);
  const [typing, setTyping] = useState('');
  const [emoji, setEmoji] = useState(false);
  const [emojiData, setEmojiData] = useState('');

  // setting redux message which is live text data to local state
  useEffect(() => {
    if (
      (singleUserData && singleUserData?.adminId) === messageDatas?.SenderId
    ) {
      setMessageData((previousData) => {
        return [...previousData, messageDatas];
      });
      scrollToBottom();
    }
  }, [messageDatas]);

  useEffect(() => {
    let typingTimeout;

    if (singleUserData) {
      const filterData = typingData.filter(
        (data) =>
          data.senderId === singleUserData.adminId &&
          data.message === 'Typing...'
      );
      if (filterData.length > 0) {
        setTyping('Typing...');
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          setTyping('');
        }, 1000);
      } else {
        setTyping('');
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [typingData]);

  // rtk query calling
  const { data: allUsers } = useGetAllUsersQuery();
  const [getMessage] = useGetChatMessageMutation();
  const [uploadFile, { isLoading }] = useUploadFileOnImageKitMutation();
  const [changeVisibility, { refetch }] = useChangeVisibilityMutation();

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
    scrollToBottom();
  }, [notificationData, notificationData?.length > 0, allUsers]);

  function formatTimeWithAMPM(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${meridiem}`;
  }

  const scrollToBottom = () => {
    // console.log("Scroll to bottom", messagesEndRef.current);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleDownLoadFile = async (url) => {
    try {
      const urlArray = url.split('/');
      const fileName = urlArray.pop();
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };
  // for like when user comes to chat then the div scroll down to bottom
  // useEffect(() => {
  //   messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });

  // }, [singleUserData?.adminId]);

  // calling message like all the messages which is end to end from data base
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMessage(true);
        const data = { senderId: adminId, receiverId: singleUserData?.adminId };
        const result = await getMessage(data);
        setIsLoadingMessage(false);
        setMessageData([...result.data]);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };
    scrollToBottom();
    fetchData();
  }, [singleUserData?.adminId, setSingleUserData, singleUserData]);

  // this function is for removing notification icon from user div
  const handleOnClickUser = (user) => {
    scrollToBottom();
    setSingleUserData(user);
  };

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
    const typingData = {
      senderId: adminId,
      receiverId: singleUserData?.adminId,
    };
    if (socket) {
      socket.emit('onTypingMessage', typingData);
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
    const changeVisible = async () => {
      try {
        const data = { senderId: singleUserData?.adminId, receiverId: adminId };
        const result = await changeVisibility(data);
        const filterData = notificationData.filter(
          (data) => data.SenderId !== singleUserData?.adminId
        );
        dispatch(removeChatNotification(filterData));
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };
    if (singleUserData) {
      changeVisible();
    }
  }, [setSingleUserData, singleUserData]);

  // function for sending message
  const handleSubmit = async () => {
    scrollToBottom();
    if (!message) return;
    try {
      const messageData = {
        _id: Math.random().toString(36).substring(2),
        senderId: adminId,
        receiverId: singleUserData?.adminId,
        content: message,
        type: 'text',
      };

      setMessageData((prevData) => [
        ...prevData,
        {
          _id: Math.random().toString(36).substring(2),
          SenderId: adminId,
          ReceiverId: singleUserData?.adminId,
          Content: { message: message },
          Type: 'text',
          createdAt: Date.now(),
        },
      ]);
      socket.emit('newChatMessage', messageData);
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  // function for file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  //function for submitting file
  const handleFileSend = async () => {
    if (!selectedImage) return;
    scrollToBottom();
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      const uploadfiles = await uploadFile(formData).unwrap();
      if (!uploadfiles) return;
      const messageData = {
        _id: Math.random().toString(36).substring(2),
        senderId: adminId,
        receiverId: singleUserData?.adminId,
        file: uploadfiles?.file,
        type: 'media',
      };
      setMessageData((prevData) => [
        ...prevData,
        {
          _id: Math.random().toString(36).substring(2),
          SenderId: adminId,
          ReceiverId: singleUserData?.adminId,
          Content: { url: uploadfiles?.file?.url },
          Type: 'media',
          createdAt: Date.now(),
        },
      ]);
      socket.emit('newChatMessage', messageData);
      setSelectedImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOnDiv = () => {
    if (emoji || selectedImage) {
      setEmoji(false), setSelectedImage(null);
    }
  };

  const handleEmojiClick = (data) => {
    setEmojiData(data.emoji);
    setMessage(message + data.emoji);
    setEmoji(false);
  };

  // this are the webrtc methods and functions for calls which is getting shutdown because of microphone problems
  // call dialog box open
  // const handleOpenCallDial = (data) => {
  //   console.log(data);
  //   setCallDial(true);
  // };

  // Saket initiates the call
  // const handleCallRequest = async (data) => {
  //   console.log(data);
  //   try {

  //     const offer = await createCallOffer();
  //     socket.emit("callUser", { data, offer });
  //     setConnectedTo(data.receiverId);
  //     setCallDial(true)
  //   } catch (error) {
  //     console.error("Error initiating call:", error);
  //   }
  // };

  // Akash receives the call and decides to accept or reject
  // const handleIncomingCall = async (datas) => {
  //   console.log("incoming call:", datas);
  //   try {
  //     const { data, offer } = datas;
  //     setCallDial(true)
  //     setCalling(true);
  //     setIncomingCallData(datas);
  //     setConnectedTo(data.senderId);
  //     // }
  //   } catch (error) {
  //     console.error("Error handling incoming call:", error);
  //   }
  // };
  // accept call
  // const handleAcceptCall = async () => {
  //   try {
  //     const { data, offer } = incomingCallData;
  //     console.log("offer", offer);
  //     const answer = await createAnswer(offer);
  //     socket.emit("callAccepted", { data, answer });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleCallAccepted = async (datas) => {
  //   try {
  //     const { answer } = datas;

  //     await setRemoteAnswer(answer);
  //     sendStream(myStream);

  //   } catch (error) {
  //     console.error("Error accepting call:", error);
  //   }
  // };
  // const handleCallRejected = () => {

  //   console.log(`${adminId} rejected the call.`);
  //   if(socket){
  //     socket.emit("callRejected",{senderId:adminId})
  //   }
  //   setCallDial(false);

  // };
  // Socket event listeners
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("incomingCall", handleIncomingCall);
  //     socket.on("callAccepted", handleCallAccepted);
  //     // socket.on("callRejected", handleCallRejected);

  //     return () => {
  //       socket.off("incomingCall", handleIncomingCall);
  //       socket.off("callAccepted", handleCallAccepted);
  //       socket.off("callRejected", handleCallRejected);
  //     };
  //   }
  // }, [socket, handleIncomingCall, handleCallAccepted, ]);

  // const handleNegotiationNeeded = useCallback(() => {
  //   const localOffer = peerConnection.localDescription;
  //   let data = { senderId: adminId, receiverId: "AID3317" };
  //   console.log(data);
  //   console.log("socket: " + socket);
  //   if (socket) {
  //     socket.emit("callUser", { data, offer: localOffer });
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("negotiation needed")
  //   peerConnection.addEventListener(
  //     "negotiationneeded",
  //     handleNegotiationNeeded
  //   );
  //   return () => {
  //     peerConnection.removeEventListener(
  //       "negotiationneeded",
  //       handleNegotiationNeeded
  //     );
  //   };
  // }, []);

  // const getUserMediaStream = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     setMyStream(stream);
  //   } catch (error) {
  //     console.error("Error getting user media stream:", error);
  //   }
  // };

  // useEffect(() => {
  //   getUserMediaStream();
  // }, []);

  // useEffect(() => {}, [remoteStream]);

  // Group messages by date
  const groupedMessages = messageData.reduce((acc, msg) => {
    const date = formatDateForWhatsApp(msg.createdAt);
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  // Scroll Button
  const scrollToBtn = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
      setShowButton(scrollTop + clientHeight < scrollHeight);
    }
  };

  useEffect(() => {
    handleScroll(); // Check initial scroll position

    const scrollableElement = messagesEndRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [groupedMessages]);

  // console.log(groupedMessages);

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]); // Trigger scroll to bottom when messages change

  return (
    <Box
      sx={{
        height: '87vh',
        width: '98%',
        mt: '10px',
        border: '0.2px solid grey',
        borderRadius: '10px',
        background: '#fefefe',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        overflow: 'hidden',
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '7%',
          gap: '20%',
          borderBottom: '0.2px solid #eee',
        }}
      >
        <span
          style={{
            fontFamily: 'cursive',
            padding: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            // color: " rgb(138, 43, 226)",
          }}
          onClick={() => setSingleUserData()}
        >
          IRS-Chat
        </span>
        {/* {remoteStream && (
            
            <audio
              autoPlay
              ref={(audio) => {
                if (audio) {
                  audio.srcObject = remoteStream;
                }
              }}
            />
          )} */}
        {/* {myStream && <audio controls autoPlay srcObject={myStream}></audio>} */}
        {singleUserData && (
          <div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div
                style={{
                  height: '45px',
                  width: '45px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={singleUserData?.profileImage?.url || noImage}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                ></img>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{singleUserData?.name}</span>
                <span
                  style={{
                    color: `${online ? 'blue' : typing ? 'grey' : 'red'}`,
                  }}
                >
                  {typing || (online ? 'Online' : 'Offline')}
                </span>
              </div>
            </div>
            {/* <div
          //   style={{ marginLeft: "300px", cursor: "pointer" }}
          //   onClick={() =>
          //     handleCallRequest({
          //       senderId: adminId,
          //       receiverId: singleUserData?.adminId,
          //     })
          //   }
          // >
          //   <CallIcon />
          // </div> */}
          </div>
        )}
      </Box>

      {/* to show the users */}
      <Box sx={{ display: 'flex', height: '93%' }}>
        <Box
          sx={{
            height: '100%',
            width: '25%',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRight: '0.2px solid #eeee',
            '&::-webkit-scrollbar': {
              width: '2px',
            },
          }}
        >
          {Array.isArray(allUsers?.data) &&
            allUsers?.data.map((docs, i) => {
              const isAdminUser = docs.adminId === adminId;
              const userName = isAdminUser ? 'You' : docs.name;
              const onlineUser = onLineUsers.includes(docs.adminId);
              return (
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    margin: '2px',
                    padding: '6px',
                    cursor: 'pointer',
                    width: '99%',
                    position: 'relative',
                    borderRadius: '5px',
                    background: `${
                      singleUserData?._id === docs._id ? '#e0e0e0' : '#fff'
                    }`,
                  }}
                  key={i}
                  onClick={() => handleOnClickUser(docs)}
                >
                  <img
                    src={docs?.profileImage?.url || noImage}
                    style={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '20px',
                    }}
                    alt=''
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    >
                      <span
                        style={{
                          color: `${userName === 'You' ? 'green' : ''}`,
                          fontWeight: 'bolder',
                          opacity: '0.8',
                        }}
                      >
                        {userName}
                      </span>
                      <div
                        style={{
                          background: `${
                            onlineUser
                              ? 'radial-gradient(circle, #00f62a, #0cc21e, #0d9014, #0a620a, #063701)'
                              : 'radial-gradient(circle, #fd1919, #e4121c, #cc0c1d, #b3081c, #9b071b)'
                          }`,
                          width: '12px',
                          height: '12px',
                          borderRadius: 50,
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginRight: '7px',
                      }}
                    >
                      <span style={{ opacity: '0.7' }}>{docs.ContactNo}</span>
                      {messageCountsBySender &&
                        messageCountsBySender[docs?.adminId] && (
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              background: '#1daa61',
                              height: '20px',
                              width: '20px',
                              borderRadius: 50,
                              color: 'white',
                              fontSize: '12px',
                            }}
                          >
                            {messageCountsBySender[docs?.adminId] || 1}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
        </Box>

        {/* For message field */}
        {singleUserData?.adminId ? (
          <Box
            sx={{
              width: '75%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              backgroundImage: `url(${whatsImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              flexDirection: 'column',
            }}
          >
            {/* to show message */}
            <Box
              sx={{
                flex: 1,
                width: '100%',
                height: '84.8vh',
                overflowY: 'auto',
                position: 'relative',
                padding: '5px',
                '&::-webkit-scrollbar': {
                  width: '2px',
                },
              }}
              ref={messagesEndRef}
              onClick={() => handleClickOnDiv()}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000,
                }}
              >
                {isLoadingMessage && <CircularProgress />}
              </Box>
              {Object.entries(groupedMessages).map(([date, messages]) => (
                <div key={date}>
                  <div
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button sx={{ background: '#f4f3ef' }}>{date}</Button>
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      style={{
                        textAlign: msg.SenderId === adminId ? 'right' : 'left',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ position: 'relative', padding: '20px' }}>
                        <div
                          style={{
                            position: 'absolute',
                            width: '20px',
                            height: '10px',
                            left: msg.SenderId === adminId ? '' : 0,
                            right: msg.SenderId === adminId ? 0 : '',
                            clipPath:
                              msg.SenderId === adminId
                                ? 'polygon(100% 0, 0 0, 0 100%)'
                                : 'polygon(100% 0, 0 0, 100% 100%)',
                            background:
                              msg.SenderId === adminId ? '#d9fdd3' : '#fff',
                          }}
                        ></div>
                        <div
                          style={{
                            display: 'inline-block',
                            padding: '8px',
                            background:
                              msg.SenderId === adminId ? '#d9fdd3' : '#fff',
                            borderRadius:
                              msg.SenderId === adminId
                                ? '8px 0px 8px 8px'
                                : '0px 0px 8px 8px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {msg.Type === 'text' ? (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'end',
                                maxWidth: '35rem',
                                flexWrap: 'wrap',
                                gap: '20px',
                                padding: '0px 10px',
                                textAlign: 'start',
                              }}
                            >
                              <p>{msg.Content.message}</p>
                              <div
                                style={{
                                  marginTop: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                }}
                              >
                                <span
                                  style={{ color: 'gray', fontSize: '10px' }}
                                >
                                  {' '}
                                  {formatTimeWithAMPM(msg.createdAt)}{' '}
                                </span>

                                <span
                                  style={{
                                    color: `${
                                      msg.Visibility === 'seen'
                                        ? '#1d8df6'
                                        : 'gray'
                                    }`,
                                  }}
                                >
                                  {' '}
                                  <DoneAllIcon fontSize='4px' />
                                </span>
                              </div>
                            </div>
                          ) : msg.Type === 'media' ? (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={msg?.Content?.url}
                                alt='Media'
                                style={{
                                  maxWidth: '250px',
                                  height: 'auto',
                                  display: 'block',
                                  cursor: 'pointer',
                                }}
                                onDoubleClick={() =>
                                  handleDownLoadFile(msg?.Content?.url)
                                }
                              />
                              <div
                                style={{
                                  marginTop: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                }}
                              >
                                <span
                                  style={{ color: 'gray', fontSize: '10px' }}
                                >
                                  {' '}
                                  {formatTimeWithAMPM(msg.createdAt)}{' '}
                                </span>

                                <span
                                  style={{
                                    color: `${
                                      msg.Visibility === 'seen'
                                        ? '#1d8df6'
                                        : 'gray'
                                    }`,
                                  }}
                                >
                                  {' '}
                                  <DoneAllIcon fontSize='4px' />
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </Box>

            {/* Scroll button */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '3rem',
                right: 0,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              {showButton && (
                <Box
                  onClick={scrollToBtn}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.10)',
                    // color: '#fff',
                    borderRadius: '15%',
                    width: '40px',
                    height: '50px',
                    minWidth: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  <ExpandMoreIcon />
                </Box>
              )}
            </Box>

            {/* to send message */}
            <div
              style={{
                height: '42px',
                padding: '3px',
                background: '#fcfcfc',
                // border:"1px solid"
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                }}
              >
                <div
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                  onClick={() => setEmoji(!emoji)}
                >
                  <MoodIcon />
                </div>
                <div style={{ position: 'relative' }}>
                  {emoji && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '60px',
                        zIndex: 1,
                        left: '-50px',
                      }}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          handleEmojiClick(emojiData)
                        }
                      />
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  {selectedImage && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-300px',
                        zIndex: 1,
                        height: '290px',
                        width: '400px',
                        background: '#eceff1',
                        borderRadius: '10px',
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '15px',
                        }}
                      >
                        <span style={{ fontFamily: 'cursive' }}>
                          Preview Image
                        </span>
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt='test'
                          style={{ height: '200px', width: '200px' }}
                        ></img>
                        {isLoading ? (
                          <CircularProgress sx={{ color: 'green' }} size={20} />
                        ) : (
                          <SendIcon
                            sx={{ cursor: 'pointer', color: 'green' }}
                            onClick={() => handleFileSend()}
                          />
                        )}
                      </div>
                    </Box>
                  )}{' '}
                  <label htmlFor='fileInput'>
                    <AttachFileIcon
                      sx={{ cursor: 'pointer', marginTop: '5px' }}
                    />{' '}
                    <input
                      type='file'
                      id='fileInput'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e)}
                    />
                  </label>
                </div>
                <input
                  placeholder='Enter Message Here'
                  style={{
                    width: '85%',
                    marginBottom: '20px',
                    outline: 'none',
                    marginTop: '2px',
                    border: 'none',
                    height: '30px',
                  }}
                  value={message}
                  ref={inputRef}
                  onChange={(e) => handleChangeMessage(e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                ></input>
                <SendIcon
                  sx={{ cursor: 'pointer', marginTop: '6px' }}
                  onClick={() => handleSubmit()}
                />
              </div>
            </div>
          </Box>
        ) : (
          <Box
            sx={{
              width: '75%',
              height: '84.8vh',
              display: 'flex',
              backgroundColor: '#f0ebe3',
              justifyContent: 'center',
              // flexDirection: "column",
              alignItems: 'center',
            }}
          >
            <div>
              <img
                src={frontImage}
                style={{ height: '700px', width: '700px' }}
              ></img>
            </div>
          </Box>
        )}
      </Box>

      {callDial && (
        <CallingDial
          open={callDial}
          setOpen={setCallDial}
          name={singleUserData?.name}
          handleAcceptCall={handleAcceptCall}
          handleRejectCall={handleCallRejected}
          incomingCallData={incomingCallData}
          remoteStream={remoteStream}
        />
      )}
    </Box>
  );
};

export default CreateChat;
