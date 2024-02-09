import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dscFormDetails: {},
};

const DscFormSlice = createSlice({
  name: "dscForm",
  initialState,
  reducers: {
    setDscformDetails: (state, action) => {
      state.dscFormDetails = action.payload;
    },
    removeDscformDetails: (state) => {
      state.dscFormDetails = {};
    },
  },
});
export const {
    setDscformDetails,
    removeDscformDetails,

} = DscFormSlice.actions;
export default DscFormSlice.reducer;
