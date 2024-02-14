"use client";
import "@/style/member/member.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

export const CardDisclaimer = ({ lang, payWithCard }: { lang: LocaleKeysType; payWithCard?: boolean }) => {
  const { translate: t } = useTranslation(lang);
  return (
    <ol className={`couponCardDisclaimerContentContainer ${payWithCard ? "lg:text-center" : "lg:text-right"}`}>
      <li>
        {lang === "en" ? (
          <p>
            {t("savedCards.cardApplicable")}
            <strong>
              {t("savedCards.visa")}/{t("savedCards.master")}/{t("savedCards.americanExpress")}
            </strong>{" "}
            {/* {t("savedCards.only")} */}
          </p>
        ) : (
          <p>
            {t("savedCards.cardApplicable")}
            <strong>
              {t("savedCards.visa")}/{t("savedCards.master")}/{t("savedCards.americanExpress")}
            </strong>{" "}
          </p>
        )}
      </li>
      <li>
        <p>
          {t("savedCards.maxNumOfCards")}
          <strong>{t("savedCards.5cards")}</strong>
        </p>
      </li>
    </ol>
  );
};
