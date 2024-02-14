"use client";

import { SelectProps } from "@/types/form/formTypes";
import { getYears } from "@/components/auth/authUtils";
import moment from "moment";
const today = moment();
const todayYYYY = parseInt(moment(today).format("YYYY"));

// Country
export const country: SelectProps = {
  labelFor: "country",
  labelText: "Your Living Country*",
  defaultOption: "- Select Country -",
  default: "",
  name: "country",
  id: "country",
  items: ["Hong Kong", "Macau", "Mainland"],
  itemsTC: ["香港", "澳門", "中國"],
};

export const countryCode: SelectProps = {
  labelFor: "countryCode",
  labelText: "",
  defaultOption: "",
  default: "+852",
  name: "countryCode",
  id: "countryCode",
  items: ["+852", "+853", "+86"],
};

//  Region
// Region for registration / profile page
export const regionWithoutAllArea: SelectProps = {
  labelFor: "regionWithoutAllArea",
  labelText: "Your Living Region*",
  defaultOption: "- Select Region -",
  default: "",
  name: "regionCode",
  id: "regionWithoutAllArea",
  items: ["Hong Kong Island", "Kowloon", "New Territories", "Outlying Islands"],
};

// Region for store locators
export const regionWithAllArea: SelectProps = {
  labelFor: "regionWithAllArea",
  labelText: "",
  defaultOption: "Region",
  default: "",
  name: "region",
  id: "regionWithAllArea",
  items: ["All Areas", "Hong Kong Island", "Kowloon", "New Territories", "Outlying Islands"],
};

// District
// Region for registration / profile page
export const districtWithoutAllDistrict: SelectProps = {
  labelFor: "districtWithoutAllDistrict",
  labelText: "",
  defaultOption: "- Select District -",
  default: "",
  name: "districtCode",
  id: "districtWithoutAllDistrict",
  items: [
    "Islands",
    "Kwai Tsing",
    "North",
    "Sai Kung",
    "Sha Tin",
    "Tai Po",
    "Tsuen Wan",
    "Tuen Mun",
    "Yuen Long",
    "Kowloon City",
    "Kwun Tong",
    "Sham Shui Po",
    "Wong Tai Sin",
    "Yau Tsim Mong",
    "Central & Western",
    "Eastern",
    "Southern",
    "Wan Chai",
  ],
};

// District for store locators
export const districtWithAllDistrict: SelectProps = {
  labelFor: "districtWithAllDistrict",
  labelText: "",
  defaultOption: "District",
  default: "",
  name: "district",
  id: "districtWithAllDistrict",
  items: [
    "All Districts",
    "Islands",
    "Kwai Tsing",
    "North",
    "Sai Kung",
    "Sha Tin",
    "Tai Po",
    "Tsuen Wan",
    "Tuen Mun",
    "Yuen Long",
    "Kowloon City",
    "Kwun Tong",
    "Sham Shui Po",
    "Wong Tai Sin",
    "Yau Tsim Mong",
    "Central & Western",
    "Eastern",
    "Southern",
    "Wan Chai",
  ],
};

// Title
export const titles: SelectProps = {
  labelFor: "title",
  labelText: "Title*",
  defaultOption: "- Select Title -",
  default: "",
  name: "title",
  id: "title",
  items: ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof."],
  itemsTC: ["先生", "太太", "女士", "小姐", "博士", "教授"],
};

export const contactEnquiry: SelectProps = {
  labelFor: "contactEnquiry",
  labelText: "Type of Enquiry / Feedback*",
  defaultOption: "- Select Enquiry Type-",
  default: "",
  name: "contactEnquiry",
  id: "contactEnquiry",
  items: [
    "Account Login",
    "Member Upgrade/ Renewal",
    "Member Registration/ Recruitment",
    "Promotion/ Transactions",
    "Feedback(Order/ Service/ Food)",
    "Membership Cancellation",
    "Others",
  ],
  itemsTC: [
    "會員登入",
    "會員升級/續會",
    "會員登記/募集",
    "折扣優惠/消費查詢",
    "意見回饋(訂單/服務/食品)",
    "取消會籍",
    "其他",
  ],
};

export const campaignEnquiry: SelectProps = {
  labelFor: "campaignEnquiry",
  labelText: "Enquiry Type*",
  defaultOption: "- Select Enquiry Type-",
  default: "",
  name: "campaignEnquiry",
  id: "campaignEnquiry",
  items: ["Executive bento ", "Corporate catering", "Tuna fish cut show", "Others"],
  itemsTC: ["商務便當", "企業外燴", "現切三文魚表演", "其他"],
};

// ================== Time Related ======================
const yearList: string[] = getYears(1924, 2005).map(year => year.toString());
// yearList.unshift("Year");

const yearList2: string[] = getYears(1900, 2023).map(year => year.toString());
yearList2;

const yearList3: string[] = getYears(todayYYYY - 99, todayYYYY - 18).map(year => year.toString());
yearList3.unshift("Year");

const yearList4: string[] = getYears(todayYYYY - 99, todayYYYY - 18).map(year => year.toString());
yearList4.unshift("年份");

// Years
// Registration form / Profile page
export const years: SelectProps = {
  labelFor: "years",
  labelText: "",
  defaultOption: "Year",
  default: "",
  name: "years",
  id: "years",
  items: yearList,
  itemsWithRollingYearEn: yearList3,
  itemsWithRollingYearTc: yearList4,
};

// Months
// Registration form / Profile page
export const monthsWithNumbers: SelectProps = {
  labelFor: "monthsWithNumbers",
  labelText: "Your Birthday*",
  defaultOption: "Month",
  default: "",
  name: "month",
  id: "monthsWithNumbers",
  items: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
};

// Years
//Select year and month in transaction popup
export const years2: SelectProps = {
  labelFor: "years2",
  labelText: "",
  defaultOption: "YYYY",
  default: "",
  name: "years2",
  id: "years2",
  items: yearList2,
};

// Months
// Select year and month in transaction popup
export const monthsWithEngText: SelectProps = {
  labelFor: "monthWithEngText",
  labelText: "",
  defaultOption: "MM",
  default: "",
  name: "months",
  id: "monthWithEngText",
  items: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

// Hours
export const hours: SelectProps = {
  labelFor: "hours",
  labelText: "",
  defaultOption: "HH",
  default: "",
  name: "hours",
  id: "hours",
  items: ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
};

// Minutes
// CHECK: Not sure about values of minutes, TBD
export const minutes: SelectProps = {
  labelFor: "minutes",
  labelText: "",
  defaultOption: "MM",
  default: "",
  name: "minutes",
  id: "minutes",
  items: ["00", "15", "30", "45"],
};

export const selectNumberOfGuests: SelectProps = {
  type: "select",
  labelFor: "numberOfGuests",
  labelText: "Number of Guests*",
  defaultOption: "- Select Number of Guests -",
  default: "",
  name: "numberOfGuests",
  id: "numberOfGuests",
  items: ["20-50", "50-100", "100+"],
};
