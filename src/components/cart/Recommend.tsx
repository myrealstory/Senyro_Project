"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { RecommendType } from "@/types/componentTypes";
import { getLangFromString, getRouteNameFromPathname } from "@/utils/commonUtils";
import { useProgressCalculate } from "@/components/product/scrollUtils";

import "../../style/component/component.scss";
import { ProductCard } from "../product/ProductCard";
import { CustomScrollBar } from "../CustomScrollBar";
import { useTranslation } from "@/app/i18n/client";
import { ROUTES } from "@/constants";

export default function Recommend({ recommendData, recommendId, mode }: RecommendType) {
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const { secondSlug, thirdSlug } = getRouteNameFromPathname(path);
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  // useProgressCalulate is a customize Hook for calculating by div only ref
  // and return progress as % for ProgressBar component
  // it includes that DIV with ref import horizontal scroll effect
  // and disable normal scroll page effect.
  // once mouse above that div will active useProgressCalulate
  const { progress, isHovering } = useProgressCalculate({ Ref: containerRef, activeWheel: false });
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 初始化視窗寬度

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showScrollBar = () => {
    if (mode === "ADD-ON" && recommendData) {
      if (recommendData.length > 1) return true;
      return false;
    }
    if (mode === "NORMAL" && recommendData) {
      if (windowWidth > 1300) return recommendData.length > 4 ? true : false;
      if (windowWidth < 1300 && windowWidth > 1024) return recommendData.length > 3 ? true : false;
      if (windowWidth < 1024 && windowWidth > 768) return recommendData.length > 2 ? true : false;
    }
    return false;
  };

  // const getHeightWhenAppear = useMemo(() => {
  //   if(width > 768 ) return 24;
  //   if (isAppear) {
  //     return 240;
  //   } else {
  //     return 120;
  //   }
  // }, [isAppear]);

  useEffect(() => {
    const handleMouseEnter = () => {
      isHovering.current = true;
    };
    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    const div = containerRef.current;
    if (div) {
      div.addEventListener("mouseenter", handleMouseEnter);
      div.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      div!.removeEventListener("mouseenter", handleMouseEnter);
      div!.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, isHovering]);

  return (
    <div className="recommendContainer">
      <div
        className={`recommendRow ${
          mode === "ADD-ON"
            ? ""
            : "bg-MainBG before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-white40 before:bg-cover before:bg-center before:content-['']"
        }`}
      >
        {mode === "NORMAL" && <h3>{translate("SingleProduct.youMayAlsoLike")}</h3>}
        <CustomScrollBar
          currentX={progress}
          width={251}
          scrollBarWidth={30}
          scrollRef={containerRef}
          showScrollBar={showScrollBar()}
          buttonTap
          height={4}
          currentY={180}
          itemAmount={recommendData.length ?? 4}
          containerClasses={`${secondSlug !== "index" && thirdSlug !== "add-on" ? "pb-[250px]" : ""} md:pb-0`}
          renderMode={mode}
        >
          <div
            className={`scrollbarPattern recommendCustomContainer ${
              recommendData && recommendData.length > 1 ? "" : " justify-center"
            }`}
            ref={containerRef}
          >
            <div className={"recommendCustomRow"}>
              {recommendData?.map((value, index) => (
                <ProductCard
                  isHorizontalMode={true}
                  product={value}
                  key={index}
                  lang={lang}
                  refCategoryType={mode === "ADD-ON" ? "ADD_ON" : "RECOMMENDATION"}
                  isAddOnMode={mode === "ADD-ON" ? true : false}
                  refCategoryTypeId={mode === "ADD-ON" ? value.addonCampaignId : recommendId}
                  containerClasses={mode === "ADD-ON" ? "w-[279px]" : ""}
                  id={value.skuCode}
                  source={thirdSlug === ROUTES.ADD_ON ? "addon" : secondSlug === ROUTES.CART ? "cart" : "normal"}
                />
              ))}
            </div>
          </div>
        </CustomScrollBar>
        <p className="hidden">{windowWidth}</p>
      </div>
    </div>
  );
}
