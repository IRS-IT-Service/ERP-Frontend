import { apiSlice } from "./apiSlice";
import { Marketing_URL } from "../../constants/ApiEndpoints";
import { DataSaverOff } from "@mui/icons-material";

export const marketingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "marketingApi",

    addGroup: builder.mutation({
      query: (data) => {
        return {
          url: `${Marketing_URL}/addGroup`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllGroupInfo: builder.query({
      query: () => {
        return {
          url: `${Marketing_URL}/getAllGroup`,
          method: "GET",
         
        };
      },
    }),

    getGroupInfoByid: builder.query({
      query: (id) => {
        return {
          url: `${Marketing_URL}/getGroupById/${id}`,
          method: "GET",
         
        };
      },
    }),

    updateGroupById: builder.mutation({
      query: (data) => {
        const id = data.id
        return {
          url: `${Marketing_URL}/updateGroup/${id}`,
          method: "PUT",
          body: data
         
        };
      },
    }),

    deleteGroupById: builder.mutation({
      query: (id) => {
        console.log(id)
       return {
          url: `${Marketing_URL}/deleteGroup/${id}`,
          method: "DELETE",
              
        };
      },
    }),

    
  }),
});

export const {
  useAddGroupMutation,
  useGetAllGroupInfoQuery,
  useGetGroupInfoByidQuery,
  useUpdateGroupByIdMutation,
  useDeleteGroupByIdMutation,


  
} = marketingApiSlice;
