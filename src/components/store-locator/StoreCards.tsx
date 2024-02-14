"use client";
import { Stores } from "@/types/api/apiTypes";
import { StoreCard } from "./StoreCard";
import { useEffect, useMemo, useState } from "react";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { StoreCardsType } from "@/types/componentTypes";
import { LocaleKeysType } from "@/app/i18n";

interface FilterParams {
  region: string;
  district: string;
}

const useFilteredStores = (
  allStores: Stores[],
  values: FilterParams,
  isClickedGPS: boolean,
  lang: LocaleKeysType,
  setFilterdStoreLength: React.Dispatch<React.SetStateAction<number>>,
  setSearchBoxArray: React.Dispatch<React.SetStateAction<Stores[]>>,
  setGpsStoreArray: React.Dispatch<React.SetStateAction<Stores[]>>
) => {
  const [filteredStores, setFilteredStores] = useState<Stores[]>([]);
  const { translate } = useTranslation(lang);

  useEffect(() => {
    let tempFilteredStores = allStores;
    const { region, district } = values;

    if (!isClickedGPS) {
      if (
        region === `${translate("storeLocator.dropdownSelectionArea")}` &&
        district === `${translate("storeLocator.dropdownSelectionDistrict")}`
      ) {
        tempFilteredStores = allStores;
      } else if (region === `${translate("storeLocator.dropdownSelectionArea")}` && district.length === 0) {
        tempFilteredStores = allStores;
      } else if (region.length === 0 && district === `${translate("storeLocator.dropdownSelectionDistrict")}`) {
        tempFilteredStores = allStores;
      } else if (region !== `${translate("storeLocator.dropdownSelectionArea")}` && district.length === 0) {
        tempFilteredStores = allStores.filter(items => items.region.name === region);
      } else if (region.length === 0 && district !== `${translate("storeLocator.dropdownSelectionDistrict")}`) {
        tempFilteredStores = allStores.filter(items => items.district.name === district);
      } else if (
        region !== `${translate("storeLocator.dropdownSelectionArea")}` &&
        district === `${translate("storeLocator.dropdownSelectionDistrict")}`
      ) {
        tempFilteredStores = allStores.filter(items => items.region.name === region);
      } else if (
        region === `${translate("storeLocator.dropdownSelectionArea")}` &&
        district !== `${translate("storeLocator.dropdownSelectionDistrict")}`
      ) {
        tempFilteredStores = allStores.filter(items => items.district.name === district);
      } else if (
        region !== `${translate("storeLocator.dropdownSelectionArea")}` &&
        district !== `${translate("storeLocator.dropdownSelectionDistrict")}`
      ) {
        tempFilteredStores = allStores
          .filter(items => items.region.name === region)
          .filter(items => items.district.name === district);
      }
    }

    if (isClickedGPS) {
      if (tempFilteredStores[0]?.distanceWithGPS !== undefined) {
        tempFilteredStores.sort((a, b) => a.distanceWithGPS! - b.distanceWithGPS!);

        tempFilteredStores.filter(items => items.distanceWithGPS! < 3).length > 0
          ? ((tempFilteredStores = tempFilteredStores.filter(items => items.distanceWithGPS! < 3)),
            setGpsStoreArray(tempFilteredStores))
          : ((tempFilteredStores = tempFilteredStores.slice(0, 3)), setGpsStoreArray(tempFilteredStores));

        if (!region && !district) {
          tempFilteredStores = tempFilteredStores;
        } else if (
          region === `${translate("storeLocator.dropdownSelectionArea")}` &&
          district === `${translate("storeLocator.dropdownSelectionDistrict")}`
        ) {
          tempFilteredStores = tempFilteredStores;
        } else if (region === `${translate("storeLocator.dropdownSelectionArea")}` && district.length === 0) {
          tempFilteredStores = tempFilteredStores;
        } else if (region.length === 0 && district === `${translate("storeLocator.dropdownSelectionDistrict")}`) {
          tempFilteredStores = tempFilteredStores;
        } else if (region !== `${translate("storeLocator.dropdownSelectionArea")}` && district.length === 0) {
          tempFilteredStores = tempFilteredStores.filter(items => items.region.name === region);
        } else if (region.length === 0 && district !== `${translate("storeLocator.dropdownSelectionDistrict")}`) {
          tempFilteredStores = tempFilteredStores.filter(items => items.district.name === district);
        } else if (
          region !== `${translate("storeLocator.dropdownSelectionArea")}` &&
          district === `${translate("storeLocator.dropdownSelectionDistrict")}`
        ) {
          tempFilteredStores = tempFilteredStores.filter(items => items.region.name === region);
        } else if (
          region === `${translate("storeLocator.dropdownSelectionArea")}` &&
          district !== `${translate("storeLocator.dropdownSelectionDistrict")}`
        ) {
          tempFilteredStores = tempFilteredStores.filter(items => items.district.name === district);
        } else if (
          region !== `${translate("storeLocator.dropdownSelectionArea")}` &&
          district !== `${translate("storeLocator.dropdownSelectionDistrict")}`
        ) {
          tempFilteredStores = tempFilteredStores
            .filter(items => items.region.name === region)
            .filter(items => items.district.name === district);
        }
      }
    }

    setFilteredStores(tempFilteredStores);
    setFilterdStoreLength(tempFilteredStores.length);
    setSearchBoxArray(tempFilteredStores);
  }, [allStores, values, isClickedGPS, translate]);

  return filteredStores;
};

