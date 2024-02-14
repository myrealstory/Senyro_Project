import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import VisaLogo from "@/images/icons/Icon_Visa-yellow@3x.png";
import alertIcon from "@/images/icons/Icon_tooltip.png";
import ErrorLogo from "@/images/icons/Icon_warning@3x.png";
import MasterLogo from "@/images/icons/Icon_Master@3x.png";
import AELogo from "@/images/icons/Icon_AE.png";
import { useTranslation } from "@/app/i18n/client";
import { OriginApiResponseType } from "@/types/commonTyps";
import { getCreditCardType, getLangFromString, getRouteNameFromPathname } from "@/utils/commonUtils";
import {
  useGetApplepayMerchantDetailMutation,
  useGetGooglepayMerchantDetailMutation,
} from "@/redux/api/orderCheckoutApi";
import { GetApplepayMerchantInfoResponse, GetGooglepayMerchantInfoResponse } from "@/types/api/apiTypes";
import {
  ApplepayPaymentMethodIds,
  CreditCardPaymentMethodIds,
  GooglepayPaymentMethodIds,
  useOrderCheckoutSlice,
} from "@/redux/slice/orderCheckoutSlice";
import { PaymentMethodProps } from "@/types/componentTypes";
import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { Checkbox } from "../forms/Checkbox";
import { useWindowSize } from "@/hook/useWindowSize";
import { CustomInput } from "./CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { OrderCheckoutType } from "@/types/checkout/checkoutTypes";

