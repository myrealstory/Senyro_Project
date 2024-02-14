"use client";

import React, { useState, useEffect } from "react";
import FavIcon from "@/images/icons/Icon_fav-gold@3x.png";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "../CustomButton";
import { useGetFavouriteItemListQuery } from "@/redux/api/memberApi";
import { ProductCard } from "../product/ProductCard";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { ROUTES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SetProductPopup } from "../product/SetProductPopup";
import { usePathname } from "next/navigation";
import { setLoadingScreenDisplay, setSourceForAddCart } from "@/redux/slice/generalStateSlice";

const FavProducts = ({ lang }: { lang: LocaleKeysType }) => {
  const countPerPage = 10;
  const { data: getFavoriteItemListResponse, refetch, isLoading } = useGetFavouriteItemListQuery();
  const { isSetProductPopupOpen } = useSelector((state: RootState) => state.generalState);

  const [totalProductCount, setTotalProductCount] = useState(countPerPage);
  const [isPageReady, setIsPageReady] = useState(false);
  const favPath = usePathname().split("/")[3];
  const dispatch = useDispatch();

  const productList = getFavoriteItemListResponse?.data.favItemList;

  const { translate: t } = useTranslation(lang);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setLoadingScreenDisplay(false));
      setIsPageReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    refetch();
  }, [getFavoriteItemListResponse, refetch]);

  useEffect(() => {
    dispatch(setSourceForAddCart("normal"));
  }, []);

  if (!isPageReady) {
    return <></>;
  }

  return (
    <div className="w-full lg:mt-[23px] lg:h-fit lg:w-full lg:max-w-full lg:rounded-[28px] lg:bg-white lg:pt-7 xl:rounded-[20px] xl:shadow-lg 2xl:pt-0">
      <span className="block pb-[8px] pl-4 text-[12px] leading-4 lg:px-4 xl:text-xl 2xl:pb-[25px] 2xl:pl-8 2xl:pt-[25px]">
        {t("myfav.applyTakeaway")}
      </span>
      <div
        className={`favItemContainer relative my-6 w-full px-5 ${
          productList && productList?.length === 0 ? "" : "lg:mt-[0px]"
        } lg:px-8`}
      >
        {/* product list */}
        {productList && productList?.length === 0 && (
          <div className=" flex flex-col items-center gap-3 pt-[7rem]">
            <Image src={FavIcon} width={0} height={0} alt="Fav Icon" className="h-auto w-[50px] self-center" />
            <Link href={`/${lang}/${ROUTES.INDEX}`} className="m-auto text-[20px] text-primaryGold lg:text-[24px]">
              {t("myfav.noFavProduct")}
            </Link>
          </div>
        )}
        <div className="max-w-full">
          {productList && productList?.length > 0 && (
            <div className="gap-3 lg:grid lg:grid-cols-2">
              {productList?.slice(0, totalProductCount)?.map((value, index) => (
                <ProductCard
                  product={value}
                  key={index}
                  lang={lang}
                  containerClasses={"mb-12 md:mb-[2rem]"}
                  isMemberFavoriteMode
                  path={favPath}
                  id={value.skuCode}
                  source="normal"
                />
              ))}
            </div>
          )}
        </div>

        {/* load all button */}

        {productList && productList?.length > totalProductCount && (
          <div className="loadAllContainer pb-6">
            <CustomButton
              secondary
              containerClass={
                " px-11 py-5 md:px-[40px] md:py-[16px] xl:px-[50px] xl:py-[16px] border border-primaryGold"
              }
              textClass="whitespace-nowrap font-medium leading-6 md:text-18 md:leading-6 xl:text-20 text-[16px] text-primaryGold hover:text-white"
              onClick={() => setTotalProductCount(999)}
              title={t("coupons.loadMore") as string}
            />
          </div>
        )}
        {isSetProductPopupOpen && <SetProductPopup />}
      </div>
    </div>
  );
};

export default FavProducts;
