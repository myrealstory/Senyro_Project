import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountryCodeType {
  code: string;
  mobile: string;
}

export const initialCountryCode: CountryCodeType = {
  code: "852",
  mobile: "",
};

const registrationMobileSlice = createSlice({
  name: "registrationMobile",
  initialState: initialCountryCode,
  reducers: {
    getCountryCodeWithMobile: (state, action: PayloadAction<CountryCodeType>) => {
      state.code = action.payload.code;
      state.mobile = action.payload.mobile;
    },
  },
});

export const { getCountryCodeWithMobile } = registrationMobileSlice.actions;
export default registrationMobileSlice.reducer;
