import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import "@/style/general-information/StoreLocatorMobileModal.css";
import { CSSTransition } from "react-transition-group";
import { getLangFromString } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";
import GPSClicked from "@/images/icons/navigation.png";
import GPS from "@/images/icons/Icon_nav-hollow.png";
import { Select } from "@/components/forms/Select";
import { districtWithAllDistrict, regionWithAllArea } from "@/constants/registration/select";
import Tooltip from "@/images/icons/Icon_tooltip.png";
import { StoreCards } from "./StoreCards";
import { MapDraggingModalType } from "@/types/componentTypes";

export const StoreLocatorMobileModal = ({
  openModal,
  handleGPSonClick,
  isClickedGPS,
  regionArray,
  handleRegionSelectChange,
  selectVal,
  isClicked,
  isFullModal,
  activeIndex,
  setActiveIndex,
  districtArr,
  handleDistrictSelectChange,
  isSecondSelectDisabled,
  selectdStore,
  storeLists,
  setSelectdStore,
  activeMarker,
  setActiveMarker,
  searchBoxArray,
  setSearchBoxArray,
  setFilterdStoreLength,
  setIsHalfModal,
  setSelectedStoreListFromSelecor,
  setIsFullModal,
  setSelectVal,
  setGpsStoreArray,
  areaArr,
}: MapDraggingModalType) => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const headerHeight = window.innerHeight * 0.49 ?? 400;
  const [dragModalMode, setDragModalMode] = useState<"half" | "full">("half");
  const focusRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<BottomSheetRef>();
  const secondNodeRef = useRef<HTMLDivElement>(null);
  const [isContentDraggable, setIsContentDraggable] = useState(true);

  useEffect(() => {
    setSelectVal && setSelectVal({ region: selectVal?.region as string, district: selectVal?.district as string });
  }, []);

  useEffect(() => {
    if (!isContentDraggable) {
      setTimeout(() => {
        setIsContentDraggable(true);
      }, 400);
    }
  }, [isContentDraggable]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const node = focusRef.current;

    if (node && (node === target || node.contains(target))) {
      event.stopPropagation();
      setIsContentDraggable(false);
    } else {
      setIsContentDraggable(true);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const node = focusRef.current;

    if (node && (node === target || node.contains(target))) {
      event.stopPropagation();
      setIsContentDraggable(false);
    } else {
      setIsContentDraggable(true);
    }
  };

  const sheetContent = (selectVal: { region: string; district: string }) => {
    const snapFromFulltoHalf = () => {
      sheetRef.current && sheetRef.current.snapTo(({ snapPoints }) => Math.min(...snapPoints));
      setDragModalMode("half");
    };

    return (
      <div id="sheetContent" className={"z-10 w-full bg-primaryGold1 py-4  "}>
        <main
          className={` modal-transition fixed bottom-[-40px] left-0 h-full w-full rounded-t-[24px] bg-primaryGold1 
          px-[.5rem] sm:px-[6rem]  md:px-[8rem] `}
        >
          <section className={`${openModal ? "lg:pt-[4.5rem]" : ""}`}>
            <div className="storeUpModalTitleDiv">
              <div>
                <h1 className="">{translate("storeLocator.storeLocation")}</h1>
              </div>
              <button className="" onClick={handleGPSonClick}>
                <div className="storeLocationDesktopGpsBtnContainer">
                  {isClickedGPS ? (
                    <Image
                      src={GPSClicked}
                      width={0}
                      height={0}
                      alt="Search by GPS is on"
                      className="h-auto w-[28px]"
                    />
                  ) : (
                    <Image src={GPS} width={0} height={0} alt="Search by GPS not on" className="h-auto w-[28px]" />
                  )}
                  <span className="">{translate("storeLocator.serchByGPS")}</span>
                </div>
              </button>
            </div>
          </section>

          <div className={`flex flex-col ${openModal ? "" : "mb-3"}`}>
            <form className="storeUpModalSelectContainer">
              <div className="flex w-[50%] ">
                <Select
                  items={isClickedGPS ? areaArr : regionArray}
                  onChangeMap={handleRegionSelectChange}
                  selectVal={selectVal && selectVal.region}
                  isClicked={isClicked}
                  lang={lang}
                  id={regionWithAllArea.id}
                  name={regionWithAllArea.name}
                  isFullModal={isFullModal}
                  isActive={activeIndex === 0}
                  onShow={() => setActiveIndex && setActiveIndex(0)}
                  // isMapRegionDisabled={isClickedGPS}
                  defaultSelectVal={selectVal && selectVal.region}
                  openModal={openModal}
                />
              </div>
              <div className="flex w-[50%] ">
                <Select
                  items={districtArr}
                  onChangeMap={handleDistrictSelectChange}
                  selectVal={selectVal && selectVal.district}
                  isClicked={isClicked}
                  lang={lang}
                  isSecondSelectDisabled={isSecondSelectDisabled}
                  id={districtWithAllDistrict.id}
                  name={districtWithAllDistrict.name}
                  isFullModal={isFullModal}
                  isActive={activeIndex === 1}
                  onShow={() => setActiveIndex && setActiveIndex(1)}
                  defaultSelectVal={selectVal && selectVal.district}
                  openModal={openModal}
                />
              </div>
            </form>
            {openModal && (
              <div className="storeUpModalOnInfoContainer">
                <div className="w-[7%]  pt-[2px]">
                  <Image
                    src={Tooltip}
                    width={30}
                    height={30}
                    alt="The store opening hours may adjusted for holidays or special events. Please call to confirm before your visit."
                    className="h-auto w-[30px] self-center object-contain"
                  />
                </div>
                <span className="w-[93%] text-[12px] leading-5 tracking-[0px] text-primaryGold lg:text-[14px]">
                  {translate("storeLocator.storeOpenDesciption")}
                </span>
              </div>
            )}
          </div>
          {(selectVal && Object.values(selectVal).some(value => value !== "")) ||
          (selectVal && selectdStore.id !== 0) ||
          (selectVal && isClickedGPS) ? (
            <StoreCards
              focusRef={focusRef}
              values={selectVal}
              openModal={openModal as boolean}
              storeLists={storeLists}
              selectdStore={selectdStore}
              setSelectdStore={setSelectdStore}
              activeMarker={activeMarker}
              setActiveMarker={setActiveMarker}
              searchBoxArray={searchBoxArray}
              setSearchBoxArray={setSearchBoxArray}
              isClickedGPS={isClickedGPS as boolean}
              setFilterdStoreLength={setFilterdStoreLength}
              lang={lang}
              setIsHalfModal={setIsHalfModal}
              setSelectedStoreListFromSelecor={setSelectedStoreListFromSelecor}
              selectVal={selectVal}
              dragModalMode={dragModalMode}
              snapFromFulltoHalf={snapFromFulltoHalf}
              setGpsStoreArray={setGpsStoreArray}
            />
          ) : (
            ""
          )}
        </main>
      </div>
    );
  };

  const defaultRender = () => {
    return (
      <BottomSheet
        className="relative z-[998]"
        open={true}
        blocking={false}
        scrollLocking={false}
        skipInitialTransition
        expandOnContentDrag={isContentDraggable}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        ref={ref => {
          if (ref) {
            sheetRef.current = ref;
          }
        }}
        initialFocusRef={focusRef}
        defaultSnap={() => headerHeight}
        snapPoints={({ maxHeight }: { maxHeight: number }) => {
          const lowerHeight = Math.round(maxHeight * 0.49);
          const upperHeight = Math.round(maxHeight * 0.89);
          return [headerHeight, lowerHeight, upperHeight];
        }}
        onSpringEnd={async event => {
          if (event.type === "SNAP" && event.source === "dragging") {
            if (sheetRef?.current && sheetRef?.current?.height > window.innerHeight * 0.5) {
              setIsFullModal && setIsFullModal(true);
              setIsHalfModal(false);
              setDragModalMode("full");
              // console.log("swipe up");
            } else {
              setIsFullModal && setIsFullModal(false);
              setIsHalfModal(true);
              setDragModalMode("half");
              // console.log("swipe down");
            }
          }
        }}
      >
        <CSSTransition
          in={true}
          nodeRef={secondNodeRef}
          timeout={5}
          classNames="fade"
          unmountOnExit
          onEnter={() => null}
          onExited={() => null}
        >
          <div ref={secondNodeRef}>{sheetContent(selectVal as { region: string; district: string })}</div>
        </CSSTransition>
      </BottomSheet>
    );
  };

  return defaultRender();
};
