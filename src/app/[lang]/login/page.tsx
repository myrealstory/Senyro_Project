import { LocaleKeysType } from "@/app/i18n";
import { LoginContainer } from "@/components/registrationAndLogin/LoginContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <main className="login-layout-wrapper pb-[4rem] lg:pb-0">
      <LoginContainer lang={params.lang} />
    </main>
  );
}
