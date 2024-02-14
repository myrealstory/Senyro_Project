"use client";

import { salesHistoryUnitType } from "@/types/api/apiTypes";
import Image from "next/image";
import TransactionIcon from "@/images/icons/Icon_transaction-gold@3x.png";
import { Receipt } from "./Receipt";
import { LocaleKeysType } from "@/app/i18n";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { LoadMoreBtn } from "../LoadMoreBtn";

interface InstoreProps {
  lang: LocaleKeysType;
  instoreReceipts?: salesHistoryUnitType[];
}

export const InstoreReceipts = ({ lang, instoreReceipts }: InstoreProps) => {
  const [isLoadMore, setIsLoadMore] = useState(false);
  const handleLoadMore = () => {
    setIsLoadMore(true);
  };

  const { translate: t } = useTranslation(lang);

  const displayMonths = new Set();

  const generateReceipts = (receipts: salesHistoryUnitType[]) => {
    return receipts.map(item => {
      const showMonthTag = !displayMonths.has(item.orderMonth);
      if (showMonthTag) {
        displayMonths.add(item.orderMonth);
      }
      return <Receipt key={item.trxId} InstoreReceipt={item} showMonthTag={showMonthTag} lang={lang} />;
    });
  };

  const renderNoInstoreReceipts = (
    <>
      <div className="transactionNoReceiptContainer">
        <Image src={TransactionIcon} width={0} height={0} alt="You don't have any coupons" />
        <span>{t("transactions.noTransaction")}</span>
      </div>
    </>
  );

  const renderInstoreReceipts = (
    <div className="transactionInstoreReceiptContainer">
      {instoreReceipts &&
        instoreReceipts.length > 0 &&
        (isLoadMore ? generateReceipts(instoreReceipts) : generateReceipts(instoreReceipts.slice(0, 10)))}

      {instoreReceipts && instoreReceipts.length > 10 && !isLoadMore && (
        <div className="transactionLoadMoreBtn py-[1.75rem]">
          <LoadMoreBtn onLoadMore={handleLoadMore} loadMore={isLoadMore} lang={lang} />
        </div>
      )}
    </div>
  );

  return <>{instoreReceipts && instoreReceipts.length === 0 ? renderNoInstoreReceipts : renderInstoreReceipts}</>;
};
