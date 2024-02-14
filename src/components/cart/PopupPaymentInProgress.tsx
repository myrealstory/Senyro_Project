"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ClosedBTN from "@/images/icons/Icons-Closed-White@3x.png";
import iconCreditCard from "@/images/icons/Icon_CreditCard.png";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import Mask from "@/components/Mask";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsPaymentInProgressPopupDisplay } from "@/redux/slice/generalStateSlice";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

interface PopupProps {
  lang: LocaleKeysType,
}

export const PopupPaymentInProgress: React.FC<PopupProps> = ({ lang }) => {
  const { translate } = useTranslation(lang);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isPaymentInProgressOpen, setIsPaymentInProgressOpen] = useState(false);
  const { isPaymentInProgressPopupDisplay } = useSelector((state: RootState) => state.generalState);
  const popupStyles = useMemo(() => isPaymentInProgressOpen ? "flex" : "hidden", [isPaymentInProgressOpen]);

  useEffect(() => {
    setIsPaymentInProgressOpen(isPaymentInProgressPopupDisplay);
  }, [isPaymentInProgressPopupDisplay])

  if (!isPaymentInProgressOpen || pathname === `/${lang}/${ROUTES.CART}`  ) {
    return <></>;
  }
  
  return (
    <Mask>
      <div className={`fixed inset-0 items-center justify-center ${popupStyles} `}>
        <div className="flex flex-col items-center justify-center ">
          <section className="flex h-[221px] w-[282px] flex-col items-center justify-center rounded-[0.7rem] bg-white px-11 lg:h-[373.3px] lg:w-[520px]">
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center lg:mb-2 lg:h-[100px] lg:w-[100px]">
              <Image
                src={iconCreditCard}
                width={0}
                height={0}
                alt="icon CreditCard"
                className="h-full w-full object-fill"
              />
            </div>

            <div className="flex h-auto flex-col items-center justify-center ">
              <h5
                className="text-[18.789px] font-medium leading-[40px] tracking-[-0.376px] lg:-mt-3 
                                  lg:mb-2 lg:text-[30px] lg:leading-[72.5px] lg:tracking-[-0.6px]"
              >
                {translate("transactions.paymentLoadingTitle")}
              </h5>

              <p
                className="px-3 text-center text-[12px] font-medium leading-[16.9px] 
                                  tracking-[-0.24px] lg:-mt-4 lg:text-[18px] lg:leading-[21.6px] lg:tracking-[-0.36px]"
              >
                {translate("transactions.paymentLoadingContent")}
              </p>
            </div>
          </section>

          <button className=" mt-6 flex items-center justify-center rounded-[0.7rem] bg-white" onClick={() => {
            dispatch(setIsPaymentInProgressPopupDisplay(false));
          }}>
            <Image
              src={ClosedBTN}
              alt="Closed Button"
              width={0}
              height={0}
              sizes="100vw"
              className="h-[30px] w-[30px] lg:h-[61.336px] lg:w-[61.336px]"
            />
          </button>
        </div>
      </div>
    </Mask>
  );
};
