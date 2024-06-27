import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../../constants/ApiEndpoints";
import BASEURL from "../../constants/BaseApi";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "useApi",
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    otpLogin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifyLoginOtp`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}/getAllUserAdmin`,
        method: "GET",
      }),
    }),
    getAllUsersHistory: builder.query({
      query: (page) => ({
        url: `${USERS_URL}/getAllUserHistory?page=${page || 1}`,
        method: "GET",
      }),
    }),
    getOneUsers: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/getSingleUser/${id}`,
        method: "GET",
      }),
    }),
    userRoleUpdate: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/userRoleUpdate/?Type=${data.type}`,
        method: "POST",
        body: data.body,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ data, id }) => ({
        url: `${USERS_URL}/changePassword/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `${USERS_URL}/resetPassword/${token}`,
        method: "PUT",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgetPassword`,
        method: "POST",
        body: data,
      }),
    }),
    masterPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/setMasterPassword`,
        method: "POST",
        body: data,
      }),
    }),
    createTaskUpdate: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createTaskUpdate`,
        method: "POST",
        body: data,
      }),
    }),
    getTaskUpdate: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/getTask?from=${data.from}&to=${data.to}`,
        method: "GET",
      }),
    }),
    getAllUserHistory: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/getAllUserHistory?date=${data.date}&type=${data.type}`,
        method: "GET",
      }),
    }),
    createUserHistory: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createUserHistory`,
        method: "POST",
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatePassword`,
        method: "POST",
        body: data,
      }),
    }),
    clickTologout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/clicktologoutadmin`,
        method: "POST",
        body: data,
      }),
    }),
    getChatMessage: builder.mutation({
      query: (data) => ({
        url: `${BASEURL}/chat/getChat?senderId=${data.senderId}&receiverId=${data.receiverId}`,
        method: "GET",
      }),
    }),
    uploadFileOnImageKit: builder.mutation({
      query: (data) => ({
        url: `${BASEURL}/chat/uploadFile`,
        method: "POST",
        body: data,
      }),
    }),
    getReceivedMessages: builder.mutation({
      query: (receiverId) => ({
        url: `${BASEURL}/chat/getReceivedMessages/${receiverId}`,
        method: "GET",
      }),
    }),
    changeVisibility: builder.mutation({
      query: (data) => ({
        url: `${BASEURL}/chat/changeVisibility`,
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateProfile`,
        method: "POST",
        body: data,
      }),
    }),
    userUpdateWhole: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateUser`,
        method: "PUT",
        body: data,
      }),
    }),
    getSingleAdmin: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/getSingleAdmin/${data}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
  useGetOneUsersQuery,
  useUserRoleUpdateMutation,
  useClickTologoutMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useMasterPasswordMutation,
  useOtpLoginMutation,
  useGetAllUsersHistoryQuery,
  useCreateTaskUpdateMutation,
  useGetTaskUpdateQuery,
  useGetAllUserHistoryQuery,
  useCreateUserHistoryMutation,
  useUpdatePasswordMutation,
  useGetChatMessageMutation,
  useUploadFileOnImageKitMutation,
  useGetReceivedMessagesMutation,
  useChangeVisibilityMutation,
  useUpdateProfileMutation,
  useUserUpdateWholeMutation,useGetSingleAdminQuery
} = userApiSlice;
