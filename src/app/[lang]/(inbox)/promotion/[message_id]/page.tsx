import { Metadata } from "next";
import "@/style/member/member.scss";
import { PromotionMessageContainer } from "@/components/member/PromotionMessageContainer";
import { LocaleKeysType } from "@/app/i18n";

export const metadata: Metadata = {
  title: "Promotion Messages",
};

export default function PromotionalMessagePage({ params }: { params: { lang: LocaleKeysType; message_id: string } }) {
  return <PromotionMessageContainer lang={params.lang} message_id={params.message_id} />;
}
