import { LocaleKeysType } from "@/app/i18n";
import { AvailablePickupDateType, BranchesType, RegionListType } from "./branchTypes";

export type PickUpMethodType = "EFFECTIVE" | "PICKUP" | undefined;

type SelectedData = {
  selectedRegionId?: number;
  selectedDistrictId?: number;
  selectedBranchCode?: string;
  selectedPickupMethod: PickUpMethodType;
  selectedPickupHour?: string;
  selectedPickupMinute?: string;
  selectedPickupDate?: string;
}

export type FirstTimeOrderPopupStateType = {
  shouldCacheStep1: boolean;
  districtList: any;
  regionList: RegionListType[];
  page: number;
  isBackFrom: boolean;
  branchPickupInfo: BranchesType;
  branchAvailablePickupDate: AvailablePickupDateType | undefined;
  // preSelectedData => user / guest selected data from cart
  preSelectedData: SelectedData;
  willUpdateSelectedPickupDate: boolean;
} & SelectedData;

// ---------------------------------------- for api ----------------------------------------
export type GetBranchListInputType = {
  lang: LocaleKeysType;
  region?: number;
  district?: number;
  lat?: number;
  long?: number;
  // for caching only (rtk)
  cache?: boolean;
};
