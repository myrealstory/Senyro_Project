import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TitleType {
  title: string;
}

export const initialCountryCode: TitleType = {
  title: "",
};

const titleSlice = createSlice({
  name: "title",
  initialState: initialCountryCode,
  reducers: {
    getTitle: (state, action: PayloadAction<TitleType>) => {
      state.title = action.payload.title;
    },
  },
});

export const { getTitle } = titleSlice.actions;
export default titleSlice.reducer;
