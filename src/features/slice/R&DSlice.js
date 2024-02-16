import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  RAndForm: {},
};

const RAndDFormSlice = createSlice({
  name: 'RAndDForm',
  initialState,
  reducers: {
    setRAndForm: (state, action) => {
      state.RAndForm = action.payload;
    },
  },
});
export const { setRAndForm,} = RAndDFormSlice.actions;
export default RAndDFormSlice.reducer;
