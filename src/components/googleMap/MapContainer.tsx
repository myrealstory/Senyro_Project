"use client";
import Image from "next/image";
import MyLocationPinIcon from "@/images/icons/GpsMyLocation@2x.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import GoogleMap from "google-maps-react-markers";
import { Stores } from "@/types/api/apiTypes";
import CustomizedPin from "./customizedPin";
import "@/style/general-information/general-information.scss";

const MyLocationPin = ({}: { lat: number; lng: number; markerId: number }) => {
  return (
    <div className=" z-[999] h-[58px] w-[58px]">
      <Image
        width={0}
        height={0}
        src={MyLocationPinIcon}
        alt="location_logo"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export const MapContainer = ({
  storeLists,
  selectdStore,
  setSelectdStore,
  activeMarker,
  setActiveMarker,
  searchBoxArray,
  defaultProps,
  setDefaultProps,
  isClickedGPS,
  myLocationByGPS,
  isDistictSelected,
}: {
  storeLists: Stores[];
  selectdStore: Stores;
  setSelectdStore: React.Dispatch<React.SetStateAction<Stores>>;
  activeMarker: number | null;
  setActiveMarker: React.Dispatch<React.SetStateAction<number | null>>;
  searchBoxArray: Stores[];
  defaultProps: { center: { lat: number; lng: number }; zoom: number };
  setDefaultProps: React.Dispatch<React.SetStateAction<{ center: { lat: number; lng: number }; zoom: number }>>;
  isClickedGPS: boolean;
  myLocationByGPS: { center: { lat: number; lng: number } };
  isDistictSelected: boolean;
}) => {
  const windowSize = useWindowSize();
  const [isPageReady, setIsPageReady] = useState(false);
  const mapRef = useRef<any>(null);
  const mapSiteKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY;

  useEffect(() => {
    if (windowSize.width > 0) {
      setIsPageReady(true);
    }
  }, [windowSize]);

  useEffect(() => {
    if (selectdStore.lat !== 0)
      setDefaultProps({ center: { lat: selectdStore.lat - 0.015, lng: selectdStore.long + 0.0025 }, zoom: 13 });

    if (mapRef !== null && mapRef.current !== null && selectdStore.lat !== 0) {
      mapRef.current.setCenter({ lat: selectdStore.lat - 0.015, lng: selectdStore.long + 0.0025 });
      mapRef.current.setZoom(13.3);

      // rif.google maps method https://developers.google.com/maps/documentation/javascript/reference?hl=it
    }

    // console.log("UPDATED DEFAULT CENTER");
    // console.log("DefaultProps =>>", defaultProps);
  }, [selectdStore]);

  const isAbleToZoom = useMemo(() => {
    return windowSize.width > 1023 ? true : false;
  }, [windowSize]);

  useEffect(() => {
    if (mapRef !== null && mapRef.current !== null) {
      mapRef.current.setZoom(13.3);
      !isAbleToZoom && isClickedGPS
        ? mapRef.current.setCenter({ lat: defaultProps.center.lat - 0.0212, lng: defaultProps.center.lng + 0.0045 })
        : mapRef.current.setCenter({ lat: defaultProps.center.lat - 0.015, lng: defaultProps.center.lng + 0.0025 });
    }
  }, [isClickedGPS, myLocationByGPS]);

  const onGoogleApiLoaded = ({ map }: { map: any }) => {
    mapRef.current = map;
  };

  const handleMarkerClick = (markerId: number) => {
    setActiveMarker(markerId);
  };

  if (!isPageReady) {
    return <></>;
  }

  return (
    <div className="MapContainerDiv" style={{ height: windowSize.height }}>
      <GoogleMap
        apiKey={mapSiteKey}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onGoogleApiLoaded={onGoogleApiLoaded}
        options={{
          maxZoom: 20,
          minZoom: 10,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          zoomControl: isAbleToZoom,
          clickableIcons: false,
          styles: [
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            // {
            //   "elementType": "labels.icon",
            //   "stylers": [
            //     {
            //       "visibility": "off"
            //     }
            //   ]
            // },
          ],
        }}
      >
        {isClickedGPS && myLocationByGPS?.center?.lat && myLocationByGPS?.center?.lng && (
          <MyLocationPin markerId={99999} lat={myLocationByGPS?.center?.lat} lng={myLocationByGPS?.center?.lng} />
        )}
        {storeLists.map(item => (
          <CustomizedPin
            key={item.branchCode}
            lat={item.lat}
            lng={item.long}
            markerId={item.id}
            individualStore={item}
            setSelectdStore={setSelectdStore}
            handleMarkerClick={handleMarkerClick}
            isActive={activeMarker === item.id}
            searchBoxArray={searchBoxArray}
            isDistictSelected={isDistictSelected}
          />
        ))}
      </GoogleMap>
    </div>
  );
};
