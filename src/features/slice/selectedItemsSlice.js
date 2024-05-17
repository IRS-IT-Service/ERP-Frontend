import { createSlice } from "@reduxjs/toolkit";
import { enableMapSet } from 'immer';

enableMapSet();


const initialState = {
  createQueryItems: [],
  createQuerySku: [],
  NewselectedSKU:[],
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
      
      const Stored = [...state.NewselectedSKU , action.payload]; 
      const Unique = new Set(Stored);
      
      state.NewselectedSKU = [...Unique];
    },
    removeSelectedSkuQuery: (state) => {
      state.createQuerySku = [];
    },
    removeSelectedSKU: (state) => {
      state.NewselectedSKU = [];
    },
  },
});
export const {
  setSelectedCreateQuery,
  removeSelectedCreateQuery,
  setSelectedSkuQuery,
  setStoredselectedSKU,
  removeSelectedSkuQuery,
  removeSelectedSKU
} = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
