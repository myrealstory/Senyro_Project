import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";
import { defaultLocale } from "@/app/i18n";
import { FetchFailResponse } from "@/types/commonTyps";
import { ServerSidePageType } from "@/types/pageTypes";

import { verifyNewUserEmail } from "../api/verifyNewUserEmail";
import { VerifyEmail } from "@/components/verifyEmail";
import { CookiesKey } from "@/constants/cookies";

export default async function Verify({ params, searchParams }: ServerSidePageType) {
  const cookie = cookies();
  const accessToken = cookie.get(CookiesKey.accessToken);
  const lang = params?.lang ?? defaultLocale;
  const session = searchParams?.session;
  let error: FetchFailResponse["error"] | undefined;
  if (!session || accessToken) {
    redirect(`/${ROUTES.INDEX}`);
  }

  const verifyEmailResult = await verifyNewUserEmail({ lang, session });
  if (verifyEmailResult.status !== 200) {
    error = verifyEmailResult.error;
  }

  return <VerifyEmail lang={lang} error={error} session={session} />;
}
