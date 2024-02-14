import { Stores } from "@/types/api/store";

export const emptyStore: Stores = {
  id: 0,
  name: "",
  address: "",
  lat: 0,
  long: 0,
  region: {
    id: 0,
    name: "",
  },
  district: {
    id: 0,
    name: "",
  },
  reminderMessage: "",
  directionMessage: "",
  openingHours: {
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  },
  distanceKm: null,
  isOpenNow: false,
  lng: 0,
  branchCode: "",
  nameEn: "",
  displaySequence: 0,
  storeLocationDisplayStatus: 0,
  contactNumber: "",
  faxNumber: "",
  restaurantLicense: "",
};
