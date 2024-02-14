"use client";

import { LocaleKeysType } from "@/app/i18n";
import { PromotionImage } from "../PromotionImage";
import { useTranslation } from "@/app/i18n/client";
import { OtpForm } from "@/components/forms/OtpForm";
import { PromoItems } from "./promoItems";
import registration from "@/images/registration.png";
import { AuthProgressbar } from "@/components/forms";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants";
import { useTokenValidationMutation } from "@/redux/api/memberApi";
import { useDispatch } from "react-redux";
import { alertMessageMapperForRegistration } from "@/utils/clientUtils";
import { getCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

export const RegistrationContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  const [tokenValidation] = useTokenValidationMutation();
  const isAlreadyLogin = getCookie(CookiesKey.accessToken);
  const path = usePathname();
  const query = useSearchParams();
  const route = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = query.get("register");
    if (!token || !token?.length) {
      window.location.href = `/${lang}/${ROUTES.INDEX}`;
    } else if (isAlreadyLogin) {
      alertMessageMapperForRegistration({
        alertCode: "r8",
        translate,
        dispatch,
        lang,
        onLeftButtonClick: () => {
          window.location.href = `/${lang}/${ROUTES.INDEX}`;
        },
      });
    } else {
      tokenValidation({ token })
        .unwrap()
        .then(res => {
          if (res.statusCode !== 200 || (res.statusCode === 200 && !res.data.isValid)) {
            alertMessageMapperForRegistration({
              alertCode: res?.returnCode ?? "",
              translate,
              dispatch,
              lang,
            });
          }
        })
        .catch(error => {
          alertMessageMapperForRegistration({
            alertCode: error.error.returnCode,
            translate,
            dispatch,
            lang,
          });
        });
    }
  }, [path, route, isAlreadyLogin, query, lang]);

  return (
    <>
      <PromotionImage
        divClass="lg:w-1/2"
        img={registration}
        width={550}
        height={629}
        alt="Promotion item"
        placeholder="blur"
        loading="lazy"
        imgClass="hidden md:block"
        url={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`}
      />
      <div className="registrationContainer">
        <AuthProgressbar title={[translate("registrationStep1.mobileVerification"), "", ""]} progress={1} />
        <div className="mt-[-5px] lg:py-12">
          <h1>{translate("registrationStep1.memberRegistration")}</h1>
        </div>
        <div className="otpFormContainer">
          <div>
            <OtpForm lang={lang} />
          </div>
        </div>
        <PromoItems lang={lang} />
      </div>
    </>
  );
};
