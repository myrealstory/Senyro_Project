"use client";

import { LocaleKeysType } from "@/app/i18n";
import { InboxContent } from "./InboxContent";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { useGetPersonalMessageDetailsQuery } from "@/redux/api/memberApi";

export const PersonalMessageContainer = ({ lang, message_id }: { lang: LocaleKeysType; message_id: string }) => {
  const { data: personalMessageDetails, isSuccess } = useGetPersonalMessageDetailsQuery(message_id);
  const ctaName = personalMessageDetails?.data.ctaButtonName;

  return (
    <div className="inboxMsgContainer">
      {isSuccess ? <InboxContent lang={lang} id={message_id} message={personalMessageDetails} /> : null}
      {ctaName ? (
        <div className="lg:py-6">
          <Link href={`/${lang}/${ROUTES.PRODUCT}/${message_id}`} className="inboxViewProductWebBtn">
            {ctaName}
          </Link>
        </div>
      ) : null}
      {ctaName ? (
        <MobileButtonContainer>
          <Link href={`/${lang}/${ROUTES.PRODUCT}/${message_id}`} className="inboxViewProductMobileBtn">
            {ctaName}
          </Link>
        </MobileButtonContainer>
      ) : null}
    </div>
  );
};
