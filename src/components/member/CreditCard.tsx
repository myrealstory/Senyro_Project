"use client";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import alertIcon from "@/images/icons/Icon_tooltip.png";
import Delete from "@/images/icons/Icon_trash-primary@3x.png";
import { CreditCardType } from "@/types/componentTypes";
import { reFormattedCardNum } from "@/components/forms/FormattedUtils";
import { CardPopup } from "./CardPopup";
import { CreditCardIcon } from "./CreditCardIcon";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import { CustomInput } from "../checkout/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useOrderCheckoutSlice } from "@/redux/slice/orderCheckoutSlice";
import { RootState } from "@/redux/store";
import { setIsCVVPopup } from "@/redux/slice/generalStateSlice";
import "@/style/member/member.scss";
import { handleAlertMessageForGeneralPage } from "@/utils/clientUtils";

export const CreditCard = ({
  disableQRCodePopup,
  onDelete,
  profile,
  card,
  path,
  lang,
  containerStyle,
  MRight,
  checkoutForm,
  isDisplayCVV,
  onClick,
  isAE,
}: CreditCardType) => {
  const [payWithCardPopupShown, setPayWithCardPopupShown] = useState(false);

  const dispatch = useDispatch();
  const { setSavedCardFormData, setCheckoutFormErrorData } = useOrderCheckoutSlice();
  const cardNum = reFormattedCardNum({ cardNum: card.cardNumber, type: "FourAsterisks" });
  const formData = useSelector((state: RootState) => state.orderCheckout);

  const { translate } = useTranslation(lang);

  const onCVVInput = (cvv: string) => {
    dispatch(
      setSavedCardFormData({
        savedCardCVV: cvv,
      })
    );

    let hasError = false;
    let message = "";
    switch (true) {
      case isAE && !String(cvv)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case isAE && String(cvv)?.length && (Number.isNaN(cvv) || String(cvv)?.length !== 4):
        hasError = true;
        message = translate("checkout.error.cvv");
        break;
      case !isAE && !String(cvv)?.length:
        hasError = true;
        message = translate("checkout.error.required");
        break;
      case !isAE && String(cvv)?.length && (Number.isNaN(cvv) || String(cvv)?.length !== 3):
        hasError = true;
        message = translate("checkout.error.cvv");
        break;
      default:
        hasError = false;
        message = "";
    }

    dispatch(
      setCheckoutFormErrorData({
        key: "savedCardCVV",
        hasError,
        message,
      })
    );
  };

  return (
    <>
      <li
        className={`savedCardContainer
      ${containerStyle ? containerStyle : "savedCardContainerStyle"}
            ${path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) && "lg:border lg:border-primaryGold2"}`}
      >
        <div className={"savedCardFirstRow"}>
          <div
            className="savedCardBtn"
            role="button"
            onClick={() => {
              onClick && onClick();
              setPayWithCardPopupShown(true);
            }}
          >
            <div className="w-[25%]">
              <CreditCardIcon cardType={card.cardBankType} />
            </div>
            <div className={`${MRight ? "md:ml-1" : ""} w-[210px]`}>
              <h3 className={`${MRight ? "mb-1 md:mb-2 md:text-[20px]" : "md:text-[16px]"}`}>
                {card.cardBankType} ({cardNum})
              </h3>
              <span>
                {translate("savedCards.expiry")}{" "}
                {card.cardExpiryMonth.toString().length === 1 ? `0${card.cardExpiryMonth}` : card.cardExpiryMonth}/
                {card.cardExpiryYear}
              </span>
            </div>
          </div>
          <button
            type={"button"}
            onClick={() => {
              handleAlertMessageForGeneralPage({
                alertCode: "g61",
                alertType: "popup",
                translate,
                dispatch,
                lang,
                extraInfo: {
                  rightButtonCallback: () => {
                    onDelete(card.id);
                  },
                },
              });
            }}
          >
            <Image
              src={Delete}
              width={0}
              height={0}
              alt="delete credit card"
              className="block  h-auto w-[24px] object-contain lg:w-[30px]"
            />
          </button>
        </div>
        {isDisplayCVV && (
          <div className={"savedCardCVVRow"}>
            <span className="font-bold">CVV*</span>
            <CustomInput
              maxLength={4}
              type={"TEL"}
              pattern="\d*"
              placeholder={"CVV"}
              value={formData.savedCardCVV}
              handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onCVVInput(event.target.value);
              }}
              onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onCVVInput(event.target.value)}
              rightComponent={() => (
                <div className="absolute right-4 top-0 flex h-full w-7 cursor-pointer items-center">
                  <button type="button" className="h-7 object-cover" onMouseEnter={() => dispatch(setIsCVVPopup(true))}>
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
              )}
              hasError={formData.error.savedCardCVV.hasError && formData.error.savedCardCVV.isEditing}
              error={formData.error.savedCardCVV.message}
            />
          </div>
        )}
      </li>
      {!disableQRCodePopup &&
        payWithCardPopupShown &&
        createPortal(
          <CardPopup
            checkoutForm={checkoutForm}
            card={card}
            profile={profile}
            lang={lang}
            close={() => setPayWithCardPopupShown(false)}
            isShowPopup={payWithCardPopupShown}
          />,
          document.body
        )}
    </>
  );
};
