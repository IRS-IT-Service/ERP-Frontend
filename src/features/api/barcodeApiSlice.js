import { apiSlice } from "./apiSlice";
import { BARCODE_URL } from "../../constants/ApiEndpoints";

export const BarcodeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "BarcodeApi",
    generateBarcode: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/generate`,
        method: "POST",
        body: data,
      }),
    }),
    getBarcode: builder.mutation({
      query: (id) => ({
        url: `${BARCODE_URL}/getSerialNumber/${id}`,
        method: "GET",
      }),
    }),
    verifyBarcodeForDispatch: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/verifyBarcodeForDispatch`,
        method: "POST",
        body: params,
      }),
    }),
    verifyBarcodeForReturn: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/verifyBarcodeForReturn`,
        method: "POST",
        body: params,
      }),
    }),
    barcodeForRejection: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/barcodeForRejection`,
        method: "POST",
        body: params,
      }),
    }),
    dispatchBarcodeInBulk: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/dispatchBarcodeInBulk`,
        method: "POST",
        body: params,
      }),
    }),
    returnBarcodeInBulk: builder.mutation({
      query: (params) => ({
        url: `${BARCODE_URL}/returnProduct`,
        method: "POST",
        body: params,
      }),
    }),
    getAllBarcodesSkus: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllBarcodes`,
        method: "GET",
      }),
    }),
    scanBarcodeForVerify: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/searchVerifySticky`,
        method: "POST",
        body: data,
      }),
    }),
    getBarcodesReturnHistory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getreturnHistory`,
        method: "GET",
      }),
    }),
    getBarcodesDispatchHistory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getBarcodeHistory`,
        method: "GET",
      }),
    }),
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/addSubCategory`,
        method: "POST",
        body: data,
      }),
    }),
    getAllProductBySku: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/getProducts`,
        method: "POST",
        body: data,
      }),
    }),
    getAllSalesHistory: builder.query({
      query: (params) => ({
        url: `${BARCODE_URL}/salesHistory${params}`,
        method: "GET",
      }),
    }),
    getSingleSalesHistory: builder.mutation({
      query: (id) => ({
        url: `${BARCODE_URL}/salesHistory/${id}`,
        method: "GET",
      }),
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/addCustomer`,
        method: "POST",
        body: data,
      }),
    }),
    getCustomer: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllCustomer`,
        method: "GET",
      }),
    }),
    getSingleCustomer: builder.query({
      query: (id) => ({
        url: `${BARCODE_URL}/getSingleCustomer/${id}`,
        method: "GET",
      }),
    }),
    createBoxOpen: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/createBoxOpen`,
        method: "POST",
        body: data,
      }),
    }),
    getAllOpenedBox: builder.query({
      query: (data) => ({
        url: `${BARCODE_URL}/getAllOpenedBox`,
        method: "GET",
      }),
    }),
    getAllBoxOpenHistory: builder.query({
      query: (data) => ({
        url: `${BARCODE_URL}/getAllBoxOpenHistory`,
        method: "GET",
      }),
    }),
    createBoxOpenApproval: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/createBoxOpenApproval`,
        method: "POST",
        body: data,
      }),
    }),
    updateBoxOpenApproval: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/updateBoxOpenApproval`,
        method: "PUT",
        body: data,
      }),
    }),
    getBoxOpenApproval: builder.query({
      query: (id) => ({
        url: `${BARCODE_URL}/getBoxOpenApproval/${id}`,
        method: "GET",
      }),
    }),
    createShipment: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/createShipment`,
        method: "POST",
        body: data,
      }),
    }),
    getSingleShipment: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/getSingleShipment/${data}`,
        method: "Get",
      }),
    }),
    getAllShipment: builder.query({
      query: (params) => ({
        url: `${BARCODE_URL}/getAllShipment${params}`,
        method: "GET",
      }),
    }),
    getShipmentBarcode: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/getProductDetailsByBarcode`,
        method: "POST",
        body: data,
      }),
    }),

    updateAssignedStatus: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/updateAssignedStatus`,
        method: `POST`,
        body: data,
      }),
    }),
    updateDamagedStatus: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/updateDamagedStatus`,
        method: `POST`,
        body: data,
      }),
    }),
    getAllBarcodes: builder.query({
      query: (filter) => ({
        url: `${BARCODE_URL}/getAllBarcodesV2?${filter}`,
        method: `GET`,
      }),
    }),
    createRandDInventry: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/createReqRandD`,
        method: `Post`,
        body:data
      }),
    }),
    getAllRandDInventry: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllRDInventory`,
        method: `GET`,
      }),
    }),
    getPendingRequest: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getPendingRequest`,
        method: `GET`,
      }),
    }),
    getPendingRequestCount: builder.query({
      query: () => {
        return {
          url: `${BARCODE_URL}/getPendingRequestCount`,
          method: "GET",
        };
      },
    }),
    addProductInRnDInventory: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/addProductInR&DInventory`,
        method: `Post`,
        body:data
      }),
    }),
  }),
});

export const {
  useGenerateBarcodeMutation,
  useGetBarcodeMutation,
  useVerifyBarcodeForDispatchMutation,
  useDispatchBarcodeInBulkMutation,
  useGetAllBarcodesSkusQuery,
  useScanBarcodeForVerifyMutation,
  useVerifyBarcodeForReturnMutation,
  useGetBarcodesReturnHistoryQuery,
  useGetBarcodesDispatchHistoryQuery,
  useReturnBarcodeInBulkMutation,
  useBarcodeForRejectionMutation,
  useAddSubCategoryMutation,
  useGetAllProductBySkuMutation,
  useGetAllSalesHistoryQuery,
  useGetSingleSalesHistoryMutation,
  useAddCustomerMutation,
  useGetCustomerQuery,
  useGetSingleCustomerQuery,
  useCreateBoxOpenMutation,
  useGetAllOpenedBoxQuery,
  useGetAllBoxOpenHistoryQuery,
  useCreateBoxOpenApprovalMutation,
  useUpdateBoxOpenApprovalMutation,
  useGetBoxOpenApprovalQuery,
  useCreateShipmentMutation,
  useGetSingleShipmentMutation,
  useGetAllShipmentQuery,
  useGetShipmentBarcodeMutation,
  useUpdateAssignedStatusMutation,
  useUpdateDamagedStatusMutation,
  useGetAllBarcodesQuery,
  useCreateRandDInventryMutation,useGetAllRandDInventryQuery ,
  useGetPendingRequestQuery,
  useGetPendingRequestCountQuery,
  useAddProductInRnDInventoryMutation
} = BarcodeSlice;
