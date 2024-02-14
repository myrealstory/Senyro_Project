import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentHeight: 0,
  currentNavHeight: {
    isAppear: true,
    height: 0,
  },
};

const heightSlice = createSlice({
  name: "height",
  initialState,
  reducers: {
    setCurrentHeight: (state, action) => {
      state.currentHeight = action.payload;
    },
    setCurrentNavHeight: (state, action) => {
      state.currentNavHeight = action.payload;
    },
  },
});

export const { setCurrentHeight, setCurrentNavHeight } = heightSlice.actions;
export default heightSlice.reducer;
