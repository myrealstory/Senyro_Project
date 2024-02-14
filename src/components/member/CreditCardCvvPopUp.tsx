import React from "react";
import Image from "next/image";
import CreditCardTips from "@/images/icons/CreditCardTips@3x.png";
import CreditCardTipsMobile from "@/images/icons/CreditCardTips_Mobile@3x.png";
import CreditCardTipsTC from "@/images/icons/creditCard_tooltip_desktop-TC.png";
import CreditCardTipsMobileTC from "@/images/icons/creditCard_tooltip_mobile-TC.png";

import "@/style/member/member.scss";
import { LocaleKeysType } from "@/app/i18n";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseLeave: () => void;
  lang: LocaleKeysType;
}

const CreditCardCvvPopUp: React.FC<PopupProps> = ({ isOpen, onMouseLeave, lang }) => {
  const popupStyles = isOpen ? "flex" : "hidden";
  return (
    <div className={`creditCardCvvPopUpContainer ${popupStyles}`}>
      <div onMouseLeave={onMouseLeave}>
        <Image
          src={lang === "en" ? CreditCardTipsMobile : CreditCardTipsMobileTC}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="creditCardImageTipsMobile"
        />
        <Image src={lang === "en" ? CreditCardTips : CreditCardTipsTC} alt="" width={0} height={0} sizes="100vw" />
      </div>
    </div>
  );
};

export default CreditCardCvvPopUp;
