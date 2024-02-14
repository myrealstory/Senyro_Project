import React from "react";
import Image from "next/image";
import editIcon from "@/images/icons/Icon_edit-white@3x.png";
import IconShopping from "@/images/icons/Icon_shopping-bag_Gold@3x.png";
import IconClock from "@/images/icons/Icon_clock_Gold@3x.png";
import IconMap from "@/images/icons/Icon_mappin_Gold@3x.png";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment";
import { InnerAlert } from "../InnerAlert";
import { openCartPickupPopup } from "@/utils/clientUtils";

export type PickupInfoType = {
  lang: LocaleKeysType;
};

export default function PickupInfo({ lang }: PickupInfoType) {
  const { apiData } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const branchInfo = apiData.cart?.branch;
  const pickupMethodInfo = apiData.cart?.deliveryMethod;
  const { translate } = useTranslation(lang);

  const generateInfoByPickupMethod = () => {
    if (pickupMethodInfo?.type === "EFFECTIVE") {
      return (
        <>
          <li className="mb-[10px]">
            <div className="flex items-center ">
              <Image src={IconShopping} alt="" className="mr-3 h-auto w-[20px] self-center" />
              <div className="flex flex-wrap items-start xl:items-center">
                <h3 className="mr-1 text-[14px] leading-5 md:text-lg">{translate("checkout.pickMode")}</h3>
                <p className="whitespace-nowrap text-[14px] font-semibold leading-5 md:text-lg">
                  {translate("checkout.ASAP")}
                </p>
              </div>
            </div>
          </li>
          <li className="mb-[10px]">
            <div className="flex items-center ">
              <Image src={IconClock} alt="" className="mr-3 h-auto w-[20px] self-center" />
              <div className="flex flex-wrap items-start xl:items-center">
                <h3 className="mr-1 text-[14px] leading-5 md:text-lg">{translate("checkout.pickTime")}</h3>
                <p className="whitespace-nowrap text-[14px] font-semibold leading-5 md:text-lg">
                  {/* {`Approx. ${branchInfo?.prepTime} min`} */}
                  {`${translate("checkout.approx")} ${branchInfo?.prepTime} ${translate("checkout.min")}`}
                </p>
              </div>
            </div>
          </li>
        </>
      );
    }

    if (pickupMethodInfo?.type === "PICKUP") {
      return (
        <>
          <li className="mb-[10px]">
            <div className="flex items-center ">
              <Image src={IconShopping} alt="" className="mr-3 h-auto w-[20px] self-center" />
              <div className="flex flex-wrap items-start xl:items-center">
                <h3 className="mr-1 text-[14px] leading-5 md:text-lg">{translate("checkout.pickMode")}</h3>
                <p className="whitespace-nowrap text-[14px] font-semibold leading-5 md:text-lg">
                  {translate("checkout.otherTimes")}
                </p>
              </div>
            </div>
          </li>
          <li className="mb-[10px]">
            <div className="flex items-center ">
              <Image src={IconClock} alt="" className="mr-3 h-auto w-[20px] self-center" />
              <div className="flex flex-wrap items-start xl:items-center">
                <h3 className="mr-1 text-[14px] leading-5 md:text-16">{translate("checkout.pickTime")}</h3>
                <p className="whitespace-nowrap text-[14px] font-semibold leading-5 md:text-lg">
                  {`${moment(pickupMethodInfo?.datetime).format("YYYY/MM/DD hh:mm")}`}
                </p>
              </div>
            </div>
          </li>
        </>
      );
    }

    return <></>;
  };

  return (
    <div className="mb-12 px-4 -tracking-[0.03rem] md:mb-12 md:px-0">
      <h1 className="checkoutTitle">{translate("checkout.title")}</h1>
      <InnerAlert containerStyle="md:mb-10 mb-5" />
      <div className="mb-[22px] flex items-center justify-between md:justify-start">
        <h2 className="mr-10 text-[20px] font-semibold leading-[22px] md:text-h4">
          {translate("checkout.pickupInfo")}
        </h2>
        <button
          className="btn-dark flex items-center space-x-1 px-3 py-2 md:px-7 md:py-4"
          onClick={() => openCartPickupPopup(dispatch, "EDIT")}
        >
          <Image src={editIcon} alt="" className="mr-1 w-5" />
          <p className="text-[14px] leading-[16.43px]">{translate("checkout.edit")}</p>
        </button>
      </div>
      <ul>
        {generateInfoByPickupMethod()}
        <li className="mb-3">
          <div className="flex items-center ">
            <Image src={IconMap} alt="" className="mr-3 h-auto w-[20px] self-center" />
            <div className="flex flex-wrap items-start xl:items-center">
              <h3 className="mr-1 text-[14px] leading-5 md:text-16">{translate("checkout.pickStore")}</h3>
              <p className="whitespace-nowrap text-[14px] font-semibold leading-5 md:text-16">{branchInfo?.name}</p>
            </div>
          </div>
        </li>
        <li className="ml-[2.2rem] w-auto md:ml-8 md:mt-0">
          <p className="mb-1 block text-md font-semibold">{translate("checkout.storeAddress")}</p>
          <p className="w-[90%] break-words text-base leading-6 md:text-md md:leading-5">{branchInfo?.address}</p>
        </li>
      </ul>
    </div>
  );
}
