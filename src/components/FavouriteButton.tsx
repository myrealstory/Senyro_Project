"use client";

import Image from "next/image";
import lightHeart01 from "@/images/favorGif/Fav(light)@3x.png";
import lightHeart02 from "@/images/favorGif/Fav filled(light)@3x.png";
import darkHeart01 from "@/images/favorGif/Fav(dark)@3x.png";
import darkHeart02 from "@/images/favorGif/Fav filled(dark)@3x.png";

import "../style/component/component.scss";
import { FavouriteType } from "@/types/componentTypes";
import { useAddFavItemMutation, useDeleteFavItemMutation, useGetFavouriteItemListQuery } from "@/redux/api/memberApi";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const FavouriteButton = ({
  containerClasses,
  isFavourite,
  skuCode,
  isMemberFavoriteMode,
  darkmode,
}: FavouriteType) => {
  const router = useRouter();
  const path = usePathname().split("/")[2];
  const [isFavouriteOn, setIsFavouriteOn] = useState(isFavourite);
  const [deleteFavItem] = useDeleteFavItemMutation();
  const [addFavItem] = useAddFavItemMutation();
  const { refetch } = useGetFavouriteItemListQuery();

  const handleDeleteFavorite = (skuCode: string) => {
    deleteFavItem({ skuCode })
      .unwrap()
      .then(res => {
        if (res.statusCode === 200 && path === "index") {
          setIsFavouriteOn(false);
          refetch();
          router.refresh();
        } else if (res.statusCode === 200 && isMemberFavoriteMode) {
          refetch();
          router.refresh();
        } else {
          setIsFavouriteOn(false);
          refetch();
          router.refresh();
        }
      });
  };

  const handleAddFavorite = (skuCode: string) => {
    addFavItem({ skuCode })
      .unwrap()
      .then(res => {
        if (res.statusCode === 200) {
          setIsFavouriteOn(true);
        }
        refetch();
        router.refresh();
      });
  };

  const getTargetImage = () => {
    switch (true) {
      case isFavouriteOn && darkmode:
        return darkHeart02;
      case isFavouriteOn && !darkmode:
        return lightHeart02;
      case !isFavouriteOn && darkmode:
        return darkHeart01;
      default:
      case !isFavouriteOn && !darkmode:
        return lightHeart01;
    }
  };

  const onClick = (skuCode?: string) => {
    if (!skuCode) {
      return;
    }
    if (isFavouriteOn) {
      handleDeleteFavorite(skuCode);
    } else {
      handleAddFavorite(skuCode);
    }
  };

  return (
    <>
      <button className={containerClasses} onClick={() => onClick(skuCode)}>
        <Image
          src={getTargetImage()}
          alt="FavorImage"
          className={"h-full w-full object-contain"}
          width={0}
          height={0}
          sizes="100vw"
        />
      </button>
    </>
  );
};
