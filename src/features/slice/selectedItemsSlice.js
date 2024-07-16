import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();

const initialState = {
  createQueryItems: [],
  createQuerySku: [],
  NewselectedSKU: [],
  selectedOverseaseOrder: [],
  selectedItems: [],
  selectedSkus: [],
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
      state.selectedOverseaseOrder = action.payload;
    },
    removeSelectedOverseaseOrder: (state) => {
      state.selectedOverseaseOrder = [];
    },
    setSelectedItems: (state, action) => {
      const skuIndex = state.selectedItems.findIndex(item => item.SKU === action.payload);
      if (skuIndex !== -1) {
        state.selectedItems.splice(skuIndex, 1);
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    setSelectedSkus: (state, action) => {
      const skuIndex = state.selectedSkus.indexOf(action.payload);
      if (skuIndex !== -1) {
        state.selectedSkus.splice(skuIndex, 1);
      } else {
        state.selectedSkus.push(action.payload);
      }
    },
    removedSelectedItems: (state, action) => {
      state.selectedItems = [];
    },
    removeSelectedSkus: (state, action) => {
      state.selectedSkus = [];
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
  removeSelectedSkus,
  removedSelectedItems,
  setSelectedSkus,
  setSelectedItems,
} = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
