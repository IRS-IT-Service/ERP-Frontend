import { apiSlice } from "./apiSlice";
import { RnD_URL } from "../../constants/ApiEndpoints";
import { BARCODE_URL } from "../../constants/ApiEndpoints";

export const RnDApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "RnDApi",

    addProjectName: builder.mutation({
        query: (data) => ({
          url: `${RnD_URL}/createProject`,
          method: 'POST',
          body: data,
        }),
      }),
      getAllProjectData: builder.query({
        query: () => ({
          url: `r-and-d/getAllProjects`,
          method: 'GET',
        }),
      }),
      addProjectItem: builder.mutation({
        query: (data) => ({
          url: `r-and-d/addProjectItem/${data.id}`,
          method: 'POST',
          body: data,
        }),
      }),
      getAllRDInventory: builder.query({
        query: () => ({
          url: `${BARCODE_URL}/getAllRDInventory`,
          method: 'GET',
        }),
      }),
  
  }),
});

export const {
  useAddProjectNameMutation,
  useGetAllProjectDataQuery,
  useAddProjectItemMutation,
  useGetAllRDInventoryQuery,

} = RnDApiSlice;
