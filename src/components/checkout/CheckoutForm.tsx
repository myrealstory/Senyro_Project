"use client";
import React, { useCallback, useEffect, useMemo, useState, MouseEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import "@/style/customDatePicker.css";
import alertTriangleIcon from "@/images/icons/Icon_alert-triangle.png";
import { mockPolicies, mockTerms } from "@/app/mock/mockTerms";
import warningIcon from "@/images/icons/Icon_warning@3x.png";
import { RootState } from "@/redux/store";
import { useTranslation } from "@/app/i18n/client";
import { setIsApplyingDiscount, setIsCVVPopup } from "@/redux/slice/generalStateSlice";
import { CheckoutFormType } from "@/types/componentTypes";
import {
  ApplepayPaymentMethodIds,
  GooglepayPaymentMethodIds,
  useOrderCheckoutSlice,
} from "@/redux/slice/orderCheckoutSlice";
import {
  generateCheckoutRequestPayload,
  getCreditCardType,
  isNameValid,
  isCardHolderValid,
  isEmailValid,
} from "@/utils/commonUtils";
import { GetGooglepayMerchantInfoResponse } from "@/types/api/apiTypes";
import { FormSubtitleType, OrderCheckoutType } from "@/types/checkout/checkoutTypes";
import { useDeleteSavedCardMutation } from "@/redux/api/memberApi";
import {
  useApplyDiscountMutation,
  useCheckGuestEmailOptinStatusMutation,
  useGetAvailableMemberCouponsQuery,
  useGetPaymentMethodQuery,
  useLazyGetPaymentMethodQuery,
} from "@/redux/api/orderCheckoutApi";

import { MemberPoints } from "./MemberPoints";
import CustomSelect from "../CustomSelect";
import { Checkbox, PrivacyPolicyPopup } from "../forms";
import { LabelText } from "../LabelText";
import { CustomInput } from "./CustomInput";
import { PaymentMethod } from "./PaymentMethod";
import { CreditCardInput } from "./CreditCardInput";
import debounce from "lodash.debounce";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { useWindowSize } from "@/hook/useWindowSize";
import { createPortal } from "react-dom";
import Image from "next/image";
import IconSuccess from "@/images/icons/Icon_submitted.png";
import IconWarning from "@/images/icons/Icon_warning@3x.png";
import { mpgsErrorMapper, promotionOrCouponErrorMapper } from "@/utils/clientUtils";
import { useGetPromotinoalMsgCardPromotionQuery } from "@/redux/api/generalApi";
import { deleteCookie, getCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { CartApiAlertListType } from "@/types/cartTypes";

const FormSubtitle = ({ text, containerClasses }: FormSubtitleType) => {
  return <h2 className={`mb-2 text-h4 font-semibold leading-none ${containerClasses}`}>{text}</h2>;
};

export const CheckoutForm = ({ lang, isCheckoutTimeout }: CheckoutFormType) => {
  const isPageReady = useRef(false);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const dispatch = useDispatch();
  const { translate } = useTranslation(lang);
  const [deleteSavedCardRequest] = useDeleteSavedCardMutation();
  const formData = useSelector((state: RootState) => state.orderCheckout);
  const profile = useSelector((state: RootState) => state.profile);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const { resetMemberPoint, MPGSError } = useSelector((state: RootState) => state.generalState);

  const [isPaymentMethodAutoSelected, setIsPaymentMethodAutoSelected] = useState(false);
  const [promoCode, setPromoCode] = useState<string | undefined>();
  const [isApplyCouponSuccess, setIsApplyCouponSuccess] = useState(false);
  const [isApplingPromoCode, setIsApplyingPromoCode] = useState(false);
  const { width } = useWindowSize();
  // check support apple pay and google pay by native checking
  const supportApplePay = !!window.ApplePaySession;
  const supportGooglePay = !!window.PaymentRequest;

  const { data: couponListResponse } = useGetAvailableMemberCouponsQuery();
  const { data: getPaymentMethodRequestResponse } = useGetPaymentMethodQuery();
  const [getPaymentMethod] = useLazyGetPaymentMethodQuery();
  const [applyDiscountRequest, { isLoading: applyingDiscount, data: applyDiscountResponse }] =
    useApplyDiscountMutation();
  const [checkGuestEmailOptinStatusRequest, { data: checkGuestEmailOptinStatusResponse }] =
    useCheckGuestEmailOptinStatusMutation();

  const { setCheckoutFormData, setCheckoutFormErrorData, setSavedCardFormData } = useOrderCheckoutSlice();

  const isAE = formData.selectedPaymentMethodId === PAYMENT_METHOD.AMEX;

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const maxMemberPointRedeem = useMemo(() => {
    return apiData?.cart?.summary?.maxMemberPointRedeem ?? 0;
  }, [apiData]);

  const paymentMethods = useMemo(() => {
    return getPaymentMethodRequestResponse?.data.newPaymentMethods
      .filter(paymentMethod => {
        // remove apple pay related payment method if not support
        return supportApplePay || !ApplepayPaymentMethodIds.includes(paymentMethod.paymentMethodId);
      })
      .filter(paymentMethod => {
        // remove apple pay related payment method if not support
        return supportGooglePay || !GooglepayPaymentMethodIds.includes(paymentMethod.paymentMethodId);
      });
  }, [getPaymentMethodRequestResponse]);

  const savedCardPaymentMethods = useMemo(() => {
    return getPaymentMethodRequestResponse?.data.savedCard;
  }, [getPaymentMethodRequestResponse]);

  const couponList = useMemo(() => {
    return couponListResponse?.data ?? [];
  }, [couponListResponse]);

  const handleDeleteCard = async (cardId: string) => {
    if (savedCardPaymentMethods) {
      await deleteSavedCardRequest({ id: cardId })
        .unwrap()
        .then((res:any) => {
          if (res.statusCode === 200) {
            getPaymentMethod();
            dispatch(
              setCheckoutFormData({
                savedCardId: undefined,
                savedCardCVV: undefined,
              })
            );
          }
        });
    }
  };

  useEffect(() => {
    const int = setInterval(() => {
      const MPGSError = getCookie(CookiesKey.MPGSError) as string;
      if (MPGSError?.length) {
        const alertList: any = JSON.parse(MPGSError);
        if (Array.isArray(alertList) && alertList?.length) {
          alertList.forEach((alert: CartApiAlertListType) => {
            mpgsErrorMapper(
              alert,
              dispatch,
              translate,
              lang,
            )
          })
        }
        deleteCookie(CookiesKey.MPGSError);
        clearInterval(int);
      }

      setTimeout(() => {
        isPageReady.current = true;
      }, 1000)
    }, 500)
    
    return () => {
      int && clearInterval(int);
    }
  }, [])

  useEffect(() => {
    dispatch(setIsApplyingDiscount(applyingDiscount));
  }, [applyingDiscount]);

  useEffect(() => {
    if (!formData.mobileNumber?.length && profile.countryCode === "852" && profile.mobile) {
      onValueInput("mobileNumber", profile.mobile);
    }
    if (!formData.lastName?.length && profile.lastName?.length) {
      onValueInput("lastName", profile.lastName);
    }
    if (!formData.firstName?.length && profile.firstName?.length) {
      onValueInput("firstName", profile.firstName);
    }
    if (!formData.email?.length && profile.email?.length) {
      onValueInput("email", profile.email);
    }
  }, [profile]);

  useEffect(() => {
    const info = getCookie(CookiesKey.checkoutFormInfo) as string;
    if (window && info) {
      const checkoutFormInfo = JSON.parse(window.atob(info));
      const discount = {
        memberCouponId: checkoutFormInfo?.memberCouponId?.length ? checkoutFormInfo?.memberCouponId : undefined,
        promoCode: checkoutFormInfo?.promoCode?.length ? checkoutFormInfo?.promoCode : undefined,
        selectedPaymentMethodId: checkoutFormInfo?.selectedPaymentMethodId?.length ? checkoutFormInfo?.selectedPaymentMethodId : undefined,
        memberPointRedeem: checkoutFormInfo?.memberPointRedeem > 0  ? checkoutFormInfo?.memberPointRedeem : undefined,
        savedCardId: checkoutFormInfo?.savedCardId?.length ? checkoutFormInfo?.savedCardId : undefined,
      }
      
      setTimeout(() => {
        dispatch(setCheckoutFormData({
          ...formData,
          ...checkoutFormInfo,
        }))
  
        if (checkoutFormInfo?.savedCardId) {
          dispatch(setSavedCardFormData({
            savedCardId: checkoutFormInfo?.savedCardId,
          }))
        }
  
        if (checkoutFormInfo?.selectedPaymentMethodId) {
          dispatch(
            setCheckoutFormErrorData({
              key: "selectedPaymentMethodId",
              hasError: false,
            })
          );
        }
  
        if (checkoutFormInfo?.agree !== undefined) {
          onValueInput("agree", checkoutFormInfo.agree);
        }
    
        if (JSON.stringify(discount) !== "{}") {
          applyDiscount(discount);
        }
      }, 500)
    }
    
    
  }, [getPaymentMethodRequestResponse])

  useEffect(() => {
    onValueInput("memberPointRedeem", Number(0));
    applyDiscountDebounce({
      memberPointRedeem: Number(0),
    });
  }, [resetMemberPoint]);

  useEffect(() => {
    if (formData.error?.memberCouponId?.hasError && formData.error?.memberCouponId?.isEditing) {
      setIsApplyCouponSuccess(false);
    }
  }, [formData]);

  const fixedAmount = useMemo(() => apiData?.cart?.summary?.totalAmount, []);

  const maxAvailablePoints = useMemo(() => {
    let availablePoints = 0;
    const maxMemberPointRedeem =
      (applyDiscountResponse?.data?.cart?.summary?.maxMemberPointRedeem || Number(fixedAmount)) ?? 0;
    if (maxMemberPointRedeem > profile?.pointBalance) {
      availablePoints = profile?.pointBalance;
    } else {
      availablePoints = maxMemberPointRedeem;
    }
    return availablePoints;
  }, [profile, applyDiscountResponse]);

  useEffect(() => {
    if (formData.memberPointRedeem && (maxAvailablePoints < formData.memberPointRedeem)) {
      onValueInput("memberPointRedeem", maxAvailablePoints);
    }
  }, [maxAvailablePoints])

  const checkGuestEmailOptinStatusDebounce = useCallback(
    debounce((email: string) => {
      checkGuestEmailOptinStatusRequest({ email });
    }, 500),
    [formData]
  );

  const applyDiscountDebounce = useCallback(
    debounce((info: { cardNumber?: string; memberPointRedeem?: number; savedCardId?: string }) => {
      if (isPageReady.current) {
        applyDiscount({
          cardNumber: info?.cardNumber,
          memberPointRedeem: info?.memberPointRedeem,
          savedCardId: info?.savedCardId,
        });
      }
    }, 800),
    [formData]
  );

  const applyDiscount = (form?: {
    memberCouponId?: OrderCheckoutType["memberCouponId"];
    promoCode?: OrderCheckoutType["promoCode"];
    selectedPaymentMethodId?: OrderCheckoutType["selectedPaymentMethodId"];
    cardNumber?: OrderCheckoutType["cardNumber"];
    savedCardId?: OrderCheckoutType["savedCardId"];
    memberPointRedeem?: number;
  }) => {
    if (form?.memberCouponId !== undefined) {
      setIsApplyCouponSuccess(false);
    }

    const getCorrectValue = (field: keyof typeof formData, form: any) => {
      if (form?.[field] && form?.[field]?.length > 0) {
        return form?.[field];
      } else if (form?.[field] !== undefined && form?.[field]?.length === 0) {
        return undefined;
      } else if (!form?.[field] && formData?.[field]) {
        return formData?.[field];
      }

      return undefined;
    };
    const selectedPaymentMethodId = form?.selectedPaymentMethodId ?? formData?.selectedPaymentMethodId;
    const requestBody = generateCheckoutRequestPayload({
      ...formData,
      memberCouponId: form?.memberCouponId ?? formData?.memberCouponId,
      promoCode: form?.promoCode ?? formData?.promoCode,
      selectedPaymentMethodId,
      cardNumber: form?.cardNumber ?? formData?.cardNumber,
      savedCardId: getCorrectValue("savedCardId", form),
      memberPointRedeem: form?.memberPointRedeem ?? formData?.memberPointRedeem,
    });
    applyDiscountRequest(requestBody)
      .unwrap()
      .then(cartData => {
        dispatch(setCartApiData(cartData.data));
        dispatch(setCartLocalDataFromApiData({ ...cartData.data, isCartPage: false }));

        if (cartData.data?.cart?.promotion && String(cartData.data?.cart?.promotion?.autoSelectPaymentMethodId) && 
          String(cartData.data?.cart?.promotion?.autoSelectPaymentMethodId) !== selectedPaymentMethodId
          ) {
          onValueInput("selectedPaymentMethodId", String(cartData.data?.cart?.promotion?.autoSelectPaymentMethodId));
          setIsPaymentMethodAutoSelected(true);
        }

        if (form?.selectedPaymentMethodId && form?.selectedPaymentMethodId !== formData?.selectedPaymentMethodId) {
          setIsPaymentMethodAutoSelected(false);
        }

        const haveError = promotionOrCouponErrorMapper(cartData.data, dispatch, translate, lang);
        if (!haveError.memberCouponId && form?.memberCouponId !== undefined) {
          setIsApplyCouponSuccess(true);
        } else if (haveError.memberCouponId) {
          setIsApplyCouponSuccess(false);
        }

        if (haveError.promoCode) {
          if (isPaymentMethodAutoSelected) {
            setPromoCode("");
            setIsPaymentMethodAutoSelected(false);
            dispatch(
              setCheckoutFormData({
                promoCode: "",
              })
            );
          }
        }

        if (form?.promoCode !== undefined) {
          if (!cartData?.data?.alertList?.length) {
            dispatch(
              setCheckoutFormErrorData({
                key: "promoCode",
                hasError: false,
                message: "",
              })
            );
          }
          setPromoCode(form?.promoCode);
          dispatch(
            setCheckoutFormData({
              promoCode: form?.promoCode,
            })
          );

          if (form?.promoCode === "") {
            setIsPaymentMethodAutoSelected(false);
          }
        }

        if (form?.memberCouponId === "") {
          setIsApplyCouponSuccess(false);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsApplyingPromoCode(false);
      });
  };

  const onValueInput = (inputId: keyof OrderCheckoutType, value: string | number | boolean) => {
    dispatch(
      setCheckoutFormData({
        [inputId]: value,
      })
    );
    validateInputValue(inputId, value);
  };

  const validateInputValue = (inputId: keyof OrderCheckoutType, value: number | string | boolean | undefined) => {
    let hasError = false;
    let message = "";

    switch (true) {
      case inputId === "firstName" && String(value)?.length === 0:
      case inputId === "lastName" && String(value)?.length === 0:
      case inputId === "mobileNumber" && String(value)?.length === 0:
      case inputId === "email" && String(value)?.length === 0:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "mobileNumber" && formData.countryCode === "852":
        hasError = Number.isNaN(value) || String(value)[0] === "0" || String(value)?.length !== 8;
        message = translate("checkout.error.hkMobileNumber");
        break;
      case inputId === "mobileNumber" && formData.countryCode === "853":
        hasError = Number.isNaN(value) || String(value)[0] === "0" || String(value)?.length !== 8;
        break;
      case inputId === "mobileNumber" && formData.countryCode === "86":
        hasError = Number.isNaN(value) || String(value)[0] === "0" || String(value)?.length !== 11;
        break;
      case inputId === "firstName" && String(value)?.length !== 0 && !isNameValid(String(value)):
      case inputId === "lastName" && String(value)?.length !== 0 && !isNameValid(String(value)):
        hasError = true;
        message = translate(`checkout.error.${inputId}`);
        break;
      case inputId === "cardHolder" && !String(value)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "cardHolder" && String(value)?.length && !isCardHolderValid(String(value)):
        hasError = true;
        message = translate("checkout.error.cardHolder");
        break;
      case inputId === "email":
        hasError = !isEmailValid(String(value));
        if (!hasError) {
          applyDiscountDebounce();
          if (!isAlreadyLogin) {
            checkGuestEmailOptinStatusDebounce(String(value));
          }
        }
        message = translate(`checkout.error.${inputId}`);
        break;
      case inputId === "cardNumber" && !String(value)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "cardNumber" && String(value)?.length && getCreditCardType(String(value), isAE) === "error":
        hasError = true;
        message = translate("checkout.invalidNumber");
        break;
      case inputId === "expiryYear" && !String(value)?.length:
      case inputId === "expiryMonth" && !String(value)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "expiryYear" &&
        String(value)?.length &&
        (Number.isNaN(value) || String(value)?.length !== 2 || Number(value) < new Date().getFullYear() % 1000):
        hasError = true;
        message = translate("checkout.error.expiryYear");
        break;
      case inputId === "expiryMonth" &&
        String(value)?.length &&
        (Number.isNaN(value) || String(value)?.length !== 2 || Number(value) < 0 || Number(value) > 12 || value === "00"):
        hasError = true;
        message = translate("checkout.error.expiryMonth");
        break;
      case inputId === "cvv" && isAE && !String(value)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "cvv" && isAE && String(value)?.length && (Number.isNaN(value) || String(value)?.length !== 4):
        hasError = true;
        message = translate("checkout.error.cvv");
        break;
      case inputId === "cvv" && !isAE && !String(value)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case inputId === "cvv" && !isAE && String(value)?.length && (Number.isNaN(value) || String(value)?.length !== 3):
        hasError = true;
        message = translate("checkout.error.cvv");
        break;
      case inputId === "agree":
        hasError = !value;
        break;
      default:
        break;
    }

    dispatch(
      setCheckoutFormErrorData({
        key: inputId,
        hasError,
        message,
      })
    );
  };

  const handleShowTermsModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowTermsModal(!showTermsModal);
  };
  const handleShowPrivacyModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPrivacyModal(!showPrivacyModal);
  };
  const { data: promotionalMsgData, isSuccess: isPromotionalMsgSuccess } = useGetPromotinoalMsgCardPromotionQuery({
    lang,
  });
  const promotionalMsg = promotionalMsgData?.data.message[0];

  const renderCouponMessage = () => {
    const container = (children: JSX.Element) => {
      return <div className="flex flex-row md:items-center">{children}</div>;
    };

    const content = () => {
      if (isApplyCouponSuccess) {
        return (
          <>
            <div className="flex flex-row md:items-center">
              <Image
                src={IconSuccess}
                alt="IconSuccess"
                width={0}
                height={0}
                className="mr-1 aspect-square h-auto w-5 md:w-6 "
                sizes="100vw"
              />
            </div>
            <p className={"text-12 font-semibold leading-5 text-primaryGold md:text-14"}>
              {translate("checkout.error.couponSuccess")}
            </p>
          </>
        );
      } else if (
        !isApplyCouponSuccess &&
        formData.error.memberCouponId?.hasError &&
        formData.error.memberCouponId?.isEditing
      ) {
        return (
          <>
            <div className="flex flex-row md:items-center">
              <Image
                src={IconWarning}
                alt="IconWarning"
                width={0}
                height={0}
                className="mr-1 h-[18px] w-[20px] md:h-[23px] md:w-[25px] "
                sizes="100vw"
              />
            </div>
            <p className={"text-12 font-semibold leading-5 text-primaryPurple md:text-14"}>
              {formData.error.memberCouponId.message}
            </p>
          </>
        );
      }

      return <></>;
    };

    return container(content());
  };

  return (
    <form className="relative">
      <div className="mb-[45px] flex flex-col px-4 md:mb-12 md:px-0">
        <div>
          <FormSubtitle text={translate("checkout.contactTitle")} />
          <p className="mb-5 text-md font-normal leading-none text-primaryGold">
            {translate("checkout.contactRemark")}
          </p>
        </div>
        <div
          className={
            width >= 768 &&
            ((formData.error.firstName.hasError && formData.error.firstName.isEditing) ||
              (formData.error.lastName.hasError && formData.error.lastName.isEditing))
              ? "mb-5"
              : ""
          }
        >
          <div className="relative mb-5 flex flex-col">
            <div className="flex flex-row md:space-x-4">
              <div className="mb-2 md:mb-0 md:w-1/2">
                <CustomInput
                  labelClasses="text-primaryDark"
                  label={translate("checkout.nameLabel") as string}
                  type="TEXT"
                  placeholder={translate("checkout.firstName")}
                  value={formData.firstName}
                  handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const digitOnly = event.target.value.replace(/[^a-zA-Z]/g, "");
                    onValueInput("firstName", digitOnly);
                  }}
                  hasError={formData.error.firstName.hasError && formData.error.firstName.isEditing}
                  onBlur={() => validateInputValue("firstName", formData.firstName)}
                />
              </div>
              <div className="md:w-1/2">
                <CustomInput
                  labelClasses="text-primaryDark"
                  remainLabelHeight
                  type={"TEXT"}
                  placeholder={translate("checkout.lastName")}
                  value={formData.lastName}
                  handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const digitOnly = event.target.value.replace(/[^a-zA-Z]/g, "");
                    onValueInput("lastName", digitOnly);
                  }}
                  hasError={formData.error.lastName.hasError && formData.error.lastName.isEditing}
                  onBlur={() => validateInputValue("lastName", formData.lastName)}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <div className="mb-2 w-1/2 md:mb-0">
                <div className=" flex items-center pl-5 md:pl-8">
                  <p className={"mt-2 text-[14px] font-semibold leading-4 text-primaryPurple md:text-16 md:leading-5"}>
                    {formData.error.firstName.message}
                  </p>
                </div>
              </div>
              <div className="w-1/2">
                <div className=" flex items-center pl-5 md:pl-8">
                  <p className={"mt-2 text-[14px] font-semibold leading-4 text-primaryPurple md:text-16 md:leading-5"}>
                    {formData.error.lastName.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"mb-5"}>
          <CustomInput
            labelClasses="text-primaryDark"
            maxLength={8}
            label={translate("checkout.mobileLabel") as string}
            type={"TEL"}
            placeholder={translate("checkout.mobileNum")}
            value={formData.mobileNumber}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const onlyNum = event.target.value.replace(/[^0-9]/g, "");
              onValueInput("mobileNumber", onlyNum);
            }}
            hasError={formData.error.mobileNumber.hasError && formData.error.mobileNumber.isEditing}
            error={formData.error.mobileNumber.message}
            onBlur={() => validateInputValue("mobileNumber", formData.mobileNumber)}
            leftComponent={
              // keep this drop down for multi region usage in the future
              // <select
              //   onChange={(event) => setMobileRegionCode(event.target.value as MobileRegionCodeType)}
              //   value={mobileRegionCode}
              //   name="mobile-country-code"
              //   id="mobile-country-code"
              //   aria-label="mobile-country-code"
              //   form="mobile-otp"
              //   style={{ backgroundImage: `url(${Chevron.src})` }}
              //   className={`absolute left-0 top-0 h-full w-[6.5rem] items-center rounded-l-full border-l-[1px] border-r-0 border-primaryGold  bg-transparent bg-[length:14.5px_7px] pl-[15px] pr-[25px] text-[16px] font-semibold focus:border-primaryGold
              // focus:outline-none focus:ring-0 focus:ring-primaryGold`}
              // >
              //   {mobileRegionCodeConfig.map((code, index) => (<option key={index} value={code}>+{code}</option>))}
              // </select>
              () => (
                <div
                  className={
                    "absolute left-0 top-0 flex h-full w-[80px] items-center pl-6 pr-[60px] text-14 font-semibold md:pl-10 md:text-lg"
                  }
                >
                  +{formData.countryCode}
                </div>
              )
            }
          />
        </div>
        <div className={`${formData.error.email.hasError && formData.error.email.isEditing ? "mb-10" : "mb-5"}`}>
          <CustomInput
            labelClasses="text-primaryDark"
            maxLength={100}
            label={translate("checkout.emailLabel") as string}
            type={"EMAIL"}
            placeholder={translate("checkout.email")}
            value={formData.email}
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onValueInput("email", event.target.value);
            }}
            hasError={formData.error.email.hasError && formData.error.email.isEditing}
            error={formData.error.email.message}
            onBlur={() => validateInputValue("email", formData.email)}
          />
          {!isAlreadyLogin &&
            checkGuestEmailOptinStatusResponse &&
            !checkGuestEmailOptinStatusResponse?.data?.optinStatus && (
              <Checkbox
                labelFor={"noEmail"}
                labelText={
                  <p className="w-full break-words text-md leading-[22px] text-primaryGold ">
                    {translate("checkout.otpInConsent")}
                  </p>
                }
                type={"checkbox"}
                name={"noEmail"}
                id={"noEmail"}
                checked={!formData.optin}
                onChange={() => {
                  onValueInput("optin", !formData.optin);
                }}
              />
            )}
        </div>
      </div>
      <div className="flex flex-col md:flex-col">
        {/* Memberpoints section */}
        <MemberPoints
          value={formData.memberPointRedeem}
          handleChange={value => {
            onValueInput("memberPointRedeem", Number(value));
          }}
          onTextInput={value => {
            onValueInput("memberPointRedeem", Number(value));
            applyDiscountDebounce({
              memberPointRedeem: Number(value),
            });
          }}
          onTouchEnd={applyDiscountDebounce}
          onMouseUp={applyDiscountDebounce}
          maxValue={maxAvailablePoints}
          from={0}
          maxTo={profile?.pointBalance ?? 0}
          to={maxMemberPointRedeem}
        />

        {/*Promotional Offer section */}
        <div className="mb-10 px-4 md:px-0">
          <FormSubtitle
            text={
              isAlreadyLogin ? translate("checkout.promotionSubTitle") : translate("checkout.couponPromotionSubtitle")
            }
          />

          {/* choose coupon */}
          {isAlreadyLogin && (
            <div className="mb-8">
              <div className="relative rounded-[18px] border border-primaryGold3 px-6 py-5 md:px-8 md:py-6">
                <div className="item-center mb-2 flex gap-1">
                  <LabelText
                    labelTitle={translate("checkout.couponTitle")}
                    labelClass="text-[14px] font-semibold leading-[20px] text-primaryDark md:mb-1 md:text-[16px] md:leading-[28px]"
                  />
                </div>

                <CustomSelect
                  data={couponList.map(coupon => ({ label: coupon.title, value: coupon.id }))}
                  value={
                    formData.memberCouponId && formData.memberCouponId.length > 1 ? formData.memberCouponId : undefined
                  }
                  inactive={Boolean(promoCode)}
                  label={translate("checkout.couponSelector")}
                  containerClasses="md:max-w-[530px] md:w-auto h-[50px] 2xl:h-16 lg:h-[40px] text-left font-semibold text-[16px] leading-[18.77px] md:leading-[22px] mb-2"
                  onChange={value => {
                    if (formData.memberCouponId !== value) {
                      dispatch(
                        setCheckoutFormData({
                          memberCouponId: value,
                        })
                      );
                      applyDiscount({ memberCouponId: value });
                    }
                  }}
                  hasError={formData.error.memberCouponId?.hasError && formData.error.memberCouponId?.isEditing}
                  mode="COUPON"
                  deleteSelector={() => {
                    dispatch(
                      setCheckoutFormData({
                        memberCouponId: "",
                      })
                    );
                    applyDiscount({ memberCouponId: "" });
                  }}
                />
                {renderCouponMessage()}
              </div>
            </div>
          )}

          {/* promo code */}
          <div className="mb-6">
            <div className="relative rounded-[18px] border-[0.5px] border-primaryGold3 px-6 py-5 md:px-8 md:pb-7 md:pt-6">
              <CustomInput
                labelClasses="text-primaryDark !text-lg !font-bold"
                disabled={
                  (formData?.memberCouponId && formData?.memberCouponId?.length > 0) ||
                  (!!formData.promoCode && formData.promoCode.length > 0)
                }
                type={"TEXT"}
                label={translate("checkout.promotionTitle") as string}
                placeholder={translate("checkout.promotionFields")}
                value={promoCode}
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPromoCode(event.target.value);
                }}
                successMessage={
                  !!formData?.promoCode?.length && !formData.error.promoCode?.hasError
                    ? translate("alertModal.34012_next_to_field_content") ?? undefined
                    : undefined
                }
                hasError={formData.error.promoCode?.hasError && formData.error.promoCode?.isEditing}
                error={formData.error.promoCode?.message}
                errorImg={warningIcon}
                rightComponent={() => {
                  if (!formData.promoCode?.length) {
                    return (
                      <button
                        disabled={
                          isApplingPromoCode ||
                          (formData.error.promoCode?.hasError && formData.error.promoCode?.isEditing) ||
                          !promoCode?.length
                        }
                        type="button"
                        onClick={() => {
                          setIsApplyingPromoCode(true);
                          applyDiscount({ promoCode });
                        }}
                        className={`
                          ${
                            (formData.error.promoCode?.hasError && formData.error.promoCode?.isEditing) ||
                            !promoCode?.length
                              ? "opacity-50"
                              : ""
                          }
                          text-bold absolute right-0 top-0 flex  h-full items-center justify-center rounded-full border border-primaryGold bg-primaryGold px-[26px] py-[14px] text-[18px] leading-4 text-white md:px-[2.2vw] md:py-0 md:text-xl
                        `}
                      >
                        {translate("checkout.apply")}
                      </button>
                    );
                  }

                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setIsApplyingPromoCode(true);
                        applyDiscount({ promoCode: "" });
                      }}
                      className={
                        "md:text-2xl absolute right-0 top-0 flex h-full items-center justify-center rounded-full border border-primaryGold bg-primaryGold px-[26px] py-[14px] text-[18px] leading-4 text-white md:px-[2.2vw] md:py-0 md:leading-[28px]"
                      }
                    >
                      {translate("checkout.remove")}
                    </button>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Choose Saved Cards section  */}
      {savedCardPaymentMethods && savedCardPaymentMethods?.length > 0 && (
        <div className="mb-12 px-4 md:px-0">
          <FormSubtitle text={translate("checkout.creditCardTitle")} containerClasses="mb-[18px] md:mb-[1.3rem]" />

          <div className="mb-[10px] md:mb-5">
            {savedCardPaymentMethods.map((pm, i) => {
              if (!pm?.savedCardInfo) return; // must not happen

              const isAE = [
                PAYMENT_METHOD.AMEX,
                PAYMENT_METHOD.APPLE_PAY_AMEX,
                PAYMENT_METHOD.GOOGLE_PAY_AMEX,
                PAYMENT_METHOD.TOKENIZATION_AMEX,
              ].includes(pm.paymentMethodId);

              return (
                <CreditCardInput
                  isAE={isAE}
                  disableQRCodePopup={true}
                  handleDeleteCard={handleDeleteCard}
                  id={pm?.savedCardInfo?.id || ""}
                  setSelectedCard={() => {

                    applyDiscount({
                      selectedPaymentMethodId: pm?.paymentMethodId,
                      savedCardId: pm?.savedCardInfo?.id,
                    });
                    dispatch(
                      setCheckoutFormData({
                        selectedPaymentMethodId: pm?.paymentMethodId,
                      })
                    );
                    dispatch(setSavedCardFormData({
                      savedCardId: pm?.savedCardInfo?.id,
                      savedCardCVV: "",
                    }));
                    dispatch(
                      setCheckoutFormErrorData({
                        key: "selectedPaymentMethodId",
                        hasError: false,
                      })
                    );
                    dispatch(
                      setCheckoutFormErrorData({
                        key: "savedCardCVV",
                        hasError: true,
                      })
                    );
                  }}
                  checked={
                    formData.selectedPaymentMethodId === pm.paymentMethodId &&
                    formData.savedCardId === pm?.savedCardInfo.id
                  }
                  isDisplayCVV={
                    formData.selectedPaymentMethodId === pm.paymentMethodId &&
                    formData.savedCardId === pm?.savedCardInfo.id
                  }
                  value={pm.paymentMethodId}
                  name={"selectedPaymentMethod"}
                  card={pm?.savedCardInfo}
                  key={i}
                  profile={profile}
                  checkoutForm
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Use New Payment method */}
      <div className="mb-10 px-4 md:mb-6 md:px-0">
        <FormSubtitle
          text={isAlreadyLogin ? translate("checkout.otherPayment") : translate("checkout.payment")}
          containerClasses="mb-3"
        />
        <p className="mb-8 text-md">{translate("checkout.paymentRemark")}</p>

        {isPromotionalMsgSuccess && promotionalMsg && (
          <div className="mb-[13px] rounded-[10px] bg-secondaryLightSand p-5">
            <p className="text-[14px] leading-5" dangerouslySetInnerHTML={{ __html: promotionalMsg as string }}></p>
          </div>
        )}
        {(isCheckoutTimeout || MPGSError?.length > 0) && (
          <div className="mb-[13px] flex flex-row items-center rounded-[10px] bg-[#6A16484D] pb-3 pl-5 pr-5 pt-3">
            <Image
              src={alertTriangleIcon}
              alt="alertIcon"
              width={0}
              height={0}
              sizes="100vw"
              className="mr-3 h-5 w-6 xl:h-6 xl:w-7"
            />
            <div>
              <p className="font-semi text-14 leading-5 text-primaryPurple md:leading-6">
                {isCheckoutTimeout ? translate("alertModal.mpgs_payment_timeout") : MPGSError}
              </p>
            </div>
          </div>
        )}

        {paymentMethods?.map((pm, i) => {
          return (
            <PaymentMethod
              containerClasses={isPaymentMethodAutoSelected && pm.paymentMethodId !== formData.selectedPaymentMethodId ? "opacity-50" : ""}
              key={i}
              extra={{
                creditCardData: {
                  cardHolder: formData.cardHolder,
                  cardNumber: formData.cardNumber,
                  expiryMonth: formData.expiryMonth,
                  expiryYear: formData.expiryYear,
                  cvv: formData.cvv,
                  saveCardEnabled: formData.saveCardEnabled,
                },
                paymentConfig: pm,
              }}
              onChange={() => {
                if (pm?.paymentMethodId) {
                  applyDiscount({ selectedPaymentMethodId: pm?.paymentMethodId, savedCardId: "" });
                  if (pm?.paymentMethodId !== formData.selectedPaymentMethodId) {
                    dispatch(
                      setCheckoutFormData({
                        cardHolder: "",
                        cardNumber: "",
                        cvv: "",
                        expiryMonth: "",
                        expiryYear: "",
                      })
                    );

                    dispatch(setSavedCardFormData({
                      savedCardId: "",
                      savedCardCVV: "",
                    }));
                  }

                  onValueInput("selectedPaymentMethodId", pm?.paymentMethodId);
                  // this is useful if user clicked "save card" option
                  dispatch(
                    setCheckoutFormData({
                      saveCardPaymentMethodId: pm?.saveCardPaymentMethodId,
                    })
                  );
                } else {
                  alert("Wrong payment method id");
                }
              }}
              checked={formData.selectedPaymentMethodId === pm.paymentMethodId}
              onTooltipClick={trigger => {
                if (trigger === true) {
                  dispatch(setIsCVVPopup(true));
                } else {
                  dispatch(setIsCVVPopup(false));
                }
              }}
              onCreditCardInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!event || !event.target) {
                  return;
                }
                const { name, value } = event.target;
                // name is one of the "crdit card" key, see the type "OrderCheckoutType"
                onValueInput(
                  name as keyof OrderCheckoutType,
                  name === "cardHolder" ? value : value?.replace(/\s/g, "")
                );
              }}
              onCreditCardInputDone={applyDiscountDebounce}
              onMobilePaymentSelected={res => {
                onValueInput("merchantName", res.merchantInfo.merchantName);
                onValueInput("merchantId", res.merchantInfo.merchantId);

                // only exists if its google pay
                if ((res as GetGooglepayMerchantInfoResponse).merchantInfo.gateway) {
                  onValueInput("gateway", (res as GetGooglepayMerchantInfoResponse).merchantInfo.gateway);
                }
                // only exists if its google pay
                if ((res as GetGooglepayMerchantInfoResponse).merchantInfo.gatewayMerchantId) {
                  onValueInput(
                    "gatewayMerchantId",
                    (res as GetGooglepayMerchantInfoResponse).merchantInfo.gatewayMerchantId
                  );
                }
              }}
            />
          );
        })}
      </div>

      <div className="hidden md:block">
        <Checkbox
          labelFor={"agree"}
          labelText={
            <p
              className={`${
                lang === "en" ? "w-[90%] break-words" : "whitespace-nowrapc w-full "
              }  text-14 text-primaryGold md:text-md`}
            >
              {translate("checkout.checkboxMsg")}
              {/* <a
                href={`/${lang}/${ROUTES.TERMS_AND_CONDITION}`}
                target="_blank"
                className="cursor-pointer font-semibold underline"
                onClick={handleShowTermsModal}
              >
                {translate("checkout.terms")}
              </a> */}
              <button onClick={handleShowTermsModal} className="cursor-pointer font-semibold underline">
                {translate("checkout.terms")}
              </button>
              {translate("checkout.and")}
              {/* <a href={`/${lang}/${ROUTES.PRIVACY_AND_POLICY}`} target="_blank" className="font-semibold underline">
                {translate("checkout.policy")}
              </a> */}
              <button onClick={handleShowPrivacyModal} className="cursor-pointer font-semibold underline">
                {translate("checkout.policy")}
              </button>
              {translate("checkout.checkboxMsgEnd")}
            </p>
          }
          type={"checkbox"}
          name={"agree"}
          id={"agree"}
          required={true}
          checked={formData.agree}
          onChange={() => {
            onValueInput("agree", !formData.agree);
          }}
        />
      </div>

      {/* {showTermsModal &&
        createPortal(
          <TermsAndConditionPopup terms={Terms} onClose={handleShowTermsModal} showModal={showTermsModal} />,
          document.body
        )} */}

      {showTermsModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockTerms}
            lang={lang}
            onClose={handleShowTermsModal}
            showModal={showTermsModal}
          />,
          document.body
        )}

      {showPrivacyModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockPolicies}
            lang={lang}
            onClose={handleShowPrivacyModal}
            showModal={showPrivacyModal}
          />,
          document.body
        )}
    </form>
  );
};
