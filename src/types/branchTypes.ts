export type BranchListApiResponseType = {
  branches: BranchListType[];
  lastOrderBranch?: BranchListType;
};

export type BranchListType = {
  descriptions?: string[];
  branchCode: string;
  branchGroupsId: number | null;
  displaySequence: number;
  storeLocationDisplayStatus: boolean;
  lat: number;
  long: number;
  district: CommonIdNameType;
  region: CommonIdNameType;
  reminderMessage: string;
  directionMessage: string;
  address: string;
  distanceKm: number | null;
  isAvailablePickup: boolean;
  oosProducts: {
    skuCode: string;
    name: string;
  }[];
} & CommonIdNameType;

export type DistrictListType = {
  [regionId: number]: CommonIdNameType[];
  code: string;
  name: string;
};

export type CommonIdNameType = {
  id: number;
  name: string;
  code?: string;
};

export type RegionListType = {
  districts: DistrictListType[];
  code: string;
} & CommonIdNameType;

export type AdvancePickupType = {
  availablePickupTimes: {
    [key: string]: [string];
  };
  advancedPrepTime: number;
  available: boolean;
  availablePickupDate: string;
};

export interface BranchesType {
  branchCode?: string;
  currentTime?: string;
  instantPickup?: {
    currentDayOperationTime: [string];
    instantPrepTime: number;
    available: boolean;
  };
  advancedPickup?: AdvancePickupType;
}

export interface AvailablePickupDateType {
  currentDatetime: string;
  availableDates: [string];
}
