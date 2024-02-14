//TODO: Need to remove EliteMember as it's a mock data, and we don't have inbox message api at the moment

import { Metadata } from "next";

import "@/style/member/member.scss";
import { LocaleKeysType } from "@/app/i18n";
import { PersonalMessageContainer } from "@/components/member/PersonalMessageContainer";

export const metadata: Metadata = {
  title: "Personal Message",
};

export default function PersonalMessagePage({ params }: { params: { lang: LocaleKeysType; message_id: string } }) {
  return <PersonalMessageContainer lang={params.lang} message_id={params.message_id} />;
}
