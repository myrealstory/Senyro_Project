"use client";

import { PickUpSlideCard } from "./PickUpSlideCard";
import TransactionIcon from "@/images/icons/Icon_transaction-gold@3x.png";
import Image from "next/image";
import { Receipt } from "./Receipt";
import { LocaleKeysType } from "@/app/i18n";
import { SalesOnlineHistoryType, SalesOnlineType, awaitPickupOrdersType } from "@/types/api/apiTypes";
import { useRef, useState } from "react";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { useTranslation } from "@/app/i18n/client";
import { useDraggable } from "react-use-draggable-scroll";
import "@/style/member/member.scss";
import { LoadMoreBtn } from "../LoadMoreBtn";

interface onlineProps {
  lang: LocaleKeysType;
  onlineReceipts?: SalesOnlineType[];
  awaitPickupOrders?: awaitPickupOrdersType[];
}

export const OnlineReceipts = ({ lang, onlineReceipts, awaitPickupOrders }: onlineProps) => {
  const ref = useRef<HTMLDivElement>(document.createElement("div")); // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref); // Now we pass the reference to the useDraggable hook:
  const [isLoadMore, setIsLoadMore] = useState(false);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const { translate: t } = useTranslation(lang);

  const handleLoadMore = () => {
    setIsLoadMore(true);
  };

  const displayMonths = new Set();

  const generateReceipts = (receipts: SalesOnlineHistoryType["orders"]) => {
    return receipts.map(item => {
      const showMonthTag = !displayMonths.has(item.orderMonth);
      if (showMonthTag) {
        displayMonths.add(item.orderMonth);
      }
      return (
        <Receipt
          key={item.trxId}
          onlineReceipt={item}
          showMonthTag={showMonthTag}
          lang={lang}
          isOnline={true}
          isLogin={isAlreadyLogin}
        />
      );
    });
  };

  const renderAwaitPickupOrders = (
    <>
      <span className="transactionOnlineAwaitPickupTitle pl-4 lg:pl-8">{t("transactions.OrderAwaitPickup")}</span>
      <div ref={ref} {...events} className="transactionOnlineAwaitPickupContainer">
        {awaitPickupOrders &&
          awaitPickupOrders.map(awaitPickupOrder => (
            <PickUpSlideCard
              lang={lang}
              pickupOrder={awaitPickupOrder}
              key={awaitPickupOrder.trxId}
              isLogin={isAlreadyLogin}
            />
          ))}
      </div>
    </>
  );

  const renderNoOnlineReceipts = (
    <>
      {(onlineReceipts === undefined || onlineReceipts.length <= 0) && (
        <div className="transactionNoReceiptContainer">
          <Image src={TransactionIcon} width={0} height={0} alt="You don't have any transactions" />
          <span>{t("transactions.noTransaction")}</span>
        </div>
      )}
    </>
  );

  const renderOnlineReceipts = () => {
    if (!onlineReceipts || !onlineReceipts?.length) {
      return renderNoOnlineReceipts;
    }

    return (
      <div className="transactionInstoreReceiptContainer">
        {isLoadMore ? generateReceipts(onlineReceipts) : generateReceipts(onlineReceipts?.slice(0, 10))}
        {onlineReceipts && onlineReceipts.length > 10 && !isLoadMore && (
          <div className="transactionLoadMoreBtn py-[1.75rem]">
            <LoadMoreBtn onLoadMore={handleLoadMore} loadMore={isLoadMore} lang={lang} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="transactionOnlineContainer">
        {awaitPickupOrders && awaitPickupOrders.length > 0 && renderAwaitPickupOrders}
        {renderOnlineReceipts()}
      </div>
    </>
  );
};
