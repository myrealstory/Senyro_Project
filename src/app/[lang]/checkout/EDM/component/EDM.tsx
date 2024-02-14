"use client";
import React from "react";
import Image from "next/image";
import whitelogo from "@/images/icons/logo-senryo_White@3x.png";
import { EDMDB } from "@/constants/EDM";
import { ComponentType } from "@/app/[lang]/page";
import { useTranslation } from "@/app/i18n/client";
import QRCode from "@/images/icons/qrcode@3x.png";
import IconCopy from "@/images/icons/Icon_copy@3x.png";
import EDMPlaceHolder from "@/images/samplePic/EDM_PlaceHolder@3x.png";
import ClockIcon from "@/images/icons/Icon_clock-primary@3x.png";
import LocationIcon from "@/images/icons/Icon_mappin-primary@3x.png";
import TickIcon from "@/images/icons/Icon_Tick_Black@3x.png";
import EDMFooter from "./EDMFooter";

interface subTotalProps {
  amount: number;
  discount: number;
  price: number;
}

function subTotal({ amount, discount, price }: subTotalProps) {
  const discountPrice = price * (discount / 100);
  const afterDiscount = price - discountPrice;
  const total = afterDiscount * amount;
  return total as number;
}

// const getFirstName = (Name: string) => {
//   const names = Name.split(" ");
//   return names[0];
// };

