import { apiSlice } from "./apiSlice";
import { DriveUrl } from "../../constants/ApiEndpoints";

export const driveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "driveApi",

    createFolder: builder.mutation({
      query: (data) => {
        return {
          url: `${DriveUrl}/createFolder`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllFolder: builder.query({
      query: () => {
        return {
          url: `${DriveUrl}/getAllFolder`,
          method: "GET",
        };
      },
    }),
    getAllFilesOfSingleFolder: builder.mutation({
      query: (id) => {
        return {
          url: `${DriveUrl}/getAllFiles/${id}`,
          method: "GET",
        };
      },
    }),
    getSingleFile: builder.query({
      query: (id) => {
        return {
          url: `${DriveUrl}/getSingleFile/${id}`,
          method: "GET",
        };
      },
    }),
    uploadFile: builder.mutation({
      query: (data) => {
        return {
          url: `${DriveUrl}/uploadOnDrive`,
          method: "POST",
          body: data,
        };
      },
    }),
    deleteFolder: builder.mutation({
      query: (id) => {
        return {
          url: `${DriveUrl}/deleteFolder/${id}`,
          method: "DELETE",
        };
      },
    }),
    downloadFile: builder.mutation({
      query: (id) => {
        return {
          url: `${DriveUrl}/downloadfile/${id}`,
          method: "POST",
        };
      },
    }),
    deleteFile: builder.mutation({
      query: (id) => {
        return {
          url: `${DriveUrl}/deleteFile/${id}`,
          method: "DELETE",
        };
      },
    }),
    uploadFileWhatsapp: builder.mutation({
      query: (data) => {
        return {
          url: `${DriveUrl}/uploadFileWhatsapp`,
          method: "POST",
          body: data,
        };
      },
    }),
    getFolderBySpecificUser: builder.mutation({
      query: (data) => {
        return {
          url: `${DriveUrl}/getSingleUserFolders/${data}`,
          method: "GET",
        };
      },
    }),
    getAllUsersInDrive: builder.query({
      query: (data) => {
        return {
          url: `${DriveUrl}/getAllUsersInDrive`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useGetAllFolderQuery,
  useGetAllFilesOfSingleFolderMutation,
  useGetSingleFileQuery,
  useUploadFileMutation,
  useDeleteFolderMutation,
  useDownloadFileMutation,
  useDeleteFileMutation,
  useUploadFileWhatsappMutation,
  useGetFolderBySpecificUserMutation,
  useGetAllUsersInDriveQuery,
} = driveApiSlice;
