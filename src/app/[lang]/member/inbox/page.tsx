import { InboxContainer } from "@/components/member/InboxContainer";
import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/member/member.scss";

export const metadata: Metadata = {
  title: "Inbox",
};

export default async function InboxPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <section>
      <InboxContainer lang={params.lang} />
    </section>
  );
}
