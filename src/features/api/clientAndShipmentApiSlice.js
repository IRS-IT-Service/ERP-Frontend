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
    getAllPackages: builder.query({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/getAllCustomerOrderShipment?query=${data}`,
          method: "GET",
        };
      },
    }),
    updateCustomershippingAddress: builder.mutation({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/updateCustomershippingAddress`,
          method: "POST",
          body: data,
        };
      },
    }),
    createShipmentOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/createCustomerOrderShipment`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateShipment: builder.mutation({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/updateCustomerOrderShipment?query=${data.id}`,
          method: "POST",
          body: data,
        };
      },
    }),
    getCustomerOrderShipment: builder.query({
      query: (data) => {
        return {
          url: `${clientAndShipmentApi}/getCustomerOrderShipment/${data}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useAddClientMutation,
  useGetAllClientQuery,
  useGetAllPackagesQuery,
  useUpdateCustomershippingAddressMutation,
  useCreateShipmentOrderMutation,
  useUpdateShipmentMutation,
  useGetCustomerOrderShipmentQuery,
} = clientAndShipmentApiSlice;
