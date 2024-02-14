import React from "react";
import Image from "next/image";
import QTY from "../QTY";
import "../cart/TextEllipsis.css";

type PlatterItemType = {
  imgUrl: string;
  title: string;
  price: number;
  limitQty: number;
  qty: number;
  incrementAmount?: () => void;
  decrementAmount?: () => void;
};

export default function PlatterItem({
  imgUrl,
  title,
  price,
  qty,
  limitQty,
  incrementAmount,
  decrementAmount,
}: PlatterItemType) {
  return (
    <>
      <li className="mb-10 last:mb-0  md:hidden">
        <div className="flex items-start space-x-[17px] ">
          <div className="h-[60px] w-[60px]">
            <Image src={imgUrl} alt="" className="h-full w-full object-cover" width={0} height={0} sizes="100vw" />
          </div>
          <div className="flex flex-col items-center justify-between">
            <div className="mb-[27px] md:mb-0">
              <h6 className="multiline-ellipsis text-xl font-medium leading-[23px]">{title}</h6>
            </div>
            <div className="flex w-full items-center justify-around space-x-[14px]">
              <span className="text-xl font-medium leading-6 text-primaryGold">+${price}</span>
              <QTY
                limit={limitQty}
                size={"sm"}
                qty={qty}
                incrementAmount={incrementAmount}
                decrementAmount={decrementAmount}
                soldOut={limitQty <= 0 ? true : false}
              />
            </div>
          </div>
        </div>
      </li>
      <li className="mb-10 hidden pr-2 last:mb-0 md:block">
        <div className="flex items-start space-x-[17px] md:items-center">
          <div className="flex w-1/2 items-center space-x-5">
            <div className="h-[3.75rem] w-[3.75rem] lg:h-[4.16vw] lg:w-[4.16vw]">
              <Image src={imgUrl} alt="" className="h-full w-full object-cover" width={0} height={0} sizes="100vw" />
            </div>
            <h6 className="multiline-ellipsis text-xl font-medium leading-6">{title}</h6>
          </div>
          <div className="w-1/4 text-center">
            <p className="text-xl font-medium leading-6">+{price}</p>
          </div>
          <div className="w-1/4 text-center">
            <QTY
              limit={limitQty}
              size={"sm"}
              qty={qty}
              incrementAmount={incrementAmount}
              decrementAmount={decrementAmount}
              soldOut={limitQty <= 0 ? true : false}
            />
          </div>
        </div>
      </li>
    </>
  );
}
