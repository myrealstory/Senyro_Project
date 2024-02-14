"use client";

import { RenderEliteOrPrestigeCard } from "./RenderEliteOrPrestigeCard";
import { ProfileResType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { RenderBasicCard } from "./RenderBasicCard";
import "@/style/member/member.scss";

export const MemberAreaCard = ({ user, lang }: { user: ProfileResType["data"]; lang: LocaleKeysType }) => {
  const memberTierCode = Number(user?.memberTierCode);

  return (
    <>
      <div className="memberElitePrestigeCardContainer">
        <div className="memberElitePrestigeCardSecondContainer">
          {memberTierCode === 2 || memberTierCode === 3 ? (
            <RenderEliteOrPrestigeCard
              totalPoint={user?.pointBalance}
              pointList={user?.pointBucket}
              lang={lang}
              user={user}
              memberTier={memberTierCode}
            />
          ) : (
            <RenderBasicCard lang={lang} user={user} />
          )}
        </div>
      </div>
    </>
  );
};