export const StoreCards = ({
  values,
  openModal,
  storeLists,
  selectdStore,
  setSelectdStore,
  activeMarker,
  setActiveMarker,
  searchBoxArray,
  setSearchBoxArray,
  isClickedGPS,
  setFilterdStoreLength,
  lang,
  setIsHalfModal,
  setSelectedStoreListFromSelecor,
  dragModalMode,
  snapFromFulltoHalf,
  focusRef,
  setGpsStoreArray,
}: StoreCardsType) => {
  const arrayForSelectedStoreFromBtn: Array<Stores> = [];
  const filteredStores = useFilteredStores(
    storeLists,
    values,
    isClickedGPS,
    lang,
    setFilterdStoreLength,
    setSearchBoxArray,
    setGpsStoreArray as React.Dispatch<React.SetStateAction<Stores[]>>
  );

  const getStoresToDisplay = () => {
    if (selectdStore.id !== 0 && searchBoxArray.length === 0 && !isClickedGPS) {
      arrayForSelectedStoreFromBtn.push(selectdStore);
      return arrayForSelectedStoreFromBtn;
    } else if (openModal && !isClickedGPS) {
      return filteredStores;
    } else if (isClickedGPS) {
      return filteredStores;
    }
    return [];
  };

  const storesToDisplay = getStoresToDisplay();

  useEffect(() => {
    setSelectedStoreListFromSelecor(storesToDisplay);
  }, [storesToDisplay]);

  const setStoreCardHeight = useMemo(() => {
    return dragModalMode === "half" ? "h-[55%]" : "h-[72%]";
  }, [dragModalMode]);

  const sectionStyle = ` no-scrollbarMobile lg:popup-scrollbar 2xl:mr-[-1.5rem] lg:pr-4 overflow-x-hidden overflow-y-scroll  lg:h-auto
    storeCards-transition
`;
  return (
    <>
      <section className={`${sectionStyle} ${setStoreCardHeight}`} ref={focusRef}>
        {storesToDisplay.map(item => (
          <StoreCard
            key={item.id}
            item={item}
            setSelectdStore={setSelectdStore}
            setActiveMarker={setActiveMarker}
            isActive={activeMarker === item.id}
            isClickedGPS={isClickedGPS}
            lang={lang}
            setIsHalfModal={setIsHalfModal}
            snapFromFulltoHalf={snapFromFulltoHalf!}
          />
        ))}
      </section>
    </>
  );
};
