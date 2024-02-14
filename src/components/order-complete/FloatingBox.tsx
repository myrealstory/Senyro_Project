import React from "react";
import Image from "next/image";
import Logo from "@/images/icons/Senryo General Logo_GIF_Light Swipe.gif";
import { usePathname, useRouter } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";
import { useDispatch } from "react-redux";

type FloatingBoxType = {
  memberPopupHandler: () => void;
  containerClass?: string;
  registrationUrl: string;
};

export default function FloatingBox({ memberPopupHandler, containerClass, registrationUrl }: FloatingBoxType) {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  return (
    <div
      className={`boxShadow-3xl fixed right-1/2 top-1/2 z-[999] flex w-[90%] -translate-y-1/2 translate-x-1/2 flex-col items-center rounded-[26px] bg-white px-8 pb-5 pt-[44px] shadow-5xl md:right-[5%] md:w-[20%] md:translate-x-0 ${containerClass}`}
    >
      <div className="md:w-[70px] xl:h-auto xl:w-[85px]">
        <Image src={Logo} alt="" width={0} height={0} sizes="100vw" className="mb-8 aspect-square h-full w-full" />
      </div>
      <p className="mb-[26px] text-center text-[16px] leading-[22px] md:mb-[14px] md:text-lg md:leading-5">
        {translate("orderComplete.promoMSG")}
      </p>
      <button
        className="btn-dark mb-4 w-full py-5 text-[18px] font-medium leading-5 md:mb-3 md:text-xl md:leading-6"
        onClick={() => router.push(registrationUrl)}
      >
        {translate("orderComplete.promoButton")}
      </button>
      <button className="whitespace-nowrap text-[14px] leading-[19px] underline" onClick={() => {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate("alertModal.g43_popup_title"),
            alertContent: translate("alertModal.g43_popup_content"),
            leftButtonText: translate("alertModal.g43_popup_left_button_text"),
            rightButtonText: translate("alertModal.g43_popup_right_button_text"),
            onRightButtonClick: () => {
              memberPopupHandler();
            },
          })
        );
      }}>
        {translate("orderComplete.promoLater")}
      </button>
    </div>
  );
}
