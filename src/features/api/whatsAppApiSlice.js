import { apiSlice } from "./apiSlice";
import { WhatsApp_URL } from "../../constants/ApiEndpoints";
import { DataSaverOff } from "@mui/icons-material";

export const whatsAppApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "whatsAppApi",

    saveWhatsAppNo: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/saveContactForWaapi?name=${data.name}`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllContactNo: builder.query({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/getAllSavedContact?name=${data}`,
          method: "GET",
        };
      },
    }),
    deleteContactNo: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/deleteSavedContact?name=${data.name}`,
          method: "DELETE",
          body: data,
        };
      },
    }),
    sendMessage: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/send-message`,
          method: "POST",
          body: data,
        };
      },
    }),
    sendMessageToAdmin: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/sendMessageToAdmin`,
          method: "POST",
          body: data,
        };
      },
    }),
    sendPdfOnWhatsappDsc: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/sendPdfDsc`,
          method: "POST",
          body: data,
        };
      },
    }),
    sendBulkMessagesWithPic: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/sendBulkMessage`,
          method: "POST",
          body: data,
        };
      },
    }),
    addCustomerNumber: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/addCustomerNumber`,
          method: "POST",
          body: data,
        };
      },
    }),
    
    getCustomerNumber: builder.query({
      query: () => {
        return {
          url: `${WhatsApp_URL}/getAllCustomer`,
          method: "GET",
        };
      },
    }),

    sendBulkWithoutMedia: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/sendBulkWithoutMedia`,
          method: "POST",
          body: data,
        };
      },
    }),
    AddScheduledTaskMessage: builder.mutation({
      query: (data) => {
        return {
          url: `${WhatsApp_URL}/AddScheduledTaskMessage`,
          method: "POST",
          body: data,
        };
      },
    }),

    getAllScheduleMessage: builder.query({
      query: () => {
        return {
          url: `${WhatsApp_URL}/getAllScheduleMessage`,
          method: "GET",
        };
      },
    }),
    getAllScheduleMessageHistory: builder.query({
      query: () => {
        return {
          url: `${WhatsApp_URL}/getAllScheduleMessagehistory`,
          method: "GET",
        };
      },
    }),

    deleteScheduledTask: builder.mutation({
      query: (id) => {
        console.log(id)
        return {
          url: `${WhatsApp_URL}/deleteScheduledTask/${id}`,
          method: "DELETE",
      
        };
      },
    }),
    
  }),
});

export const {
  useSaveWhatsAppNoMutation,
  useGetAllContactNoQuery,
  useDeleteContactNoMutation,
  useSendMessageMutation,
  useSendPdfOnWhatsappDscMutation,
  useSendMessageToAdminMutation,
  useSendBulkMessagesWithPicMutation,
  useAddCustomerNumberMutation,
  useGetCustomerNumberQuery,
  useSendBulkWithoutMediaMutation,
  useAddScheduledTaskMessageMutation,
  useGetAllScheduleMessageQuery,
  useGetAllScheduleMessageHistoryQuery,
  useDeleteScheduledTaskMutation,
  
} = whatsAppApiSlice;
