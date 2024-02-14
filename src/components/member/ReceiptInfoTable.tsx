import "@/style/member/member.scss";

export const ReceiptInfoTable = ({
  titles,
  transactionNum,
  orderTime,
}: {
  titles: string[];
  transactionNum: string;
  orderTime?: string;
}) => {
  return (
    <table className="w-full">
      <tbody>
        <tr className="text-left lg:border-b-[1px] lg:border-dotted lg:border-primaryGold">
          <td className="receiptInfoTd font-normal text-primaryGold xl:font-semibold">{titles[0]}</td>
          <td className="receiptInfoTd lg:text-primaryGold">#{transactionNum}</td>
        </tr>
        <tr className="text-left lg:border-b-[1px] lg:border-dotted lg:border-primaryGold">
          <td className="receiptInfoTd font-normal text-primaryGold lg:pt-5 xl:font-semibold">{titles[1]}</td>
          <td className="receiptInfoTd lg:pt-5 lg:text-primaryGold">{orderTime}</td>
        </tr>
      </tbody>
    </table>
  );
};
