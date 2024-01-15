import { apiSlice } from "./apiSlice";
import { Assets_URL } from "../../constants/ApiEndpoints";

export const assetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "assetsApi",

    createAssets: builder.mutation({
      query: (data) => {
        return {
          url: `${Assets_URL}/create`,
          method: "POST",
          body:data
        };
      },
    }),
    getAllAssets: builder.query({
      query: (page) => {
        return {
          url: `${Assets_URL}/getAll?page=${page}`,
          method: "Get",
       
        };
      },
    }),
    getSingleAssets: builder.mutation({
      query: (data) => {
        return {
          url: `${Assets_URL}/getAssetsByCode/${data}`,
          method: "Get",
       
        };
      },
    }),
    deleteSingleAssets: builder.mutation({
      query: (data) => {
        return {
          url: `${Assets_URL}/deleteAssets/${data}`,
          method: "Post",
       
        };
      },
    }),
  }),
});

export const { useCreateAssetsMutation, useGetAllAssetsQuery ,useGetSingleAssetsMutation,useDeleteSingleAssetsMutation} = assetsApiSlice;
