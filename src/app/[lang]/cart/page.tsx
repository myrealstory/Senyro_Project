"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import iconCreditCard from "@/images/icons/Icon_CreditCard.png";
import Recommend from "@/components/cart/Recommend";
import Icon_left from "@/images/icons/Icon_chevron-left@3x.png";
import arrowIcon from "@/images/icons/Icon_arrow-right-white@3x.png";
import Icon_right from "@/images/icons/Icon_arrow-right-white@3x.png";
import CustomSwitch from "@/components/CustomSwitch";
import arrowIconWhite from "@/images/icons/Icon_arrow-right-white@3x.png";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/hook/useCart";
import { CartType } from "@/types/pageTypes";
import { RootState } from "@/redux/store";
import { SlidePanel } from "@/components/SlidePanel";
import { DeliveryBar } from "@/components/DeliveryBar";
import { useWindowSize } from "@/hook/useWindowSize";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { MobileCartTable } from "@/components/cart/MobileCartTable";
import { DesktopCartTable } from "@/components/cart/DesktopCartTable";
import { setLoadingScreenDisplay, setSourceForAddCart } from "@/redux/slice/generalStateSlice";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { useAddCartRequestMutation, useLazyGetCartRequestQuery } from "@/redux/api/cartSliceApi";
import "@/style/cart/cart.scss";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { getMobilePBottom, handleAlertMessage } from "@/utils/clientUtils";
import { InnerAlert } from "@/components/InnerAlert";
import { useCartPickupStep } from "@/hook/useCartPickupStep";
import { useGetPromotinoalMsgCart_bottomQuery, useGetPromotinoalMsgCart_topQuery } from "@/redux/api/generalApi";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import CustomButton from "@/components/CustomButton";

const EmptyCartView = ({ lang }: { lang: LocaleKeysType }) => {
  const { push } = useRouter();
  const { translate } = useTranslation(lang);

  return (
    <div className="flex flex-col items-center justify-center px-8 py-24 text-center md:pb-24 md:pt-8">
      <h2 className="mb-[28px] text-[28px] leading-6 md:mb-5 md:text-[36px] md:leading-[60px]">
        {translate("cart.cartEmpty")}
      </h2>
      <button
        className="btn-dark flex h-[56px] w-full items-center justify-center gap-2 md:mb-5 md:aspect-[3.5/1] md:h-auto md:w-[321px]"
        onClick={() => {
          push(`/${lang}/index`);
        }}
      >
        <span className="text-20 md:text-22 2xl:text-26">{translate("cart.shopNow")}</span>
        <Image src={arrowIconWhite} alt="" width={0} height={0} sizes="100vw" className="h-auto w-[26px] md:w-[30px]" />
      </button>
    </div>
  );
};

const PromotionBar = ({ containerClass, Content }: { containerClass: string; Content: string }) => {
  return (
    <div
      className={`w-full rounded-lg bg-secondaryLightSand xl:rounded-xl ${containerClass}`}
      dangerouslySetInnerHTML={{ __html: Content }}
    />
  );
};

