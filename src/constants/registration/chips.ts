import { ChipProps } from "@/types/form/formTypes";
import { ChipTitleProps } from "@/types/form/formTypes";

export const genderChips = {
  title: "Gender*",
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  },
  items: [
    { id: "male", name: "gender", label: "male", tabIndex: 0 },
    { id: "female", name: "gender", label: "female", tabIndex: 1 },
    { id: "undisclosed", name: "gender", label: "Undisclosed", tabIndex: 2 },
  ],
} as ChipProps;

export const numberOfGuestsChip = {
  type: "chip",
  title: "No. of Guest*",
  labelFor: "numOfGuests",
  labelTitle: "No. of Guest*",
  name: "numOfGuests",
  id: "numOfGuests",
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  },
  items: [
    {
      id: "20-50",
      name: "numOfGuests",
      label: "20-50",
      tabIndex: 0,
    },
    {
      id: "50-100",
      name: "numOfGuests",
      label: "50-100",
      tabIndex: 1,
    },
    {
      id: "100+",
      name: "numOfGuests",
      label: "100+",
      tabIndex: 2,
    },
  ],
} as ChipProps;

export const titleChips = {
  type: "chip",
  title: "Title*",
  labelFor: "title",
  name: "title",
  id: "title",
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  },
  items: [
    {
      name: "title",
      label: "Mr.",
      labelTC: "先生",
      tabIndex: 1,
    },
    {
      name: "title",
      label: "Mrs.",
      labelTC: "太太",
      tabIndex: 2,
    },
    {
      name: "title",
      label: "Ms.",
      labelTC: "女士",
      tabIndex: 3,
    },

    {
      name: "title",
      label: "Miss",
      labelTC: "小姐",
      tabIndex: 4,
    },
    {
      name: "title",
      label: "Dr.",
      labelTC: "博士",
      tabIndex: 5,
    },
    {
      name: "title",
      label: "Prof.",
      labelTC: "教授",
      tabIndex: 7,
    },
  ],
} as ChipTitleProps;

export const childrenChips = {
  title: "Do you have any children?",
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  },
  items: [
    {
      id: "yes",
      name: "hasChild",
      label: "YES",
      tabIndex: 1,
    },
    { id: "no", name: "hasChild", label: "NO", tabIndex: 2 },
  ],
} as ChipProps;

export const languageChips = {
  title: "Preferred Language*",
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  },
  items: [
    {
      id: "zh",
      name: "preferredLan",
      label: "繁中",
      tabIndex: 1,
    },
    {
      id: "en",
      name: "preferredLan",
      label: "English",
      tabIndex: 2,
    },
  ],
} as ChipProps;
