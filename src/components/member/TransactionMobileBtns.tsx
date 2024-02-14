"use client";

import Link from "next/link";
import Image from "next/image";
import Transaction from "@/images/icons/Icon_transaction-white.png";
import Reorder from "@/images/icons/Icon_reorder.png";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useReOrderMutation } from "@/redux/api/memberApi";
import { ROUTES } from "@/constants";
import { RootState } from "@/redux/store";

export const TransactionMobileBtns = ({
  path,
  isOnline,
  lang,
  orderNumber,
}: {
  path: string;
  isOnline?: boolean;
  lang: LocaleKeysType;
  orderNumber?: string;
}) => {
  const { translate: t } = useTranslation(lang);
  const dispatch = useDispatch();
  const [reOrderRequest] = useReOrderMutation();
  const { globalSelectedProductSkuCode } = useSelector((state: RootState) => state.generalState);
  const { apiData } = useSelector((state: RootState) => state.cart);

  const reorder = () => {
    dispatch(setLoadingScreenDisplay(true));

    if (orderNumber) {
      reOrderRequest({ orderNumber, globalSelectedProductSkuCode, branchCode: apiData?.cart?.branch?.branchCode })
        .unwrap()
        .then(() => {
          window.location.href = `/${ROUTES.CART}`;
        })
        .catch(err => {
          dispatch(setLoadingScreenDisplay(false));
          alert(err);
        });
    }
  };

  return (
    <div className="transactionMobileBtnsOuterContainer">
      <div className="transactionMobileBtnsInnerContainer">
        {isOnline && (
          <div
            onClick={() => {
              reorder();
            }}
            className="transactionMobileReOrderBtn"
          >
            <Image src={Reorder} width={20} height={20} alt="shopping cart" />
            <span>{t("transactions.reOrder")}</span>
          </div>
        )}
        <Link target="_blank" href={path} className="transactionMobileReceiptBTn">
          <Image src={Transaction} width={20} height={20} alt="receipt icon" />
          <span>{isOnline ? t("transactions.onlineReceiptBtn") : t("transactions.receipt")}</span>
        </Link>
      </div>
      <span className="transactionBottomDottedLine"></span>
    </div>
  );
};
