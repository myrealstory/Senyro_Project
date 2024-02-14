import React from "react";
import Image from "next/image";
import arrowPrimaryIcon from "../../../images/icons/Icon_arrow-right-primary@3x.png";
import arrowWhiteIcon from "../../../images/icons/Icon_arrow-right-white@3x.png";

type ButtonGroupType = {
  arrow: boolean;
  even: boolean;
  title: string[];
  handlers: (() => void)[];
};

export default function ButtonGroup({ arrow, even, title, handlers }: ButtonGroupType) {
  return (
    <div className="flex w-full items-center justify-end space-x-4">
      {title[0] ? (
        <button
          className={`flex ${
            even ? "w-1/2" : "w-2/5"
          } items-center justify-center space-x-2 rounded-full border-[3px] border-primaryGold py-5 md:py-[30px]`}
          onClick={handlers[0]}
        >
          <Image src={arrowPrimaryIcon} alt="" className={`w-9 rotate-180  ${arrow ? "block" : "hidden"}`} />
          <p className="text-lg font-medium text-primaryGold md:text-[32px] md:leading-[38px]">{title[0]}</p>
        </button>
      ) : null}
      {title[1] && (
        <button
          className={`btn-dark flex ${
            title[0] === undefined ? "w-full" : even ? "w-1/2" : "w-3/5"
          } items-center justify-center space-x-2 py-5 md:py-[30px]`}
          onClick={handlers[1]}
        >
          <p className="font-medium md:text-[32px] md:leading-[38px]">{title[1]}</p>
          <Image src={arrowWhiteIcon} alt="" className={`w-9 ${arrow ? "block" : "hidden"}`} />
        </button>
      )}
    </div>
  );
}
