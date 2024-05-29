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

    getCareers: builder.query({
      query: (data) => ({
        url: `/common/getERPCareers`,
        method: "GET",
      }),
    }),

    getApplicants: builder.mutation({
      query: (id) => ({
        url: `/common/getApplicants/${id}`,
        method: "GET",
      }),
    }),
    getShipRocketCourier: builder.mutation({
      query: (data) => ({
        url: `/common/getShipRocket`,
        method: "POST",
        body:data
      }),
    }),
  
  }),
});

export const {
  useGetStudentinfoQuery,
  useAddCareerMutation,
  useGetCareersQuery,
  useGetApplicantsMutation,useGetShipRocketCourierMutation
} = otherApiSlice;
