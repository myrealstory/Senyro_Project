"use client";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import "@/style/index/indexUsed.scss";

import { RootState } from "@/redux/store";
import cartImg from "@/images/icons/Icon_shopping-cart-primary@3x.png";
import { AmountBox } from "../AmountBox";

export const CartWithTotalCount = () => {
  const totalItem = useSelector((state: RootState) => state.cart.apiData.cart?.itemCount);

  return (
    <div className="cartWithTotalCount h-auto w-[110%]">
      <Image src={cartImg} alt="cart" width={30} height={30} className="object-contain" />
      {/* <Image src={cartImg} alt="cart" width={0} height={0} sizes="100vw" /> */}
      {/* we are using window.print function and it can't be size=100vw, it will break the scale*/}
      <AmountBox amount={totalItem} containerStyle="2xl:top-[-0.5rem] lg:top-[-1rem] lg:right-[-1rem]" />
    </div>
  );
};
