import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

interface DiscountType {
  name: string;
  discountAmount: string;
}

interface Props {
  titles: string[];
  amount?: string;
  discount?: DiscountType[];
  SRPoint?: string;
  totalAmount?: string;
  isDiscount?: boolean;
  lang: LocaleKeysType;
}
export const AmountTable = ({ titles, amount, discount, SRPoint, totalAmount, lang }: Props) => {
  const { translate: t } = useTranslation(lang);

  const TableRow = ({
    title,
    value,
    isDiscount,
  }: {
    title: string;
    value?: string | undefined;
    isDiscount?: boolean;
  }) => (
    <tr className="mb-[-5px] flex justify-between font-[14px]">
      <td
        className={`w-[70%] ${
          title === t("transactionOnlineDetails.totalAmountPayable") && "text-[16px] font-semibold lg:text-[20px]"
        }`}
      >
        {title}
      </td>

      <td
        className={`receiptAmountTdDiscount ${
          title === t("transactionOnlineDetails.totalAmountPayable") &&
          "mt-1 text-[16px] font-semibold lg:mt-2 lg:text-[20px]"
        }`}
      >
        {/* {value ? "$" + value : "$0"} */}
        {isDiscount ? "-$" + value : "$" + value}
      </td>
    </tr>
  );
  return (
    <table className="receiptAmountTableContainer">
      <tbody>
        {/* Item total */}
        {<TableRow title={titles[0]} value={amount} />}
        {/* Discount */}
        {discount &&
          discount.length > 0 &&
          discount.map((discountItem, index) => (
            <TableRow
              key={discountItem.name + index}
              isDiscount={true}
              title={discountItem.name}
              value={discountItem.discountAmount}
            />
          ))}
        {/* Redeemed SR points */}
        {SRPoint?.toString() !== "0" && SRPoint !== undefined && <TableRow title={titles[2]} value={SRPoint} />}
        {/* Order Total */}
        <TableRow title={titles[3]} value={totalAmount} />
      </tbody>
    </table>
  );
};
