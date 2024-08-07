import { createSlice } from "@reduxjs/toolkit";
import { removedSelectedItems } from "./selectedItemsSlice";

const initialState = {
  RAndForm: {},
  Addparts: [],
  selectedSkusRandD: [],
  selectedItemsRandD: [],
};

const RAndDFormSlice = createSlice({
  name: "RAndDForm",
  initialState,
  reducers: {
    setRAndForm: (state, action) => {
      state.RAndForm = action.payload;
    },
    setAddparts: (state, action) => {
      state.Addparts = action.payload;
    },
    setSelectedItemsRandD: (state, action) => {
      const skuIndex = state.selectedItemsRandD.findIndex(
        (item) => item.SKU === action.payload
      );
      if (skuIndex !== -1) {
        state.selectedItemsRandD.splice(skuIndex, 1);
      } else {
        state.selectedItemsRandD.push(action.payload);
      }
    },
    setSelectedSkusRandD: (state, action) => {
      const skuIndex = state.selectedSkusRandD.indexOf(action.payload);
      if (skuIndex !== -1) {
        state.selectedSkusRandD.splice(skuIndex, 1);
      } else {
        state.selectedSkusRandD.push(action.payload);
      }
    },
    removeSelectedSkusRandD: (state, action) => {
      state.selectedSkusRandD = [];
    },
    removedSelectedItemsRandD: (state) => {
      state.selectedItemsRandD = [];
    },
  },
});
export const {
  setRAndForm,
  setAddparts,
  setSelectedItemsRandD,
  setSelectedSkusRandD,
  removeSelectedSkusRandD,
  removedSelectedItemsRandD,
} = RAndDFormSlice.actions;

export default RAndDFormSlice.reducer;
