import { Metadata } from "next";
import { LocaleKeysType } from "@/app/i18n";
import { RegistrationContainer } from "@/components/registrationAndLogin/RegistrationContainer";
import "@/style/auth/auth.scss";

export const metadata: Metadata = {
  title: "Registration",
};

export default function RegistrationPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <main className="registration-layout-wrapper">
      <RegistrationContainer lang={params.lang} />
    </main>
  );
}
  