import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();

const initialState = {
  createQueryItems: [],
  createQuerySku: [],
  NewselectedSKU: [],
  selectedOverseaseOrder: [],
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
    setStoredselectedSKU: (state, action) => {
      const Stored = [...state.NewselectedSKU, action.payload];
      const Unique = new Set(Stored);

      state.NewselectedSKU = [...Unique];
    },
    removeSelectedSkuQuery: (state) => {
      state.createQuerySku = [];
    },
    removeSelectedSKU: (state) => {
      state.NewselectedSKU = [];
    },
    setOverseaseSelectedOrder: (state, action) => {
      state.selectedOverseaseOrder = action.payload
    },
    removeSelectedOverseaseOrder: (state) => {
      state.selectedOverseaseOrder = [];
    },
  },
});
export const {
  setSelectedCreateQuery,
  removeSelectedCreateQuery,
  setSelectedSkuQuery,
  setStoredselectedSKU,
  removeSelectedSkuQuery,
  removeSelectedSKU,
  setOverseaseSelectedOrder,
  removeSelectedOverseaseOrder,
} = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
