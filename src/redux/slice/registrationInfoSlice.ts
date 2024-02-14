import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InfoState {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  mobile: string;
  hasChild: string;
  month: string;
  year: string;
  country: string;
  preferredLan: string;
  notToReceiveEmailPromotion: boolean;
  notToReceiveMobilePromotion: boolean;
  readTermsAndConditions: boolean;
}

interface RegistrationState {
  info: InfoState;
}

export const initialState = {
  info: {
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobile: "",
    hasChild: "",
    month: "",
    year: "",
    country: "",
    preferredLan: "",
    notToReceiveEmailPromotion: false,
    notToReceiveMobilePromotion: false,
    readTermsAndConditions: false,
  } as InfoState,
} as RegistrationState;

// Create a slice for registration
const registrationInfoSlice = createSlice({
  name: "registrationInfo",
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<InfoState>) => {
      state.info = action.payload;
    },
    updateInfo: (state, action: PayloadAction<InfoState>) => {
      state.info = {
        ...state.info,
        ...action.payload,
      };
    },
  },
});

export const { setInfo, updateInfo } = registrationInfoSlice.actions;
export default registrationInfoSlice.reducer;
