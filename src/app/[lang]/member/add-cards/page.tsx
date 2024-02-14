import { Metadata } from "next";
import { LocaleKeysType } from "@/app/i18n";
import { AddCardContainer } from "@/components/member/AddCardContainer";

export const metadata: Metadata = {
  title: "Add Cards",
};

export default function AddCards({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <div>
      <AddCardContainer lang={params.lang} />
    </div>
  );
}
