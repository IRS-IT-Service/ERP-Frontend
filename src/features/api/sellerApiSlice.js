import { apiSlice } from "./apiSlice";
import { SELLER_URL } from "../../constants/ApiEndpoints";

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "sellerApi",

    getAllSeller: builder.query({
      query: (params) => {
        return {
          url: `${SELLER_URL}/allSeller?query=${params}`,
          method: "GET",
        };
      },
    }),
    verifySeller: builder.mutation({
      query: (params) => {
        return {
          url: `${SELLER_URL}/verify/${params.id}`,
          method: "PUT",
          body: params.body,
        };
      },
    }),
    deactiveSeller: builder.mutation({
      query: (params) => {
        return {
          url: `${SELLER_URL}/toggle/${params}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const { useGetAllSellerQuery, useVerifySellerMutation,useDeactiveSellerMutation } = sellerApiSlice;
