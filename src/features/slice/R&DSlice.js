import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  RAndForm: {},
  Addparts:[]
};

const RAndDFormSlice = createSlice({
  name: 'RAndDForm',
  initialState,
  reducers: {
    setRAndForm: (state, action) => {
      state.RAndForm = action.payload;
    },
    setAddparts: (state, action) => {
      state.Addparts = action.payload;
    },
  },
});
export const { setRAndForm,setAddparts} = RAndDFormSlice.actions;

export default RAndDFormSlice.reducer;
