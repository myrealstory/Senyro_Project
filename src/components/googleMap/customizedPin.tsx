"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import IconLocationPin from "@/images/icons/Location.png";
import IconPurpleMarker from "@/images/icons/Marker-purple.png";
import IconLocationDimmed from "@/images/icons/Location_dimmed.png";
import { Stores } from "@/types/api/store";
import "@/style/general-information/general-information.scss";

const CustomizedPin = ({
  markerId,
  setSelectdStore,
  individualStore,
  handleMarkerClick,
  isActive,
  searchBoxArray,
  isDistictSelected,
}: {
  lat: number;
  lng: number;
  markerId: number;
  individualStore: Stores;
  setSelectdStore: React.Dispatch<React.SetStateAction<Stores>>;
  handleMarkerClick: (markerId: number) => void;
  isActive: boolean;
  searchBoxArray: Stores[];
  isDistictSelected: boolean;
}) => {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isSetTimeOut, setIsSetTimeOut] = useState(false);

  useEffect(() => {
    if (
      (searchBoxArray.length !== 0 && !searchBoxArray.some(item => item.id === individualStore.id)) ||
      (isDistictSelected && searchBoxArray.length === 0)
    )
      setIsDimmed(true);
    else setIsDimmed(false);
  }, [searchBoxArray, isDistictSelected]);

  useEffect(() => {
    setTimeout(() => {
      setIsSetTimeOut(true);
    }, 500);
  }, []);

  const pinSource = useMemo(() => {
    if (isDimmed) {
      return IconLocationDimmed;
    } else if (isActive) {
      return IconPurpleMarker;
    } else {
      return IconLocationPin;
    }
  }, [isDimmed, isActive]);

  const handleClick = () => {
    if (isDimmed) {
      // Do nothing if the pin is dimmed
      return;
    }

    setSelectdStore(individualStore);
    scrollToElement();
    if (!isActive) {
      handleMarkerClick(markerId);
    }
  };

  const scrollToElement = () => {
    const element = document.getElementById(`${individualStore.branchCode}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      element.focus();
    }
  };

  return (
    <>
      <div className="CustomizedPinDiv">
        <button className="" onClick={handleClick}>
          <a href={`#${individualStore.branchCode}`}>
            {/* {isDimmed ? (
              <Image src={IconLocationDimmed} alt="IconLocationDimmed" className="CustomizedPinImg " />
            ) : isActive ? (
              <Image src={IconPurpleMarker} alt="IconPurpleMarker" className="CustomizedPinImg " />
            ) : (
              <Image src={IconLocationPin} alt="location_logo" className="CustomizedPinImg " />
            )} */}
            {isSetTimeOut && <Image src={pinSource} alt="location_logo" className="CustomizedPinImg " />}
          </a>
        </button>
      </div>
    </>
  );
};

export default CustomizedPin;
