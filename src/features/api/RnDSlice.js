import { apiSlice } from "./apiSlice";
import { RnD_URL } from "../../constants/ApiEndpoints";
import { BARCODE_URL } from "../../constants/ApiEndpoints";

export const RnDApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "RnDApi",

    addProjectName: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/createProject`,
        method: "POST",
        body: data,
      }),
    }),
    getAllProjectData: builder.query({
      query: () => ({
        url: `r-and-d/getAllProjects`,
        method: "GET",
      }),
    }),
    addProjectItem: builder.mutation({
      query: (data) => ({
        url: `r-and-d/addProductInProject/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getAllRDInventory: builder.query({
      query: () => ({
        url: `${BARCODE_URL}/getAllRDInventory`,
        method: "GET",
      }),
    }),
    changeStatus: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/projectStatusUpdate`,
        method: "PUT",
        body: data,
      }),
    }),
    getSingleProject: builder.query({
      query: (id) => ({
        url: `${RnD_URL}/getSingleProject/${id}`,
        method: "GET",
      }),
    }),
    getAllPreOrder: builder.query({
      query: (id) => ({
        url: `${RnD_URL}/getAllPreOrder`,
        method: "GET",
      }),
    }),
    getPreOrderCount: builder.query({
      query: (id) => ({
        url: `${RnD_URL}/getPreOrderCount`,
        method: "GET",
      }),
    }),
    fullFillPreOrder: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/fullFillPreOrder`,
        method: "POST",
        body: data,
      }),
    }),
    allDispatchRnDProduct: builder.query({
      query: (data) => ({
        url: `${RnD_URL}/allDispatchRnDProduct`,
        method: "Get",
      
      }),
    }),
    allDispatchAprovalCount: builder.query({
      query: (data) => ({
        url: `${RnD_URL}/allDispatchAprovalCount`,
        method: "Get",
       
      }),
    }),
    ApproveRnDproduct: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/ApproveRnDproduct`,
        method: "POST",
        body: data,
      }),
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/updateProject/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    addImage: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/addImage/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    addRemarks: builder.mutation({
      query: (data) => ({
        url: `${RnD_URL}/changeRemark/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getAllRemarks: builder.query({
      query: (id) => ({
        url: `${RnD_URL}/allRemarks/${id}`,
        method: "Get",
      }),
    }),
  }),
});

export const {
  useAddProjectNameMutation,
  useGetAllProjectDataQuery,
  useAddProjectItemMutation,
  useGetAllRDInventoryQuery,
  useChangeStatusMutation,
  useGetSingleProjectQuery,
  useGetAllPreOrderQuery,
  useGetPreOrderCountQuery,
  useFullFillPreOrderMutation,
  useAllDispatchRnDProductQuery,
  useAllDispatchAprovalCountQuery,
  useApproveRnDproductMutation,
  useUpdateProjectMutation,
  useAddImageMutation,
  useAddRemarksMutation,
  useGetAllRemarksQuery
} = RnDApiSlice;
 