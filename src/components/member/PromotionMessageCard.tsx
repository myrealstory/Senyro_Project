"use client";

import IconMsg from "@/images/icons/Icon_message-gold@3x.png";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LoadMoreBtn } from "../LoadMoreBtn";
import { formattedISODateTime } from "@/components/forms/FormattedUtils";
import { ROUTES } from "@/constants";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { InboxMessageProps } from "@/types/api/apiTypes";
interface PromotionalMessageCardProps {
  promotionMsg?: InboxMessageProps[];
  lang: LocaleKeysType;
}
export const PromotionMessageCard = ({ lang, promotionMsg }: PromotionalMessageCardProps) => {
  const [loadMore, setLoadMore] = useState(false);
  const initialItemsToShow = loadMore ? promotionMsg?.length : 10;
  const { translate: t } = useTranslation(lang);

  const handleLoadMore = () => {
    setLoadMore(!loadMore);
  };

  const renderNoPromotionMsg = (
    <div className="inboxMessageCardContainer">
      <Image
        src={IconMsg}
        width={0}
        height={0}
        alt="This is an icon that describe no messages in inbox"
        className="block h-auto w-[30px] sm:w-[40px]"
      />
      <h2>{t("inbox.noPromotionalMessage")}</h2>
    </div>
  );

  return (
    <ul className="inboxMessageListContainer">
      {promotionMsg && promotionMsg.length === 0 && renderNoPromotionMsg}
      {promotionMsg &&
        promotionMsg.length > 0 &&
        promotionMsg.slice(0, initialItemsToShow).map(message => (
          <Link target="_blank" href={`/${lang}/${ROUTES.INBOX_PROMOTION}/${message.id}`} key={message.id}>
            <li key={message.id}>
              <div className="flex flex-col">
                <div className="inboxMessageItemContainer">
                  {message.readTime === null ? (
                    <span className="inboxMessageNotRead"></span>
                  ) : (
                    <span className="inboxMessageRead"></span>
                  )}
                  <div className="inboxMessageContentContainer">
                    <h2
                      className={`text-[16px] ${
                        message.readTime === null ? "font-semibold" : "font-normal"
                      } leading-4 xl:text-xl`}
                    >
                      {message.title.substring(0, 20) + "..."}
                    </h2>
                    <span
                      className={`block text-[14px] ${
                        message.readTime === null ? "font-semibold" : "font-normal"
                      } leading-4  xl:text-lg`}
                    >
                      {message.subTitle}
                    </span>
                  </div>
                </div>
              </div>
              <div className="inboxMessageTimeContainer">
                <span>{formattedISODateTime(message.date)}</span>
              </div>
            </li>
          </Link>
        ))}
      {promotionMsg && promotionMsg.length > 10 ? (
        <div className=" my-[30px] flex justify-center pt-[1.75rem] lg:mx-0 lg:mb-[80px] xl:mb-0">
          <LoadMoreBtn onLoadMore={handleLoadMore} loadMore={loadMore} lang={lang} />
        </div>
      ) : null}
    </ul>
  );
};
