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
          body:data
        };
      },
    }),
    getAllContactNo:builder.query({
      query:(data) =>{
        return {
            url: `${WhatsApp_URL}/getAllSavedContact?name=${data}`,
            method:"GET"
        }
      }  
    }),
    deleteContactNo:builder.mutation({
        query:(data) =>{
            return {
                url:`${WhatsApp_URL}/deleteSavedContact?name=${data.name}`,
                method:"DELETE",
                body:data
            }
        }
    }),
    sendMessage:builder.mutation({
      query:(data)=>{
        return {
          url:`${WhatsApp_URL}/send-message`,
          method:"POST",
          body:data
        }
      }
    })
   
  }),
});

export const {useSaveWhatsAppNoMutation,useGetAllContactNoQuery,useDeleteContactNoMutation , useSendMessageMutation} = whatsAppApiSlice;
