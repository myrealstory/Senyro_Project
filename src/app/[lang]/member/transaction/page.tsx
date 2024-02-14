import { LocaleKeysType } from "@/app/i18n";
import { TransactionContainer } from "@/components/member/TransactionContainer";
import { Metadata } from "next";
import "@/style/member/member.scss";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function TransactionHistoryPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <section>
      <TransactionContainer lang={params.lang} />
    </section>
  );
}
