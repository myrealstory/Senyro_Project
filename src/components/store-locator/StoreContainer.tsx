"use client";

import { Stores } from "@/types/api/apiTypes";
import { MapContainer } from "../googleMap/MapContainer";
import { StoreUpModal } from "./StoreUpModal";
import { useEffect, useState } from "react";
import { emptyStore } from "@/constants/store/emptyStore";
import { LocaleKeysType } from "@/app/i18n";
import { useDispatch } from "react-redux";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

export const StoreContainer = ({ lang, storeLists }: { lang: LocaleKeysType; storeLists: Stores[] }) => {
  const [selectdStore, setSelectdStore] = useState<Stores>(emptyStore);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [searchBoxArray, setSearchBoxArray] = useState<Stores[]>([]);
  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: 22.3061859,
      lng: 114.151735,
    },
    zoom: 12.88,
  });
  const [myLocationByGPS, setMyLocationByGPS] = useState({
    center: {
      lat: 0,
      lng: 0,
    },
  });

  const [isClickedGPS, setIsClickedGPS] = useState(false);
  const [isDistictSelected, setIsDistictSelected] = useState(false);
  const [storeListsState, setStoreListsState] = useState<Stores[]>(storeLists);
  // console.log(storeLists, "storeLists")
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoadingScreenDisplay(false));
    }, 500);
  }, []);

  return (
    <>
      <MapContainer
        storeLists={storeListsState}
        selectdStore={selectdStore}
        setSelectdStore={setSelectdStore}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        searchBoxArray={searchBoxArray}
        defaultProps={defaultProps}
        setDefaultProps={setDefaultProps}
        isClickedGPS={isClickedGPS}
        myLocationByGPS={myLocationByGPS}
        isDistictSelected={isDistictSelected}
      />
      <StoreUpModal
        lang={lang}
        storeLists={storeListsState}
        selectdStore={selectdStore}
        setSelectdStore={setSelectdStore}
        activeMarker={activeMarker}
        setActiveMarker={setActiveMarker}
        searchBoxArray={searchBoxArray}
        setSearchBoxArray={setSearchBoxArray}
        setDefaultProps={setDefaultProps}
        setIsClickedGPS={setIsClickedGPS}
        myLocationByGPS={myLocationByGPS}
        isClickedGPS={isClickedGPS}
        setMyLocationByGPS={setMyLocationByGPS}
        setIsDistictSelected={setIsDistictSelected}
        setStoreListsState={setStoreListsState}
      />
    </>
  );
};
