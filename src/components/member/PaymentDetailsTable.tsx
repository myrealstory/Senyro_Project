import "@/style/member/member.scss";

interface Props {
  role: "member" | "guest";
  titles: string[];
  totalAmountWithDiscount?: string;
  paymentMethod?: string;
  paymentType?: string;
  cardNum?: string;
  name?: string;
  email?: string;
  phone?: string;
  SRName?: string;
  membershipNo?: string;
}

export const PaymentDetailsTable = ({
  role,
  titles,
  totalAmountWithDiscount,
  paymentMethod,
  paymentType,
  cardNum,
  name,
  email,
  phone,
  SRName,
  membershipNo,
}: Props) => {
  const TableRow = ({ title, value }: { title: string; value?: number | string | null }) => (
    <tr className="receiptPaymentDetailsTableTr">
      <td>{title}</td>
      <td>
        {title === "Payment Amount" || title === "付款金額" ? "$" : ""}
        {value ? value : ""}
      </td>
    </tr>
  );

  return (
    <table className="receiptPaymentDetailsTableContainer">
      <tbody>
        <TableRow title={titles[0]} value={totalAmountWithDiscount} />
        <TableRow title={titles[1]} value={paymentMethod} />
        <TableRow title={titles[2]} value={paymentType} />
        <TableRow title={titles[3]} value={cardNum} />
        <TableRow title={titles[4]} value={name} />
        <TableRow title={titles[5]} value={email} />
        <TableRow title={titles[6]} value={phone} />
        {role === "member" ? <TableRow title={titles[7]} value={SRName} /> : null}
        {role === "member" ? <TableRow title={titles[8]} value={membershipNo} /> : null}
      </tbody>
    </table>
  );
};
