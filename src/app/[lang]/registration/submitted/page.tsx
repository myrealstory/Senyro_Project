import { LocaleKeysType } from "@/app/i18n";
import { SubmittedContainer } from "@/components/registrationAndLogin/SubmittedContainer";
import { Metadata } from "next";
import "@/style/auth/auth.scss";

export const metadata: Metadata = {
  title: "Email Submitted",
};

export default function Submitted({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <main className="registerSubmitContainer">
      <SubmittedContainer lang={params.lang} />
    </main>
  );
}
