import { apiSlice } from "./apiSlice";
import { RESTOCK_URL } from "../../constants/ApiEndpoints";
import { VENDOR_URL } from "../../constants/ApiEndpoints";

export const restockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "restockApi",
    createRestock: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/create`,
          method: "POST",
          body: data,
        };
      },
    }),
    CreateOverseasOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createOverseasOrder`,
          method: "POST",
          body: data,
        };
      },
    }),

    getAllRestock: builder.query({
      query: () => {
        return {
          url: `${RESTOCK_URL}/getAll`,
          method: "GET",
        };
      },
    }),
    updateRestockQuantity: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/updateOrderQuantity/${params.id}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),
    getRestockProductDetail: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getRestock/${id}`,
          method: "GET",
        };
      },
    }),
    getAllVendor: builder.query({
      query: () => {
        return {
          url: `${VENDOR_URL}/getAll`,
          method: "GET",
        };
      },
    }),
    getAllOverseasOrder: builder.query({
      query: () => {
        return {
          url: `${RESTOCK_URL}/getAllOverseasOrder`,
          method: "GET",
        };
      },
    }),
    getOneOverseasOrder: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getOneOverseasOrder/${id}`,
          method: "GET",
        };
      },
    }),

    deleteOrderItem: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/deleteOrderItem/${params.id}`,
          method: "DELETE",
          body: params.body,
        };
      },
    }),
    updateOverseaseOrder: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/updateColumn/${params.id}?type=${params.type}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),
    uploadOverseasReciept: builder.mutation({
      query: (params) => {
        return {
          url: `${RESTOCK_URL}/uploadReciept/${params.id}`,
          method: "POST",
          body: params.body,
        };
      },
    }),
    addVendorIdToAssignOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/assignOrder`,
          method: "POST",
          body: data,
        };
      },
    }),
    createPriceComparision: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createPriceComparision`,
          method: "POST",
          body: data,
        };
      },
    }),
    getPriceComparision: builder.query({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/getPriceComparision`,
          method: "GET",
        };
      },
    }),
    getSinglePriceComparision: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getPriceComparision/${id}`,
          method: "GET",
        };
      },
    }),
    assignOrderToVendor: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/assignOrderToVendor`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAssignedOrder: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/assignedVendor/${id}`,
          method: "GET",
        };
      },
    }),
    updateAssignedOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/updateAssignedOrder`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteAssignedProduct: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/deleteAssignedProduct`,
          method: "DELETE",
          body: data,
        };
      },
    }),
    assignPaidOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/assignPaidOrder`,
          method: "POST",
          body: data,
        };
      },
    }),
    overseasShipment: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createOverseasShipment`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllVendorWithOrder: builder.query({
      query: () => {
        return {
          url: `${RESTOCK_URL}/getAllVendorWithOrder`,
          method: "GET",
        };
      },
    }),
    getAllOverseasBox: builder.query({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/getAllOverseasBox?status=${data.type}&vendorId=${data.vendorId}`,
          method: "GET",
        };
      },
    }),
    createOverseasBox: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createOverseasBox`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllOverseasShipment: builder.query({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/getAllOverseasShipment?status=${data.type}&vendorId=${data.vendorId}`,
          method: "GET",
        };
      },
    }),
    getOneOverseasShipment: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getOneOverseasShipment/${id}`,
          method: "GET",
        };
      },
    }),
    getAllCreatedOrder: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getAllCreatedOrder`,
          method: "GET",
        };
      },
    }),
    getSingleOrder: builder.query({
      query: (id) => {
        return {
          url: `${RESTOCK_URL}/getSingleOrder/${id}`,
          method: "GET",
        }
      },
    }),
    updatePaymentForOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/updatePayment`,
          method: "PUT",
          body:data
        };
      },
    }),
    assingOrderVendor: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/assignOverseasOrder`,
          method: "POST",
          body:data
        };
      },
    }),
    createSubOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/createSubOrder`,
          method: "POST",
          body:data
        };
      },
    }),
    updateSubOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/updateSubOrder`,
          method: "PUT",
          body:data
        };
      },
    }),
    updateOrder: builder.mutation({
      query: (data) => {
        return {
          url: `${RESTOCK_URL}/updateOrder`,
          method: "PUT",
          body:data
        };
      },
    }),
  }),

});

export const {
  useCreateRestockMutation,
  useCreateOverseasOrderMutation,
  useGetAllRestockQuery,
  useUpdateRestockQuantityMutation,
  useGetRestockProductDetailQuery,
  useGetAllVendorQuery,
  useGetAllOverseasOrderQuery,
  useGetOneOverseasOrderQuery,
  useDeleteOrderItemMutation,
  useUpdateOverseaseOrderMutation,
  useUploadOverseasRecieptMutation,
  useAddVendorIdToAssignOrderMutation,
  useGetPriceComparisonQuery,
  useCreatePriceComparisionMutation,
  useGetPriceComparisionQuery,
  useGetSinglePriceComparisionQuery,
  useAssignOrderToVendorMutation,
  useGetAssignedOrderQuery,
  useUpdateAssignedOrderMutation,
  useDeleteAssignedProductMutation,
  useAssignPaidOrderMutation,
  useGetAllVendorWithOrderQuery,
  useGetAllOverseasBoxQuery,
  useCreateOverseasBoxMutation,
  useOverseasShipmentMutation,
  useGetAllOverseasShipmentQuery,
  useGetOneOverseasShipmentQuery,
  useGetAllCreatedOrderQuery,
  useGetSingleOrderQuery,
  useUpdatePaymentForOrderMutation,
  useAssignOrderVendorMutation,
  useCreateSubOrderMutation,
  useUpdateSubOrderMutation,
  useUpdateOrderMutation,
} = restockApiSlice;
