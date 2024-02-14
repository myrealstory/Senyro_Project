"use client";
import React, { useEffect } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { useDispatch } from "react-redux";
import { setIsBodyScrollbarDisplay } from "@/redux/slice/generalStateSlice";
import { useRouter } from "next/navigation";
import PaymentLoading from "@/images/icons/Icon_Loader_GIF.gif";
import Image from "next/image";
import { useGetSaveCardStatusQuery } from "@/redux/api/memberApi";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import { handleAlertMessageForGeneralPage, mpgsErrorMapper } from "@/utils/clientUtils";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import moment from "moment";

export interface FullScreenSaveCardLoaderProps {
  returnHtmlPayload?: { returnHtml: string; returnHtmlScriptId: string } | null;
  needEnquirePaymentStatus?: boolean;
  isLoading?: boolean;
  siteOrderRefNo?: string;
  lang: LocaleKeysType;
}

export const FullScreenSaveCardLoader = ({
  returnHtmlPayload,
  needEnquirePaymentStatus,
  siteOrderRefNo,
  lang,
}: FullScreenSaveCardLoaderProps) => {
  // Start: Interval enquire payment result logic
  const route = useRouter();
  const { translate } = useTranslation(lang);
  const { data, refetch, isLoading } = useGetSaveCardStatusQuery(
    { siteOrderRefNo }, 
    { 
      skip: !siteOrderRefNo?.length 
    } 
  );

  let interval: any;

  const handleGetCheckoutStatusError = (data: any) => {
    if (data?.data?.alertList?.length) {
      setCookie(
        CookiesKey.MPGSError,
        JSON.stringify(data?.data?.alertList),
        {
          expires: moment().add(3, "minutes").toDate(),
        }
      )
    }
  }

  useEffect(() => {
    if (!needEnquirePaymentStatus) {
      return;
    }

    interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!needEnquirePaymentStatus) {
      return;
    }

    if (data) {
      if (data?.statusCode !== 200) {
        const isMPGSError = mpgsErrorMapper({
            alertCode: (data as any)?.data?.returnCode ?? data?.returnCode as any,
            alertMessage: data?.data as any,
            alertItems: [],
            alertType: "popup",
          },
          dispatch,
          translate,
          lang,
          true,
        )
  
        if (isMPGSError) {
          handleGetCheckoutStatusError(data);
          route.push(`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`);
        } else {
          handleAlertMessageForGeneralPage({
            alertCode: data?.returnCode as any,
            alertType: "popup",
            translate,
            dispatch,
            lang,
            extraInfo: {
              rightButtonCallback: () => {
                route.push(`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`);
              },
            },
          });
        }
      } else {
        handleAlertMessageForGeneralPage({
          alertCode: "g62",
          alertType: "popup",
          translate,
          dispatch,
          lang,
          extraInfo: {
            rightButtonCallback: () => {
              route.push(`/${lang}/${ROUTES.MEMBER_SAVED_CARDS}`);
            },
          },
        });
      }
    }

    clearInterval(interval);
  }, [data]);
  // End: Interval enquire payment result logic

  // Start: Handle MPGS response html OTP iframe display logic
  useEffect(() => {
    if (returnHtmlPayload) {
      const targetDiv = document.getElementById("paymentReturnHtml");
      if (targetDiv) {
        targetDiv.innerHTML = returnHtmlPayload.returnHtml;
        eval((document.getElementById(returnHtmlPayload.returnHtmlScriptId) as any).text);
        targetDiv.style["zIndex"] = "9999999999";
      }

      const acDiv = document.getElementById("redirectTo3ds1AcsSimple");
      if (acDiv) {
        acDiv.style["height"] = "100vh";
        acDiv.style["zIndex"] = "9999999999";
      }
    }
  }, [returnHtmlPayload]);
  // End: Handle MPGS response html OTP iframe display logic

  const { width } = useWindowSize();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isLoading === true) {
      document.body.style.overflow = "hidden"; // disable scrolling
      dispatch(setIsBodyScrollbarDisplay(false));
    } else {
      document.body.style.overflow = "visible"; // enable scrolling
      dispatch(setIsBodyScrollbarDisplay(true));
    }

    return () => {
      document.body.style.overflow = "visible"; // enable scrolling
      dispatch(setIsBodyScrollbarDisplay(true));
    };
  }, [isLoading, width]);

  return (
    <>
      {/* For credit card OTP */}
      <div
        id="paymentReturnHtml"
        style={{
          visibility: returnHtmlPayload ? "visible" : "hidden",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
        }}
      />
      {isLoading && (
        <div className=" fixed left-0 top-0 z-[999] flex h-screen w-full items-center justify-center bg-[#E8E4DE]/80 backdrop-blur-[1px]">
          <div className=" flex h-full max-h-[221px] w-full max-w-[280px] flex-col items-center justify-center rounded-2xl bg-white md:max-h-[370px] md:max-w-[520px] md:px-10">
            <Image
              src={PaymentLoading}
              alt="PaymentLoadingDummyImg"
              width={0}
              height={0}
              sizes="100vw"
              className="aspect-square h-full max-h-[63px] w-full max-w-[63px] object-contain md:max-h-[140px] md:max-w-[140px]"
            />
            <h6 className=" text-center text-18 font-medium leading-8 md:text-25 md:leading-[60px] xl:text-[30px] xl:leading-[72px]">
              {translate("transactions.paymentLoadingTitle")}
            </h6>
            <p className="text-center text-12  leading-4 md:text-18 md:leading-5 ">
              {translate("transactions.paymentLoadingContent")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
