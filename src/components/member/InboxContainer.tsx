"use client";

import { PersonalMessageCard } from "./PersonalMessageCard";
import { PromotionMessageCard } from "./PromotionMessageCard";
import { CustomTab } from "./CustomTab";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useGetInboxQuery } from "@/redux/api/memberApi";
import { useDispatch } from "react-redux";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

export const InboxContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const [mode, setMode] = useState<string>(lang === "en" ? "Personal" : "個人訊息");
  const { data: inboxResponse, isLoading } = useGetInboxQuery();
  const numberOfPersonalMsg = inboxResponse?.statusCode === 200 && inboxResponse.data.personal.length;
  const numberOfPromotionalMsg = inboxResponse?.statusCode === 200 && inboxResponse.data.promotional.length;
  const { translate: t } = useTranslation(lang);
  const dispatch = useDispatch();

  const handleModeChange = (mode: string) => {
    setMode(mode);
  };

  const renderContent = (lang: LocaleKeysType, mode: string) => {
    if (
      (lang === "en" && mode === "Personal") ||
      (lang === "tc" && mode === "個人訊息" && inboxResponse?.statusCode === 200)
    ) {
      return <PersonalMessageCard lang={lang} personalMsg={inboxResponse?.data.personal} />;
    }
    if (
      (lang === "en" && mode === "Promotional") ||
      (lang === "tc" && mode === "推廣訊息" && inboxResponse?.statusCode === 200)
    ) {
      return <PromotionMessageCard lang={lang} promotionMsg={inboxResponse?.data.promotional} />;
    }
    return null;
  };

  useEffect(() => {
    dispatch(setLoadingScreenDisplay(isLoading));
  }, [isLoading])

  if (isLoading) {
    return <></>
  }

  return (
    <div className="inboxContainer">
      <h1 className="inboxTitle">{t("inbox.inbox")}</h1>
      <div>
        <CustomTab
          onChange={handleModeChange}
          mode={mode}
          tabs={[t("inbox.personal"), t("inbox.promotional")]}
          counts={[numberOfPersonalMsg || 0, numberOfPromotionalMsg || 0]}
        />
      </div>
      {renderContent(lang, mode)}
    </div>
  );
};
