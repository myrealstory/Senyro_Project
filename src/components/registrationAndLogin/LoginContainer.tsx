"use client";

import LogoGold from "@/images/icons/Icon_senryo-new.png";
import Promotion from "@/images/samplePic/Placeholder Square.png";
import Image from "next/image";
import { OtpForm } from "@/components/forms/OtpForm";
import { PromotionImage } from "@/components/PromotionImage";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { PromoItems } from "./promoItems";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { ROUTES } from "@/constants";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import "@/style/auth/auth.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CartPickup from "../cart/CartPickup";

export const LoginContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const { isCartPickupOpen } = useSelector((state: RootState) => state.generalState);
  const { selectedBranchCode } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const path = usePathname();
  const route = useRouter();

  useLayoutEffect(() => {
    if (isAlreadyLogin === true) {
      route.push(`/${ROUTES.INDEX}`);
    }
  }, [path, route, isAlreadyLogin]);

  return (
    <>
      {isCartPickupOpen.isOpen && <CartPickup lang={lang} mode={selectedBranchCode !== undefined ? "EDIT" : "NEW"} />}
      <PromotionImage
        divClass="cursor-pointer lg:w-[500px] lg:h-auto"
        width={550}
        height={629}
        alt="Promotion item"
        placeholder="blur"
        loading="lazy"
        imgClass="hidden h-auto lg:w-full lg:h-full object-contain lg:block "
        img={Promotion}
        url={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`}
      />
      <div className="loginFirstContainer">
        <div className="loginSecondContainer">
          <Image src={LogoGold} width={0} height={0} alt="Senryo logo" />
          <h1>{t("login.login")}</h1>
        </div>
        <div className="loginOtpFormContainer pt-3">
          <div className="w-full lg:px-7 2xl:px-12">
            <OtpForm lang={lang} />
          </div>
        </div>
        <PromoItems lang={lang} />
      </div>
    </>
  );
};
