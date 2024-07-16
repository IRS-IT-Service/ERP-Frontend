import { apiSlice } from "./apiSlice";
import { Task_URL } from "../../constants/ApiEndpoints";

export const taskManagementApiSilce = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "createTaskApi",

    createTask: builder.mutation({
      query: (data) => {
        return {
          url: `${Task_URL}/createTask`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateTask: builder.mutation({
        query: (data) => {
          return {
            url: `${Task_URL}/updateTask?query=${data.query}`,
            method: "PUT",
            body: data.body,
          };
        },
      }),
      getTasksByEmpId: builder.query({
        query: (data) => {
          return {
            url: `${Task_URL}/getTasksByEmpId/${data}`,
            method: "GET",
     
          };
        },
      }),
      getAllTasksManagement: builder.query({
        query: (data) => {
          return {
            url: `${Task_URL}/getAllTasksManagement`,
            method: "GET",
     
          };
        },
      }),
      deleteTask: builder.mutation({
        query: (data) => {
          return {
            url: `${Task_URL}/deleteTask/${data}`,
            method: "DELETE",
     
          };
        },
      }),

  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTasksByEmpIdQuery,
  useGetAllTasksManagementQuery,
  useDeleteTaskMutation,

} = taskManagementApiSilce;
