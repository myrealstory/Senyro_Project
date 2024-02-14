"use client";

import { SalesOnlineType, salesHistoryUnitType } from "@/types/api/apiTypes";
import { TableRow } from "./TableRow";
import { TransactionWebBtns } from "./TransactionWebBtns";
import { TransactionMobileBtns } from "./TransactionMobileBtns";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { formatDateBasedOnLang } from "../forms/FormattedUtils";

export const Receipt = ({
  InstoreReceipt,
  onlineReceipt,
  lang,
  isOnline,
  isLogin,
  showMonthTag,
}: {
  InstoreReceipt?: salesHistoryUnitType;
  onlineReceipt?: SalesOnlineType;
  lang: LocaleKeysType;
  isOnline?: boolean;
  isLogin?: boolean;
  showMonthTag: boolean;
}) => {
  const { translate: t } = useTranslation(lang);

  const getOnlineMonthTag = formatDateBasedOnLang(lang, onlineReceipt?.orderDate ?? "");
  const getInstoreMonthTag = formatDateBasedOnLang(lang, InstoreReceipt?.orderDate ?? "");

  return (
    <>
      <div className="sticky top-[56px] z-99 md:top-[68px]">
        {showMonthTag && (
          <span className="transactionReceiptOrderDate">{isOnline ? getOnlineMonthTag : getInstoreMonthTag}</span>
        )}
      </div>
      <div className="transactionReceiptContainer p-4 lg:px-[1.7rem] lg:pb-3">
        <div className="transactionReceiptSecondContainer">
          <div className="transactionReceiptThirdContainer">
            <div className="transactionReceiptBtnsContainer  -z-10 lg:z-0">
              <span className="text-[18px] font-bold lg:flex-1 lg:text-primaryGold">
                {isOnline
                  ? `${t("transactions.onlineOrder")} #${onlineReceipt?.orderNumber}`
                  : `${t("transactions.instoreTXN")} #${InstoreReceipt?.orderNumber}`}
              </span>
              {isLogin && isOnline ? (
                <TransactionWebBtns
                  isOnline={isOnline}
                  path={`/${lang}/${ROUTES.TRANSACTION_ONLINE}/${isLogin && isOnline ? "member" : "guest"}/${
                    isOnline ? onlineReceipt?.embeddedOrderStr : InstoreReceipt?.embeddedOrderStr
                  }`}
                  lang={lang}
                  orderNumber={isOnline ? onlineReceipt?.orderNumber : InstoreReceipt?.orderNumber}
                />
              ) : (
                <TransactionWebBtns
                  path={`/${lang}/${ROUTES.TRANSACTION_INSTORE}/${
                    isOnline ? onlineReceipt?.trxId : InstoreReceipt?.trxId
                  }`}
                  lang={lang}
                  orderNumber={isOnline ? onlineReceipt?.orderNumber : InstoreReceipt?.orderNumber}
                />
              )}
            </div>
          </div>
        </div>
        <table className="transactionReceiptTableContainer">
          <TableRow
            label={t("transactions.orderDate")}
            value={isOnline ? onlineReceipt?.orderDatetime : InstoreReceipt?.orderDatetime}
            lang={lang}
          />
          <TableRow
            label={isOnline ? t("transactions.pickupStore") : t("transactions.store")}
            value={isOnline ? onlineReceipt?.store : InstoreReceipt?.store}
            lang={lang}
          />
          {isOnline && (
            <TableRow label={t("transactions.pickupDate")} value={onlineReceipt?.orderDatetime} lang={lang} />
          )}
          <TableRow
            label={t("transactions.memberPoints")}
            earnPoint={isOnline ? onlineReceipt?.earnPoint : InstoreReceipt?.earnPoint}
            burnPoint={isOnline ? onlineReceipt?.burnPoint : InstoreReceipt?.burnPoint}
            lang={lang}
            pointMovement={onlineReceipt?.pointMovement}
          />
          {/* <TableRow
          label={t("transactions.purchaseAmount")}
          value={isOnline ? onlineReceipt?.orderAmount : InstoreReceipt?.orderAmount}
          lang={lang}
        /> */}
          <TableRow
            label={t("transactions.orderNetAmount")}
            value={isOnline ? onlineReceipt?.orderAmount : InstoreReceipt?.orderAmount}
            lang={lang}
          />
        </table>
        {isLogin && isOnline ? (
          <TransactionMobileBtns
            isOnline={isOnline}
            path={`/${lang}/online/${isLogin && isOnline ? "member" : "guest"}/${
              isOnline ? onlineReceipt?.embeddedOrderStr : InstoreReceipt?.embeddedOrderStr
            }`}
            lang={lang}
            orderNumber={isOnline ? onlineReceipt?.orderNumber : InstoreReceipt?.orderNumber}
          />
        ) : (
          <TransactionMobileBtns
            path={`/${lang}/${ROUTES.TRANSACTION_INSTORE}/${isOnline ? onlineReceipt?.trxId : InstoreReceipt?.trxId}`}
            lang={lang}
            orderNumber={isOnline ? onlineReceipt?.orderNumber : InstoreReceipt?.orderNumber}
          />
        )}
      </div>
    </>
  );
};
