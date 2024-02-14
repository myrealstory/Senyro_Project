"use client";
import Image from "next/image";
import moment from "moment";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

import Mask from "@/components/Mask";
import clockIcon from "@/images/icons/Icon_clock@3x.png";
import mapIcon from "@/images/icons/Icon_map_pin@3x.png";
import FloatingBox from "@/components/order-complete/FloatingBox";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import CustomButton from "@/components/CustomButton";
import { useGetOrderConfirmInfoQuery } from "@/redux/api/orderCheckoutApi";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { useDispatch } from "react-redux";
import { setTopBarErrorMessage } from "@/redux/slice/generalStateSlice";

export default function OrderComplete({ params }: { params: { lang: LocaleKeysType } }) {
  const lang = params.lang;
  const dispatch = useDispatch();
  const { translate } = useTranslation(lang);
  const [memberPopup, setMemberPopup] = useState(false);
  const { data: orderConfirmInfoResponse } = useGetOrderConfirmInfoQuery();
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const [closeReg, setCloseReg] = useState(false);

  const orderConfirmInfo = orderConfirmInfoResponse?.data;

  const memberPopupHandler = () => {
    setMemberPopup(false);
  };
  const goToReceiptPage = () => {
    window.open(`/online/${isAlreadyLogin ? "member" : "guest"}/${orderConfirmInfo?.embeddedOrderStr}`, "_blank");
  };

  const gotoRegister = () => {
    if (orderConfirmInfoResponse?.data?.registrationUrl) {
      window.location.href = orderConfirmInfoResponse?.data?.registrationUrl;
    }
  };

  useEffect(() => {
    dispatch(setTopBarErrorMessage([]));
  }, []);

  useEffect(() => {
    if (!isAlreadyLogin && orderConfirmInfoResponse?.data?.registrationUrl) {
      setMemberPopup(true);
    }
  }, [orderConfirmInfoResponse, isAlreadyLogin]);

  const askRegister = () => {
    if (
      isAlreadyLogin ||
      closeReg ||
      !orderConfirmInfoResponse?.data?.registrationUrl ||
      !orderConfirmInfoResponse?.data?.registrationUrl?.length
    ) {
      return <></>;
    }
    return (
      <>
        <div className="absolute left-0 top-0 flex h-full max-h-[56px] w-full items-center justify-center bg-secondaryLightSand md:hidden ">
          <span className="mr-4 text-14 font-medium leading-[22px] text-primaryDark">
            {translate("cart.joinSenyro")}
          </span>
          <CustomButton
            containerClass="max-w-[126px] max-h-[36px] w-full h-full rounded-2 bg-primaryGold "
            textClass="text-white leading-[15px] font-medium text-12"
            title={translate("orderComplete.promoButton") as string}
            onClick={() => gotoRegister()}
          />
          <button
            className="absolute right-5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white"
            onClick={() => setCloseReg(true)}
          >
            <span className="absolute left-1/2 top-1/2 h-[1px] w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primaryDark" />
            <span className="absolute left-1/2 top-1/2 h-[1px] w-3 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-primaryDark" />
          </button>
        </div>
        <div className="h-[56px]" />
      </>
    );
  };

  return (
    <div
      className={
        " wrapper relative mx-auto flex flex-col items-center  justify-center pb-20  pt-12 leading-none text-primaryDark md:max-w-[900px] md:flex-row  md:pb-[120px] md:pt-[110px] xl:max-w-[1104px]"
      }
    >
      {askRegister()}
      <div className="mb-20 w-[90%] md:mb-0 md:w-7/12 md:pr-[10%]">
        <h2 className="mb-[15px] text-28 font-normal md:text-[40px] md:leading-[45px] xl:text-[52px] xl:leading-[62px]">
          {translate("orderComplete.title")}
          {orderConfirmInfo?.firstName} {orderConfirmInfo?.lastName}!
        </h2>
        <p className="mb-[34px] text-16 leading-[22px] md:text-18 md:leading-6">{translate("orderComplete.content")}</p>
        <div className="mx-auto mb-[48px] block w-[288px] items-center rounded-[12px] bg-secondaryLightSand px-[14px] pb-[22px] pt-[17px] md:hidden">
          <div className="mb-[17px] rounded-[10px] bg-white md:mb-[25px]">
            {/* <Image src={qrCode} alt={""} width={0} height={0} sizes="100vw" className="mb-auto h-full w-full " /> */}
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={orderConfirmInfo?.pickupQrCodeUrl || ""}
              viewBox={"0 0 256 256"}
              className="mb-auto"
            />
          </div>
          <p className="mx-auto text-center text-[24px] leading-[28px]">
            {translate("orderComplete.pickupNo")} <span className="font-bold">#{orderConfirmInfo?.pickupNo}</span>
          </p>
        </div>
        <div>
          <div className="mb-[20px] flex space-x-3 text-[26px] md:mb-[36px] md:text-h3 xl:text-[36px]">
            <h3>{translate("orderComplete.orderNumber")}</h3>
            <p className="font-semibold">#{orderConfirmInfo?.orderNumber}</p>
          </div>
          <div className="mb-4 flex items-center space-x-3 text-[16px] md:mb-[34px] md:text-h4">
            <Image src={clockIcon} alt={"clockIcon"} className=" h-[18px] w-[18px] md:h-8 md:w-8" />
            <h4>{translate("orderComplete.approx")}</h4>
            <p className="font-semibold">
              {moment(orderConfirmInfo?.pickupDateTime).format("YYYY/MM/DD (ddd) hh:mm").toUpperCase()}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[16px] md:mb-[51px] md:text-h4">
            <Image src={mapIcon} alt={"mapIcon"} className=" h-5 w-5 md:h-8 md:w-8" />
            <h4>{translate("orderComplete.pickUpStore")}</h4>
            <p className="font-semibold">{orderConfirmInfo?.pickupStoreName}</p>
          </div>
        </div>
        {/* <button className="btn-dark mb-[51px] hidden w-full px-[38px] py-[18px] md:block" onClick={goToReceiptPage}>
          <p className="text-[28px] font-semibold">Receipt</p>
        </button> */}
        <CustomButton
          containerClass="mb-[51px] hidden w-full px-[38px] py-[18px] md:block"
          onClick={goToReceiptPage}
          textClass="text-16 md:text-19 xl:text-24 font-medium"
          title={translate("orderComplete.button") as string}
        />
      </div>
      <div className="hidden w-full flex-col items-center rounded-[12px] bg-secondaryLightSand px-4 pb-[22px] pt-[17px] md:flex md:w-auto md:rounded-[20px] md:px-[19px] md:pb-7 md:pt-[23px]">
        <div className="mb-[17px] rounded-[10px] bg-white p-4 md:mb-[25px]">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={orderConfirmInfo?.pickupQrCodeUrl || ""}
            viewBox={"0 0 256 256"}
            className="mb-auto"
          />
        </div>
        <p className="text-16 leading-[28px] md:text-24 md:leading-[36px] xl:text-26">
          {translate("orderComplete.pickupNo")} <span className="font-bold">{orderConfirmInfo?.pickupNo}</span>
        </p>
      </div>
      {memberPopup && orderConfirmInfo?.registrationUrl && (
        <>
          <FloatingBox memberPopupHandler={memberPopupHandler} registrationUrl={orderConfirmInfo?.registrationUrl} />
          <div className="md:hidden">
            <Mask>
              <FloatingBox
                memberPopupHandler={memberPopupHandler}
                registrationUrl={orderConfirmInfo?.registrationUrl}
              />
            </Mask>
          </div>
        </>
      )}
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-3xl bg-white p-4 md:hidden">
        {/* <button
          className="btn-dark mb-[51px] flex h-[56px] w-[343px] items-center justify-center"
          onClick={goToReceiptPage}
        >
          <p className="text-[16px] font-semibold leading-[20px]">Receipt</p>
        </button> */}
        <CustomButton
          containerClass="mb-[51px] flex h-[56px] w-[343px] items-center justify-center"
          textClass="text-[16px] font-semibold leading-[20px]"
          onClick={goToReceiptPage}
          title={translate("cart.receipt") as string}
        />
      </div>
    </div>
  );
}
