import { CookiesKey } from "@/constants/cookies";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export const useIsAlreadyLogin = () => {
  const [isAlreadyLogin, setIsAlreadyLogin] = useState(false);
  const accessToken = getCookie(CookiesKey.accessToken);

  useEffect(() => {
    if (accessToken) {
      setIsAlreadyLogin(true);
    }
  }, [accessToken])

  return {
    isAlreadyLogin,
  }
}