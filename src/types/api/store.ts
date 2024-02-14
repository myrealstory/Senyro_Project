export interface Coords {
  lat: number;
  lng: number;
}

export interface Stores {
  id: number;
  branchCode: string;
  nameEn: string;
  displaySequence: number;
  storeLocationDisplayStatus: number;
  contactNumber: string;
  faxNumber: string;
  lat: number;
  long: number;
  restaurantLicense: string;
  district: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
  name: string;
  reminderMessage: string;
  directionMessage: string;
  address: string;
  openingHours: OpeningTime;
  distanceKm: null;
  isOpenNow: boolean;
  lng: number;
}

export interface OpeningTime {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
  [key: string]: string;
}

export interface OpeningTimeREMAPPED {
  [x: string]: string;
}
