import { apiSlice } from "./apiSlice";
import { Expo } from "../../constants/ApiEndpoints";
export const otherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "expoApi",
    getStudentinfo: builder.query({
      query: (data) => ({
        url: `${Expo}/getWorkshop`,
        method: "GET",
      }),
    }),

    addCareer: builder.mutation({
      query: (data) => ({
        url: `/common/createCareer`,
        method: "POST",
        body: data,
      }),
    }),
  
  }),
});

export const {
  useGetStudentinfoQuery,
  useAddCareerMutation,
} = otherApiSlice;
