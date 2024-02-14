"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import "@/style/index/indexUsed.scss";
import "@/style/general-information/general-information.scss";
import PrevWhite from "@/images/icons/Icon_PromoPrev-white@3x.png";
import NextWhite from "@/images/icons/Icon_PromoNext-white@3x.png";
import { RootState } from "@/redux/store";
import { useTranslation } from "@/app/i18n/client";
import { CategoryListType } from "@/types/componentTypes";
import { setGlobalGetProductDatetime, setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { getLangFromString } from "@/utils/commonUtils";
import { useWindowSize } from "@/hook/useWindowSize";
import { CategoriesTypes } from "@/types/categorysTypes";
import { ROUTES } from "@/constants";
import CustomButton from "../CustomButton";

export const CategoryList = ({ data }: CategoryListType) => {
  const { selectedMainCategorySlug, selectedSubCategorySlug } = useSelector((state: RootState) => state.categories);

  const sliderRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentRoll, setCurrentRoll] = React.useState(0);
  const [dimDirection, setDimDirection] = React.useState({
    left: true,
    right: false,
  });

  const [isAllCategoriesHover, setIsAllCategoriesHover] = React.useState(false);
  const [isMainCategoriesHover, setIsMainCategoriesHover] = React.useState<number | undefined>(undefined);
  const [buttonPositions, setbuttonPositions] = React.useState<Record<number, { id: number; position: number }> | null>(
    null
  );

  const path = usePathname();
  const dispatch = useDispatch();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const maxWidth = document.querySelector(".wrapper")?.clientWidth;
  const paddingBox = maxWidth !== undefined ? ((width - maxWidth)/2) : 0;

  const enterCategoriesHover = () => {
    setIsAllCategoriesHover(true);
  };

  const exitCategoriesHover = () => {
    setIsAllCategoriesHover(false);
  };

  const enterMainCategoriesHover = (index: number) => {
    setIsMainCategoriesHover(index);
  };

  const exitMainCategoriesHover = () => {
    setIsMainCategoriesHover(undefined);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const lastItem = sliderRef.current.lastElementChild as HTMLDivElement;
      const lastItemPosition = (lastItem.offsetWidth + 12) * sliderRef.current.childElementCount;
      const numRolls = Math.round(lastItemPosition / containerWidth);
      let updateRoll = 0;
      
      

      const dimDirection = (currentPosition: number) => {
        if (currentPosition === 0) {
          return setDimDirection({ left: false, right: true });
        }
        if (currentPosition + containerWidth > lastItem.offsetLeft) {
          return setDimDirection({ left: true, right: false });
        }
        if (currentPosition > containerWidth * numRolls && currentPosition < lastItemPosition) {
          return setDimDirection({ left: true, right: true });
        }
      };

      if (direction === "left") {
        if (currentRoll > 0) {
          updateRoll = currentRoll - 1;
          setCurrentRoll(updateRoll);

          const newScrollLeft = () => {
            if (updateRoll === 0) return 0;
            return containerWidth * updateRoll;
          };

          dimDirection(newScrollLeft());
          sliderRef.current.style.transform = `translateX(-${newScrollLeft()}px)`;
        }
      }

      if (direction === "right") {
        if (currentRoll < numRolls) {
          updateRoll = currentRoll + 1;
          setCurrentRoll(updateRoll);

          const newScrollRight = () => {
            if (lastItemPosition > containerWidth * updateRoll && numRolls > updateRoll && numRolls !== updateRoll) {
              return containerWidth * updateRoll;
            }
            //now padding-x was 40
            // lastitem.offsetLeft is leftside of item
            // lastitem.offsetwidth is whole length of item
            // we should move right end of item + 10% of padding-x
            return lastItemPosition + 40 - (containerWidth - 40) + paddingBox -24;
          };
          dimDirection(newScrollRight());

          sliderRef.current.style.transform = `translateX(-${newScrollRight()}px)`;
        }
      }
    }
  };

  const appearHoverButton = () => {
    if (sliderRef.current === null) return false;
    const childWidth = sliderRef.current.lastElementChild as HTMLDivElement;
    const allButtonWidth =
      childWidth !== null ? (childWidth.offsetWidth + 12) * sliderRef.current.childElementCount : 180 * data.length;
    return width < allButtonWidth ? true : false;
  };

  const onCategoryClick = (type: "MAIN" | "SUB", mainCategoryIndex: number, subCategoryIndex?: number) => {
    dispatch(setLoadingScreenDisplay(true));
    const date = new Date().toISOString();
    dispatch(setGlobalGetProductDatetime(date));
    const categorySlug = data[mainCategoryIndex].slug;

    if (type === "MAIN") {
      window.location.href = `/${lang}/${ROUTES.INDEX}/${categorySlug}`;
    } else if (type === "SUB" && subCategoryIndex !== undefined) {
      const subcategorySlug = data[mainCategoryIndex].subcategories[subCategoryIndex].slug;
      window.location.href = `/${lang}/${ROUTES.INDEX}/${categorySlug}/${subcategorySlug}`;
    }
  };

  const getCategoryIndex = (type: "MAIN" | "SUB") => {
    let index = 0;
    if (type === "MAIN" && selectedMainCategorySlug?.length) {
      index = data.findIndex(category => category.slug === selectedMainCategorySlug);
    }

    if (type === "SUB" && selectedMainCategorySlug?.length && !selectedSubCategorySlug?.length) {
      index = -1;
    }

    if (type === "SUB" && selectedMainCategorySlug?.length && selectedSubCategorySlug?.length) {
      index = data
        .flatMap(category =>
          category?.subcategories?.findIndex(subCategory => subCategory.slug === selectedSubCategorySlug)
        )
        .filter(index => index !== undefined && index > -1)[0];
    }

    return index;
  };

  const MainCategoriesBG = (data: CategoriesTypes, currentIndex: number) => {
    if (width > 768) {
      if (isMainCategoriesHover === currentIndex || currentIndex === getCategoryIndex("MAIN")) {
        return data.desktopHoverIcon;
      } else if (data.desktopHoverIcon === null) {
        return data.desktopIcon;
      } else {
        return data.desktopIcon;
      }
    } else if (width < 768) {
      if (isMainCategoriesHover === currentIndex || currentIndex === getCategoryIndex("MAIN")) {
        return data.mobileHoverIcon;
      } else if (data.desktopHoverIcon === null) {
        return data.mobileIcon;
      } else {
        return data.mobileIcon;
      }
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const positions: Record<number, { id: number; position: number }> = {};
      data.forEach((value, index) => {
        const button = sliderRef.current!.children[index] as HTMLDivElement;
        positions[value.id] = { id: value.id, position: (button.offsetWidth + 8) * index };
      });
      setbuttonPositions(positions);
    }
  }, [data]);

  useEffect(() => {
    if (width < 1024) {
      const currentCategory = sessionStorage.getItem("categoryPosition");
      const sliderContainer = sliderRef.current;
      if (currentCategory && sliderContainer && parseInt(currentCategory) > width) {
        setTimeout(() => {
          sliderContainer.scrollTo({
            left: parseInt(currentCategory),
            behavior: "smooth", // This enables the smooth scrolling animation
          });
        }, 100);
      }
    }
  }, [buttonPositions, width]);

  const handleButtonClick = (id: number) => {
    if (buttonPositions === null) return;
    const positions = buttonPositions[id] ? buttonPositions[id].position : null;
    if (positions !== null && width < 1024) sessionStorage.setItem("categoryPosition", String(positions));
  };

  function setupSubActive(index: number) {
    if (getCategoryIndex("SUB") === index) return true;

    return false;
  }

  const barBody = () => {
    return (
      <div className={"categoryListContainer"}>
        <div
          className="buttonWrapper categoryListBox"
          onMouseEnter={enterCategoriesHover}
          onMouseLeave={exitCategoriesHover}
        >
          {isAllCategoriesHover && width > 768 && appearHoverButton() && (
            <>
              <button className={"bgLinearLeft categoryButtonBox CBLeft "} onClick={() => handleScroll("left")}>
                <div className={`categoryImgBox ${dimDirection.left === false ? "dimArrow" : ""}`}>
                  <div>
                    <Image src={PrevWhite} alt="prev" width={0} height={0} sizes="100vw" />
                  </div>
                </div>
              </button>
              <button className={"bgLinearRight categoryButtonBox CBRight"} onClick={() => handleScroll("right")}>
                <div className={`categoryImgBox ${dimDirection.right === false ? "dimArrow" : ""}`}>
                  <div>
                    <Image src={NextWhite} alt="next" width={0} height={0} sizes="100vw" />
                  </div>
                </div>
              </button>
            </>
          )}
          <div className="categoryMainContent no-scrollbar " ref={containerRef}
          >
            <div
              className={`durantion-300 hiddenScrollBar flex h-full w-auto items-center gap-2 transition-transform md:gap-3 pl-4`}
              ref={sliderRef}
              id={"sliderContainer"}
              style={
                width > 1024
                  ? appearHoverButton() === true
                    ? { justifyContent: "flex-start", width: "max-content",paddingLeft:`${paddingBox-24 }px`}
                    : { justifyContent: "center", width: "100%",}
                  : {paddingLeft:"16px"}
              }
            >
              {data.map((value, index) => {
                return (
                  <div
                    className={`catergoryMainButtonBox ${
                      getCategoryIndex("MAIN") === index ? "bg-primaryGold " : "bg-primaryGold2 "
                    } shadow-categoriesShadow`}
                    key={index}
                    onMouseEnter={() => enterMainCategoriesHover(index)}
                    onMouseLeave={exitMainCategoriesHover}
                  >
                    <button
                      onClick={() => {
                        // setSelectedMainIndex(index);
                        // dispatch(setMainCategorySlugAndId(value.slug));
                        handleButtonClick(value.id);
                        onCategoryClick("MAIN", index);
                      }}
                    >
                      {value.desktopIcon !== null && value.mobileIcon !== null ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${MainCategoriesBG(value, index)}`}
                          alt="MainCategoryBG"
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      ) : (
                        <div
                          className={`${
                            getCategoryIndex("MAIN") === index ? " text-white" : " text-primaryGold"
                          } hover:text-white`}
                        >
                          {value.name}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={"wrapper"}>
          {data?.[getCategoryIndex("MAIN")]?.subcategories?.length >= 0 && (
            <ul className="buttonWrapper subCategoryListContainer">
              <li className="buttonBox">
                <CustomButton
                  containerClass={"px-4 py-3 "}
                  noHover={getCategoryIndex("SUB") === -1}
                  title={translate("tabs.all") as string}
                  textClass="whitespace-nowrap text-12
                  leading-3 md:text-16 md:leading-4"
                  onClick={() => {
                    onCategoryClick("MAIN", getCategoryIndex("MAIN"));
                  }}
                  secondary={!(getCategoryIndex("SUB") === -1)}
                  noBorder={!(getCategoryIndex("SUB") === -1)}
                />
                
              </li>
              {data?.[getCategoryIndex("MAIN")]?.subcategories.map((value, index) => (
                <li className="buttonBox" key={index}>
                  <CustomButton
                    containerClass="px-4 py-3 "
                    noHover={setupSubActive(index)}
                    title={value.name}
                    textClass="whitespace-nowrap text-12
                    leading-3 md:text-16 md:leading-4"
                    onClick={() => {
                      onCategoryClick("SUB", getCategoryIndex("MAIN"), index);
                    }}
                    secondary={!(setupSubActive(index))}
                    noBorder={!(setupSubActive(index))}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return barBody();
};
