"use client";

import registration from "@/images/registration.png";
import { AuthProgressbar } from "@/components/forms";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { InfoForm } from "@/components/forms/InfoForm";
import { PromotionImage } from "@/components/PromotionImage";
import "@/style/auth/auth.scss";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants";

export default function InfoPage({ params }: { params: { lang: LocaleKeysType } }) {
  const lang = params.lang;
  const infoPath = usePathname().split("/")[3];
  const { translate: t } = useTranslation(lang);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 500)
  }, [])

  if(!isReady) {
    return <></>;
  }

  return (
    <main className="registerInfoContainer">
      <div className="relative w-full lg:w-1/2">
        <PromotionImage
          divClass="hidden rounded-[30px] lg:block lg:sticky lg:w-[521px] lg:z-99 lg:h-auto lg:top-[7rem]"
          img={registration}
          width={782}
          height={860}
          alt="registration image"
          placeholder="blur"
          loading="lazy"
          imgClass="hidden h-auto lg:block "
           url={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`}
        />
      </div>
      <div className="registerInfoFormContainer">
        <AuthProgressbar title={["1", t("registrationStep2.personalInfo"), "3"]} progress={2} path={infoPath} />
        <section>
          <div className="registerInfoFormGreeting">
            <h1>
              {t("registrationStep2.memberRegistration")}
              <br className="lg:hidden" />
              {t("registrationStep2.memberRegistrationDescription")}
            </h1>
            <p>{t("registrationStep2.knowAboutYouP1")}</p>
            <p>{t("registrationStep2.knowAboutYouP2")}</p>
          </div>
          <InfoForm lang={lang} />
        </section>
      </div>
    </main>
  );
}
