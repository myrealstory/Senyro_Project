"use client";

import React, { useState } from "react";
import { districtWithAllDistrict, regionWithAllArea } from "@/constants/registration/select";
import { StoreCards } from "./StoreCards";
import Tooltip from "@/images/icons/Icon_tooltip.png";
import GPS from "@/images/icons/Icon_nav-hollow.png";
import GPSClicked from "@/images/icons/navigation.png";
import Image from "next/image";
import { Stores } from "@/types/api/apiTypes";
import { emptyStore } from "@/constants/store/emptyStore";
import { Select } from "@/components/forms/Select";
import { calculateDistance } from "@/components/googleMap/mapUtils";
import mobileGPS from "@/images/icons/Navigation OFF@3x.png";
import mobileGPSON from "@/images/icons/Navigation ON@3x.png";
import { useGetRegionListQuery } from "@/redux/api/branchApi";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { useWindowSize } from "@/hook/useWindowSize";
import { StoreUpModalType } from "@/types/componentTypes";
import { StoreLocatorMobileModal } from "@/components/store-locator/StoreLocatorMobileModal";

export const StoreUpModal = ({
  lang,
  storeLists,
  selectdStore,
  setSelectdStore,
  activeMarker,
  setActiveMarker,
  searchBoxArray,
  setSearchBoxArray,
  setDefaultProps,
  setIsClickedGPS,
  setMyLocationByGPS,
  isClickedGPS,
  setIsDistictSelected,
  setStoreListsState,
}: StoreUpModalType) => {
  const { width } = useWindowSize();
  const [selectVal, setSelectVal] = useState({ region: "", district: "" });
  const [openModal, setOpenModal] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const [isSecondSelectDisabled, setIsSecondSelectDisabled] = useState<boolean>(true);
  const [filterdStoreLength, setFilterdStoreLength] = useState<number>(0);
  const [storeCardModalLength, setStoreCardModalLength] = useState<string>("");
  const [areaArr, setAreaArr] = useState<string[]>([]);
  const [districtArr, setDistrictArr] = useState<string[]>([]);
  const { data: regionList } = useGetRegionListQuery({ lang });
  const { translate } = useTranslation(lang);
  const [isFullModal, setIsFullModal] = useState<boolean>(false);
  const [isHalfModal, setIsHalfModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStoreListFromSelecor, setSelectedStoreListFromSelecor] = useState<Stores[]>([]);
  const [gpsStoreArray, setGpsStoreArray] = useState<Stores[]>([]);

  const regionArray: string[] = [`${translate("storeLocator.dropdownSelectionArea")}`];
  regionList?.data.map(item => {
    regionArray.push(item.name);
  });

  React.useEffect(() => {
    if (selectVal.region === `${translate("storeLocator.dropdownSelectionArea")}`) {
      const array4 = regionList?.data
        .map(item => item.districts)
        .flat()
        .map(item2 => item2.name) as string[];
      array4?.unshift(`${translate("storeLocator.dropdownSelectionDistrict")}`);
      setDistrictArr(array4);
    }
    selectdStore.id === 0 && handleDistrictSelectChange("district", "");
  }, [selectVal.region]);

  React.useEffect(() => {
    if (isHalfModal && selectdStore.id === 0 && filterdStoreLength === 0) {
      setStoreCardModalLength("lg:h-[280px] ");
      setIsFullModal(false);
    } else if (isHalfModal && selectdStore.id === 0 && filterdStoreLength !== 0) {
      setStoreCardModalLength("lg:h-[520px]  2xl:pb-10 ");
      setIsFullModal(false);
    } else if (isHalfModal && selectdStore.id !== 0) {
      setStoreCardModalLength("lg:h-[520px]  2xl:pb-10 ");
      setIsFullModal(false);
    } else if (filterdStoreLength === 0 && selectdStore.id === 0 && isClickedGPS !== true) {
      setStoreCardModalLength("lg:h-[280px] ");
      setIsFullModal(false);
    } else if (isClickedGPS && filterdStoreLength === 0) {
      setStoreCardModalLength(" lg:h-[280px] ");
      setIsFullModal(false);
    } else if (filterdStoreLength === 1 && selectdStore.id === 0) {
      setStoreCardModalLength("lg:h-[520px] ");
      setIsFullModal(false);
      setIsHalfModal(true);
    } else if (!selectVal.region && selectdStore.id !== 0 && !isClickedGPS && !isHalfModal) {
      setStoreCardModalLength("lg:h-[520px] 2xl:pb-10   ");
      setIsFullModal(true);
      setOpenModal(true);
      setIsHalfModal(false);
    } else if (selectdStore.id !== 0 && !isHalfModal) {
      setStoreCardModalLength("lg:h-[520px] 2xl:pb-10  ");
      setIsFullModal(true);
    } else if (selectdStore.id !== 0 && isHalfModal) {
      setStoreCardModalLength("lg:h-[520px] ");
      setIsFullModal(false);
      setIsHalfModal(true);
    } else if (isClickedGPS && !isHalfModal) {
      setStoreCardModalLength("lg:h-[60%] 2xl:pb-10 ");
      setIsFullModal(true);
    } else if (isClickedGPS && filterdStoreLength === 1) {
      setStoreCardModalLength("lg:h-[520px] ");
      setIsFullModal(false);
      setIsHalfModal(true);
    } else if (isClickedGPS && filterdStoreLength > 1) {
      setStoreCardModalLength("lg:h-[60%] 2xl:pb-10");
      setIsHalfModal(true);
      setIsFullModal(false);
    } else {
      setStoreCardModalLength("lg:h-[60%] 2xl:pb-10");
      setIsFullModal(true);
    }
  }, [filterdStoreLength, isClickedGPS, selectdStore, isHalfModal, isFullModal]);

  const handleRegionSelectChange = (name: string, str: string) => {
    const selectedValue = str;
    setIsSecondSelectDisabled(selectedValue === "");
    setSelectVal({
      ...selectVal,
      [name]: selectedValue,
    });
    setSelectdStore(emptyStore);
    setActiveMarker(null);
  };

  const handleDistrictSelectChange = (name: string, str: string) => {
    const newValues = str;
    setSelectVal({
      ...selectVal,
      [name]: newValues,
    });

    setSelectdStore(emptyStore);
    setActiveMarker(null);
  };

  React.useEffect(() => {
    setIsSecondSelectDisabled(selectVal.region === "");
    selectVal.district && setIsDistictSelected(true);
    !selectVal.district && setIsDistictSelected(false);
    !selectVal.region && !selectVal.district && setIsHalfModal(true);
  }, [selectVal]);

  const handleOpenModal = () => {
    if (!selectVal.region && !selectVal.district && !isClickedGPS && !selectdStore.id) {
      return null;
    }

    if (selectVal.region || isClickedGPS || selectdStore.id) {
      setOpenModal(true);
      if (!isHalfModal) {
        setIsHalfModal(true);
        setIsFullModal(false);
      }
      if (isHalfModal) {
        setIsHalfModal(false);
      }
    }
  };

  React.useEffect(() => {
    const hasValues = Object.values(selectVal).some(value => value !== "");
    const hasClickMarker = selectdStore.id !== 0;
    if (hasValues || hasClickMarker || isClickedGPS) {
      setOpenModal(true);
    }
  }, [selectVal, selectdStore]);

  React.useEffect(() => {
    const hasClickMarker = selectdStore.id !== 0;
    if (hasClickMarker) {
      setIsClicked(true);
    }
  }, [selectdStore]);

  React.useEffect(() => {
    if (!isClickedGPS) {
      let arraySelect = selectedStoreListFromSelecor.map(item => item.district.name);
      arraySelect?.unshift(`${translate("storeLocator.dropdownSelectionDistrict")}`);
      arraySelect = Array.from(new Set(arraySelect));
      selectVal.region && !selectVal.district && setDistrictArr(arraySelect);
    }
  }, [selectedStoreListFromSelecor, isClickedGPS]);

  React.useEffect(() => {
    if (isClickedGPS) {
      let arrayGpsRegion = gpsStoreArray.map(item => item.region.name);
      arrayGpsRegion?.unshift(`${translate("storeLocator.dropdownSelectionArea")}`);
      arrayGpsRegion = Array.from(new Set(arrayGpsRegion));
      setAreaArr(arrayGpsRegion);

      let arraySelect = selectedStoreListFromSelecor.map(item => item.district.name);
      arraySelect?.unshift(`${translate("storeLocator.dropdownSelectionDistrict")}`);
      arraySelect = Array.from(new Set(arraySelect));
      selectVal.region && !selectVal.district && setDistrictArr(arraySelect);
    }
  }, [selectedStoreListFromSelecor, isClickedGPS]);

  const GetAllDistanceBetweenMyLocationAndMarkers = (myLocationByGPSLat: number, myLocationByGPSLng: number) => {
    const updatedStoreLists = storeLists.map(item => {
      const distance = calculateDistance(myLocationByGPSLat, myLocationByGPSLng, item.lat, item.long);

      return {
        ...item,
        distanceWithGPS: distance,
      };
    });
    setStoreListsState(updatedStoreLists);
  };

  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setDefaultProps({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            zoom: 12.88,
          });
          setMyLocationByGPS({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          GetAllDistanceBetweenMyLocationAndMarkers(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.log(error);
        }
      );
    }
  };

  const toggleGPSMode = () => {
    setIsClickedGPS(!isClickedGPS);
  };

  const handleGPSonClick = () => {
    isClickedGPS
      ? (setOpenModal(false),
        toggleGPSMode(),
        setIsHalfModal(false),
        setIsFullModal(false),
        setDefaultProps({
          center: {
            lat: 22.3061859,
            lng: 114.151735,
          },
          zoom: 12.88,
        }),
        setSearchBoxArray([]),
        setSelectVal({
          region: "",
          district: "",
        }),
        setSelectdStore(emptyStore),
        setFilterdStoreLength(0),
        setActiveMarker(null),
        setIsHalfModal(false),
        setIsFullModal(false))
      : (getPosition(),
        toggleGPSMode(),
        setOpenModal(true),
        setIsHalfModal(true),
        setIsFullModal(false),
        setSelectVal({
          region: "",
          district: "",
        }));
  };

  return (
    <>
      <div className="storeLocationMobileGpsBtnContainer">
        <button className="storeLocationMobileGpsBtn" onClick={handleGPSonClick}>
          {isClickedGPS ? (
            <div>
              <Image src={mobileGPSON} alt="mobileGPSon" width={52} height={52} className="storeLocationMobileGpsBtn" />
            </div>
          ) : (
            <div>
              <Image src={mobileGPS} alt="mobileGPS" width={52} height={52} className="storeLocationMobileGpsBtn" />
            </div>
          )}
        </button>
      </div>

      {width < 1024 && openModal && (
        <StoreLocatorMobileModal
          openModal={openModal}
          handleOpenModal={handleOpenModal}
          filterdStoreLength={filterdStoreLength}
          width={width}
          handleGPSonClick={handleGPSonClick}
          isClickedGPS={isClickedGPS}
          regionArray={regionArray}
          handleRegionSelectChange={handleRegionSelectChange}
          selectVal={selectVal}
          isClicked={isClicked}
          isFullModal={isFullModal}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          districtArr={districtArr}
          handleDistrictSelectChange={handleDistrictSelectChange}
          isSecondSelectDisabled={isSecondSelectDisabled}
          selectdStore={selectdStore}
          storeLists={storeLists}
          setSelectdStore={setSelectdStore}
          activeMarker={activeMarker}
          setActiveMarker={setActiveMarker}
          searchBoxArray={searchBoxArray}
          setSearchBoxArray={setSearchBoxArray}
          setFilterdStoreLength={setFilterdStoreLength}
          setIsHalfModal={setIsHalfModal}
          setSelectedStoreListFromSelecor={setSelectedStoreListFromSelecor}
          setIsFullModal={setIsFullModal}
          setSelectVal={setSelectVal}
          setGpsStoreArray={setGpsStoreArray}
          areaArr={areaArr}
        />
      )}

      <main
        className={` ${
          openModal
            ? `lg:pb-7 2xl:gap-0  ${storeCardModalLength} lg:justify-start`
            : ` pb-2 lg:h-[192px] lg:pb-0  ${
                filterdStoreLength !== 0 ? "h-[350px] lg:justify-center" : "h-[130px] lg:justify-center"
              }`
        } storeUpModalMainContainer  modal-transition z-10 shadow-mapModalShadow ${
          width >= 1024 || (width < 1024 && !openModal) ? "block lg:flex" : "hidden"
        }`}
        style={{ touchAction: "none" }}
      >
        <section className={`${openModal ? "lg:pt-[2.75rem]" : ""}`} style={{ touchAction: "none" }}>
          <div className="storeUpModalTitleDiv">
            <div>
              <h1 className="">{translate("storeLocator.storeLocation")}</h1>
            </div>
            <button className="" onClick={handleGPSonClick}>
              <div className="storeLocationDesktopGpsBtnContainer">
                {isClickedGPS ? (
                  <Image src={GPSClicked} width={0} height={0} alt="Search by GPS is on" className="h-auto w-[20px]" />
                ) : (
                  <Image src={GPS} width={0} height={0} alt="Search by GPS not on" className="h-auto w-[20px]" />
                )}
                {isClickedGPS ? (
                  <span className="">{translate("storeLocator.searchByGpsIsOn")}</span>
                ) : (
                  <span className="">{translate("storeLocator.serchByGPS")}</span>
                )}
              </div>
            </button>
          </div>
        </section>
        <div className="storeUpModalMobileToggleContainer" onClick={handleOpenModal} style={{ touchAction: "none" }}>
          <button className=""></button>
        </div>
        <div className={`flex flex-col ${openModal ? "" : "mb-3"}`} style={{ touchAction: "none" }}>
          <form className="storeUpModalSelectContainer">
            <div className="flex w-[50%] ">
              <Select
                items={isClickedGPS ? areaArr : regionArray}
                onChangeMap={handleRegionSelectChange}
                selectVal={selectVal.region}
                isClicked={isClicked}
                lang={lang}
                id={regionWithAllArea.id}
                name={regionWithAllArea.name}
                isFullModal={isFullModal}
                isActive={activeIndex === 0}
                onShow={() => setActiveIndex(0)}
                // isMapRegionDisabled={isClickedGPS}
                openModal={openModal}
              />
            </div>
            <div className="flex w-[50%] ">
              <Select
                items={districtArr}
                onChangeMap={handleDistrictSelectChange}
                selectVal={selectVal.district}
                isClicked={isClicked}
                lang={lang}
                isSecondSelectDisabled={isSecondSelectDisabled}
                id={districtWithAllDistrict.id}
                name={districtWithAllDistrict.name}
                isFullModal={isFullModal}
                isActive={activeIndex === 1}
                onShow={() => setActiveIndex(1)}
                openModal={openModal}
              />
            </div>
          </form>
          {openModal && (
            <div className="storeUpModalOnInfoContainer" style={{ touchAction: "none" }}>
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

        {Object.values(selectVal).some(value => value !== "") || selectdStore.id !== 0 || isClickedGPS ? (
          <StoreCards
            values={selectVal}
            openModal={openModal}
            storeLists={storeLists}
            selectdStore={selectdStore}
            setSelectdStore={setSelectdStore}
            activeMarker={activeMarker}
            setActiveMarker={setActiveMarker}
            searchBoxArray={searchBoxArray}
            setSearchBoxArray={setSearchBoxArray}
            isClickedGPS={isClickedGPS}
            setFilterdStoreLength={setFilterdStoreLength}
            lang={lang}
            setIsHalfModal={setIsHalfModal}
            setSelectedStoreListFromSelecor={setSelectedStoreListFromSelecor}
            selectVal={selectVal}
            setGpsStoreArray={setGpsStoreArray}
          />
        ) : (
          ""
        )}
      </main>
    </>
  );
};
