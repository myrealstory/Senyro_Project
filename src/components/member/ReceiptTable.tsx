import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
interface Props {
  lang: LocaleKeysType;
  titles: string[];
  items: {
    name?: string;
    qty?: number;
    subTotal?: string;
  }[];
}

export const ReceiptTable = ({ titles, items, lang }: Props) => {
  const { translate: t } = useTranslation(lang);

  return (
    <table className="receiptTableContainer">
      <thead>
        <tr className="text-left">
          {titles.map((title, index) => (
            <th
              key={index}
              className={`receiptTableTh ${title === t("transactionOnlineDetails.subTotal") && "text-end"} ${
                title === t("transactionOnlineDetails.qty") && "text-center"
              }`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.name}>
            <td className="receiptTdName">{item.name}</td>
            <td className="receiptTdQty">{item.qty}</td>
            <td className="receiptSubtotal">${item.subTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
