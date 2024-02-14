import { instoreSalesHistoryType } from "@/types/api/apiTypes";
import "@/style/member/member.scss";

interface instoreReceiptSummaryTypr {
  titles: string[];
  receiptId: string;
  receiptItems: instoreSalesHistoryType["data"];
}

export const InstoreReceiptSummaryTable = ({ titles, receiptId, receiptItems }: instoreReceiptSummaryTypr) => {
  return (
    <table className=" w-full">
      <tbody className="table w-full">
        <tr className="instoreReceiptSummaryTr">
          <td className="instoreReceiptSumaryTitleTd">{titles[0]}</td>
          <td className="instoreReceiptSumaryInfoTd">{receiptId}</td>
        </tr>
        <tr className="instoreReceiptSummaryTr">
          <td className="instoreReceiptSumaryTitleTd">{titles[1]}</td>
          <td className="instoreReceiptSumaryInfoTd">{receiptItems.pickupBranchNameEn}</td>
        </tr>
        <tr className="instoreReceiptSummaryTr">
          <td className="instoreReceiptSumaryTitleTd">{titles[2]}</td>
          <td className="instoreReceiptSumaryInfoTd">{receiptItems.trxDateTime}</td>
        </tr>
      </tbody>
    </table>
  );
};
