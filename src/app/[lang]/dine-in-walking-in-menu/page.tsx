import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/general-information/general-information.scss";
import DineinMenuContainer from "@/components/general/DineinMenuContainer";

export const metadata: Metadata = {
  title: "Dine In and Waling in Menu",
};

export default function DineInMenu({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <>
      <DineinMenuContainer lang={params.lang} />
    </>
  );
}
