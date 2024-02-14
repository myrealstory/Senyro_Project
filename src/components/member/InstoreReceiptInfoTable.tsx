import { instoreSalesHistoryType } from "@/types/api/apiTypes";
import "@/style/member/member.scss";

interface InstoreReceiptInfoType {
  title?: string;
  itemTitles: string[];
  itemList: instoreSalesHistoryType["data"]["itemList"];
}

export const InstoreReceiptInfoTable = ({ title, itemTitles, itemList }: InstoreReceiptInfoType) => {
  return (
    <>
      <h3 className="instoreReceiptInfoTableH3">{title}</h3>
      <table className="instoreReceiptInfoTable">
        <thead>
          <tr>
            <th className="w-[24.5%] font-medium text-[#282828] text-opacity-60 lg:font-semibold lg:text-primaryGold">
              {itemTitles[0]}
            </th>
            <th className="font-medium text-[#282828] text-opacity-60 lg:font-semibold lg:text-primaryGold">
              {itemTitles[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {itemList.map(item => (
            <tr key={item.itemCode}>
              <td>{item.itemQty}</td>
              <td>{item.itemName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
