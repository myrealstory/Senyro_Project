"use client";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import Logo from "@/images/icons/Icon_senryo-new_Black.png";
import Alert from "@/images/icons/Icon_alert-circle@3x.png";
import Guest from "@/images/icons/Icon_user@3x.png";
import { setPage, setWillUpdateSelectedPickupDate } from "@/redux/slice/firstTimeOrderPopupSlice";
import { useTranslation } from "@/app/i18n/client";
import { ProgressConstans } from "@/constants/product/CartPicker";
import { CartPickupStep3Type } from "@/types/componentTypes";

import Progress from "../Progress";
import CustomButton from "../CustomButton";
import { useCartPickupStep } from "@/hook/useCartPickupStep";
import { setLoginRedirectUrl } from "@/redux/slice/generalStateSlice";
import { setIsPopupOpen } from "@/redux/slice/generalStateSlice";
import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";

export const CartPickupStep3 = ({ lang }: CartPickupStep3Type) => {
  const [selectedOption, setSelectedOption] = useState<"LEFT" | "RIGHT" | undefined>();
  const { width } = useWindowSize();
  const {
    sourceForAddCart
  } = useSelector((state: RootState) => state.generalState);
  const { translate } = useTranslation(lang);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { onStep3Submit, addCartBeforeMemberLogin } = useCartPickupStep({
    lang,
  });

  const onConfirmClick = () => {
    if (selectedOption === "LEFT") {
      dispatch(setLoginRedirectUrl(pathname as string));
      addCartBeforeMemberLogin(lang);
    }
    if (selectedOption === "RIGHT") {
      onStep3Submit(translate, sourceForAddCart ?? "confirm");
    }
  };

  const handlePopUp = () => {
    dispatch(setIsPopupOpen(true));
  };

  return (
    <>
      <Progress title={ProgressConstans} progress={3} lang={lang} containerStyle="my-4" />
      <div className="my-4 h-full w-full md:mt-0  md:flex md:justify-between md:pb-[80px]">
        <button
          className={`mb-3 flex  aspect-[2/1] h-auto max-h-[250px] w-full items-center justify-center rounded-2xl bg-white hover:border-2 hover:border-solid hover:border-black md:mb-0 md:mr-5 md:h-[100%] md:max-h-[100%]  md:w-1/2 ${
            selectedOption === "LEFT" ? "border-2 border-solid border-black" : ""
          }`}
          onClick={() => {
            setSelectedOption("LEFT");
          }}
        >
          <div className="mx-auto">
            <Image
              src={Logo}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="mx-auto mb-4 aspect-square h-[60px] w-[60px] object-cover md:mb-[1.1vw] md:h-[70px] md:w-[70px] xl:h-[85px] xl:w-[85px]"
            />
            <div className="mb-2 flex items-center justify-center text-[20px] font-medium text-mineShaft">
              <span className="mr-1 leading-7 ">{translate("SingleProduct.memberlogin")}</span>
              <button onClick={handlePopUp}>
                <Image
                  src={Alert}
                  alt="alert"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-5 w-5 md:h-[1.5rem] md:w-[1.5rem]"
                />
              </button>
            </div>
            <p className="text-14 leading-4 tracking-normal">{translate("SingleProduct.memberReminder")}</p>
          </div>
        </button>
        <button
          className={`flex aspect-[2/1] h-auto  max-h-[250px] w-full items-center justify-center rounded-2xl bg-white hover:border-2 hover:border-solid hover:border-black md:mb-0 md:mr-5 md:h-[100%] md:max-h-[100%] md:w-1/2 ${
            selectedOption === "RIGHT" ? "border-2 border-solid border-black" : ""
          }`}
          onClick={() => {
            setSelectedOption("RIGHT");
          }}
        >
          <div className="mx-auto">
            <Image
              src={Guest}
              alt="guest"
              width={0}
              height={0}
              sizes="100vw"
              className="mx-auto mb-4 h-[60px] w-[60px] object-cover md:mb-[1vw] md:h-[7rem] md:w-[7rem]"
            />
            <span className="text-[20px] font-medium leading-7 text-mineShaft">
              {translate("SingleProduct.guestcheckout")}
            </span>
          </div>
        </button>
      </div>
      <div className="stepBtnContainer">
          <CustomButton
            containerClass={
              "defaultStyle left"
            }
            onClick={() => {
              dispatch(setWillUpdateSelectedPickupDate(true));
              dispatch(setPage(2));
            }}
            textClass={"textStyle"}
            title={translate("SingleProduct.previous") as string}
            secondary
            noBorder={width < 1024}
          />
          <CustomButton
            containerClass={"defaultStyle right"}
            onClick={() => onConfirmClick()}
            textClass="textStyle"
            title={translate("SingleProduct.confirm") as string}
            disabled={!selectedOption}
          />
      </div>
    </>
  );
};
