import Image from "next/image";
import { useState } from "react";

import { GPSType } from "@/types/componentTypes";
import { useTranslation } from "@/app/i18n/client";

import navIcon from "../../images/icons/Icon_navigation@3x.png";
import navIconEmpty from "../../images/icons/Icon_navigation_empty@3x.png";

export const GPS = ({ lang, onActivate, onDeactivate }: GPSType) => {
  const { translate } = useTranslation(lang);
  const [isGPSActive, setIsGPSActive] = useState(false);

  const toogleGPS = () => {
    if (isGPSActive) {
      setIsGPSActive(false);
      onDeactivate && onDeactivate();
    } else if (!isGPSActive && navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then(permissionStatus => {
        if (permissionStatus.state === "denied") {
          alert("Please allow location access.");
          // keep for future use
          // window.location.href = "app-settings:location";
        } else {
          navigator.geolocation.getCurrentPosition(
            position => {
              setIsGPSActive(true);
              onActivate && onActivate(position.coords);
            },
            error => {
              alert("Please turn on the GPS permission from your browser setting");
              console.error("[GPS] toogleGPS : ", error);
            }
          );
        }
      });
    }
  };

  return (
    <button
      className="flex items-center md:ml-4 "
      onClick={() => {
        toogleGPS();
      }}
    >
      <Image src={isGPSActive ? navIcon : navIconEmpty} alt="" className="h-[1.09rem] w-[1.09rem]" />
      <p className="ml-2 text-[16px] font-medium leading-[18px] text-primaryGold md:text-lg">
        {translate(`popup.${isGPSActive ? "gpsOn" : "seachGPS"}`)}
      </p>
    </button>
  );
};
