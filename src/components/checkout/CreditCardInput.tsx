import React from "react";
import { usePathname } from "next/navigation";

import { getLangFromString } from "@/utils/commonUtils";
import { CreditCardInputType } from "@/types/componentTypes";

import { CreditCard } from "../member/CreditCard";

export const CreditCardInput = ({
  disableQRCodePopup,
  handleDeleteCard,
  id,
  checked,
  value,
  name,
  card,
  setSelectedCard,
  profile,
  checkoutForm,
  isDisplayCVV,
  isAE,
}: CreditCardInputType) => {
  const path = usePathname();
  const lang = getLangFromString(path);

  return (
    <div
      className="mb-[10px] flex h-full w-full items-center rounded-2xl border-[0.5px] border-solid border-primaryGold3 py-4 md:mb-[1vw] md:py-[1vw] md:pl-[0.4vw]"
      key={id}
    >
      <label className="goldenCircle ">
        <input type="radio" name={name} value={value} checked={checked} onChange={() => setSelectedCard(id)} />
        <span className={"checkMarked"} />
      </label>
      <CreditCard
        disableQRCodePopup={disableQRCodePopup}
        card={card}
        lang={lang}
        onDelete={handleDeleteCard}
        path={path}
        MRight
        containerStyle="bg-transparent w-full h-full flex items-center border-none shadow-none md:pr-[1.61vw] pr-4 md:ml-[1vw]"
        profile={profile}
        checkoutForm={checkoutForm}
        isDisplayCVV={isDisplayCVV}
        onClick={() => {
          setSelectedCard(id)
        }}
        isAE={isAE}
      />
    </div>
  );
}
