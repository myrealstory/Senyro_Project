import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileResType } from "@/types/api/apiTypes";
import { memberApi } from "../api/memberApi";

type profileSliceInitialState = ProfileResType;

export const profileSliceInitialState: ProfileResType["data"] = {
  memberNo: "",
  memberTier: "",
  memberTierCode: 0,
  tierExpiryDate: "",
  title: "",
  firstName: "",
  lastName: "",
  gender: "",
  birthMonth: 0,
  birthYear: 0,
  hasChild: false,
  countryCode: "",
  mobile: "",
  email: "",
  emailOptIn: false,
  smsOptIn: false,
  preferLang: "",
  district: "",
  region: "",
  pointBalance: 0,
  inboxUnreadCount: 0,
  currentSpending: 0,
  renewalSpending: 0,
  tierSpending: [
    {
      tier: "",
      tierCode: 0,
      maintainSpending: 0,
      upgradeSpending: 0,
      effectiveDate: "",
      expiryDate: "",
    },
    {
      tier: "",
      tierCode: 0,
      maintainSpending: 0,
      upgradeSpending: 0,
      effectiveDate: "",
      expiryDate: "",
    },
  ],
  pointBucket: [
    {
      id: "",
      pointBalance: 0,
      expiryDate: "",
    },
  ],
  isSuperAccount: false,
  livingCountry: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState: profileSliceInitialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileResType["data"]>) => {
      return action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(memberApi.endpoints.getProfile.matchFulfilled, (state, action) => {
      if (typeof action.payload?.data !== "string") {
        return action.payload?.data;
      }
    });
  },
});

export const { setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
