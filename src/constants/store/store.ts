export interface Time {
  week: string;
  time: string;
}

export interface Store {
  id: number;
  name: string;
  license: string;
  address: string;
  contact: string;
  notAvailable?: boolean;
  fax: string;
  open: boolean;
  time: Time[];
}

export interface Stores {
  region: string;
  district: string;
  stores: Store[];
}

export const stores: Stores[] = [
  {
    region: "Hong Kong Island",
    district: "Islands",
    stores: [
      {
        id: 1,
        name: "IFC Mall",
        license: "3818828208",
        address: "Shop 3099-3100, Podium Level 3, ifc mall, No. 8 Finance St, Central, Hong Kong",
        contact: "2234 7633",
        fax: "2234 7633",
        open: true,
        notAvailable: false,
        time: [
          {
            week: "Monday",
            time: "11:30 - 22:00",
          },
          {
            week: "TuseDay",
            time: "11:30 - 22:00",
          },
          {
            week: "Wednesday",
            time: "11:30 - 22:00",
          },
          {
            week: "Thursday",
            time: "11:30 - 22:00",
          },
          {
            week: "Friday/PH Eve",
            time: "11:30 - 22:00",
          },
          {
            week: "Saturday",
            time: "11:30 - 22:00",
          },
          {
            week: "Sunday/PH",
            time: "11:30 - 22:00",
          },
        ],
      },
    ],
  },
  {
    region: "Kowloon",
    district: "Kowloon City",
    stores: [
      {
        id: 2,
        name: "Shen Sun",
        license: "788273728",
        address: "Shop 3302, Podium Level 1, ifc mall, No. 10 Finance St, Central, Kowloon",
        contact: "67372 9633",
        fax: "67372 9633",
        open: true,
        notAvailable: false,
        time: [
          {
            week: "Monday",
            time: "11:30 - 22:00",
          },
          {
            week: "TuseDay",
            time: "11:30 - 22:00",
          },
          {
            week: "Wednesday",
            time: "11:30 - 22:00",
          },
          {
            week: "Thursday",
            time: "11:30 - 22:00",
          },
          {
            week: "Friday/PH Eve",
            time: "11:30 - 22:00",
          },
          {
            week: "Saturday",
            time: "11:30 - 22:00",
          },
          {
            week: "Sunday/PH",
            time: "11:30 - 22:00",
          },
        ],
      },
    ],
  },
  {
    region: "New Territories",
    district: "Sai Kung",
    stores: [
      {
        id: 3,
        name: "New Mall",
        license: "9099826",
        address: "Shop 3302, Podium Level 1, ifc mall, No. 10 Finance St, Sai Kung",
        contact: "45565 7782",
        fax: "45565 7782",
        open: false,
        notAvailable: true,
        time: [
          {
            week: "Monday",
            time: "09:30 - 21:00",
          },
          {
            week: "TuseDay",
            time: "09:30 - 21:00",
          },
          {
            week: "Wednesday",
            time: "09:30 - 21:00",
          },
          {
            week: "Thursday",
            time: "09:30 - 21:00",
          },
          {
            week: "Friday/PH Eve",
            time: "09:30 - 21:00",
          },
          {
            week: "Saturday",
            time: "09:30 - 21:00",
          },
          {
            week: "Sunday/PH",
            time: "09:30 - 21:00",
          },
        ],
      },
    ],
  },
];