const EDM = ({ lang }: ComponentType) => {
  const { translate } = useTranslation(lang);
  const orderSummaryTotal = EDMDB.orderSummary.reduce((total, item) => total + item.tag.price * item.amount, 0);
  const addOnTotal = EDMDB.addOn.reduce((total, item) => total + item.tag.price * item.amount, 0);
  const totalAmount = orderSummaryTotal + addOnTotal;
  const discount = totalAmount * 0.01;
  const payableAmount = totalAmount - discount;

  const renderContent = () => {
    switch (true) {
      case totalAmount > 300 && EDMDB.memberName === "":
        return (
          <React.Fragment>
            {/* here input second page of EDM about guest purchase over amount and promote to member's UI */}
            <div className="w-full text-center  text-primaryDark">
              <p className=" mb-7 text-[40px] font-semibold md:text-[48px]">{translate("EDM.congratz")}</p>
              <div className=" mx-auto mb-12 w-full text-24 leading-8 tracking-tight text-primaryDark md:w-[560px]">
                <span>{translate("EDM.congratzContent")}</span>
                <span>{translate("EDM.congratzContent02")}</span>
                <span>
                  <a href="#" className="cursor-pointer text-primaryDark underline">
                    {translate("EDM.congratzContent03")}
                  </a>
                </span>
              </div>
              <button className="mb-5 w-full rounded-full bg-primaryGold py-6 text-center text-22 leading-8 text-white md:text-28">
                {translate("EDM.reg")}
              </button>
              <div className="mb-[73px]">
                <p className="mx-auto mb-4 max-w-[505px] text-center text-18 font-semibold leading-7 md:text-22">
                  {translate("EDM.mayReg")}
                </p>
                <div className="flex items-center justify-center">
                  <p className="mr-4 text-14 font-semibold text-primaryDark md:text-16">
                    https://order.sen-ryo.com.hk/register
                  </p>
                  <button>
                    <Image src={IconCopy} alt={"IconCopy"} height={24} width={24} />
                  </button>
                </div>
              </div>
              <div className="mb-[73px] w-full rounded-full">
                <Image
                  src={EDMPlaceHolder}
                  alt="EDMPlaceHolder"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full object-cover"
                />
              </div>
              <div className="mb-14 text-center text-20 leading-7 text-primaryDark md:text-24 md:leading-[36px]">
                <span>{translate("EDM.thankContent")}</span>
                <span className=" font-bold ">{EDMDB.orderNum}</span>
                <span>{translate("EDM.thankContent02")}</span>
              </div>
            </div>
          </React.Fragment>
        );
        break;
      case EDMDB.memberName !== "":
        return (
          <React.Fragment>
            <div className="mb-14 text-center text-24 text-primaryDark sm:leading-[36px]">
              <span>{translate("EDM.thankContent")}</span>
              <span className=" font-bold ">{EDMDB.orderNum}</span>
              <span>{translate("EDM.thankContent02")}</span>
            </div>
            <button className="mb-5 w-full rounded-full bg-primaryGold py-6 text-center text-24 text-white">
              {translate("EDM.reg")}
            </button>
            <div className="mb-[73px]">
              <p className="mx-auto mb-4 max-w-[505px] text-center text-22 font-semibold leading-7">
                {translate("EDM.mayReg")}
              </p>
              <div className="flex items-center justify-center">
                <p className="mr-4 text-lg font-semibold text-primaryDark">https://order.sen-ryo.com.hk/register</p>
                <button>
                  <Image src={IconCopy} alt={"IconCopy"} height={24} width={24} />
                </button>
              </div>
            </div>
          </React.Fragment>
        );
        break;
      default:
        return <></>;
        break;
    }
  };

  return (
    <div className="z-50 md:h-full md:w-full md:bg-[rgba(0,0,0,0.2)]">
      <div className="mx-auto overflow-hidden rounded-[32px] bg-primaryGold sm:w-full md:w-3/4 lg:w-[60vw] 2xl:w-[41.6vw]">
        <div className=" flex w-full justify-center pb-4 pt-8" id="edmlogo">
          <Image src={whitelogo} alt="closed" width={105} height={81} />
        </div>
        <div className="mx-auto w-[99%] bg-secondaryLightGold3 px-14 pb-20 pt-14">
          {/* Store Pickup Order */}
          <p className=" mb-8 text-28 font-semibold leading-8 text-primaryDark md:text-[32px]">
            {translate("EDM.pickupTitle")}
          </p>
          <div className=" mb-4 text-primaryDark [&_span]:text-20 md:[&_span]:text-24">
            <span>{translate("EDM.orderNo")}</span>
            <span className=" font-semibold">{EDMDB.orderNum}</span>
          </div>
          <div className=" mb-10 text-primaryDark [&_span]:text-20 md:[&_span]:text-24">
            <span>{translate("EDM.orderTime")}</span>
            <span className=" font-semibold">{EDMDB.orderTime}</span>
          </div>
          {/* ======================== */}
          {/* dear Guest */}
          <p className=" mb-5 text-28 font-semibold text-primaryDark md:text-[32px]">
            <span>{translate("EDM.dear")}</span>
            <span className="mx-1 md:mx-2">
              {EDMDB.memberName
                ? EDMDB.memberName
                : EDMDB.firstName && EDMDB.lastName
                ? EDMDB.firstName
                : translate("EDM.guest")}
            </span>
            <span>,</span>
          </p>

          {renderContent()}
          <div className="mb-14 w-full rounded-3xl bg-secondaryLightGold260 py-10">
            <p className="mb-1 px-6 text-center text-22 font-medium text-primaryDark md:mb-3 xl:text-[32px]">
              {translate("EDM.showStaff")}
            </p>
            <p className=" mb-3 text-center text-[50px] font-bold text-primaryGold sm:text-[5rem] sm:leading-[108px] md:mb-6 ">
              #{EDMDB.qrCodeNum}
            </p>
            <Image src={QRCode} alt={"QRCode"} className="mx-auto mb-12 h-[45%] w-[45%]" />
            <div className="mx-auto w-[270px]  text-primaryDark md:w-[400px] lg:w-[512px]">
              <div
                className={`mb-9 whitespace-nowrap ${
                  lang === "tc" ? "[&_p]:text-18 md:[&_p]:text-22" : "[&_p]:text-22 md:[&_p]:text-26"
                } relative flex flex-col items-start leading-6 md:flex-row md:items-center`}
              >
                <div className="absolute -left-12 top-1/2 -translate-y-1/2">
                  <Image
                    src={ClockIcon}
                    alt="ClockIcon"
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="aspect-square h-auto w-[36px]"
                  />
                </div>
                <p className="mb-2 md:mb-0">{translate("EDM.pickupTime")}&nbsp;</p>
                <p className=" font-semibold">{EDMDB.pickupTime}</p>
              </div>
              <div
                className={`mb-9 whitespace-nowrap ${
                  lang === "tc" ? "[&_p]:text-18 md:[&_p]:text-22" : "[&_p]:text-22 md:[&_p]:text-26"
                } relative flex flex-col items-start leading-6 md:flex-row md:items-center`}
              >
                <div className="absolute -left-12 top-1/2 -translate-y-1/2">
                  <Image
                    src={LocationIcon}
                    alt="locationIcon"
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="aspect-square h-auto w-[36px]"
                  />
                </div>
                <p className="mb-2 md:mb-0">{translate("EDM.pickup")}&nbsp;</p>
                <p className=" font-semibold">{EDMDB.storeName}</p>
              </div>
              <div
                className={`item-center mb-9 flex justify-center ${
                  lang === "tc" ? "[&_p]:text-16 md:[&_p]:text-20" : "[&_p]:text-18 md:[&_p]:text-22"
                } text-primaryDark [&_p]:leading-6 md:[&_p]:leading-8`}
              >
                <div>
                  <p className="font-semibold ">{translate("EDM.adress")}</p>
                  <p className="mb-6">{EDMDB.storeAddress}</p>
                  <p className="font-semibold ">{translate("EDM.contact")}</p>
                  <p>{EDMDB.contactNum}</p>
                </div>
              </div>
            </div>
            <div className=" mb-8 border-b border-t border-solid border-primaryDark py-4 pl-10 text-h4 font-medium text-primaryDark">
              {translate("EDM.order")}
            </div>
            <div className=" w-full px-10 pb-6 text-28 text-primaryDark">
              {/* soy and wasabi and ginger */}
              <div className="mb-9 flex">
                {EDMDB.soy && (
                  <div className="mr-9 flex items-center">
                    <Image src={TickIcon} alt="TickIcon" width={0} height={0} sizes="100vw" className=" h-3 w-5" />
                    <span className="ml-3 text-xl font-medium text-primaryDark">{translate("EDM.soysauce")}</span>
                  </div>
                )}
                {EDMDB.wasabi && (
                  <div className="mr-9 flex items-center">
                    <Image src={TickIcon} alt="TickIcon" width={0} height={0} sizes="100vw" className=" h-3 w-5" />
                    <span className="ml-3 text-xl font-medium text-primaryDark">{translate("EDM.wasabi")}</span>
                  </div>
                )}
                {EDMDB.ginger && (
                  <div className="mr-9 flex items-center">
                    <Image src={TickIcon} alt="TickIcon" width={0} height={0} sizes="100vw" className=" h-3 w-5" />
                    <span className="ml-3 text-xl font-medium text-primaryDark">{translate("EDM.ginger")}</span>
                  </div>
                )}
              </div>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="w-full text-16 uppercase text-primaryDark/50">
                    <th className="w-[70%] pb-3 text-left font-normal ">{translate("EDM.food")}</th>
                    <th className="w-[15%] pb-3 text-center font-normal">{translate("EDM.quality")}</th>
                    <th className="w-[15%] whitespace-nowrap pb-3 text-end font-normal">{translate("EDM.sub")}</th>
                  </tr>
                </thead>
                <tbody>
                  {EDMDB.orderSummary.map((item, index) => (
                    <tr key={index} className="text-18 text-primaryDark">
                      <td className="pb-6 text-left font-semibold ">{item.title}</td>
                      <td className="pb-6 pl-3 text-center ">{item.amount}</td>
                      <td className={` pb-6 text-end ${lang === "tc" ? "pr-1" : "pr-4"} `}>
                        ${subTotal({ amount: item.amount, price: item.tag.price, discount: item.tag.discount })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="mt-10 table w-full">
                <thead>
                  <tr className="w-full text-16 uppercase text-primaryDark/50">
                    <th className="w-[70%] pb-4 text-left font-normal ">{translate("EDM.addon")}</th>
                    <th className="w-[15%] pb-4 text-center font-normal">{translate("EDM.quality")}</th>
                    <th className="w-[15%] whitespace-nowrap pb-4 text-end font-normal">{translate("EDM.sub")}</th>
                  </tr>
                </thead>
                <tbody>
                  {EDMDB.addOn.map((item, index) => (
                    <tr
                      key={index}
                      className={` ${lang === "tc" ? "[&_td]:text-18" : "[&_td]:text-20"} text-primaryDark`}
                    >
                      <td className="pb-6 text-left font-semibold ">{item.title}</td>
                      <td className="pb-6 pl-3 text-center">{item.amount}</td>
                      <td className={`pb-6 text-end ${lang === "tc" ? "[&_td]:pr-2" : "[&_td]:pr-4"}`}>
                        ${subTotal({ amount: item.amount, price: item.tag.price, discount: item.tag.discount })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mb-[50px] w-full border-t border-solid border-primaryDark px-10 pt-7">
              <li className="mb-4 flex justify-between text-18 text-primaryDark">
                <div>
                  <span>{translate("EDM.subTotal")}</span>
                  <span>9</span>
                  <span>{translate("EDM.subTotalItem")}</span>
                </div>
                <p className={`${lang === "tc" ? "[&_td]:pr-2" : "[&_td]:pr-4"}`}>${totalAmount.toFixed(1)}</p>
              </li>
              {/* here input discount content*/}
              <li className="mb-4 flex justify-between text-18 text-primaryDark">
                <p>{translate("EDM.discount")}</p>
                <p>-${Math.floor(discount).toFixed(1)}</p>
              </li>
              <li className=" flex justify-between font-semibold text-primaryDark [&_p]:text-22 [&_p]:leading-6">
                <p>{translate("EDM.total")}</p>
                <p className={`${lang === "tc" ? "[&_td]:pr-2" : "[&_td]:pr-4"}`}>
                  ${Math.ceil(payableAmount).toFixed(1)}
                </p>
              </li>
            </ul>
            <div className=" mb-8 border-b border-t border-solid border-primaryDark py-4 pl-10 text-h4 font-medium text-primaryDark">
              {translate("EDM.payment")}
            </div>
            <ul className="w-full px-10">
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.paymentAmount")}</p>
                <p>${Math.ceil(payableAmount).toFixed(1)}</p>
              </li>
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.method")}</p>
                <p>{EDMDB.payment}</p>
              </li>
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.CCNum")}</p>
                <p>{EDMDB.CCNum}</p>
              </li>
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.name")}</p>
                <p>{EDMDB.firstName + EDMDB.lastName}</p>
              </li>
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.email")}</p>
                <p>{EDMDB.pickupEmail}</p>
              </li>
              <li className="mb-4 flex justify-between text-xl text-primaryDark">
                <p>{translate("EDM.mobile")}</p>
                <p>{EDMDB.pickupNum}</p>
              </li>
              {/* here for only member when API return srmember detail */}
              {false && (
                <li className="mb-4 flex justify-between text-xl text-primaryDark">
                  <p>{translate("EDM.srmember")}</p>
                  <p>{EDMDB.pickupNum}</p>
                </li>
              )}
              {false && (
                <li className="mb-4 flex justify-between text-xl text-primaryDark">
                  <p>{translate("EDM.memberNo")}</p>
                  <p>{EDMDB.pickupNum}</p>
                </li>
              )}
            </ul>
          </div>
          <div className="text-primaryDark">
            <p className=" mb-6 text-28 font-semibold">{translate("EDM.pickupT&C")}</p>
            <div className="[&_p]:text-18 [&_p]:leading-8">
              <p>{translate("EDM.T&CContent01")}</p>
              <p>{translate("EDM.T&CContent02")}</p>
              <p>{translate("EDM.T&CContent03")}</p>
              <p>{translate("EDM.T&CContent04")}</p>
              <p>{translate("EDM.T&CContent05")}</p>
              <p>{translate("EDM.T&CContent06")}</p>
              <p>{translate("EDM.T&CContent07")}</p>
              <p>{translate("EDM.T&CContent08")}</p>
            </div>
          </div>
        </div>
        <EDMFooter lang={lang} />
      </div>
    </div>
  );
};

export default EDM;
