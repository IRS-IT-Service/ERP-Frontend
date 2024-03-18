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
  
  }),
});

export const {
  useGetStudentinfoQuery,
} = otherApiSlice;
