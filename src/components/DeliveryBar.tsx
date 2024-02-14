"use client";
import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import ClockIcons from "@/images/icons/Icon_clock-primary@3x.png";
import LocationIcons from "@/images/icons/Icon_mappin-primary@3x.png";
import EditPenIcons from "@/images/icons/Icon_edit_Gold@3x.png";
import DarkPenIcon from "@/images/icons/Icon_edit@3x.png";

import IconStore from "@/images/icons/Icon_Store.png";
import { useTranslation } from "@/app/i18n/client";
import { DeliveryBarType } from "@/types/componentTypes";
import moment from "moment";
import { useWindowSize } from "@/hook/useWindowSize";
import { openCartPickupPopup } from "@/utils/clientUtils";

export const DeliveryBar = ({ data, lang, isCartMode, miniMode }: DeliveryBarType) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const getCart = data.cart;
  const { width } = useWindowSize();

  const renderCartMode = () => {
    if (width > 1024) {
      return (
        <div className="hidden h-full w-full items-center justify-between sm:p-2 md:flex md:p-3 lg:px-5 lg:py-4">
          <div>
            <div className="flex items-center">
              <div className="mr-8 flex items-center ">
                <div className="mr-2 aspect-square h-auto md:w-5 lg:w-[22px] 2xl:w-6">
                  <Image
                    src={IconStore}
                    alt="IconStore"
                    width={0}
                    height={0}
                    className=" h-full w-full object-cover "
                  />
                </div>
                <span className="text-12 font-semibold leading-6 2xl:text-14">{getCart?.branch.name}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <Image
                    src={ClockIcons}
                    alt="ClockIcons"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className=" mr-2 aspect-square h-auto object-cover md:w-[20px]  lg:w-[22px] 2xl:w-6"
                  />
                  <div className="w-fullx mr-2 flex items-center break-words text-12 leading-[1rem] md:w-full 2xl:text-14">
                    <div className="block">
                      {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
                        <>
                          <span className="">{translate("tabs.searchbar1")}</span>
                          <span className="px-1 md:px-2 md:font-semibold">{getCart.branch.prepTime}</span>
                          <span className="">
                            {translate("tabs.mins")}
                            {translate("tabs.searchbar2")}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="">{translate("tabs.advSearch")}</span>
                          <span className="px-1 md:px-2 md:font-semibold">
                            {getCart?.deliveryMethod?.datetime &&
                              moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <Image
                src={LocationIcons}
                className="mr-2 aspect-square h-auto object-cover md:w-[20px]  lg:w-[22px] 2xl:w-6 "
                alt="LocationIcons"
                width={0}
                height={0}
                sizes="100vw"
              />
              <span className="text-12 leading-4 2xl:text-14">{getCart?.branch.address}</span>
            </div>
          </div>
          <button
            className=" flex items-center border-l border-solid border-primaryDark pl-[1.59vw] md:h-[5.1vw] md:w-[5.1vw] xl:h-[56px] xl:w-[63px] 2xl:pr-1"
            onClick={() => {
              openCartPickupPopup(dispatch, "EDIT");
            }}
          >
            <Image
              src={EditPenIcons}
              alt="EditPenIcons"
              width={0}
              height={0}
              className="h-5 w-5 md:h-[22px] md:w-[22px] 2xl:mr-3 2xl:h-[24px] 2xl:w-[24px] "
            />
          </button>
        </div>
      );
    } else {
      return (
        <div
          className="2xl:text-2xl flex w-full items-center 
              justify-between whitespace-nowrap 
              text-primaryDark 

              md:hidden 
              md:bg-secondaryLightGold2 
              md:bg-opacity-0 
              md:text-base
              md:leading-6 
              
              lg:text-18 
              
              xl:leading-8 
        "
        >
          <div className="w-full p-4  md:flex md:w-[60.4vw] md:flex-wrap md:items-center ">
            <div className="mb-3 flex w-full justify-between md:mb-[0.88vw]">
              <div className="mr-2 flex h-[20px] w-[20px] items-center md:h-[1.16vw] md:w-[22.75px]">
                <Image src={IconStore} alt="IconStore" width={0} height={0} className="mr-2 h-full w-full" />
                <span className="font-semibold">{getCart?.branch.name}</span>
              </div>
              <button
                className="mr-2 flex sm:ml-[1.7vw] md:hidden "
                onClick={() => {
                  openCartPickupPopup(dispatch, "EDIT");
                }}
              >
                <Image
                  src={EditPenIcons}
                  alt="EditPenIcons"
                  width={0}
                  height={0}
                  className="mr-2 h-[15px] w-[15px] 
                    
                    "
                />
                <span className="block text-[16px] font-medium leading-[18px] text-primaryGold md:hidden">
                  {translate("cart.Edit")}
                </span>
              </button>
            </div>
            <div className="mb-3 flex sm:pr-[1.7vw] md:mb-[0.88vw] ">
              <Image
                src={LocationIcons}
                className="mr-2 h-[20px] w-[20px] object-contain md:ml-1 md:mr-0 md:h-[25.67px] md:w-[21px]"
                alt="LocationIcons"
                width={0}
                height={0}
                sizes="100vw"
              />
              <span className="whitespace-normal text-[14px] leading-[16px] sm:w-[34.16vw]">
                {getCart?.branch.address}
              </span>
            </div>
            <div className="flex items-center">
              <Image
                src={ClockIcons}
                alt="ClockIcons"
                width={0}
                height={0}
                sizes="100vw"
                className=" mr-2 h-[20px] w-[20px] object-contain md:h-[1.16vw]"
              />
              <div className="mr-2 flex w-full items-center break-words text-[14px] leading-[1rem] md:w-full">
                <div className="hidden md:block">
                  {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
                    <>
                      <span className="">{translate("tabs.searchbar1")}</span>
                      <span className="px-1 md:px-2 md:font-semibold">{getCart.branch?.prepTime}</span>
                      <span className="">
                        {translate("tabs.mins")}
                        {translate("tabs.searchbar2")}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="">{translate("tabs.advSearch")}</span>
                      <span className="px-1 font-semibold md:px-2">
                        {getCart?.deliveryMethod?.datetime &&
                          moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                      </span>
                    </>
                  )}
                </div>
                <div className="block whitespace-normal md:hidden">
                  <p className="leading-[16px]">
                    {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
                      <>
                        {translate("tabs.searchbar1")}
                        {getCart.branch?.prepTime}
                        {translate("tabs.mins")}

                        {translate("tabs.searchbar2")}
                      </>
                    ) : (
                      <>
                        {translate("tabs.advSearch")}
                        <span className="font-semibold">
                          {getCart?.deliveryMethod?.datetime &&
                            moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:flex md:h-[4.1rem] md:items-center md:justify-end md:border-l md:border-solid md:border-primaryDark md:pl-[2.48vw]">
            <button
              className="ml-[1.7vw] hidden h-[1.16vw] w-[1.16vw] md:block  "
              onClick={() => {
                openCartPickupPopup(dispatch, "EDIT");
              }}
            >
              <Image src={EditPenIcons} alt="" width={0} height={0} className="h-full w-full" />
            </button>
          </div>
        </div>
      );
    }
  };

  const renderMiniMode = () => {
    return (
      <div className=" z-[99] mx-auto my-4 flex w-fit  max-w-[900px] gap-6 rounded-full bg-primaryGold05 p-5 shadow-deliveryShadow">
        <div className="flex items-center">
          <Image
            src={ClockIcons}
            alt="clockIcon"
            width={0}
            height={0}
            sizes="100vw"
            className="mr-2 aspect-square h-auto w-6 object-contain"
          />
          <div className="text-14 leading-7 text-primaryDark">
            {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
              <>
                <span className="">{translate("tabs.searchbar1")}</span>
                <span className="px-1 md:px-2 md:font-semibold">{getCart.branch.prepTime}</span>
                <span className="truncate">
                  {translate("tabs.mins")}
                  {translate("tabs.searchbar2")}
                </span>
              </>
            ) : (
              <>
                <span className="">{translate("tabs.advSearch")}</span>
                <span className="px-1 font-semibold md:px-2">
                  {getCart?.deliveryMethod?.datetime &&
                    moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                </span>
              </>
            )}
          </div>
        </div>
        <div className=" flex items-center text-14 leading-7">
          <Image
            src={LocationIcons}
            className="mr-2 aspect-[0.85/1] h-6 w-auto object-contain "
            alt="LocationIcons"
            width={0}
            height={0}
            sizes="100vw"
          />
          {getCart?.branch?.address.length === 0 ? (
            <span>{translate("navbar.pickUpStore")}</span>
          ) : (
            <div className="w-full ">
              <p>{getCart?.branch?.name}</p>
            </div>
          )}
        </div>
        <button
          className="box-content aspect-square h-auto w-6 border-l border-solid border-primaryDark pl-6"
          onClick={() => {
            openCartPickupPopup(dispatch, "EDIT");
          }}
        >
          <Image
            src={DarkPenIcon}
            alt="DarkPenIcon"
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-contain"
          />
        </button>
      </div>
    );
  };

  const defaultRender = () => {
    return (
      <div className="hidden w-full items-center justify-center md:flex">
        <div className=" 2xl:text-2xl items-center justify-between whitespace-nowrap px-4 text-primaryDark md:flex md:justify-start md:px-0 md:text-14 md:leading-6 xl:leading-8">
          <div className="md:flex md:items-center md:border-r md:border-solid md:border-primaryDark md:pr-4">
            <div className="flex h-[17px] md:h-[19px] md:items-center xl:h-[22px]">
              <Image
                src={ClockIcons}
                alt="ClockIcons"
                width={0}
                height={0}
                sizes="100vw"
                className=" h-full object-contain md:mx-1 md:mr-3 md:w-auto"
              />
              <div className="mb-4 flex w-[250px] items-center md:mb-0 lg:w-full ">
                {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
                  <>
                    <span className="">{translate("tabs.searchbar1")}</span>
                    <span className="px-1 md:px-2 md:font-semibold">{getCart.branch.prepTime}</span>
                    <span className="truncate">
                      {translate("tabs.mins")}
                      {translate("tabs.searchbar2")}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="">{translate("tabs.advSearch")}</span>
                    <span className="px-1 font-semibold md:px-2">
                      {getCart?.deliveryMethod?.datetime &&
                        moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className=" flex h-[17px] items-center pr-[1.7vw] md:h-[19px] xl:h-[20px]">
              <Image
                src={LocationIcons}
                className="h-full object-contain md:mx-1 md:mr-3 md:w-auto xl:pl-5"
                alt="LocationIcons"
                width={0}
                height={0}
                sizes="100vw"
              />
              {getCart?.branch.address.length === 0 ? (
                <span>{translate("navbar.pickUpStore")}</span>
              ) : (
                <div className="w-full ">
                  <p className="md:text-14 xl:leading-[28px]">{getCart?.branch?.name}</p>
                </div>
              )}
            </div>
          </div>
          <button
            className="ml-[1.7vw] hidden h-[19px] w-[19px] md:block xl:h-[1.16vw] xl:w-[1.16vw] "
            onClick={() => {
              openCartPickupPopup(dispatch, "EDIT");
            }}
          >
            <Image src={EditPenIcons} alt="" width={0} height={0} className="h-full w-full" />
          </button>
        </div>
        <div className="w-[80%] text-primaryDark md:hidden ">
          <div className="mb-1 flex h-5 w-full">
            <div className="mr-3 flex h-full items-center">
              <Image
                src={LocationIcons}
                alt="LocationIcons"
                width={0}
                height={0}
                sizes="100vw"
                className="mr-2 h-full w-5"
              />
              <div className="max-w-[326px] truncate">
                <span className="whitespace-nowrap text-[16px] leading-[18px]">{getCart?.branch?.name}</span>
              </div>
            </div>
            <button
              className="h-[20px] w-[20px] overflow-hidden rounded-full"
              onClick={() => {
                openCartPickupPopup(dispatch, "EDIT");
              }}
            >
              <Image
                src={EditPenIcons}
                alt="EditPenIcons"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full"
              />
            </button>
          </div>
          <div className=" flex items-center overflow-hidden text-11 leading-5 opacity-60">
            {getCart?.deliveryMethod?.type === "EFFECTIVE" ? (
              <>
                <p className="whitespace-nowrap">{translate("tabs.searchbar1")}</p>
                <p className="whitespace-nowrap px-1">{getCart.branch.prepTime}min</p>
                <p className="whitespace-nowrap">{translate("tabs.searchbar2")}</p>
              </>
            ) : (
              <>
                <p className="whitespace-nowrap">{translate("tabs.advSearch")}</p>
                <p className="whitespace-nowrap px-1">
                  {getCart?.deliveryMethod?.datetime &&
                    moment(getCart?.deliveryMethod?.datetime).format("YYYY/MM/DD HH:mm")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return isCartMode ? renderCartMode() : miniMode ? renderMiniMode() : defaultRender();
};
