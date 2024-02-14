"use client";
import React, { useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";

import iconCreditCard from "@/images/icons/Icon_CreditCard.png";

import { setIsPaymentInProgressPopupDisplay, setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

const PaymentInProgressPage = () => {
  const dispatch = useDispatch();
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoadingScreenDisplay(false));
    }, 500);
  }, []);

  return (
    <main className="wrapper mt-5 w-full sm:mt-[4.6875vw] xl:mt-[4vw] 2xl:mt-[3.5vw]">
      <div className="mb-[79px] mt-[48px] w-full ">
        <h3 className="text-[28px] font-medium leading-7 lg:text-[40px] lg:leading-10"> {translate("cart.title")}</h3>
      </div>

      <section className="flex h-auto flex-col items-center justify-center">
        <div className="h-[60px] w-[60px] lg:mb-2 lg:h-[100px] lg:w-[100px]">
          <Image
            src={iconCreditCard}
            width={0}
            height={0}
            alt="icon CreditCard"
            className="h-full w-full object-fill"
          />
        </div>

        <div className="mx-6 flex h-auto flex-col items-center justify-center">
          <h5 className="text-[25.571px] font-medium leading-[52px] tracking-[-0.511px] lg:text-[30px] lg:leading-[72.5px] lg:tracking-[-0.6px]">
            {translate("cart.paymentInProcessPageTitle")}
          </h5>

          <p
            className={`px-3 text-center text-[14px] font-medium leading-[18.4px] 
                              tracking-[-0.28px] lg:text-[18px] lg:leading-[21.6px] lg:tracking-[-0.36px]
                              ${lang === "tc" ? "lg:mt-0 " : "lg:-mt-4 "}`}
          >
            {translate("cart.paymentInProcessPageContent")}
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <Link href="/en/index">
            <button
              className="mx-[37px] mb-[187px] mt-[91px] flex h-[56px] w-[300px] items-center justify-center rounded-full bg-primaryGold text-[18px] font-medium tracking-[-0.36px] text-white 
                                    lg:mt-[2.604vw] lg:h-[68px] lg:w-[19.21875vw] lg:text-[22px] lg:tracking-[-0.44px] xl:mb-[160px] 2xl:mb-[143px] "
              onClick={() => {
                setCookie(CookiesKey.isPaymentInProgress, "true");
                dispatch(setIsPaymentInProgressPopupDisplay(true));
              }}
            >
              {translate("campaignSubmitted.backToHome")}
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentInProgressPage;
