"use client";

import { MouseEvent } from "react";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { AuthProgressbar } from "../forms";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { PromotionImage } from "@/components/PromotionImage";
import Link from "next/link";
import Image from "next/image";
import EmailSend from "@/images/icons/Icon_email-gold@3x.png";
import Promotion from "@/images/samplePic/Placeholder Square.png";
import { useSelector } from "react-redux";
import "@/style/auth/auth.scss";
import { RootState } from "@/redux/store";
import { ROUTES } from "@/constants";

export const SubmittedContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const registerEmail = useSelector((state: RootState) => state.generalState.registerEmail);
  const { translate: t } = useTranslation(lang);

  const handleToContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    localStorage.setItem("isContactClickedInRegisterSubmittedPage", "true");
    if (window !== undefined) {
      window.location.href = `/${lang}/${ROUTES.CONTACT}`;
    }
  };

  return (
    <div className="registerSubmitContentContainer">
      <div>
        <AuthProgressbar title={["1", "2", t("registrationStep3.emailVerification")]} progress={3} />
      </div>
      <div className="registerSubmitEmailIcon">
        <Image src={EmailSend} width={83} height={83} alt="Email sent icon" />
      </div>
      <div className="registerSubmitTextsContainer">
        <h1>{t("registrationStep3.checkEmail")}</h1>

        <p className="registerSubmitTexxPleaseCheck">
          {t("registrationStep3.sendEmail")} <strong>{registerEmail}</strong>
          <br />
          {t("registrationStep3.pleaseCheck")}
          <button className="border-b-2" onClick={handleToContact}>
            {t("registrationStep3.contact")}
          </button>
        </p>
      </div>
      <div className="registerSubmitPromotionImgContainer">
        <PromotionImage
          divClass="mt-[27px] w-full sm:w-[60%] lg:w-[85%] md:w-full rounded-[30px]"
          img={Promotion}
          width={781}
          height={860}
          alt="Promotion image"
          placeholder="blur"
          loading="lazy"
          imgClass="mx-auto block h-auto"
        />
        <div>
          <Link className="font-semibold" href={`/${lang}/index`}>
            {t("registrationStep3.backToHome")}
          </Link>
        </div>
      </div>
      <MobileButtonContainer containerClass="md:px-[15px]">
        <Link href={`/${lang}/index`} className="registerSubmitMobileLink">
          {t("registrationStep3.backToHome")}
        </Link>
      </MobileButtonContainer>
    </div>
  );
};
