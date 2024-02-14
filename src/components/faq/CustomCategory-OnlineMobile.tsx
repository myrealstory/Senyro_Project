"use client";
interface CategoryProps {
  onChange: (category: string) => void;
  category: string;
  tabs: string[];
}

export const CustomCategory = ({ onChange, category, tabs }: CategoryProps) => {
  return (
    <div
      className={`mb-1 flex 
      ${category === "Membership" || category === "Privileges" || category === "Account" ? "mr-10 gap-3" : "gap-2"}`}
    >
      {tabs.map(tab => (
        <>
          <a href={`#${tab.toLowerCase().replace(/ /g, "")}`}>
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`rounded-full px-[12px] py-[10px] text-[12px] font-medium leading-4 md:px-5 md:text-[16px] xl:px-[1.875rem] xl:py-3 2xl:text-[1.25rem] 2xl:font-normal ${
                category === tab ? "bg-primaryGold text-primaryGold05 " : "text-primaryGold"
              }`}
            >
              {tab}
            </button>
          </a>
        </>
      ))}
    </div>
  );
};
