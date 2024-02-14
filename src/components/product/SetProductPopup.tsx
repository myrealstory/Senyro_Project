"use client";
import React, { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "@/app/i18n/client";
import { getLangFromString, getRouteNameFromPathname } from "@/utils/commonUtils";
import { useAddToCartButton } from "@/hook/useAddToCartButton";

import "../cart/TextEllipsis.css";
import "./Popup.css";
import Mask from "../Mask";
import { AddToCartButton } from "../AddToCartButton";
import {
  setGlobalAlertStatus,
  setIsSetProductPopupOpen,
  setIsSubProductCanAdd,
  setIsSubProductCanMinus,
  setIsSubProductReachMaxium,
  setItemTypeInSet,
} from "@/redux/slice/generalStateSlice";
import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";
import { SubProductType } from "@/types/productTypes";
import CustomButton from "../CustomButton";
import { setSetProductPopupData, cartSliceInitialState } from "@/redux/slice/cartSlice";
import { ROUTES } from "@/constants";

export function SetProductPopup() {
  const isPopupReady = useRef(false);
  const path = usePathname();
  const { secondSlug } = getRouteNameFromPathname(path);
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [isFinishButtonEnable, setIsFinishButtonEnable] = useState(false);

  const generateState = useSelector((state: RootState) => state.generalState);
  const categoriesData = useSelector((state: RootState) => state.categories);
  const { apiData, localData } = useSelector((state: RootState) => state.cart);
  const { isSetProductPopupOpen, isSetProductSelectedBeforeTheFirstTimePopup, isBrandNewSet, cartKey } = useSelector(
    (state: RootState) => state.generalState
  );

  const { setProductData, onSetProductSubmit } = useAddToCartButton({
    lang,
    slugId: generateState.globalSelectedProductSlugId,
    isSetProduct: true,
    refCategoryType: localData.refCategoryType,
    refCategoryTypeId: localData.refCategoryTypeId,
    cartLocalData: localData,
    cartApiData: apiData,
    categoriesData,
    generateState,
    source: "normal",
  });

  const source = useMemo(() => {
    if (secondSlug === ROUTES.CART) {
      return "cart";
    }
    return "normal";
  }, [secondSlug]);

  const submitSetProductToCart = async () => {
    onSetProductSubmit(source, localData.setProductPopupData.cartKey);
  };

  const calculateTotalMandatory = () => {
    return setProductData?.product?.noOfItemInSet ?? 0;
  };

  const totalSelected = useMemo(() => {
    return localData.setProductPopupData.subItems.reduce((prev, curr) => {
      if (curr.skuCode === generateState.globalSelectedProductSkuCode) {
        return prev;
      }
      return curr.quantity + prev;
    }, 0);
  }, [localData]);

  useEffect(() => {
    // edit set product
    if (secondSlug === ROUTES.CART && !isPopupReady.current) {
      const subProductsFromProductDetail = setProductData?.product.subProducts.map(subProduct => {
        return {
          skuCode: subProduct.subProduct.skuCode,
          oosStatus: subProduct.subProduct.oosStatus,
        };
      });

      const validSubProducts =
        apiData.cart?.cartItems
          .flatMap(item => {
            if (item.item.type === "SET" && item.cartKey === cartKey && item.subItems?.length) {
              return item.subItems.flatMap(subItem => {
                const targetProduct = subProductsFromProductDetail?.find(
                  detail => detail.skuCode === subItem.skuCode && !detail.oosStatus
                );
                if (targetProduct) {
                  return {
                    quantity: subItem.quantity,
                    skuCode: targetProduct.skuCode,
                  };
                }
                return {
                  quantity: 0,
                  skuCode: "",
                };
              });
            }

            return {
              quantity: 0,
              skuCode: "",
            };
          })
          .filter(item => item.skuCode !== "") ?? [];

      dispatch(
        setSetProductPopupData({
          ...localData.setProductPopupData,
          subItems: validSubProducts,
        })
      );

      setTimeout(() => {
        isPopupReady.current = true;
      }, 800);
    }
  }, [apiData, setProductData]);

  const updateButtonStatus = () => {
    switch (true) {
      case !localData.setProductPopupData.quantity:
        dispatch(setIsSubProductCanAdd(false));
        dispatch(setIsSubProductCanMinus(false));
        setIsFinishButtonEnable(false);
        break;
      case localData.setProductPopupData.quantity && totalSelected < (setProductData?.product?.noOfItemInSet ?? 1):
        dispatch(setIsSubProductCanAdd(true));
        setIsFinishButtonEnable(false);
        break;
      case localData.setProductPopupData.quantity && totalSelected > (setProductData?.product?.noOfItemInSet ?? 1):
        dispatch(setIsSubProductCanAdd(false));
        dispatch(setIsSubProductCanMinus(true));
        setIsFinishButtonEnable(false);
        break;
      case localData.setProductPopupData.quantity && totalSelected === (setProductData?.product?.noOfItemInSet ?? 1):
        dispatch(setIsSubProductCanAdd(false));
        dispatch(setIsSubProductCanMinus(false));
        setIsFinishButtonEnable(true);
        break;
      default:
        dispatch(setIsSubProductCanAdd(true));
        dispatch(setIsSubProductCanMinus(true));
        setIsFinishButtonEnable(false);
        break;
    }
  };

  useEffect(() => {
    updateButtonStatus();
  }, [totalSelected, localData, setProductData]);

  useEffect(() => {
    if (generateState.itemTypeInSet.length === setProductData?.product?.maxItemTypeInSet) {
      dispatch(setIsSubProductReachMaxium(true));
    } else {
      dispatch(setIsSubProductReachMaxium(false));
    }
  }, [generateState]);

  const calculateTotalPrice = () => {
    if (!localData.setProductPopupData || !setProductData?.product?.subProducts) {
      return 0;
    }
    return (
      localData.setProductPopupData.subItems.reduce((totalPrice, subItem) => {
        const productSubItem = setProductData.product.subProducts?.find(
          item => item.subProduct.skuCode === subItem.skuCode
        );

        if (productSubItem && productSubItem.subProduct.price) {
          return totalPrice + Number(productSubItem.subProduct.price) * subItem.quantity;
        }
        return totalPrice;
      }, 0) * localData.setProductPopupData.quantity
    );
  };

  useEffect(() => {
    if (isSetProductPopupOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isSetProductPopupOpen]);

  const titleContent = () => {
    const minAmount = setProductData?.product?.subProducts?.reduce((prev, curr) => {
      return parseInt(prev.subProduct.price) < parseInt(curr.subProduct.price) ? prev : curr;
    });
    const finalTotal = calculateTotalMandatory();
    const maxType = setProductData?.product?.maxItemTypeInSet;
    return (
      translate("setProductPopup.popMainMessage1") +
      `$${Number(minAmount?.subProduct.price) * (localData.setProductPopupData.quantity || 1)}` +
      translate("setProductPopup.popMainMessage2") +
      finalTotal +
      translate("setProductPopup.popMainMessage3") +
      maxType +
      translate("setProductPopup.popMainMessage4")
    );
  };

  const renderSubProducts = (subProducts: SubProductType[]) => {
    if (width < 1024) {
      return (
        <div className="lg:custom-scrollbar mb-32 flex h-full flex-col justify-between overflow-y-auto pt-6 lg:pt-0">
          <div className="h-full w-full">
            {subProducts.map((item, index) => (
              <ul key={index} className="flex lg:mb-[1.8vw]">
                <li className="lg:w-[10%] xl:w-auto">
                  <div className="h-[61px] w-[61px] overflow-hidden rounded-md lg:h-[3.75rem] lg:w-auto ">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item?.subProduct?.images?.[0]}`}
                      alt=""
                      className="h-full w-full object-cover"
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                </li>
                <li className="mb-8 block w-full pl-4 pt-4">
                  <div className="mb-5">
                    <p className="text-16 leading-5">{item.subProduct.name}</p>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <p className="w-full max-w-[146px] text-center text-18 font-medium leading-6 text-primaryGold">
                      ${item.subProduct.price}
                    </p>
                    <div>
                      <AddToCartButton<"isSubProduct">
                        product={item.subProduct}
                        lang={lang}
                        mode="CALCULATOR"
                        containerClasses="max-w-[120px] max-h-[38px] "
                        source={source}
                      />
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </div>
      );
    }
    if (width >= 1024) {
      return (
        <div className="relative lg:mb-5">
          <div className="custom-scrollbar h-full w-full overflow-y-auto pb-4 lg:max-h-[360px]">
            <table className="w-full">
              <thead className=" w-full">
                <tr
                  className="absolute left-0 top-0 z-40 table
                    h-5
                    w-[99%]
                    bg-MainBG 
                    bg-cover
                     bg-center bg-no-repeat lg:mb-5"
                >
                  <th
                    className="text-left text-[10px] font-normal uppercase leading-5 opacity-40
          
                    lg:w-[10%] lg:pb-4
                    lg:text-13
                    lg:leading-5
                    2xl:text-15
                    "
                  >
                    {translate("setProductPopup.popSubTitle1")}
                  </th>
                  <th className="lg:w-[47%] 2xl:w-[47%]"></th>
                  <th
                    className="w-[10%] text-[10px] font-normal uppercase leading-[20px]  opacity-40
          
                    lg:pb-4
                    lg:text-13
                    lg:leading-4
                    2xl:text-15
                    "
                  >
                    {translate("setProductPopup.popSubTitle2")}
                  </th>
                  <th
                    className="w-[35%] text-[10px] font-normal uppercase
                    leading-[20px] opacity-40
          
                    lg:pb-4
                    lg:text-13
                    lg:leading-4
                    2xl:text-15
                    "
                  >
                    {translate("setProductPopup.popSubTitle3")}
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-[300px] overflow-y-auto pt-5">
                <tr className="h-8"></tr>
                {subProducts.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="w-[10%]">
                        <div className="aspect-square h-auto w-[61px] overflow-hidden rounded-md lg:w-[65px]">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item?.subProduct?.images?.[0]}`}
                            alt=""
                            className="h-full w-full object-cover"
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        </div>
                      </td>
                      <td className="w-[40%]">
                        <div className="pl-[0.93vw]">
                          <p className=" text-13 font-medium leading-8 lg:leading-10 xl:text-[18px]">
                            {item.subProduct.name}
                          </p>
                        </div>
                      </td>
                      <td className="w-[10%]">
                        <p className={"text-center text-13 font-medium  leading-6 text-black xl:text-16"}>
                          +{item.subProduct.price}
                        </p>
                      </td>
                      <td className="w-[30%]">
                        <div className="flex w-full items-center justify-center">
                          <AddToCartButton<"isSubProduct">
                            product={item.subProduct}
                            lang={lang}
                            type={"smallSize"}
                            mode="CALCULATOR"
                            source={source}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="h-10"></tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return <></>;
  };

  const openExitPopup = () => {
    const alertCode = isSetProductSelectedBeforeTheFirstTimePopup ? "pu1" : "g5";
    dispatch(
      setGlobalAlertStatus({
        isGlobalAlertDisplay: true,
        alertTitle: translate(`alertModal.${alertCode}_popup_title`),
        alertContent: translate(`alertModal.${alertCode}_popup_content`),
        leftButtonText: translate(`alertModal.${alertCode}_popup_left_button_text`),
        rightButtonText: translate(`alertModal.${alertCode}_popup_right_button_text`),
        onLeftButtonClick: () => {
          dispatch(setSetProductPopupData(cartSliceInitialState.localData.setProductPopupData));
          dispatch(
            setIsSetProductPopupOpen({
              isSetProductPopupOpen: false,
              isBrandNewSet: false,
              cartKey: "",
            })
          );
          dispatch(setIsSubProductCanAdd(false));
          dispatch(setIsSubProductCanMinus(false));
          dispatch(
            setItemTypeInSet({
              action: "PURGE",
              skuCode: "",
            })
          );
        },
      })
    );
  };

  if (!setProductData || !generateState.isSetProductPopupOpen) {
    return <></>;
  }

  return (
    <Mask closeAnimation={!generateState.isSetProductPopupOpen}>
      <>
        <div
          className={
            "popup fixed left-0 top-0 z-[1099] flex h-full w-full flex-col justify-between overflow-y-hidden rounded-[24px] bg-MainBG p-5 lg:left-1/2 lg:top-1/2 lg:max-h-[750px] lg:max-w-[800px]  lg:-translate-x-1/2 lg:-translate-y-1/2 lg:animate-[swideDown_0.5s_ease-in] lg:overflow-y-hidden  lg:px-20 lg:py-14 2xl:max-h-[800px]"
          }
        >
          <div>
            <div className="flex items-center justify-end">
              <button
                className="btnClose"
                onClick={() => {
                  openExitPopup();
                }}
                style={width > 1024 ? { display: "none" } : { display: "flex" }}
              />
            </div>
            <div className="mx-2 flex items-start justify-between">
              <div className="w-full lg:w-[90%]">
                <h2 className="mb-3 text-xl font-semibold leading-[24xpx] text-primaryGold lg:mb-[9px] lg:mt-[1.3vh] lg:text-h2 lg:leading-[1.66vw] lg:text-primaryDark">
                  {/* {translate("setProductPopup.selectPlatter")} */}
                  {setProductData?.product?.name}
                </h2>
                <p className="mb-3 pr-4 text-14 leading-5 -tracking-[2%] sm:pr-0 lg:mb-6 lg:text-16 lg:leading-7">
                  {titleContent()}
                </p>
              </div>
              <button
                className="btnClose"
                onClick={() => {
                  openExitPopup();
                }}
                style={width < 1024 ? { display: "none" } : { display: "flex", justifyContent: "end" }}
              />
            </div>
            <div className="mx-2 flex items-start space-x-[17px] lg:mb-[3vh] lg:items-center lg:space-x-9">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${setProductData?.product?.images?.[0]}`}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="aspect-square h-auto w-[81px] flex-shrink-0  rounded-lg object-cover lg:w-[90px]"
              />
              <div className="flex w-full flex-col flex-wrap justify-between sm:flex-auto lg:flex-row lg:items-center lg:pr-[1.2vw]">
                <div className="mb-3 w-[60%] lg:mb-0 lg:w-[45%]">
                  <p className="mb-[6px] text-[14px] leading-[16px] opacity-60 lg:mb-[9px] lg:text-base lg:leading-[19px]">
                    {setProductData?.product?.nameJp}
                  </p>
                  <h5 className="text-[20px] leading-9 lg:text-[28px]">{setProductData?.product?.name}</h5>
                </div>
                <AddToCartButton<"isMainProduct">
                  product={setProductData?.product}
                  lang={lang}
                  type={"largeSize"}
                  containerClasses="flex justify-start"
                  mode="CALCULATOR"
                  defaultValue={isBrandNewSet ? 1 : undefined}
                  source={source}
                />
              </div>
            </div>
            <div className="relative">
              <h2 className="btn-dark mt-3 w-max px-4 py-1 text-[12px] font-bold leading-[15px] lg:hidden">
                {translate("setProductPopup.platter")}
              </h2>
              <hr className="absolute top-3 z-[-1] w-full border-dashed border-t-primaryGold lg:hidden" />
            </div>
            {/* render subproduct in setProduct */}
            {setProductData?.product?.subProducts && renderSubProducts(setProductData?.product?.subProducts)}
          </div>
          <div className="absolute bottom-0 left-0 w-full items-end justify-between rounded-t-[24px] bg-white px-4 pb-5 pt-3 lg:relative lg:flex lg:bg-transparent lg:p-0">
            <div className="mb-[18px] flex items-center justify-between lg:flex-col lg:justify-end">
              <div
                className="flex items-center justify-center rounded-full bg-primaryGrey px-3 py-2 text-[14px] leading-4  
              
              lg:mb-2
              lg:text-12
              

              xl:mb-4
              xl:text-15
              "
              >
                {translate("setProductPopup.pick1")}
                <span className="px-1 font-bold leading-[1.125vw]">{calculateTotalMandatory()}</span>
                {translate("setProductPopup.pick2")}
              </div>
              <div className="flex text-20 leading-6 lg:leading-8 xl:text-[24px]">
                <span className="">(</span>
                {lang === "en" ? (
                  <>
                    <p className="self-end px-1 lg:font-bold">{totalSelected}</p>
                    <p>{translate("setProductPopup.selected")}</p>
                  </>
                ) : (
                  <>
                    <p>{translate("setProductPopup.selected")}</p>
                    <p className="self-end px-1 lg:font-bold">{totalSelected}</p>
                    <p>{translate("setProductPopup.pick2")}</p>
                  </>
                )}
                <span className="">)</span>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <CustomButton
                disabled={!isFinishButtonEnable}
                onClick={() => {
                  submitSetProductToCart();
                }}
                containerClass={"w-full py-4 text-18 font-medium leading-6 sm:py-[1.125vw] lg:text-15 lg:leading-8"}
                title={`${translate("SingleProduct.addCart") as string} ${
                  calculateTotalPrice() > 0 ? `(+$${calculateTotalPrice()})` : ""
                }`}
              />
            </div>
          </div>
        </div>
      </>
    </Mask>
  );
}
