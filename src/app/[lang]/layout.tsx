import FavIcon from "@/images/icons/favicon@3x.png";
import { dir } from "i18next";
import { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { headers, cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookiesKey } from "@/constants/cookies";
import { PopUpBanner } from "@/components/PopUpBanner";
import { BottomNavbar } from "@/components/BottomNavbar";
import { ReduxProvider } from "@/components/ReduxProvider";
import { ServerSidePageType } from "@/types/pageTypes";
import { TopErrorMessageBar } from "@/components/TopErrorMessageBar";
import { generalApisRequests } from "@/utils/apiMiddleware";
import { locales } from "../i18n";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { ROUTES } from "@/constants";
import { AlertModal } from "@/components/AlertModal";
import { CookiesNotice } from "@/components/CookiesNotice";
import { PopupPaymentInProgress } from "@/components/cart/PopupPaymentInProgress";
import "./globals.css";
import "@/style/component/customButton.scss";
import { getPopupBannerApi } from "./api/getPopupBanner";

export const metadata: Metadata = {
  title: {
    default: "sen-ryo 千両",
    template: "%s | sen-ryo 千両",
  },
  description: "Amazing Japanese sushi restaurant in Hong Kong.",
  keywords: "Senryo, 千両, Japanese, sushi, restaurant, Hong Kong, 香港, 日本, 壽司, 餐廳",
};

const workLato = Open_Sans({
  subsets: ["latin"],
  // weight: "400",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: ServerSidePageType["params"];
}) {
  let shouldDisplayCommonComponents = true;
  const headersList = headers();
  const cookie = cookies();
  const slugs = getRouteNameFromPathname(headersList.get("x-pathname") ?? "");
  const { lang } = params;
  const accessToken = cookie.get(CookiesKey.accessToken);
  const FullScreenPopUp = cookie.get(CookiesKey.screenPopBanner);
  const addCartBeforeMemberLogin = cookie.get(CookiesKey.addCartBeforeMemberLogin);
  const targetPageToBeRedirectedTo = cookie.get(CookiesKey.targetPageToBeRedirectedTo);
  const addCartIsContinue = cookie.get(CookiesKey.addCartIsContinue);
  const sourceForGetCart = cookie.get(CookiesKey.sourceForGetCart);
  const popupBannerData = await getPopupBannerApi({ lang });

  if (!locales.includes(lang)) {
    return <></>;
  }

  const response = await generalApisRequests({
    lang,
    pathname: headersList.get("x-pathname") ?? "",
    options: {
      accessToken: accessToken?.value,
      addCartBeforeMemberLogin: addCartBeforeMemberLogin?.value,
      targetPageToBeRedirectedTo: targetPageToBeRedirectedTo?.value,
      addCartIsContinue: addCartIsContinue?.value,
      sourceForGetCart: sourceForGetCart?.value,
    },
  });

  const validNoneNavPage = {
    maintenance: "maintenance",
    errorOops: "error-oops",
    maintenanceDaily: "maintenance-daily",
    checkout: "checkout",
  };

  if (
    (Object.values(validNoneNavPage).includes(slugs.secondSlug) &&
      slugs.thirdSlug !== ROUTES.PROCESSING &&
      !response?.cart?.data?.cart?.cartItems?.length) ||
    (accessToken?.value && slugs.secondSlug === ROUTES.VERIFY_NEW_USER_EMAIL)
  ) {
    shouldDisplayCommonComponents = false;
  }

  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <link rel="icon" href={FavIcon.src} sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </head>
      <body
        className={`${
          lang === "en" ? workLato.className : "TCFont"
        } ${lang}-letter-spacing relative bg-opacity-30 bg-MainBG`}
      >
        <ReduxProvider
          lang={lang}
          initValue={{
            cart: response?.cart,
            profile: response?.profile,
            addCartAfterMemberLogin: response?.addCartAfterMemberLogin,
          }}
        >
          {shouldDisplayCommonComponents && <TopErrorMessageBar />}
          {popupBannerData.status === 200 && (
            <PopUpBanner data={popupBannerData.data} isOpen={FullScreenPopUp?.value === "true"} />
          )}
          {shouldDisplayCommonComponents && (
            <Header lang={lang} inboxUnreadCount={response.inboxUnreadCount} coupon={response.coupon} />
          )}
          {shouldDisplayCommonComponents && <BottomNavbar inboxUnreadCount={response.inboxUnreadCount} lang={lang} />}
          {children}
          {shouldDisplayCommonComponents && <Footer lang={lang} hideFooter={false} />}
          <AlertModal />
          <PopupPaymentInProgress lang={lang} />
          <CookiesNotice lang={lang} />
        </ReduxProvider>
      </body>
    </html>
  );
}
