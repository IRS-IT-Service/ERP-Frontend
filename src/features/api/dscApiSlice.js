import { apiSlice } from "./apiSlice";
import { DSC_URL } from "../../constants/ApiEndpoints";

export const dscApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "dscApi",

    createFormDynamicData: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/createNewModel`,
          method: "POST",
          body: data,
        };
      },
    }),
    getFormDynamicData: builder.query({
      query: () => {
        return {
          url: `${DSC_URL}/getFormDynamicData`,
          method: "GET",
        };
      },
    }),
    getOneFormDynamicData: builder.query({
      query: (params) => {
        return {
          url: `${DSC_URL}/getOneFormDynamicData/${params}`,
          method: "GET",
        };
      },
    }),
    addIssuesToModel: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/addIssuesToModel`,
          method: "POST",
          body: data,
        };
      },
    }),
    removeIssuesToModel: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/RemoveIssuesToModel`,
          method: "DELETE",
          body: data,
        };
      },
    }),
    getCommonDroneRepairData: builder.query({
      query: (data) => {
        return {
          url: `${DSC_URL}/getCommonDroneRepairData`,
          method: "GET",
        };
      },
    }),
    addCommonDroneRepairData: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/addCommonDroneRepairData`,
          method: "POST",
          body: data,
        };
      },
    }),
    deleteCommonRepairData: builder.mutation({
      query: (id) => {
        return {
          url: `${DSC_URL}/deleteCommonRepairData/${id}`,
          method: "DELETE",
        };
      },
    }),
    saveRepairingForm: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/saveRepairingForm`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllRepairingForm: builder.query({
      query: (data) => {
        return {
          url: `${DSC_URL}/getAllRepairingForm?query=${data}`,
          method: "GET",
        };
      },
    }),
    getSingleRepairingForm: builder.query({
      query: (id) => {
        return {
          url: `${DSC_URL}/getSingleRepairingForm/${id}`,
          method: "GET",
        };
      },
    }),
    updateCustomerAknowledgement: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/updateCustomerAknowledgement`,
          method: "PUT",
          body: data,
        };
      },
    }),
    updateRepairStatus: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/UpdateRepairStatus/${data.token}?status=${data.status}&rejectRemark=${data.rejectRemark}`,
          method: "PUT",
        };
      },
    }),
    updateRepairForm: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/updateRepairForm`,
          method: "PUT",
          body: data,
        };
      },
    }),
    updateRepairImage: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/UpdateDefectedItemImage`,
          method: "POST",
          body: data,
        };
      },
    }),
    addWebsiteStatus: builder.mutation({
      query: (data) => {
        return {
          url: `${DSC_URL}/createRepairingStatus`,
          method: "Post",
          body: data,
        };
      },
    }),
    getWebsiteStatus: builder.query({
      query: (id) => {
        return {
          url: `${DSC_URL}/getRepairingStatus/${id}`,
          method: "GET",
        };
      },
    }),
    deleteWebsiteStatus: builder.mutation({
      query: (id) => {
        return {
          url: `${DSC_URL}/deleteWebStatus/${id}`,
          method: "Delete",
        };
      },
    }),
  }),
});

export const {
  useCreateFormDynamicDataMutation,
  useGetFormDynamicDataQuery,
  useGetOneFormDynamicDataQuery,
  useAddIssuesToModelMutation,
  useRemoveIssuesToModelMutation,
  useGetCommonDroneRepairDataQuery,
  useAddCommonDroneRepairDataMutation,
  useDeleteCommonRepairDataMutation,
  useSaveRepairingFormMutation,
  useGetAllRepairingFormQuery,
  useGetSingleRepairingFormQuery,
  useUpdateCustomerAknowledgementMutation,
  useUpdateRepairStatusMutation,
  useUpdateRepairFormMutation,
  useUpdateRepairImageMutation,
  useGetWebsiteStatusQuery,
  useAddWebsiteStatusMutation,
  useDeleteWebsiteStatusMutation,
} = dscApiSlice;
