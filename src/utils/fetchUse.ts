import { LocaleKeysType } from "@/app/i18n";
import { host } from "@/types/headerType";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

type Method = "get" | "post";

interface CookiesPropsType {
  method: Method;
  api: string;
  lang: LocaleKeysType;
  // eslint-disable-next-line @typescript-eslint/ban-types
  dynamicDependence?: string | undefined | number | Function | object | boolean | symbol | bigint | null | void;
  key: string;
}

export const useCookies = ({ method, api, lang, dynamicDependence, key }: CookiesPropsType) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = getCookie(key);

        if (data) {
          const response = await fetch(`${host}/${lang}/api/${api}`, {
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const setupData = data === true ? "true" : (data as string);
            const parsedData = JSON.parse(setupData);
            setData(parsedData);
            // const responseData = await response.json();
            // setData(responseData);
            console.log("Setup success", response);
          } else {
            throw new Error("Something went wrong");
          }
        } else {
          console.log("no Cookie Found");
        }
      } catch (err) {
        console.log("Error fetching Data", err);
      }
    };

    fetchData();
  }, [dynamicDependence]);

  return data;
};
