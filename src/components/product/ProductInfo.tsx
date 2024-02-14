"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";

import IconUp from "@/../images/icons/Icon_up@3x.png";
import { RootState } from "@/redux/store";
import { ProductDetailType } from "@/types/componentTypes";

import Floating from "./Floating";
import { Slider } from "../index/Slider";
import { FavouriteButton } from "../FavouriteButton";
import { AddToCartButton } from "../AddToCartButton";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useWindowSize } from "@/hook/useWindowSize";
import debounce from "lodash.debounce";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { ROUTES } from "@/constants";
import { ProductPriceType } from "@/types/productTypes";
import { setSourceForAddCart } from "@/redux/slice/generalStateSlice";
import { CookiesKey } from "@/constants/cookies";
import { setCookie, getCookie } from "cookies-next";
import moment from "moment";

export default function ProductInfo({ data, lang, promotionalMsgData, isPromotionalMsgSuccess }: ProductDetailType) {
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const dispatch = useDispatch();
  const getPopFloat = getCookie(CookiesKey.floatingPopBanner);
  const [popFloat, setPopFloat] = useState(getPopFloat);

  const { width } = useWindowSize();

  const isMenuOpen = useSelector((state: RootState) => state.generalState.isMenuOpen);

  const renderCartButton = () => {
    if (width < 1024) {
      return (
        <MobileButtonContainer zIndex={999}>
          <AddToCartButton<"isMainProduct">
            product={data}
            lang={lang}
            mode="FULL_BUTTON"
            containerClasses="cartButton"
            type={"largeSize"}
            source="normal"
          />
        </MobileButtonContainer>
      );
    }

    if (width > 1024) {
      return (
        <AddToCartButton<"isMainProduct">
          product={data}
          lang={lang}
          mode="FULL_BUTTON"
          containerClasses="cartButton md:justify-end"
          type={"largeSize"}
          source="normal"
        />
      );
    }
    return <></>;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const debouncealert = useCallback(
    debounce(() => {
      window.location.href = `/${lang}/${ROUTES.INDEX}`;
    }, 500),
    []
  );

  useEffect(() => {
    dispatch(setSourceForAddCart("normal"));
    if (!data) {
      debouncealert();
    }
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <div className="productInfoContainer">
        <div className="mobileInfoContainer">
          <h3>{data.nameJp}</h3>
          <div className="infoTitleContainer ">
            <h2>{data.name}</h2>
          </div>
          <div className="badgesContainer">
            {data.badges.map((item, index) => (
              <div key={index}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.icon}`}
                  alt={""}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="badgesImage "
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          {isPromotionalMsgSuccess && promotionalMsgData?.message?.length > 0 && (
            <div className="promotionBar">
              {promotionalMsgData ? (
                <p dangerouslySetInnerHTML={{ __html: promotionalMsgData?.message[0] as string }}></p>
              ) : (
                <p>dummy data(is using api data but not yet connect with CMS)</p>
              )}
            </div>
          )}
        </div>
        <div className="sliderContainer">
          <Slider images={data.images} isProduct remark={data.remark} darkmode={data.darkBackground} />

          {isAlreadyLogin && (
            <div className="favorButton">
              <FavouriteButton
                skuCode={data.skuCode}
                isFavourite={data.isFavourite}
                darkmode={data.darkBackground}
                containerClasses="innerClasses"
              />
            </div>
          )}
        </div>
        <div className="desktopInfoContainer">
          <div className="infoTitleContainer">
            <h3>{data.nameJp}</h3>
            <div className="infoTitle">
              <h2>{data.name}</h2>
            </div>
            {/* promotion bar */}
            <div className="badgesContainer">
              {data.badges.map((badge, index) => (
                <div className="badgesBox" key={index}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${badge.icon}`}
                    alt={""}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="badgesImage "
                  />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
          {isPromotionalMsgSuccess && promotionalMsgData?.message?.length > 0 && (
            <div className="promotionBar">
              {promotionalMsgData ? (
                <p className="" dangerouslySetInnerHTML={{ __html: promotionalMsgData?.message[0] as string }}></p>
              ) : (
                <p>dummy data(is using api data but not yet connect with CMS)</p>
              )}
            </div>
          )}
          <ul className="priceBadgesContainer">
            <div
              className={`priceBadgesRow ${
                data.generalPriceBadges && data.memberPriceBadges
                  ? "justify-between"
                  : " justify-center md:justify-start"
              }`}
            >
              {/* generalPriceBadges */}
              <ul className="generalPriceBox">
                {data.generalPriceBadges
                  .reduce((prev, curr) => {
                    // list price should be placed on top
                    const sortedBadges: ProductPriceType[] = [...prev];
                    if (curr.isListPrice) {
                      sortedBadges.unshift(curr);
                    } else {
                      sortedBadges.push(curr);
                    }
                    return sortedBadges;
                  }, [] as ProductPriceType[])
                  .map((item, index) => (
                    <li key={index}>
                      <div className="imageBox">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                          alt={item.type}
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      </div>
                      <span>{`$${item.price}`}</span>
                    </li>
                  ))}
              </ul>
              <ul className="memberPriceBox">
                {data.memberPriceBadges.map((item, index) => (
                  <li key={index}>
                    <div className="imageBox">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                        alt={item.type}
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <span>{`$${item.price}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ul>
          {renderCartButton()}

          <button onClick={scrollToTop} className={`scrollToTopButton ${isMenuOpen ? "" : "md:!z-[1100]"} `}>
            <Image src={IconUp} alt="" />
          </button>
          <div className="descriptionBox" dangerouslySetInnerHTML={{ __html: data.description ?? "" }}></div>
        </div>
      </div>
      {popFloat === true && (
        <Floating
          close={() => {
            setCookie(CookiesKey.floatingPopBanner, "false", {
              expires: moment().add(10, "year").toDate(),
            });
            setPopFloat(false);
          }}
        />
      )}
    </>
  );
}
