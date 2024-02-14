"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";
import { useTranslation } from "@/app/i18n/client";
import { IndexContentType } from "@/types/pageTypes";
import { SubCategoriesTypes } from "@/types/categorysTypes";
import { setRefCategoryData } from "@/redux/slice/cartSlice";
import { getProductApiInputParams } from "@/utils/commonUtils";
import { useGetProductListRequestState } from "@/redux/api/productApi";
import { getCategories, setMainCategorySlugAndId, setSubCategorySlugAndId } from "@/redux/slice/categoriesSlice";

import "../../style/index/indexUsed.scss";
import Recommend from "../cart/Recommend";
import CustomButton from "../CustomButton";
import { ProductCard } from "../product/ProductCard";
import { CategoryList } from "./CategoryList";
import {
  setLoadingScreenDisplay,
  setProductArchorId,
  setProductInCategory,
  setSourceForAddCart,
} from "@/redux/slice/generalStateSlice";
import { PromotionMessage } from "./PromotionMessage";
import { DeliveryBar } from "../DeliveryBar";
import { deleteCookie, getCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { ENDPOINTS } from "@/constants/endpoints";

export const IndexContent = ({
  data: { productList, recommendation, categories, redommendationId },
  lang,
  mainCategorySlug,
  subCategorySlug,
}: IndexContentType) => {
  const countPerPage = 9;
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  const [isPageReady, setIsPageReady] = useState(false);
  const [totalProductCount, setTotalProductCount] = useState(countPerPage);

  const categoryRef = useRef<HTMLDivElement | null>(null);

  const { apiData } = useSelector((state: RootState) => state.cart);
  const { globalGetProductDatetime, productArchorId } = useSelector((state: RootState) => state.generalState);
  const { selectedMainCategorySlug, selectedSubCategorySlug } = useSelector((state: RootState) => state.categories);
  const [getMessage, setGetMesssage] = useState<{ message: string[] }>({ message: [] });
  const getRequestCommonHeader = () => {
    const deviceId = getCookie(CookiesKey.deviceId);
    const headers = new Headers();
    headers.append("touch-point", "web");
    headers.append("language", lang);
    headers.append("device-id", deviceId as string);

    return headers;
  };

  const { data: getProductListApiResponseData } = useGetProductListRequestState(
    getProductApiInputParams(apiData, {
      branch: apiData.cart?.branch?.branchCode,
      category: selectedMainCategorySlug?.length ? selectedMainCategorySlug : undefined,
      subcategory: selectedSubCategorySlug?.length ? selectedSubCategorySlug : undefined,
      date: globalGetProductDatetime?.length ? globalGetProductDatetime : undefined,
      lang,
    })
  );

  productList =
    getProductListApiResponseData && getProductListApiResponseData.data.productList
      ? getProductListApiResponseData.data.productList
      : productList;

  useEffect(() => {
    const int = setInterval(() => {
      const productArchorIdFromCookie = getCookie(CookiesKey.productArchorId) as string;
      if (productArchorIdFromCookie && productArchorIdFromCookie?.length) {
        dispatch(setProductArchorId(productArchorIdFromCookie));
        clearInterval(int);
        deleteCookie(CookiesKey.productArchorId);
      }
    }, 500);

    return () => {
      int && clearInterval(int);
    };
  }, []);

  useEffect(() => {
    if (width > 0) {
      setTimeout(() => {
        setIsPageReady(true);
        dispatch(setLoadingScreenDisplay(false));
        dispatch(setProductInCategory(productList.length));
      }, 300);
    }
  }, [width]);

  useEffect(() => {
    dispatch(setSourceForAddCart("normal"));

    if (categories && categories?.length) {
      dispatch(getCategories(categories));
      const mainCategory = categories.find(category => category.slug === decodeURIComponent(mainCategorySlug ?? ""));
      let subCategory: SubCategoriesTypes | undefined = undefined;
      if (mainCategorySlug && mainCategory) {
        dispatch(
          setMainCategorySlugAndId({
            slug: decodeURIComponent(mainCategorySlug),
            id: mainCategory.id,
          })
        );
        dispatch(
          setRefCategoryData({
            refCategoryType: "CATEGORY",
            refCategoryTypeId: mainCategory.id,
          })
        );
      } else {
        // set the fist main category slug as the default main category slug
        dispatch(
          setMainCategorySlugAndId({
            slug: categories[0].slug,
            id: categories[0].id,
          })
        );
        dispatch(
          setRefCategoryData({
            refCategoryType: "CATEGORY",
            refCategoryTypeId: categories[0].id,
          })
        );
      }
      if (
        mainCategorySlug &&
        subCategorySlug &&
        (subCategory = mainCategory?.subcategories?.find(
          category => category.slug === decodeURIComponent(subCategorySlug)
        ))
      ) {
        dispatch(
          setSubCategorySlugAndId({
            slug: subCategory.slug,
            id: subCategory.id,
          })
        );
        dispatch(
          setRefCategoryData({
            refCategoryType: "SUBCATEGORY",
            refCategoryTypeId: subCategory.id,
          })
        );
      }
    }
  }, []);

  useEffect(() => {
    async function getPromotionMessage() {
      const url = new URL(ENDPOINTS.GET_PROMOTIONAL_MESSAGE_PLP);
      if (mainCategorySlug !== "") url.searchParams.append("category_slug", selectedMainCategorySlug);
      if (subCategorySlug !== "") url.searchParams.append("sub_category_slug", selectedSubCategorySlug);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: getRequestCommonHeader(),
        });

        if (response.status === 200) {
          const data = await response.json();
          setGetMesssage(data.data);
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getPromotionMessage();
  }, [lang, selectedMainCategorySlug, selectedSubCategorySlug]);

  useEffect(() => {
    if (productArchorId?.length) {
      const targetElement = document.getElementById(productArchorId);

      if (targetElement) {
        const factor = width < 768 ? 300 : 150;
        setTimeout(() => {
          window.scrollTo({ top: targetElement.getBoundingClientRect().height - factor, behavior: "smooth" });
        }, 500);
      }
    }
  }, [productArchorId]);

  if (!isPageReady) {
    return <></>;
  }

  return (
    <>
      <div className={"relative w-full "}>
        {width > 1024 && apiData.cart?.branch?.address !== undefined && (
          <DeliveryBar miniMode data={apiData} lang={lang} isCartMode={false} />
        )}
        {/* category */}
        <div
          className={"-h-full sticky left-0 top-16 z-[2] w-full bg-MainBG bg-repeat-x md:top-[67px]"}
          ref={categoryRef}
        >
          <CategoryList data={categories} />
        </div>

        {/* yellow content */}
        <PromotionMessage getMessage={getMessage} center={true} />

        {/* product list */}
        <div className={"wrapper"}>
          <div className={"productCartList"}>
            {productList?.slice(0, totalProductCount)?.map((value, index) => (
              <ProductCard
                id={value.skuCode}
                product={value}
                key={index}
                lang={lang}
                containerClasses={"mb-12 md:mb-[2rem]"}
                source="normal"
                isPLP={true}
              />
            ))}
          </div>
        </div>

        {/* load all button */}
        {productList && productList?.length > totalProductCount && (
          <div className="loadAllContainer flex flex-wrap justify-center gap-4">
            <CustomButton
              containerClass={"customButton_Container"}
              textClass="customButton_Text"
              onClick={() => setTotalProductCount(999)}
              title={translate("tabs.loadAll") as string}
            />
          </div>
        )}

        {/* recommendation list */}
        <div>
          {recommendation && recommendation.length > 0 && (
            <Recommend recommendData={recommendation} recommendId={redommendationId} mode="NORMAL" />
          )}
        </div>
      </div>
    </>
  );
};
