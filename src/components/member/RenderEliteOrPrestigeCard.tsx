"use client";

import BottomLineDeco from "@/images/deco.png";
import Image from "next/image";
import QRCode from "@/images/icons/profile_QR_code.png";
import { HowToUpgrade } from "./HowToUpgrade";
import { useWindowSize } from "@/hook/useWindowSize";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PointType, ProfileResType } from "@/types/api/apiTypes";
import { UserQRCodeCard } from "./UserQRCodeCard";
import { createPortal } from "react-dom";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

export const RenderEliteOrPrestigeCard = ({
  totalPoint,
  pointList,
  lang,
  user,
  memberTier,
}: {
  totalPoint?: number;
  pointList?: PointType[];
  lang: LocaleKeysType;
  user: ProfileResType["data"];
  memberTier: number;
}) => {
  const [showQRCodeCard, setShowQRCodeCard] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { width } = useWindowSize();
  const { translate: t } = useTranslation(lang);
  const initialItemsToShow = showMore ? pointList?.length : 5;
  const path = usePathname();

  const mobileQRCode = path === `/${lang}/${ROUTES.MEMBER}`;

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleShowQRCodeCard = () => {
    setShowQRCodeCard(!showQRCodeCard);
  };

  const renderTotalPoints = (
    <>
      {totalPoint !== 0 ? (
        <h2 className="memberElitePrestigeCardTotalPoints">{totalPoint?.toLocaleString()}</h2>
      ) : (
        <h2 className="memberElitePrestigeCardZeroPoints">0</h2>
      )}
    </>
  );

  const renderPointList = (
    <>
      <table className="memberElitePrestigeCardPointListTable">
        <thead>
          <tr className="pb-2">
            <th>{t("memberArea.points")}</th>
            <th>{t("memberArea.expiryDate")}</th>
          </tr>
        </thead>

        <tbody className="custom-scrollbar overflow-y-auto">
          {width <= 1024 &&
            pointList?.slice(0, initialItemsToShow).map((item, index) => (
              <tr className="memberElitePrestigeCardTableTr" key={index}>
                <td className="memberElitePrestigeCardTd">{item.pointBalance.toLocaleString()}</td>
                <td className="memberElitePrestigeCardTd">{item.expiryDate}</td>
              </tr>
            ))}
          {width > 1025 &&
            pointList?.map((item, index) => (
              <tr className="memberElitePrestigeCardTableTr" key={index}>
                <td className="memberElitePrestigeCardTd">{item.pointBalance.toLocaleString()}</td>
                <td className="memberElitePrestigeCardTd">{item.expiryDate}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );

  return (
    <>
      <div className="memberElitePrestigeCard">
        <h2 className="memberElitePrestigeCarTitle">{t("memberArea.totalSenryroPoints")}</h2>
        {mobileQRCode && (
          <button className="memberElitePrestigeCardQRCode" onClick={handleShowQRCodeCard}>
            <Image src={QRCode} width={0} height={0} className="lg:h-auto " alt="Your profile QR code" />
          </button>
        )}
        <div className="memberElitePrestigeCarRenderPoint">
          <div className="memberElitePrestigeCardPoints">{renderTotalPoints}</div>
          <div>
            <Image src={BottomLineDeco} width={0} height={0} alt="decoration" />
          </div>
          <span className="memberElitePrestigeCardPts">{t("memberArea.pts")}</span>
        </div>
        <div
          className={`memberscrollPattern memberElitePrestigeCardWrapper ${
            pointList && pointList?.length > 5 ? "lg:pr-[15px]" : ""
          }`}
        >
          {memberTier !== 1 && totalPoint && totalPoint > 0 ? (
            renderPointList
          ) : (
            <HowToUpgrade
              memberTier={user?.memberTierCode}
              expiryDate={user?.tierExpiryDate}
              lang={lang}
              tierSpending={user?.tierSpending}
            />
          )}
          {totalPoint && totalPoint > 0 ? (
            <span className="lg:mx-auto lg:w-full lg:max-w-[200px]">{t("memberArea.warning")}</span>
          ) : null}
        </div>
        <div className="memberElitePrestigeCardLoadMore">
          {pointList && pointList.length > 5 && (
            <button onClick={handleShowMore}>
              {showMore === true ? t("memberArea.viewLess") : t("memberArea.viewMore")}
            </button>
          )}
          {totalPoint && totalPoint > 0 ? <span>{t("memberArea.warning")}</span> : null}
        </div>
      </div>
      {showQRCodeCard &&
        createPortal(
          <UserQRCodeCard
            memberNo={user?.memberNo}
            tierExpiryDate={user?.tierExpiryDate}
            memberTier={user?.memberTier}
            close={() => setShowQRCodeCard(false)}
            lang={lang}
            isShowQRCode={showQRCodeCard}
          />,
          document.body
        )}
    </>
  );
};
