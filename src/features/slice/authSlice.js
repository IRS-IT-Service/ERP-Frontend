import { createSlice } from "@reduxjs/toolkit";
import { NotificationSoundPlay } from "../../commonFunctions/commonFunctions";
import ChatNotificationSound from "../../../public/chatRingtone.mp3";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isAdmin: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).isAdmin
    : false,
  userRole: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).userRoles
    : [],

  productColumns: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).productColumns
    : [],

  hiddenColumns: JSON.parse(localStorage.getItem("hiddenColumns") || "[]"),
  error: null,

  DriveVerifyOtp:"",

  /// admin portal data
  allUsers: {},
  onlineUsers: [],
  liveStatus: JSON.parse(localStorage.getItem("liveStatus") || "[]"),
  chatNotificationData: [],
  chatMessageData: {},
  chatMessageCount: {},
  chatTyping: [],

  /// WholeSale seller portal data
  allWholeSaleUsers: {},
  onlineWholeSaleUsers: [],
  liveWholeSaleStatus: JSON.parse(
    localStorage.getItem("liveWholeSaleStatus") || "[]"
  ),

  /// common
  autoOpenStatus: JSON.parse(localStorage.getItem("autoOpenStatus") || "true"),
  initialDropUpControl: false,
  notificationSound: JSON.parse(
    localStorage.getItem("notificationSound") || "true"
  ),
  chatNotificationSound: JSON.parse(
    localStorage.getItem("chatNotificationSound") || "true"
  ),
taskManagmentNotification :{}

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAdmin = action.payload.isAdmin;
      state.userRole = action.payload.userRoles;
      state.productColumns = action.payload.productColumns;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setHiddemColumns: (state, action) => {
      state.hiddenColumns = action.payload;
      localStorage.setItem("hiddenColumns", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    addError: (state, action) => {
      state.error = action.payload;
    },
    removeError: (state, action) => {
      state.error = null;
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },

    AddDriveVerifyOtp:(state,action) =>{
      state.DriveVerifyOtp = action.payload
    },

    /// admin portal data
    addAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    addOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addLiveStatus: (state, action) => {
      state.liveStatus = [action.payload, ...state.liveStatus];

      if (state.notificationSound) {
        NotificationSoundPlay();
      }

      if (state.liveStatus.length > 30) {
        state.liveStatus.pop();
      }

      localStorage.setItem("liveStatus", JSON.stringify(state.liveStatus));

      state.initialDropUpControl = true;
    },
    clearOneLiveStatus: (state, action) => {
      const indexToRemove = action.payload;
      const oldLiveStatusArray = [...state.liveStatus];
      if (indexToRemove >= 0 && indexToRemove < oldLiveStatusArray.length) {
        oldLiveStatusArray.splice(indexToRemove, 1);
      } else {
        console.log("Invalid index provided.");
      }
      state.liveStatus = [...oldLiveStatusArray];
      localStorage.setItem("liveStatus", JSON.stringify(state.liveStatus));
    },
    clearAllLiveStatus: (state) => {
      state.liveStatus = [];
      localStorage.removeItem("liveStatus");
    },
    addChatNotificationData: (state, action) => {
      const newDataId = action.payload._id;
      if (
        !state.chatNotificationData.some(
          (notification) => notification._id === newDataId
        )
      ) {
        state.chatNotificationData = [
          action.payload,
          ...state.chatNotificationData,
        ];
        if (state.chatNotificationSound) {
          const audio = new Audio(ChatNotificationSound);
          audio.play();
        }
      }
    },
    removeChatNotification: (state, action) => {
      state.chatNotificationData = action.payload;
    },
    addChatMessageData: (state, action) => {
      state.chatMessageData = action.payload;
    },
    removeChatMessageData: (state, action) => {
      state.chatMessageData = [];
    },
    addChatNotificationCount: (state, action) => {
      state.chatMessageCount = action.payload;
    },
    removeChatNotificationCount: (state) => {
      state.chatMessageCount = {};
    },
    
    addChatTyping: (state, action) => {
      state.chatTyping = [action.payload, ...state.chatTyping];
    },

    /// WholeSale seller portal data
    addAllWholeSaleUsers: (state, action) => {
      state.allWholeSaleUsers = action.payload;
    },
    addOnlineWholeSaleUsers: (state, action) => {
      state.onlineWholeSaleUsers = action.payload;
    },
    addLiveWholeSaleStatus: (state, action) => {
      state.liveWholeSaleStatus = [
        action.payload,
        ...state.liveWholeSaleStatus,
      ];

      if (state.notificationSound) {
        NotificationSoundPlay();
      }

      if (state.liveWholeSaleStatus.length > 30) {
        state.liveWholeSaleStatus.pop();
      }

      localStorage.setItem(
        "liveWholeSaleStatus",
        JSON.stringify(state.liveWholeSaleStatus)
      );

      state.initialDropUpControl = true;
    },

    clearOneLiveWholeSaleStatus: (state, action) => {
      const indexToRemove = action.payload;
      const oldLiveWholeSaleStatus = [...state.liveWholeSaleStatus];
      if (indexToRemove >= 0 && indexToRemove < oldLiveWholeSaleStatus.length) {
        oldLiveWholeSaleStatus.splice(indexToRemove, 1);
      } else {
        console.log("Invalid index provided.");
      }
      state.liveWholeSaleStatus = [...oldLiveWholeSaleStatus];
      localStorage.setItem(
        "liveWholeSaleStatus",
        JSON.stringify(state.liveWholeSaleStatus)
      );
    },
    clearAllLiveWholeSaleStatus: (state) => {
      state.liveWholeSaleStatus = [];
      localStorage.removeItem("liveWholeSaleStatus");
    },
    ///
    setAutoOpenStatus: (state, action) => {
      state.autoOpenStatus = action.payload;
      localStorage.setItem("autoOpenStatus", JSON.stringify(action.payload));
    },
    toggleNotificationSound: (state, action) => {
      state.notificationSound = action.payload;
      localStorage.setItem("notificationSound", JSON.stringify(action.payload));
    },
    toggleChatNotificationSound: (state, action) => {
      state.chatNotificationSound = action.payload;
      localStorage.setItem(
        "chatNotificationSound",
        JSON.stringify(action.payload)
      );
    },
    addTaskeNotification : (state, action) => {
      state.taskManagmentNotification = action.payload;
    }
  },
});

export const {
  setCredentials,
  logout,
  addError,
  addAllUsers,
  removeError,
  removeUserInfo,
  addOnlineUsers,
  addLiveStatus,
  clearAllLiveStatus,
  setAutoOpenStatus,
  clearOneLiveStatus,
  toggleNotificationSound,
  addLiveWholeSaleStatus,
  clearOneLiveWholeSaleStatus,
  clearAllLiveWholeSaleStatus,
  addOnlineWholeSaleUsers,
  addAllWholeSaleUsers,
  setHiddemColumns,
  toggleChatNotificationSound,
  addChatNotificationData,
  removeChatNotification,
  addChatMessageData,
  removeChatMessageData,
  addChatNotificationCount,
  addChatTyping,
  AddDriveVerifyOtp,
  addTaskeNotification
} = authSlice.actions;
export default authSlice.reducer;
