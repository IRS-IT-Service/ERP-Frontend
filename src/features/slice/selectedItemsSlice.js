import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createQueryItems: [],
  createQuerySku:[]
};

const selectedItemsSlice = createSlice({
  name: "SelectedItems",
  initialState,
  reducers: {
    setSelectedCreateQuery: (state, action) => {
      state.createQueryItems = action.payload;
    },
    removeSelectedCreateQuery: (state) => {
      state.createQueryItems = [];
    },
    setSelectedSkuQuery: (state, action) => {
      state.createQuerySku = action.payload;
    },
    removeSelectedSkuQuery: (state) => {
      state.createQuerySku = [];
    },
  },
});
export const {
    setSelectedCreateQuery,
    removeSelectedCreateQuery,
    setSelectedSkuQuery,removeSelectedSkuQuery
} = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
