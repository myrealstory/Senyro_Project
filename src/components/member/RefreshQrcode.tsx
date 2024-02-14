"use client";

import BasicMemberIcon from "@/images/icons/qr_code_basic@3x.png";
import EliteMemberIcon from "@/images/icons/qr_code_elite@3x.png";
import PrestigeMemberIcon from "@/images/icons/qr_code_prestige@3x.png";
import { useGetProfileLazyQuery, useGetSavedCardLazyQuery, useGetSingleCouponLazyQuery } from "@/redux/api/memberApi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRcode } from "./QRcode";
import { SaveCardType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import debounce from "lodash.debounce";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { ROUTES } from "@/constants";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";
import { useTranslation } from "@/app/i18n/client";

interface RefreshQrcodeProps {
  profileQrcodeStr?: string;
  card?: SaveCardType;
  couponId?: string;
  lang: LocaleKeysType;
  type: "PROFILE" | "COUPON" | "SAVED_CARD";
  onReady?: () => void;
}

export const RefreshQrcode = ({ card, lang, type, couponId, onReady }: RefreshQrcodeProps) => {
  const profile = useSelector((state: RootState) => state.profile);
  const [memberTier, setMemberTier] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [qrcodeStrState, setQrcodeStrState] = useState("");
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [qrcodeRequest] = useGetSavedCardLazyQuery();
  const [profileQrCodeRequest] = useGetProfileLazyQuery();
  const [couponRequest] = useGetSingleCouponLazyQuery();

  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();

  const debounceCallback = useCallback(
    debounce((func: () => any) => {
      func();
    }, 500),
    []
  );

  useEffect(() => {
    if (memberTier?.length && qrcodeStrState?.length) {
      if (onReady) {
        onReady();
      }
      setIsReady(true);
    }
  }, [memberTier, qrcodeStrState]);

  useEffect(() => {
    setMemberTier(profile.memberTier);
    if (type === "PROFILE") {
      debounceCallback(getProfileQRCode);
    } else if (type === "SAVED_CARD") {
      debounceCallback(getSavedCardQRCode);
    } else if (type === "COUPON" && couponId?.length) {
      debounceCallback(getCouponQRCode);
    }
  }, []);

  const popupLogoutAlert = () => {
    const popupMask = document?.getElementById("popupMask");
    if (popupMask) {
      popupMask.style.display = "none";
    }
    dispatch(
      setGlobalAlertStatus({
        isGlobalAlertDisplay: true,
        alertContent: translate("alertModal.fl2_popup_content"),
        rightButtonText: translate("alertModal.fl2_popup_right_button_text"),
        onRightButtonClick: () => {
          deleteCookie(CookiesKey.accessToken);
          setCookie(CookiesKey.targetPageToBeRedirectedTo, `/${lang}/${ROUTES.MEMBER}`);
          window.location.href = `/${lang}/${ROUTES.LOGIN}`;
        },
      })
    );
  }

  const getProfileQRCode = () => {
    return profileQrCodeRequest({ lang })
      .unwrap()
      .then(res => {
        if (res?.returnCode === "10003") {
          popupLogoutAlert();
        } else if (res.statusCode === 200 && res.data.qrcodeStr?.length) {
          setQrcodeStrState(res.data.qrcodeStr);
        } else {
          alert(`[Error - getProfileQRCode]: ${JSON.stringify(res)}`);
        }
      });
  };

  const getCouponQRCode = () => {
    return couponRequest(couponId ?? "")
      .unwrap()
      .then(res => {
        if (res?.returnCode === "10003") {
          popupLogoutAlert();
        } else if (res.statusCode === 200 && res.data.qrcodeStr?.length) {
          setQrcodeStrState(res.data.qrcodeStr);
        } else {
          alert(`[Error - getCouponQRCode]: ${JSON.stringify(res)}`);
        }
      });
  };

  const getSavedCardQRCode = () => {
    return qrcodeRequest()
      .unwrap()
      .then(res => {
        if (res?.returnCode === "10003") {
          popupLogoutAlert();
        } else if (res.statusCode === 200) {
          // Filter qrcode str by cardBankType
          const qrcodeStr = res.data.find((item: any) => item.cardBankType === card?.cardBankType)?.qrcodeStr;
          if (qrcodeStr?.length) {
            setQrcodeStrState(qrcodeStr);
          }
        } else {
          alert(`[Error - getSavedCardQRCode]: ${JSON.stringify(res)}`);
        }
      })
  };

  const memberTierInfo = useMemo(() => {
    if (!memberTier) {
      return {};
    }
    const lowerCaseMemberTier = memberTier.toLocaleLowerCase();
    if (lowerCaseMemberTier === "basic") {
      return {
        icon: BasicMemberIcon.src,
      };
    }

    if (lowerCaseMemberTier === "elite") {
      return {
        icon: EliteMemberIcon.src,
      };
    }

    if (lowerCaseMemberTier === "prestige") {
      return {
        icon: PrestigeMemberIcon.src,
      };
    }

    return {};
  }, [memberTier]);

  const fetchQrcode = () => {
    if (type === "PROFILE") {
      debounceCallback(getProfileQRCode);
    } else if (type === "SAVED_CARD") {
      debounceCallback(getSavedCardQRCode);
    } else if (type === "COUPON" && couponId?.length) {
      debounceCallback(getCouponQRCode);
    }
  };

  const setUpInterval = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(() => {
      fetchQrcode();
    }, 900000);
  };

  useEffect(() => {
    setUpInterval();
    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, []);

  const handleRefreshQrcode = () => {
    fetchQrcode();
    setUpInterval();
  };

  const QRCodeMemo = useMemo(
    () => (
      <QRcode
        qrCodeStr={qrcodeStrState}
        logoIcon={memberTierInfo.icon}
        logoIconWidth={40}
        qrSize={205}
        errorLevel="M"
        margin={3}
        scale={4}
      />
    ),
    [qrcodeStrState, memberTierInfo]
  );

  if (!isReady) {
    return <></>;
  }

  return (
    <div className={`${type === "SAVED_CARD" ? "mt-[-10px]" : ""} cursor-pointer`} onClick={handleRefreshQrcode}>
      {QRCodeMemo}
    </div>
  );
};
