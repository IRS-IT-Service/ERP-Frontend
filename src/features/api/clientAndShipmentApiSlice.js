import { apiSlice } from "./apiSlice";
import { clientAndShipmentApi } from "../../constants/ApiEndpoints";

export const clientAndShipmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "clientAndShipmentApi",

    addClient: builder.mutation({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/addClientBulk`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllClient: builder.query({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/getClient`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useAddClientMutation,useGetAllClientQuery } = clientAndShipmentApiSlice;
