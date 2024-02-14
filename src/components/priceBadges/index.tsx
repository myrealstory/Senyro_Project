import "@/style/index/indexUsed.scss";

import { PriceBadgesType } from "@/types/componentTypes";
import { getTotalLengthFromArray } from "@/utils/commonUtils";
import Image from "next/image";

const Badges = ({
  badges,
  badgeClasses,
  textClasses,
  badgeContainer,
}: {
  badges: PriceBadgesType["leftBadge"] | PriceBadgesType["rightBadge"];
  badgeClasses?: string;
  textClasses?: string;
  badgeContainer?: string;
  mode?: "left" | "right";
  amountOfBadges: number;
}): JSX.Element => {
  if (!badges) {
    return <></>;
  }

  return (
    <div className={`${badgeContainer} badgeBoxContainer `}>
      {badges?.map((badge, index) => (
        <div key={index} className={"badgeBoxRow justify-start"}>
          <div
            className={`flex-2 
            ${badgeClasses ? badgeClasses : "badgeBox"}
           `}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${badge.image}`}
              alt={""}
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
          <span
            className={` discount-tag
              ${textClasses ? textClasses : "textStyle"}
              ${badges.length > 1 && badge.isListPrice ? "after:bg-primaryGold" : ""}
            `}
          >
            {`$${badge.price}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export const PriceBadges = ({
  leftBadge,
  rightBadge,
  containerClasses,
  badgeClasses,
  textClasses,
  badgeContainerClasses,
}: PriceBadgesType) => {
  return (
    <div className={`pointer-events-none w-full cursor-none ${containerClasses ?? ""}`}>
      <div className={"flex flex-row justify-center gap-3 lg:gap-2 2xl:gap-4"}>
        {leftBadge && leftBadge.length > 0 && (
          <Badges
            badges={leftBadge}
            badgeClasses={badgeClasses}
            textClasses={textClasses}
            badgeContainer={badgeContainerClasses}
            mode={"left"}
            amountOfBadges={getTotalLengthFromArray(leftBadge, rightBadge)}
          />
        )}
        {rightBadge && rightBadge.length > 0 && (
          <Badges
            badges={rightBadge}
            badgeClasses={badgeClasses}
            textClasses={textClasses}
            badgeContainer={badgeContainerClasses}
            mode={"right"}
            amountOfBadges={getTotalLengthFromArray(leftBadge, rightBadge)}
          />
        )}
      </div>
    </div>
  );
};
