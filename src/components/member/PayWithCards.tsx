"use client";

import Image from "next/image";
import Link from "next/link";

import VisaCard from "@/images/icons/Icon_VISA@3x.png";
import Mastercard from "@/images/icons/Icon_Master@3x.png";
import AmericanExpress from "@/images/icons/Icon_AE@3x.png";
import Add from "@/images/icons/Icon_add@3x.png";
import { useWindowSize } from "@/hook/useWindowSize";
import { LocaleKeysType } from "@/app/i18n";
import { CouponCreditCardContainer } from "@/components/member/CouponCreditCardContainer";
import { useGetCreditCardsQuery } from "@/redux/api/memberApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CardDisclaimer } from "@/components/member/CardDisclaimer";
import { useState } from "react";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import "@/style/member/member.scss";

export const PayWithCards = ({ lang }: { lang: LocaleKeysType }) => {
  const { data: creditCardResponse } = useGetCreditCardsQuery();
  const [creditCards] = useState(creditCardResponse?.data);
  const profileData = useSelector((state: RootState) => state.profile);
  const numberOfCards = creditCards && creditCards.length;
  const disabledAddButton = numberOfCards && numberOfCards >= 5;
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();

  const renderButton = () => {
    if (width < 768) {
      return (
        <MobileButtonContainer>
          <Link
            href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`}
            className="max-full flex w-full items-center justify-center gap-1  rounded-full bg-primaryGold py-3 font-semibold text-white"
          >
            <Image src={Add} width={24} height={24} alt="add credit card" />
            <span className="">{t("cardPopup.addCard")}</span>
          </Link>
        </MobileButtonContainer>
      );
    }

    if (width > 768) {
      return (
        <Link
          href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`}
          className={` ${
            disabledAddButton ? "bg-opacity-40" : "bg-primaryGold"
          } rounded-full font-semibold text-white md:mx-auto md:flex md:w-full md:max-w-[200px] md:items-center md:justify-center md:gap-2 md:py-4`}
        >
          <Image src={Add} width={24} height={24} alt="add credit card" />
          <span className="">{t("cardPopup.addCard")}</span>
        </Link>
      );
    }
  };

  return (
    <>
      {creditCardResponse?.data.length === 0 ? (
        <>
          <section className="flex w-full flex-col gap-9 rounded-[20px] px-4 sm:px-[7rem] lg:mt-[22px] lg:max-w-[600px] lg:bg-white lg:px-[2rem] lg:py-9 lg:shadow-lg">
            <div className="w-full pb-5 text-center text-[18px] font-semibold lg:text-left">
              <h1>{t("cardPopup.selectSavedCard")}</h1>
            </div>
            <div className="couponPayWithCardIconsContainer">
              <Image src={VisaCard} width={68} height={22} alt="Visa card icon" className="couponPayWithCardVisaIcon" />
              <Image
                src={Mastercard}
                width={58}
                height={36}
                alt="Mastercard icon"
                className="couponPayWithCardMasterIcon"
              />
              <Image
                src={AmericanExpress}
                width={36}
                height={36}
                alt="America Express icon"
                className="couponPayWithCardAEMXIcon"
              />
            </div>
            {renderButton()}
            <CardDisclaimer lang={lang} payWithCard />
          </section>
        </>
      ) : (
        <section className="couponSelectedCardContainer">
          <div className="couponSelectedCardTitle">
            <h1>{t("cardPopup.selectSavedCard")}</h1>
          </div>
          <div className="xl:rounded-[28px]">
            {creditCardResponse?.statusCode === 200 && profileData && (
              <CouponCreditCardContainer lang={lang} cards={creditCardResponse.data} profile={profileData} />
            )}
          </div>
        </section>
      )}
    </>
  );
};
