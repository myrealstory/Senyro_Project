import moment from "moment";

import { DistrictListType, RegionListType } from "@/types/branchTypes";
import { FirstTimeOrderPopupStateType } from "@/types/firstTimeOrderPopupTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartApiDataType } from "@/types/cartTypes";

const initialState: FirstTimeOrderPopupStateType = {
  shouldCacheStep1: false,
  page: 1,
  districtList: {},
  regionList: [],
  selectedRegionId: undefined,
  selectedDistrictId: undefined,
  selectedBranchCode: undefined,
  selectedPickupMethod: undefined,
  selectedPickupHour: undefined,
  selectedPickupMinute: undefined,
  selectedPickupDate: undefined,
  branchAvailablePickupDate: undefined,
  isBackFrom: false,
  preSelectedData: {
    selectedRegionId: undefined,
    selectedBranchCode: undefined,
    selectedPickupMethod: undefined,
    selectedPickupHour: undefined,
    selectedPickupMinute: undefined,
    selectedPickupDate: undefined,
  },

  branchPickupInfo: {},
  willUpdateSelectedPickupDate: false,
};

const firstTimeOrderPopupSlice = createSlice({
  name: "firstTimeOrderPopup",
  initialState,
  reducers: {
    setIsBackFrom: (state, action: PayloadAction<FirstTimeOrderPopupStateType["isBackFrom"]>) => {
      state.isBackFrom = action.payload;
    },
    setShouldCacheStep1: (state, action: PayloadAction<FirstTimeOrderPopupStateType["shouldCacheStep1"]>) => {
      state.shouldCacheStep1 = action.payload;
    },
    setWillUpdateSelectedPickupDate: (state, action: PayloadAction<FirstTimeOrderPopupStateType["willUpdateSelectedPickupDate"]>) => {
      state.willUpdateSelectedPickupDate = action.payload;
    },
    setFTOPOptionsFromCartData: (state, action: PayloadAction<CartApiDataType>) => {
      state.page = 1;

      state.preSelectedData.selectedRegionId = action.payload.cart?.branch?.region?.id;
      state.preSelectedData.selectedBranchCode = action.payload.cart?.branch?.branchCode;
      state.preSelectedData.selectedPickupMethod = action.payload.cart?.deliveryMethod?.type;

      state.selectedRegionId = action.payload.cart?.branch?.region?.id;
      state.selectedBranchCode = action.payload.cart?.branch?.branchCode;
      state.selectedPickupMethod = action.payload.cart?.deliveryMethod?.type;
      if (action.payload.cart?.deliveryMethod?.type === "PICKUP") {
        const hour = String(moment(action.payload.cart?.deliveryMethod?.datetime).get("hours")).padStart(
          2,
          "0"
        );
        const minute = String(
          moment(action.payload.cart?.deliveryMethod?.datetime).get("minutes")
        ).padStart(2, "0");
        state.preSelectedData.selectedPickupHour = hour;
        state.preSelectedData.selectedPickupMinute = minute;

        state.selectedPickupHour = hour;
        state.selectedPickupMinute = minute;
        const year = String(moment(action.payload.cart?.deliveryMethod?.datetime).get("year"));
        const month = String(moment(action.payload.cart?.deliveryMethod?.datetime).get("month") + 1).padStart(2, "0");
        const date = String(moment(action.payload.cart?.deliveryMethod?.datetime).get("date")).padStart(2, "0");
        state.preSelectedData.selectedPickupDate = `${year}-${month}-${date}`;
        state.selectedPickupDate = `${year}-${month}-${date}`;
      }
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setDistrictList: (state, action: PayloadAction<DistrictListType>) => {
      state.districtList = action.payload;
    },
    setRegionList: (state, action: PayloadAction<RegionListType[]>) => {
      state.regionList = action.payload;
    },
    setSelectedRegionId: (state, action) => {
      state.selectedRegionId = action.payload;
      state.selectedDistrictId = undefined;
    },
    setSelectedDistrictId: (state, action) => {
      state.selectedDistrictId = action.payload;
    },
    setSelectedBranchCode: (state, action) => {
      state.selectedBranchCode = action.payload;
    },
    setSelectedPickupMethod: (state, action) => {
      state.selectedPickupMethod = action.payload;
    },
    setSelectedPickupHour: (state, action) => {
      state.selectedPickupHour = action.payload;
      state.selectedPickupMinute = undefined;
    },
    setSelectedPickupMinute: (state, action) => {
      state.selectedPickupMinute = action.payload;
    },
    setSelectedPickupDate: (state, action) => {
      state.selectedPickupDate = action.payload;
      state.selectedPickupHour = undefined;
      state.selectedPickupMinute = undefined;
    },
    setBranchPickupInfo: (state, action: PayloadAction<FirstTimeOrderPopupStateType["branchPickupInfo"]>) => {
      if (action.payload?.instantPickup) {
        state.branchPickupInfo.instantPickup = action.payload?.instantPickup;
      }
      if (!state.branchPickupInfo.advancedPickup) {
        state.branchPickupInfo.advancedPickup = {} as any;
      }

      if (action.payload?.advancedPickup?.available !== undefined) {
        state.branchPickupInfo.advancedPickup!.available = action.payload?.advancedPickup.available;
      }

      if (action.payload?.advancedPickup?.advancedPrepTime) {
        state.branchPickupInfo.advancedPickup!.advancedPrepTime = action.payload?.advancedPickup.advancedPrepTime;
      }
      
      if (action.payload?.advancedPickup?.availablePickupDate) {
        state.branchPickupInfo.advancedPickup!.availablePickupDate = action.payload?.advancedPickup.availablePickupDate;
      }
      
      if (action.payload?.advancedPickup?.availablePickupTimes) {
        state.branchPickupInfo.advancedPickup!.availablePickupTimes = action.payload?.advancedPickup.availablePickupTimes;
      }
      if (action.payload?.branchCode) {
        state.branchPickupInfo.branchCode = action.payload?.branchCode;
      }
      if (action.payload?.currentTime) {
        state.branchPickupInfo.currentTime = action.payload?.currentTime;
      }
    },
    setBranchAvailablePickupDate: (state, action) => {
      state.branchAvailablePickupDate = action.payload;
    },
    resetStep2Options: state => {
      state.selectedPickupMethod = undefined;
      state.selectedPickupDate = undefined;
      state.selectedPickupHour = undefined;
      state.selectedPickupMinute = undefined;
    },
    recoverStep1SelectedData: state => {
      state.selectedRegionId = state.preSelectedData.selectedRegionId;
      state.selectedBranchCode = state.preSelectedData.selectedBranchCode;
    },
    recoverStep2SelectedData: state => {
      state.selectedPickupMethod = state.preSelectedData.selectedPickupMethod;
      state.selectedPickupHour = state.preSelectedData.selectedPickupHour;
      state.selectedPickupMinute = state.preSelectedData.selectedPickupMinute;
      state.selectedPickupDate = state.preSelectedData.selectedPickupDate;
    },
    // keep reset function, might need this in the future
    resetStepAllOptions: state => {
      state.page = 1;
      state.selectedRegionId = undefined;
      state.selectedDistrictId = undefined;
      state.selectedBranchCode = undefined;
      state.selectedPickupMethod = undefined;
      state.selectedPickupHour = undefined;
      state.selectedPickupMinute = undefined;
      state.selectedPickupDate = undefined;
    },
  },
});

export const {
  setWillUpdateSelectedPickupDate,
  recoverStep1SelectedData,
  recoverStep2SelectedData,
  setFTOPOptionsFromCartData,
  setPage,
  setShouldCacheStep1,
  setDistrictList,
  setRegionList,
  setSelectedRegionId,
  setSelectedDistrictId,
  setSelectedBranchCode,
  setSelectedPickupMethod,
  setSelectedPickupHour,
  setSelectedPickupMinute,
  setSelectedPickupDate,
  setBranchPickupInfo,
  setBranchAvailablePickupDate,
  resetStep2Options,
  resetStepAllOptions,
  setIsBackFrom,
} = firstTimeOrderPopupSlice.actions;

export default firstTimeOrderPopupSlice.reducer;
