"use client";

import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

export const TableRow = ({
  label,
  value,
  earnPoint,
  burnPoint,
  pointMovement,
  lang,
}: {
  label: string;
  value?: string | number;
  earnPoint?: number;
  burnPoint?: number;
  pointMovement?: number;
  lang: LocaleKeysType;
}) => {
  const { translate: t } = useTranslation(lang);
  const renderSRPoint = (point?: number, earnPoint?: number, burnPoint?: number) => {
    return (
      <span className="srOnly">
        +{earnPoint} / {!burnPoint || burnPoint === 0 ? "-" : ""}
        {burnPoint}
      </span>
    );
  };
  return (
    <>
      <tbody
        className={`${label === t("transactions.purchaseAmount") && "block"} ${
          label === t("transactions.orderNetAmount") && "lg:block"
        }`}
      >
        <tr className={`receiptTableRowTr ${label === t("transactions.orderNetAmount") ? "" : "border-b-2"} `}>
          <th>{label}</th>
          <td>
            {label === t("transactions.memberPoints") && renderSRPoint(pointMovement, earnPoint, burnPoint)}

            {/* {label === t("transactions.purchaseAmount") && `$${value}`} */}
            {label === t("transactions.orderNetAmount") && `$${value}`}
            {label === t("transactions.dateAndTime") && value}
            {label === t("transactions.store") && value}
            {label === t("transactions.pickupStore") && value}
            {label === t("transactions.orderDate") && value}
            {label === t("transactions.pickupDate") && value}
          </td>
        </tr>
      </tbody>
    </>
  );
};
