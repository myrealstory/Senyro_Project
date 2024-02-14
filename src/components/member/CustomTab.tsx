"use client";

interface TabProps {
  onChange: (mode: string) => void;
  mode: string;
  tabs: string[];
  counts?: number[];
  isNavbarTop?: boolean;
}

export const CustomTab = ({ onChange, mode, tabs, counts, isNavbarTop }: TabProps) => {
  return (
    <ul className="customTabContainer ">
      {tabs.map((tab, index) => (
        <li
          key={index}
          className={`${isNavbarTop ? "py-4" : "py-2"} customTabCommonStyle ${
            mode === tab ? "customTabActivate" : ""
          }  `}
          onClick={() => onChange(tab)}
        >
          {tab} ({counts && counts[index]})
        </li>
      ))}
    </ul>
  );
};
