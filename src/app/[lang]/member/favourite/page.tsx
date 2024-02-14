import { Metadata } from "next";
import FavProducts from "@/components/member/FavProducts";
import { LocaleKeysType } from "@/app/i18n";

export const metadata: Metadata = {
  title: "My Favourite",
};

export default function FavouritePage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <div>
      <FavProducts lang={params.lang} />
    </div>
  );
}
