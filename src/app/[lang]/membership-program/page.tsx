import { LocaleKeysType } from "@/app/i18n";
import MembershipProgramContainer from "@/components/membership/MembershipProgramContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Program",
};

export default function MembershipProgramPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <main className="membershipLayout">
      <MembershipProgramContainer lang={params.lang} />
    </main>
  );
}
