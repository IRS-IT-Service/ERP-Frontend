import { apiSlice } from "./apiSlice";
import { PROFORMA_URL } from "../../constants/ApiEndpoints";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reducerPath: "productApi",

    createProforma: builder.mutation({
      query: (data) => {
        return {
          url: `${PROFORMA_URL}/add`,
          method: "POST",
          body: data,
        };
      },
    }),
    getAllProforma: builder.query({
      query: () => {
        return {
          url: `${PROFORMA_URL}/getAll`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateProformaMutation, useGetAllProformaQuery } =
  productApiSlice;
