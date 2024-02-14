import { Metadata } from "next";
import UpgradeContainer from "@/components/member/UpgradeContainer";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";

export const metadata: Metadata = {
  title: "Upgrade & Renew",
};

export default function UpgradePage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <section>
      <UpgradeContainer lang={params.lang} />
    </section>
  );
}
