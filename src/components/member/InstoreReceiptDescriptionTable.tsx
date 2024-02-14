"use client";
import { instoreSalesHistoryType } from "@/types/api/apiTypes";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";

export const InstoreReceiptDescriptionTable = ({
  details,
  lang,
}: {
  details: instoreSalesHistoryType["data"];
  lang: LocaleKeysType;
}) => {
  const { translate: t } = useTranslation(lang);  
  return (
    <table className="instoreReceiptDescriptionTableContainer">
      <tbody>
        <tr>
          <th className="instoreReceiptDescriptionThLeft pt-2">{t("transactionInstoreDetails.amount")}</th>
          <td className="instoreReceiptDescriptionThRight py-2">${details.trxAmount}</td>
        </tr>
        <tr>
          <th className="instoreReceiptDescriptionThLeft py-2 text-left">
            {t("transactionInstoreDetails.eligibleAmount")}
            <br />
            <span className="text-[12px] font-normal">({t("transactionInstoreDetails.exclServiceCharge")})</span>
          </th>
          <td className="instoreReceiptDescriptionThRight py-2">${details.eligibleAmount}</td>
        </tr>
        <tr>
          <th className="instoreReceiptDescriptionThLeft py-2 text-start">
            {t("transactionInstoreDetails.points")}{" "}
            <span className="block font-normal">{t("transactionInstoreDetails.earnedRedeemed")}</span>
          </th>
          <td className="instoreReceiptDescriptionThRight py-2">
            +{details.earnPoint} / {details.burnPoint === 0 ? `-${details.burnPoint}` : details.burnPoint}
          </td>
        </tr>
        <tr>
          <th className="instoreReceiptDescriptionThLeft py-2">{t("transactionInstoreDetails.balance")}</th>
          <td className="instoreReceiptDescriptionThRight">
            {details.pointMovement > 0 ? `+${details.pointMovement}` : details.pointMovement}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
