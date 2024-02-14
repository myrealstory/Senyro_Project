import { useEffect, useState } from "react";

export const useCheckBrowser = () => {
  const [isChrome, setIsChrome] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isEdge, setIsEdge] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for Chrome
    if (userAgent.indexOf("chrome") > -1 && userAgent.indexOf("safari") > -1) {
      setIsChrome(true);
      setIsFirefox(false);
      setIsSafari(false);
      setIsEdge(false);
    }
    // Check for Firefox
    else if (userAgent.indexOf("firefox") > -1) {
      setIsChrome(false);
      setIsFirefox(true);
      setIsSafari(false);
      setIsEdge(false);
    }
    // Check for Safari
    else if (userAgent.indexOf("safari") > -1) {
      setIsChrome(false);
      setIsFirefox(false);
      setIsSafari(true);
      setIsEdge(false);
    }
    // Check for Edge
    else if (userAgent.indexOf("edge") > -1) {
      setIsChrome(false);
      setIsFirefox(false);
      setIsSafari(false);
      setIsEdge(true);
    }
    // For other browsers, set a default style
    else {
      setIsChrome(false);
      setIsFirefox(false);
      setIsSafari(false);
      setIsEdge(false);
    }
  }, [isChrome, isEdge, isFirefox, isSafari]);

  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
  };
};
