import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    liveCalcDetails: [],
};

const LiveCalcReducer = createSlice({
  name: "liveCalc",
  initialState,
  reducers: {
    setLiveCalcDetails: (state, action) => {
      state.liveCalcDetails = action.payload;
    },
    removeLiveCalcDetails: (state) => {
      state.liveCalcDetails = {};
    },
  },
});
export const {
    setLiveCalcDetails,
    removeLiveCalcDetails,

} = LiveCalcReducer.actions;
export default LiveCalcReducer.reducer;
