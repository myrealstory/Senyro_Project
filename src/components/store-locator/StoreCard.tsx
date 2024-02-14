"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Location from "@/images/icons/Icon_contact-location@3x.png";
import Phone from "@/images/icons/Icon_contact-phone@3x.png";
import Tooltip from "@/images/icons/alert-circle-purple.png";
import { StoreTimeAccordion } from "./StoreTimeAccordion";
import { Stores } from "@/types/api/apiTypes";
import GPSClicked from "@/images/icons/Send.png";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { StoreCardType } from "@/types/componentTypes";

export const StoreCard = ({
  item,
  setSelectdStore,
  setActiveMarker,
  isActive,
  isClickedGPS,
  lang,
  setIsHalfModal,
  snapFromFulltoHalf,
}: StoreCardType) => {
  const [openTimeSchedule, setOpenTimeSchedule] = useState(false);
  const { translate } = useTranslation(lang as LocaleKeysType);
  const scrollToElementRef = useRef<HTMLDivElement>(null);
  const [isSetTimeOut, setIsSetTimeOut] = useState(false);

  const handleOpenTimeSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenTimeSchedule(!openTimeSchedule);
  };

  const scrollToElement = (idAnchor: string) => {
    const element = document.getElementById(`${idAnchor}`);
    // console.log(element, "element");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  const handleButtonClick = (item: Stores) => {
    setSelectdStore(item);
    setActiveMarker(item.id);
    setIsHalfModal(true);
    scrollToElement(item.branchCode);
    snapFromFulltoHalf && snapFromFulltoHalf();
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSetTimeOut(true);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isActive) {
        scrollToElementRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
      }
    }, 250);
  }, [isActive]);

  // console.log(scrollToElementRef.current,"scrollToElementRef.current")

  return (
    <div className={"storeCardMainContainer"} id={item.branchCode} ref={scrollToElementRef}>
      {/* <a href={`#${item.branchCode}`}> */}
      <div
        key={item.id}
        id={`#${item.branchCode}`}
        role="button"
        onClick={() => handleButtonClick(item)}
        className={` ${
          isActive ? "storeCardMainBorder" : "border-opacity-[0.35]"
        } relative flex cursor-pointer flex-col gap-[13px] rounded-[13.7px] border-[0.83px] border-primaryGold bg-white py-5 pl-5 pr-4 
        hover:bg-[#F3F4F6] sm:px-6 md:gap-[14px] lg:shadow-lg 
            ${item.isOpenNow === false ? "lg:border-l-primaryGold lg:border-opacity-50 " : ""} 
            `}
        style={
          // storeCardMainBorder class is not working -.-
          isActive
            ? {
                borderLeft: "8px solid rgba(141 ,122 ,91, 1)",
                borderTop: "0.83px solid rgba(141 ,122 ,91, 0.35)",
                borderRight: "0.83px solid rgba(141 ,122 ,91, 0.35)",
                borderBottom: "0.83px solid rgba(141 ,122 ,91, 0.35)",
              }
            : {}
        }
      >
        <div>
          <div className="storeCardTitleContainer">
            <div className="block w-[75%] text-[20px] font-semibold leading-5">
              <h2 className="">{item.name}</h2>
            </div>
            {isClickedGPS && isSetTimeOut ? (
              <div className="storeCardGpsIsOnDiv">
                <Image
                  src={GPSClicked}
                  width={0}
                  height={0}
                  alt="Search by GPS is on"
                  className="h-[18.2px] w-[18.2px]"
                />
                <span>
                  {item.distanceWithGPS}
                  {translate("storeLocator.km")}
                </span>
              </div>
            ) : (
              ""
            )}

            {/* <NotAvailable isAvailable={item.storeLocationDisplayStatus} /> */}
          </div>
          {item.restaurantLicense && (
            <span className="storeCardRestaurantLicense">
              {translate("storeLocator.restaurantLicence")}
              {item.restaurantLicense}
            </span>
          )}
        </div>
        <div className="storeCardOtherInfoContainer">
          <div className="flex h-[20px] w-[20px] items-center ">
            <Image src={Location} width={0} height={0} alt="Store location" className="h-auto w-[15px] object-cover" />
          </div>
          <div className="w-[90%]">
            <span className="storeCardAddress">{item.address}</span>
            <span className="storeCardDirectionMessage">{item.directionMessage}</span>
            {item.reminderMessage ? (
              <div className="storeCardReminderMessage">
                <div className="flex items-start gap-2">
                  <Image
                    src={Tooltip}
                    width={0}
                    height={0}
                    alt="Tooltip"
                    className="aspect-square h-[18px] w-[16px] object-contain"
                  />
                  <span>{item.reminderMessage}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="storeCardPhoneNumberFaxContainer">
          <div className="storeCardPhoneDiv">
            <Image src={Phone} width={0} height={0} alt="Store phone" className="h-auto w-[15px] self-center" />
            <span className="text-[14px] leading-4">
              <a className="block lg:hidden" href={`tel:${item.contactNumber}`}>
                {item.contactNumber}
              </a>
              <a className="hidden lg:block">{item.contactNumber}</a>
            </span>
          </div>
          {item.faxNumber && (
            <div className="storeCardFaxDiv">
              <p>FAX</p>
              <span>{item.faxNumber}</span>
            </div>
          )}
        </div>
        <div className="StoreTimeAccordionOutterContainer">
          <StoreTimeAccordion
            isOpen={item.isOpenNow}
            openingHours={item.openingHours}
            handleOpenTimeTable={handleOpenTimeSchedule}
            openTimeTable={openTimeSchedule}
          />
        </div>
      </div>
      {/* </a> */}
    </div>
  );
};
