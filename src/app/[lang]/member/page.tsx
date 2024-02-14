import { Metadata } from "next";
import { LocaleKeysType } from "@/app/i18n";
import MemberAreaContainer from "@/components/member/MemberAreaContainer";

export const metadata: Metadata = {
  title: "Welcome",
};

export default function MemberAreaPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <div>{<MemberAreaContainer lang={params.lang} />}</div>;
}
