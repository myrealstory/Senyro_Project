import Image from "next/image";
import React, { useState } from "react";

import { useCart } from "@/hook/useCart";
import { useTranslation } from "@/app/i18n/client";
import { MobileCartTableType } from "@/types/componentTypes";

import deleteIcon from "../../../images/icons/Icon_trash-primary@3x.png";
import MobileCartTableContainer from "./MobileCartTableContainer";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";
import { useDispatch } from "react-redux";

export const MobileCartTable = ({ mode, cartData, lang }: MobileCartTableType) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const [isExpandSubItems, setIsExpandSubItems] = useState(false);
  const { deleteAllProduct } = useCart({ lang });

  return (
    <>
      <ul className="flex w-full items-center justify-between md:hidden">
        <li className="text-[18px] uppercase leading-[20px] ">
          {mode === "PRODUCT" ? translate("cart.item") : translate("cart.gift")}
        </li>
        {mode === "PRODUCT" && (
          <li className="flex items-center" onClick={() => {
            dispatch(setGlobalAlertStatus({
              isGlobalAlertDisplay: true,
              alertTitle: translate("alertModal.g8_popup_title"),
              alertContent: "",
              leftButtonText: translate("alertModal.g8_popup_left_button_text"),
              rightButtonText: translate("alertModal.g8_popup_right_button_text"),
              onRightButtonClick: () => {
                deleteAllProduct()
              },
            }))
          }}>
            <Image src={deleteIcon} alt="123" className="mr-2 h-6 w-6" />
            <p className="text-h4 font-normal text-primaryGold">{translate("cart.all")}</p>
          </li>
        )}
      </ul>
      {/* {console.log(cartData, "cartData")} */}
      {cartData.map((item, index) => (
        <MobileCartTableContainer
          key={index}
          index={index}
          item={item}
          lang={lang}
          mode={mode}
          cartKey={item.cartKey}
          isExpandSubItems={isExpandSubItems}
          setIsExpandSubItems={setIsExpandSubItems}
        />
      ))}
    </>
  );
};