export const PaymentMethod = ({
  checked,
  onChange,
  onCreditCardInput,
  disabled,
  extra,
  onMobilePaymentSelected,
  onTooltipClick,
  onCreditCardInputDone,
  containerClasses,
}: PaymentMethodProps) => {
  const creditCardData = extra?.creditCardData;
  const paymentConfig = extra?.paymentConfig;
  const paymendMethodId = paymentConfig?.paymentMethodId;
  const isCreditCardPayment = paymendMethodId ? CreditCardPaymentMethodIds.includes(paymendMethodId) : false;
  const isAE = isCreditCardPayment && paymendMethodId === PAYMENT_METHOD.AMEX;
  const isApplepay = paymendMethodId ? ApplepayPaymentMethodIds.includes(paymendMethodId) : false;
  const isGooglepay = paymendMethodId ? GooglepayPaymentMethodIds.includes(paymendMethodId) : false;
  const { setCheckoutFormData } = useOrderCheckoutSlice();

  const [getGooglepayMerchantDetail] = useGetGooglepayMerchantDetailMutation();
  const [getApplepayMerchantDetail] = useGetApplepayMerchantDetailMutation();

  const formData = useSelector((state: RootState) => state.orderCheckout);
  const path = usePathname();
  const dispatch = useDispatch();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const { secondSlug } = getRouteNameFromPathname(path);
  const { width } = useWindowSize();
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const [creditCardSave, setCreditCardSave] = React.useState(false);
  const [identifyCard, setIdentifyCard] = React.useState<"visa" | "master" | "ae" | "error" | "">("");

  const onPaymethodSelected = () => {
    if (paymendMethodId) {
      let promise: Promise<
        OriginApiResponseType<GetApplepayMerchantInfoResponse | GetGooglepayMerchantInfoResponse> | undefined
      > = Promise.resolve(undefined);

      if (isApplepay) {
        promise = getApplepayMerchantDetail({ paymentMethodId: paymendMethodId }).unwrap();
      }
      if (isGooglepay) {
        promise = getGooglepayMerchantDetail({ paymentMethodId: paymendMethodId }).unwrap();
      }

      promise.then(res => {
        if (res?.statusCode === 200) {
          onMobilePaymentSelected && onMobilePaymentSelected(res.data);
        }
      });
    }
  };

  const toogleCreditCardSave = () => {
    dispatch(
      setCheckoutFormData({
        saveCardEnabled: !creditCardSave,
      })
    );
    setCreditCardSave(!creditCardSave);
  };

  const renderCreditCardNumber = () => {
    if (!creditCardData?.cardNumber?.length) {
      return creditCardData?.cardNumber;
    }

    // Remove any existing spaces from the string
    let newNumber = creditCardData?.cardNumber?.replace(/\s/g, "");

    // Insert a space after every 4 digits using regex
    newNumber = newNumber?.replace(/(\d{4})/g, "$1 ");

    // Trim any leading or trailing spaces
    newNumber = newNumber?.trim();

    return newNumber;
  };

  const displayError = (key: keyof OrderCheckoutType) => {
    return (
      <div className=" absolute -bottom-7 left-0 flex items-center pl-5 md:pl-8">
        <p className={"mt-2 text-14 font-semibold text-primaryPurple md:text-16"}>{formData?.error?.[key]?.message}</p>
      </div>
    );
  };

  return (
    <div
      className={`mb-[10px] flex h-full w-full  flex-col justify-start rounded-2xl border-[0.5px] border-solid  py-3 md:mb-5 md:py-4 
        ${disabled ? "opacity-40" : ""} 
        ${checked ? "cursor-default border-primaryDark bg-white md:pb-4" : " cursor-pointer border-primaryGold3"}
        ${containerClasses}
      `}
      onClick={() => {
        onPaymethodSelected();
        onChange();
      }}
    >
      <div className="flex w-full gap-3 md:w-auto  md:gap-5">
        <label className="goldenCircle ">
          <input
            type="radio"
            name="selectedPaymentMethod"
            checked={checked}
            onChange={() => {
              onPaymethodSelected();
              onChange();
            }}
            disabled={disabled}
          />
          <span className={"checkMarked"} />
        </label>
        {paymentConfig?.iconImage && (
          <Image
            src={process.env.NEXT_PUBLIC_IMAGE_URL + "/" + paymentConfig?.iconImage}
            alt=""
            width={80}
            height={80}
            sizes="100vw"
            className={`h-[32px] object-contain ${checked ? "md:pr-2" : ""}  w-auto object-left md:h-[36px]`}
          />
        )}
      </div>

      {checked && isCreditCardPayment && onCreditCardInput && (
        <div className="mx-4 mt-[18px] flex flex-col md:mx-0 md:ml-[16px] md:mr-10 lg:ml-[55px] lg:mt-10">
          <div
            className={`relative ${
              formData.error.cardHolder.hasError && formData.error.cardHolder.isEditing
                ? "mb-10 md:mb-14"
                : "mb-4 md:mb-7"
            }`}
          >
            <label className="mb-3 block text-14 font-semibold md:text-md">{translate("checkout.cardholder")}</label>
            <CustomInput
              name="cardHolder"
              label={""}
              type={"TEXT"}
              placeholder={translate("checkout.cardholder")}
              value={creditCardData?.cardHolder}
              handleChange={onCreditCardInput}
              hasError={formData.error.cardHolder.hasError && formData.error.cardHolder.isEditing}
              onBlur={onCreditCardInput}
            />
            {displayError("cardHolder")}
          </div>
          <div className={` ${identifyCard === "error" ? "mb-10 md:mb-14" : "mb-4 md:mb-7"} `}>
            <label className="mb-3 block text-14 font-semibold md:text-md">{translate("checkout.cardnumber")}</label>
            <div className="relative w-full ">
              <CustomInput
                name="cardNumber"
                label={""}
                type={"TEL"}
                pattern="\d*"
                maxLength={16 + 3}
                placeholder={translate("checkout.cardnumber")}
                value={renderCreditCardNumber()}
                handleChange={e => {
                  onCreditCardInput(e);
                  setIdentifyCard(getCreditCardType(e.target.value?.replace(/\s/g, ""), isAE));

                  if (
                    creditCardData?.cardNumber &&
                    onCreditCardInputDone &&
                    creditCardData?.cardNumber?.length >= 6 &&
                    creditCardData?.cardNumber?.length <= 9
                  ) {
                    onCreditCardInputDone({ cardNumber: creditCardData?.cardNumber, savedCardId: "" });
                  }
                }}
                hasError={formData.error.cardNumber.hasError && formData.error.cardNumber.isEditing}
                onBlur={e => {
                  onCreditCardInput(e);
                  setIdentifyCard(getCreditCardType(e.target.value?.replace(/\s/g, ""), isAE));

                  if (
                    creditCardData?.cardNumber &&
                    onCreditCardInputDone &&
                    creditCardData?.cardNumber?.length >= 6 &&
                    creditCardData?.cardNumber?.length <= 9
                  ) {
                    onCreditCardInputDone({ cardNumber: creditCardData?.cardNumber, savedCardId: ""  });
                  }
                }}
                rightComponent={() => {
                  if (formData.error.cardNumber.hasError && formData.error.cardNumber.isEditing) {
                    return (
                      <Image
                        src={ErrorLogo}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={
                          "absolute right-5 top-1/2 block h-auto w-[20px] -translate-y-1/2 cursor-default md:w-[23px]"
                        }
                      />
                    );
                  }
                  if (identifyCard !== "") {
                    return (
                      <Image
                        src={
                          identifyCard === "visa"
                            ? VisaLogo
                            : identifyCard === "master"
                            ? MasterLogo
                            : identifyCard === "ae" && isAE
                            ? AELogo
                            : identifyCard === "error"
                            ? ErrorLogo
                            : ""
                        }
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={
                          "absolute right-5 top-1/2 block h-[31px] w-auto -translate-y-1/2 cursor-default md:h-[26px] "
                        }
                      />
                    );
                  }
                  return null;
                }}
              />
              {displayError("cardNumber")}
            </div>
          </div>
          <div
            className={`w-full ${
              formData.error.expiryMonth.hasError || formData.error.expiryYear.hasError
                ? "mb-10 md:mb-14"
                : "mb-4 md:mb-7"
            }`}
          >
            <label className="mb-3 block text-14 font-semibold md:text-md">{translate("checkout.expire")}</label>
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className={"relative"}>
                <CustomInput
                  name="expiryMonth"
                  label={""}
                  type={"TEL"}
                  pattern="\d*"
                  maxLength={2}
                  placeholder={translate("checkout.expiryMonth")}
                  value={creditCardData?.expiryMonth}
                  handleChange={e => {
                    const value = e?.target?.value;
                    if (value && Number(value).toString() !== "NaN") {
                      onCreditCardInput(e);
                    }
                  }}
                  hasError={formData.error.expiryMonth.hasError && formData.error.expiryMonth.isEditing}
                  onBlur={e => {
                    const value = e?.target?.value;
                    if (value && Number(value).toString() !== "NaN") {
                      onCreditCardInput(e);
                    }
                  }}
                />
                {displayError("expiryMonth")}
              </div>
              <div className={"relative"}>
                <CustomInput
                  name="expiryYear"
                  label={""}
                  type={"TEL"}
                  pattern="\d*"
                  maxLength={2}
                  placeholder={translate("checkout.expiryYear")}
                  value={creditCardData?.expiryYear}
                  handleChange={e => {
                    const value = e?.target?.value;
                    if (value && Number(value).toString() !== "NaN") {
                      onCreditCardInput(e);
                    }
                  }}
                  hasError={formData.error.expiryYear.hasError && formData.error.expiryYear.isEditing}
                  onBlur={e => {
                    const value = e?.target?.value;
                    if (value && Number(value).toString() !== "NaN") {
                      onCreditCardInput(e);
                    }
                  }}
                />
                {displayError("expiryYear")}
              </div>
            </div>
          </div>
          <div
            className={`w-full ${
              formData.error.cvv.hasError && formData.error.cvv.isEditing ? "mb-10 md:mb-14" : "mb-4 md:mb-7"
            } `}
          >
            <label className="mb-3 block text-14 font-semibold uppercase md:text-md">{translate("checkout.cvv")}</label>
            <div className={"relative w-full"}>
              <CustomInput
                name="cvv"
                label={""}
                type={"TEL"}
                pattern="\d*"
                maxLength={4}
                placeholder={translate("checkout.cvv")}
                value={creditCardData?.cvv}
                handleChange={e => {
                  const value = e?.target?.value;
                  if (value && Number(value).toString() !== "NaN") {
                    onCreditCardInput(e);
                  }
                }}
                hasError={formData.error.cvv.hasError && formData.error.cvv.isEditing}
                onBlur={e => {
                  const value = e?.target?.value;
                  if (value && Number(value).toString() !== "NaN") {
                    onCreditCardInput(e);
                  }
                }}
                rightComponent={() => {
                  if (formData.error.cvv.hasError && formData.error.cvv.isEditing) {
                    return (
                      <Image
                        src={ErrorLogo}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className={
                          "absolute right-5 top-1/2 block h-auto w-[20px] -translate-y-1/2 cursor-default md:w-[23px]"
                        }
                      />
                    );
                  }
                  return (
                    <div className="absolute right-5 top-0 z-99 flex h-full w-7 cursor-pointer items-center">
                      <button
                        className="h-7 object-cover"
                        onMouseEnter={() => {
                          if (width > 500) {
                            onTooltipClick && onTooltipClick(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (width > 500) {
                            onTooltipClick && onTooltipClick(false);
                          }
                        }}
                        onClick={() => {
                          if (width < 500) {
                            onTooltipClick && onTooltipClick(true);
                          }
                        }}
                      >
                        <Image
                          src={alertIcon}
                          alt=""
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </div>
                  );
                }}
              />
              {displayError("cvv")}
            </div>
          </div>
          {isAlreadyLogin && (
            <Checkbox
              labelFor={"creditCardsave"}
              labelText={
                <p className="w-fit break-words text-12 font-medium text-primaryGold md:text-md">
                  {translate("checkout.saveCard")}
                </p>
              }
              type={"checkbox"}
              name={"creditCardsave"}
              id={"creditCardsave"}
              checked={creditCardSave}
              onChange={toogleCreditCardSave}
              path={secondSlug}
            />
          )}
        </div>
      )}
    </div>
  );
};
