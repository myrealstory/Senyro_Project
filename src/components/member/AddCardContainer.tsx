"use client";

import Link from "next/link";
import alertTriangleIcon from "@/images/icons/Icon_alert-triangle.png";
import VisaCard from "@/images/icons/Icon_VISA@3x.png";
import Mastercard from "@/images/icons/Icon_Master@3x.png";
import AmericanExpress from "@/images/icons/Icon_AE@3x.png";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
import { usePathname } from "next/navigation";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { LocaleKeysType } from "@/app/i18n";
import { useSaveCardMutation } from "@/redux/api/memberApi";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { FullScreenSaveCardLoader } from "./FullScreenSaveCardLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ROUTES } from "@/constants";
import { mpgsErrorMapper } from "@/utils/clientUtils";
import { setIsCVVPopup, setLoadingScreenDisplay, setMPGSError } from "@/redux/slice/generalStateSlice";
import { deleteCookie, getCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { CartApiAlertListType } from "@/types/cartTypes";
import { CustomInput } from "../checkout/CustomInput";
import { checkIfCreditCardNumberValid, isCardHolderValid } from "@/utils/commonUtils";
import { useWindowSize } from "@/hook/useWindowSize";
import { Tooltip } from "./Tooltip";
import "@/style/member/member.scss";
import CustomButton from "../CustomButton";

type AddCardFormType = {
  cardHolder?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
};

type AddCardFormErrorType = {
  cardHolder?: string | boolean;
  cardNumber?: string | boolean;
  expiryMonth?: string | boolean;
  expiryYear?: string | boolean;
  cvv?: string | boolean;
};

export const AddCardContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const dispatch = useDispatch();
  const path = usePathname().split("/")[3];
  const { width } = useWindowSize();
  const [saveCardRequest, { isLoading }] = useSaveCardMutation();
  const { translate } = useTranslation(lang);
  const [isPageReady, setIsPageReady] = useState(false);
  const { MPGSError } = useSelector((state: RootState) => state.generalState);
  const [formValue, setFormValue] = useState<AddCardFormType>({});
  const [formError, setFormError] = useState<AddCardFormErrorType>({
    cardHolder: undefined,
    cardNumber: undefined,
    expiryMonth: undefined,
    expiryYear: undefined,
    cvv: undefined,
  });
  const [returnHtmlPayload, setReturnHtmlPayload] = useState<{ returnHtml: string; returnHtmlScriptId: string } | null>(
    null
  );

  useEffect(() => {
    if (!isLoading) {
      setIsPageReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isPageReady) {
      setTimeout(() => {
        dispatch(setLoadingScreenDisplay(false));
      }, 500);
    }
  }, [isPageReady]);

  const handleCardHolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, cardHolder: e.target.value });
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, cardNumber: e.target.value });
  };

  const handleExpiryMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, expiryMonth: e.target.value });
  };

  const handleExpiryYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, expiryYear: e.target.value });
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, cvv: e.target.value });
  };

  const handleToolTip = (trigger: any) => {
    if (trigger === true) {
      dispatch(setIsCVVPopup(true));
    } else {
      dispatch(setIsCVVPopup(false));
    }
  };

  const goBack = () => {
    window.location.href = `/${lang}/${ROUTES.MEMBER_SAVED_CARDS}`;
  };

  const handleSaveCardProcess = () => {
    dispatch(setLoadingScreenDisplay(true));
    saveCardRequest({
      cardHolder: formValue.cardHolder,
      cardNumber: formValue.cardNumber ? formValue.cardNumber.replace(/\s/g, "").trim().slice(0, 16) : "",
      expiryMonth: formValue.expiryMonth,
      expiryYear: formValue.expiryYear,
      cvv: formValue.cvv,
    })
      .unwrap()
      .then(res => {
        if (res && res.data && res.data?.returnStatus === "success") {
          const { returnHtml, returnHtmlScriptId } = res.data;
          if (returnHtml && returnHtmlScriptId) {
            setReturnHtmlPayload({
              returnHtml,
              returnHtmlScriptId,
            });
          }
        } else {
          dispatch(setLoadingScreenDisplay(false));
          res?.data?.alertList &&
            res?.data?.alertList?.forEach((alert: CartApiAlertListType) => {
              mpgsErrorMapper(alert, dispatch, translate, lang);
            });
        }
      });
  };

  useEffect(() => {
    const int = setInterval(() => {
      const MPGSError = getCookie(CookiesKey.MPGSError) as string;
      if (MPGSError?.length) {
        const alertList: any = JSON.parse(MPGSError);
        if (Array.isArray(alertList) && alertList?.length) {
          alertList.forEach((alert: CartApiAlertListType) => {
            mpgsErrorMapper(alert, dispatch, translate, lang);
          });
        }
        deleteCookie(CookiesKey.MPGSError);
        clearInterval(int);
      }
    }, 500);

    return () => {
      int && clearInterval(int);
      deleteCookie(CookiesKey.MPGSError);
      dispatch(setMPGSError(""));
    };
  }, []);

  const isFormValid = useMemo(() => {
    return Object.values(formError).filter(error => error === false).length === Object.keys(formError).length;
  }, [formError, formValue]);

  const validateFormByField = (field: keyof AddCardFormType, value: any, latestFormError?: AddCardFormErrorType) => {
    const newErrorObject: AddCardFormErrorType = {
      [field]: false,
    };

    switch (true) {
      case !value || value?.length < 1:
        newErrorObject[field] = translate("alertModal.required")!;
        break;
      case field === "cardHolder" && String(value)?.length !== 0 && !isCardHolderValid(String(value)):
        newErrorObject[field] = translate("addCard.invalidCardholderName")!;
        break;
      case field === "cardNumber" &&
        String(value)?.length !== 0 &&
        checkIfCreditCardNumberValid(String(value)) === "error":
        newErrorObject[field] = translate("addCard.invalidCardNumber")!;
        break;
      case field === "expiryYear" &&
        String(value)?.length &&
        (Number.isNaN(value) || String(value)?.length !== 2 || Number(value) < new Date().getFullYear() % 1000):
        newErrorObject[field] = translate("addCard.invalidExpiryDate")!;
        break;
      case field === "expiryMonth" &&
        String(value)?.length &&
        (Number.isNaN(value) ||
          String(value)?.length !== 2 ||
          Number(value) < 0 ||
          Number(value) > 12 ||
          value === "00"):
        newErrorObject[field] = translate("addCard.invalidExpiryDate")!;
        break;
      case field === "cvv" &&
        (String(value)?.length < 3 ||
          String(value)?.length > 4 ||
          (checkIfCreditCardNumberValid(String(formValue.cardNumber)) === "ae" && String(value)?.length !== 4) ||
          (checkIfCreditCardNumberValid(String(formValue.cardNumber)) === "master" && String(value)?.length !== 3) ||
          (checkIfCreditCardNumberValid(String(formValue.cardNumber)) === "visa" && String(value)?.length !== 3)):
        newErrorObject[field] = translate("addCard.invalidCVV")!;
        break;
      default:
        break;
    }

    setFormError({
      ...(latestFormError ?? formError),
      ...newErrorObject,
    });

    return {
      ...(latestFormError ?? formError),
      ...newErrorObject,
    };
  };

  const paymentDetails = (
    <article className="addCardPaymentDetailsContainer">
      <h1>{translate("addCard.paymentDetails")}</h1>

      <p className="addCardDescription">{translate("addCard.description")}</p>
      <p className="addCardMerchantLocated">{translate("addCard.proceedDescription")}</p>
      <p className="addCardMerchantLocated">{translate("addCard.addCardRemark")}</p>
      <span className="addCardDivider"></span>
      <div className="addCardAmountContainer">
        <span className="xl:hidden">HKD</span>
        <span className="addCardPrice">$1.0</span>
      </div>
    </article>
  );

  if (!isPageReady) {
    return <></>;
  }

  const renderErrorMsg = (
    <>
      {MPGSError?.length > 0 && (
        <div className="mb-[13px] flex w-full flex-row items-center rounded-[10px] bg-[#6A16484D] pb-3 pl-5 pr-5 pt-3">
          <Image
            src={alertTriangleIcon}
            alt="alertIcon"
            width={0}
            height={0}
            sizes="100vw"
            className="mr-3 h-5 w-6 xl:h-6 xl:w-7"
          />
          <div>
            <p className="font-semi text-14 leading-5 text-primaryPurple md:leading-6">{MPGSError}</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="rounded-[24px] px-4 lg:mt-[20px] lg:max-w-[650px] lg:bg-white lg:px-8 lg:py-7 lg:shadow-lg">
      <FullScreenSaveCardLoader
        returnHtmlPayload={returnHtmlPayload}
        isLoading={Boolean(isLoading || returnHtmlPayload)}
        lang={lang}
      />
      <div className="addCardContainer">
        <div className="addCardTitlesContainer">
          <h2>{translate("addCard.cardDetails")}</h2>
          <div className="addCardsIconContainer">
            <Image src={VisaCard} width={68} height={22} alt="Visa card logo" />
            <Image src={Mastercard} width={58} height={36} alt="Mastercard logo" />
            <Image src={AmericanExpress} width={36} height={36} alt="America Express logo" />
          </div>
        </div>
        <div className="addCardFullContainer">
          <form className="flex w-full  flex-col gap-[20px] lg:items-start lg:justify-between xl:w-1/2">
            {renderErrorMsg}
            <CustomInput
              label={translate("addCard.cardHolderName") as string}
              type="TEXT"
              placeholder={translate("addCard.cardHolderName")}
              value={formValue.cardHolder}
              labelClasses="labelText"
              handleChange={handleCardHolderChange}
              onBlur={() => {
                validateFormByField("cardHolder", formValue.cardHolder);
              }}
              hasError={!!formError?.cardHolder}
              error={formError?.cardHolder as string}
              path={path}
            />
            <CustomInput
              label={translate("addCard.cardNumber") as string}
              type="TEXT"
              maxLength={16}
              placeholder={translate("addCard.cardNumberPlaceholder")}
              value={formValue.cardNumber}
              labelClasses="labelText"
              handleChange={handleCardNumberChange}
              onBlur={() => {
                const latestFormError = validateFormByField("cardNumber", formValue.cardNumber);
                if (formValue?.cvv && formValue?.cvv?.length > 0) {
                  validateFormByField("cvv", formValue.cvv, latestFormError);
                }
              }}
              hasError={!!formError?.cardNumber}
              error={formError?.cardNumber as string}
              path={path}
            />
            <div className="flex gap-4 lg:w-full">
              <CustomInput
                maxLength={2}
                label={translate("addCard.expiryDate") as string}
                type="TEXT"
                placeholder={translate("addCard.expiryMonth")}
                value={formValue.expiryMonth}
                labelClasses="labelText"
                handleChange={handleExpiryMonthChange}
                onBlur={() => {
                  validateFormByField("expiryMonth", formValue.expiryMonth);
                }}
                hasError={!!formError?.expiryMonth}
                error={formError?.expiryMonth as string}
                path={path}
              />
              <CustomInput
                maxLength={2}
                remainLabelHeight={true}
                type="TEXT"
                placeholder={translate("addCard.expiryYear")}
                value={formValue.expiryYear}
                handleChange={handleExpiryYearChange}
                onBlur={() => {
                  validateFormByField("expiryYear", formValue.expiryYear);
                }}
                hasError={!!formError?.expiryYear}
                error={formError?.expiryYear as string}
                path={path}
              />
            </div>
            <CustomInput
              maxLength={4}
              label={translate("addCard.cvv") as string}
              type="TEXT"
              placeholder="CVV"
              value={formValue.cvv}
              labelClasses="labelText"
              handleChange={handleCvvChange}
              onBlur={() => {
                validateFormByField("cvv", formValue.cvv);
              }}
              hasError={!!formError?.cvv}
              error={formError?.cvv as string}
              rightComponent={() => <Tooltip width={width} onTooltipClick={handleToolTip} />}
              path={path}
            />
          </form>
          {paymentDetails}
        </div>

        <div className="addCardWebButtonsContainer">
          <CustomButton
            containerClass="backButton"
            textClass=" text"
            onClick={goBack}
            title={translate("addCard.back") as string}
            noBorder
            secondary
          />
          <CustomButton
            containerClass="processButton"
            textClass="text"
            onClick={handleSaveCardProcess}
            title={translate("addCard.proceed") as string}
            form="AddCardForm"
            disabled={!isFormValid || isLoading}
          />
        </div>
        <MobileButtonContainer>
          <div className="addCardMobileButtonsContainer">
            <Link className="w-[20%] text-center" href={`/${lang}/${ROUTES.MEMBER_SAVED_CARDS}`}>
              {translate("addCard.back")}
            </Link>
            <button
              type="submit"
              form="AddCardForm"
              onClick={handleSaveCardProcess}
              disabled={!isFormValid || isLoading}
            >
              {translate("addCard.proceed")}
            </button>
          </div>
        </MobileButtonContainer>
      </div>
    </div>
  );
};
