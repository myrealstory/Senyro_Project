"use client";
import Image from "next/image";
import ChevronOpen from "@/images/icons/Arrow - Down 2.png";
import ChevronClose from "@/images/icons/Arrow - Down 3.png";
import "@/style/general-information/general-information.scss";

type CareerFoldUnitProps = {
  title: string;
  isActive: boolean;
  activeIndex: number;
  onShow: (index: number) => void;
  JDArray: string[];
};

export const CareerFoldUnit = ({ title, isActive, activeIndex, onShow, JDArray }: CareerFoldUnitProps) => {
  return (
    <div className="CareerFoldUnitContainer">
      <ul className="CareerFoldUnitRegularUl">
        <li onClick={() => onShow(activeIndex)} className="flex w-full cursor-pointer justify-between">
          <h3 className=" ">{title}</h3>
          <button className="font-semibold" type="button" aria-expanded="true">
            <Image
              src={!isActive ? ChevronClose : ChevronOpen}
              width={0}
              height={0}
              alt="Click here to open faq accordion"
              className="CareerFoldUnitIcon"
            />
          </button>
        </li>
      </ul>

      {isActive && (
        <>
          <ul className="CareerFoldUnitIsActiveUl">
            {JDArray.map((item, index) => (
              <li key={index} className="">
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