export default function Cart({ params }: { params: CartType }) {
  const lang = params.lang;

  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const { apiData } = useSelector((state: RootState) => state.cart);
  const { translate } = useTranslation(lang);
  const { editModifiers } = useCart({ lang });
  const { getPickupDatetime } = useCartPickupStep({ lang });
  const [addCartRequest] = useAddCartRequestMutation();
  const { isSetProductPopupOpen, isPaymentInProgressPopupDisplay } = useSelector(
    (state: RootState) => state.generalState
  );
  const { selectedBranchCode } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const [isPageReady, setIsPageReady] = useState(false);
  const [modifiersStatus, setModifiersStatus] = useState<{ [skuCode: string]: boolean }>({});
  const [getCartRequest] = useLazyGetCartRequestQuery();
  const { data: promotionalMsgData_top, isSuccess: isPromotionalMsgTop_Success } = useGetPromotinoalMsgCart_topQuery({
    lang,
  });
  const isMobileView = width < 1024;
  const promotionalMsgTop = promotionalMsgData_top?.data.message[0];
  const { data: promotionalMsgData_bottom, isSuccess: isPromotionalMsgBottom_Success } =
    useGetPromotinoalMsgCart_bottomQuery({ lang });
  const promotionalMsgBottom = promotionalMsgData_bottom?.data.message[0];
  const [footerHeight, setFooterHeight] = useState<DOMRect["height"]>(0);

  useEffect(() => {
    let int: NodeJS.Timer | undefined;
    if (typeof window !== "undefined" && isMobileView) {
      int = setInterval(() => {
        const footer = document.getElementById("mobileFooter");
        if (
          footer &&
          footer.childNodes?.length > 0 &&
          apiData.recommendationList &&
          apiData.recommendationList?.length < 0
        ) {
          setFooterHeight(footer?.clientHeight);
        }
        clearInterval(int);
      }, 100);
      int;
    }

    return () => {
      int && clearInterval(int);
    };
  }, [width, isMobileView]);

  const { isAlreadyLogin } = useIsAlreadyLogin();

  const shouldAppearAlcohol = () => {
    let shouldAppear = false;
    apiData.cart?.cartItems.some(item => {
      if (item.item.isAlcoholProduct) {
        shouldAppear = true;
      }
      return false;
    });

    return shouldAppear;
  };

  useEffect(() => {
    if (width > 0) {
      setIsPageReady(true);
    }
  }, [width]);

  useEffect(() => {
    if (apiData.cart?.modifiers?.length) {
      const modifiersInfo: {
        [skuCode: string]: boolean;
      } = {};
      apiData.cart?.modifiers.forEach(modifier => {
        modifiersInfo[modifier.skuCode] = modifier.isSelected;
      });

      setModifiersStatus(modifiersInfo);
    }
  }, [apiData]);

  useEffect(() => {
    dispatch(setSourceForAddCart("cart"));
    setTimeout(() => {
      dispatch(setLoadingScreenDisplay(false));
    }, 500);
  }, []);

  const onGoToAddOnPage = () => {
    dispatch(setLoadingScreenDisplay(true));
    getCartRequest({
      lang,
      isCartPage: true,
      source: "checkout",
    })
      .unwrap()
      .then(res => {
        if (res.statusCode === 200 && res.data.alertList?.length) {
          dispatch(setLoadingScreenDisplay(false));
          handleAlertMessage({
            alertList: res.data.alertList,
            dispatch,
            translate,
            lang,
            extraInfo: {
              branchCode: selectedBranchCode,
              pickupDatetime: getPickupDatetime(),
            },
            addCartRequest,
            getCartRequest,
          });
          dispatch(setCartApiData(res.data));
          dispatch(setCartLocalDataFromApiData({ ...res.data, isCartPage: false }));
        } else {
          router.refresh();
          router.push(`${ROUTES.CART}/${ROUTES.ADD_ON}`);
        }
      });
  };

  const renderAlcoholWarning = (className: string) => {
    if (shouldAppearAlcohol()) {
      return <div className={className}>{translate("cart.alcoholWarning")}</div>;
    }
    return <></>;
  };

  if (!isPageReady) {
    return <></>;
  }

  if (isPaymentInProgressPopupDisplay) {
    return (
      <main className="mt-5 w-full md:mt-[68px] lg:mt-[60px] 2xl:mt-[40px]">
        <div className="mb-[79px] mt-[48px] w-full px-4 sm:px-[13.645vw]">
          <h3 className="text-[26px] font-medium leading-7 lg:text-[30px] lg:leading-10">{translate("cart.title")}</h3>
        </div>

        <section className="flex h-auto flex-col items-center justify-center">
          <div className="h-[60px] w-[60px] lg:mb-2 lg:h-[100px] lg:w-[100px]">
            <Image
              src={iconCreditCard}
              width={0}
              height={0}
              alt="icon CreditCard"
              className="h-full w-full object-fill"
            />
          </div>

          <div className="mx-6 flex h-auto flex-col items-center justify-center">
            <h5 className="text-[25.571px] font-medium leading-[52px] tracking-[-0.511px] lg:text-[30px] lg:leading-[72.5px] lg:tracking-[-0.6px]">
              {translate("transactions.paymentLoadingTitle")}
            </h5>

            <p
              className="px-3 text-center text-[14px] font-medium leading-[18.4px] 
                              tracking-[-0.28px] lg:-mt-4 lg:text-[18px] lg:leading-[21.6px] lg:tracking-[-0.36px]"
            >
              {translate("transactions.paymentLoadingContent")}
            </p>
          </div>
          <div className="flex w-full items-center justify-center">
            <button
              className="mx-[37px] mb-[187px] mt-[91px] flex h-[56px] w-[300px] items-center justify-center rounded-full bg-primaryGold text-[18px] font-medium tracking-[-0.36px] text-white 
                                  lg:mt-[2.604vw] lg:h-[68px] lg:w-[19.21875vw] lg:text-[22px] lg:tracking-[-0.44px] xl:mb-[160px] 2xl:mb-[143px] "
              onClick={() => {
                window.location.assign(`/${lang}/${ROUTES.INDEX}`);
              }}
            >
              {translate("cart.Return to Home")}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="wrapper cartContainer" style={{ paddingBottom: `${footerHeight}px` }}>
        <div className={"cartRow"} style={getMobilePBottom(width, apiData)}>
          <div className="mb-6 flex lg:mb-4">
            <div className="cartLoginBox flex-1">
              {!isAlreadyLogin && (
                <React.Fragment>
                  <p>{translate("cart.AlreadyMember")}</p>
                  <button
                    onClick={() => {
                      setCookie(CookiesKey.targetPageToBeRedirectedTo, window.location.pathname);
                      window.location.href = `/${lang}/${ROUTES.LOGIN}`;
                    }}
                  >
                    {translate("cart.Login")}
                  </button>
                </React.Fragment>
              )}
            </div>
            {apiData.cart && apiData.cart.cartItems.length > 0 ? (
              <div className="hidden w-[35vw] items-center justify-between rounded-full bg-white py-3 pl-8 pr-3 shadow-5xl md:top-1 md:flex md:w-[450px] md:py-3 lg:top-5 lg:w-[500px] xl:top-3 2xl:w-[600px] ">
                <div className="flex flex-col items-center md:mr-4 md:w-[65%] md:flex-row md:justify-between 2xl:w-[58%]">
                  <h5 className="text-xl uppercase leading-[14px] opacity-60 md:text-12 lg:text-14 2xl:text-16">
                    {translate("cart.total")}
                  </h5>
                  <div className="flex items-center gap-1 whitespace-nowrap text-end">
                    <strong className="text-xl font-extrabold md:text-22 lg:text-24 xl:leading-[32px] 2xl:text-26">
                      ${apiData.cart?.summary?.totalAmount}
                    </strong>
                    <span>{"\u00A0"}</span>
                    <span className="opacity-60 md:text-12 lg:text-14 xl:leading-[14px] 2xl:text-[16px]">
                      ({apiData.cart?.itemCount} {translate("cart.items")})
                    </span>
                  </div>
                </div>
                <CustomButton
                  onClick={() => {
                    onGoToAddOnPage();
                  }}
                  containerClass="btn-dark flex items-center justify-center md:h-[40px] md:w-[140px] lg:w-[180px] 2xl:h-[50px] 2xl:w-[220px]"
                  rightIcon={arrowIcon}
                  title={translate("cart.checkout") as string}
                  textClass="mr-[6px] text-xl font-medium leading-6 text-white"
                  iconClass=" md:h-[22px] md:w-[22px] 2xl:h-[26] 2xl:w-[26px]"
                />
              </div>
            ) : null}
          </div>

          <div className="cartDetailContainer">
            <h1 className="checkoutTitle">{translate("cart.title")}</h1>
            {isPromotionalMsgTop_Success && promotionalMsgTop && (
              <PromotionBar containerClass={"mb-4 px-5 py-4 md:p-3 lg:p-4"} Content={promotionalMsgTop as string} />
            )}
            <div className="deliveryBox">
              {apiData.cart?.branch && <DeliveryBar data={apiData} lang={lang} isCartMode />}
            </div>
            {/* static message */}
            <InnerAlert />
          </div>

          {!apiData.cart || apiData.cart.cartItems.length <= 0 ? (
            <EmptyCartView lang={lang} />
          ) : (
            <>
              {!isMobileView && <DesktopCartTable cartData={apiData.cart.cartItems} mode="PRODUCT" />}
              {!isMobileView && apiData.cart?.gifts?.length > 0 && (
                <DesktopCartTable cartData={apiData.cart.gifts} mode="GIFT" />
              )}
              {!isMobileView && (apiData.cart.modifiers.length > 0 || shouldAppearAlcohol()) && (
                <div className="border-b border-solid border-primaryDark">
                  <div className="mb-4 flex">
                    {apiData.cart.modifiers &&
                      apiData.cart.modifiers.map((modifier, i) => (
                        <CustomSwitch
                          key={i}
                          type={"add-on"}
                          label={modifier.modifierName}
                          pick={modifiersStatus?.[modifier.skuCode] ?? false}
                          onClick={() => {
                            setModifiersStatus({
                              ...modifiersStatus,
                              [modifier.skuCode]: !modifiersStatus[modifier.skuCode],
                            });
                            editModifiers(modifier.skuCode, !modifiersStatus?.[modifier.skuCode]).then(res => {
                              if (res.status !== 200) {
                                setModifiersStatus({
                                  ...modifiersStatus,
                                  [modifier.skuCode]: !modifiersStatus[modifier.skuCode],
                                });
                              }
                            });
                          }}
                        />
                      ))}
                  </div>
                  {renderAlcoholWarning(`mb-4 w-fit rounded-[10px] bg-primaryGrey px-4 py-4 text-[14px] font-semibold leading-3 rounded-2xl lg:rounded-full 
                  lg:px-6 md:px-7 md:py-3 lg:text-14 md:text-12 md:leading-5 2xl:text-16`)}
                </div>
              )}

              {isMobileView && apiData.cart.modifiers.length > 0 && (
                <div className="mobileSwitchButton [&>*:nth-child(3)]:border-b-[0.2px] [&>*:nth-child(3)]:border-solid [&>*:nth-child(3)]:border-primaryGold4 [&>*:nth-child(6)]:border-b-[0.2px] [&>*:nth-child(6)]:border-solid [&>*:nth-child(6)]:border-primaryGold4 ">
                  {apiData.cart.modifiers.length > 0 &&
                    apiData.cart.modifiers.map((modifier, i) => (
                      <CustomSwitch
                        key={i}
                        type={"add-on"}
                        label={modifier.modifierName}
                        mobile={isMobileView}
                        pick={modifiersStatus?.[modifier.skuCode] ?? false}
                        onClick={() => {
                          setModifiersStatus({
                            ...modifiersStatus,
                            [modifier.skuCode]: !modifiersStatus[modifier.skuCode],
                          });
                          editModifiers(modifier.skuCode, !modifiersStatus?.[modifier.skuCode]).then(res => {
                            if (res.status !== 200) {
                              setModifiersStatus({
                                ...modifiersStatus,
                                [modifier.skuCode]: !modifiersStatus[modifier.skuCode],
                              });
                            }
                          });
                        }}
                      />
                    ))}
                </div>
              )}
              {isMobileView && <MobileCartTable mode="PRODUCT" cartData={apiData.cart.cartItems} lang={lang} />}
              {isMobileView && apiData.cart?.gifts?.length > 0 && (
                <MobileCartTable mode="GIFT" cartData={apiData.cart.gifts} lang={lang} />
              )}
              {shouldAppearAlcohol() && isMobileView && (
                <div className="border-b border-solid border-primaryDark">
                  {renderAlcoholWarning(
                    "flex h-fit w-full justify-center rounded-xl bg-primaryGrey px-7 py-4 text-14 font-medium leading-6 md:hidden mb-4 "
                  )}
                </div>
              )}
              <div className="paymentDetailContainer">
                <PromotionBar
                  containerClass=" md:w-[50%] md:px-4 md:py-3 lg:w-[60%] 2xl:px-5 2xl:py-6"
                  Content={
                    isPromotionalMsgBottom_Success
                      ? (promotionalMsgBottom as string)
                      : "get nothing from API, we would fix it very soon"
                  }
                />
                <div className="paymentDetailRow">
                  <div className="paymentDetailCol1">
                    <p>{translate("cart.itemTotal") + "\u00A0" + "(" + apiData.cart?.itemCount + ")"}</p>
                    <p>${apiData.cart?.summary?.itemTotal}</p>
                  </div>
                  {apiData.cart?.summary?.summaryDiscount &&
                    apiData.cart?.summary?.summaryDiscount?.map((discount, index) => (
                      <div key={index} className="paymentDetailCol2">
                        <p className="w-[80%] md:w-auto md:pr-10 lg:pr-16">{discount.promotionMessage}</p>
                        <p>-${discount.discount}</p>
                      </div>
                    ))}
                  <div className="paymentDetailCol3">
                    <p>{translate("cart.totalAmount")}</p>
                    <p>${apiData.cart?.summary?.totalAmount}</p>
                  </div>
                </div>
              </div>
              <div className=" hidden justify-between md:mb-[45px] md:mt-7 md:flex lg:mb-[60px] lg:mt-8 2xl:mb-[70px] 2xl:mt-10">
                <button className="mr-[1vw] flex w-2/5 items-center justify-center rounded-full border-2 border-solid border-primaryGold md:h-[42px] lg:h-[57px] 2xl:h-[72px]	">
                  <Image
                    src={Icon_left}
                    alt="IconLeft"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="mr-2 h-[1.87vw] w-[1.87vw] lg:h-[1.4vw] lg:w-[1.4vw] "
                  />
                  <p
                    className="md:text-2l text-lg font-medium leading-[38px] text-primaryGold lg:text-xl xl:text-h4"
                    onClick={() => (window.location.href = `/${lang}/${ROUTES.INDEX}`)}
                  >
                    {translate("cart.continueShopping")}
                  </p>
                </button>
                <button
                  className="color-white flex w-3/5 items-center justify-center rounded-full bg-primaryGold md:h-[42px] lg:h-[57px]  2xl:h-[72px] "
                  onClick={() => {
                    onGoToAddOnPage();
                  }}
                >
                  <p className="md:text-2l mr-2 text-lg font-medium leading-[38px] text-white lg:text-xl xl:text-h4">
                    {translate("cart.checkout")}
                  </p>
                  <Image
                    src={Icon_right}
                    alt="IconLeft"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="mr-2 h-[1.87vw] w-[1.87vw] lg:h-[1.4vw] lg:w-[1.4vw]"
                  />
                </button>
              </div>
            </>
          )}

          {apiData.cart && apiData?.cart?.cartItems?.length > 0 && isMobileView && !isSetProductPopupOpen && (
            <SlidePanel
              mode="NORMAL"
              onClick={() => {
                onGoToAddOnPage();
              }}
              lang={lang}
              isEditButtonHidden
            />
          )}
        </div>
      </div>
      {apiData.recommendationList && apiData.recommendationList?.length > 0 && (
        <Recommend recommendData={apiData.recommendationList} recommendId={apiData.recommendationId} mode="NORMAL" />
      )}
    </>
  );
}
