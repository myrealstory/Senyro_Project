"use client";

import { LocaleKeysType } from "@/app/i18n";
import { InboxContent } from "./InboxContent";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useGetPromotionalMessageDetailsQuery } from "@/redux/api/memberApi";
import { translateDeepLinkFrom } from "@/utils/commonUtils";

export const PromotionMessageContainer = ({ lang, message_id }: { lang: LocaleKeysType; message_id: string }) => {
  const { data: promotionalMessageDetails, isSuccess } = useGetPromotionalMessageDetailsQuery(message_id);

  if (!isSuccess) {
    return <></>
  }

  const getLink = () => {
    if (promotionalMessageDetails?.data?.ctaButtonDeeplink?.length) {
      return translateDeepLinkFrom(promotionalMessageDetails?.data?.ctaButtonDeeplink, lang);
    }

    return promotionalMessageDetails?.data?.ctaUrl;
  }

  const goToButton = (className: string) => {
    const newTab = promotionalMessageDetails?.data?.ctaNewTab === 1;
    if (newTab) {
      return <a target="_blank" href={getLink()} className={className}>{promotionalMessageDetails?.data.ctaButtonName}</a>
    }

    return <a href={getLink()} className={className}>{promotionalMessageDetails?.data.ctaButtonName}</a>
  }

  return (
    <div className="inboxMsgContainer">
      <InboxContent lang={lang} id={message_id} message={promotionalMessageDetails} />
      {promotionalMessageDetails?.data.ctaButtonName ? (
        <div className="lg:py-6">
          {goToButton("inboxViewProductWebBtn")}
        </div>
      ) : null}
      {promotionalMessageDetails?.data.ctaButtonName ? (
        <MobileButtonContainer>
          {goToButton("inboxViewProductMobileBtn")}
        </MobileButtonContainer>
      ) : null}
    </div>
  );
};
