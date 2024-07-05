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

    
  }),
});

export const {
  useAddGroupMutation,
  useGetAllGroupInfoQuery,


  
} = marketingApiSlice;
