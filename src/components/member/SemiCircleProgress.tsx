"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "@/style/member/member.scss";

export const SemiCircleProgress = ({
  spending,
  requiredSpending,
  memberTierCode,
}: {
  spending: number;
  requiredSpending: number;
  memberTierCode?: number;
}) => {
  const [totalPathLength, setTotalPathLength] = useState<number>(0);
  const [animatedLength, setAnimatedLength] = useState<number>(0);
  const pathRef = useRef<SVGPathElement>(null);
  const formattedSpending = useMemo(() => {
    const spend = spending > requiredSpending ? requiredSpending : spending;
    if (!spend || spend === 0) {
      return 1;
    }
    return spend;
  }, [spending, requiredSpending]);
  const duration = 1500; // duration of animation in milliseconds
  const totalAmount = requiredSpending;
  const percentage = spending ? spending / totalAmount : 0;
  const strokeDashoffset = totalPathLength * (1 - Math.min(percentage, 1));

  const position = useMemo(() => {
    if (pathRef.current && isFinite(animatedLength)) {
      const point = pathRef.current.getPointAtLength(animatedLength);
      return { x: point.x, y: point.y };
    }
    return { x: 0, y: 100 };
  }, [animatedLength]);

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      setTotalPathLength(pathLength);
      // If there is no spending, set the animatedLength to 0
      if (formattedSpending === 0) {
        setAnimatedLength(0);
      }
    }
  }, [formattedSpending]);

  useEffect(() => {
    if (formattedSpending >= 0) {
      // Define the animation duration and the target length
      const targetLength = totalPathLength * (formattedSpending / requiredSpending);

      // Set up the animation
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min(((timestamp - start) / duration) * 1.05, 1);
        setAnimatedLength(progress * targetLength);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [formattedSpending, totalPathLength, requiredSpending]);

  // const strokeDashoffset = totalPathLength - animatedLength;

  const formatted = (amount: number) => {
    return new Intl.NumberFormat("en-HK", {
      currencyDisplay: "symbol",
      currency: "HKD",
    }).format(amount);
  };

  const svgStyle = {
    "--total-path-length": totalPathLength,
    "--stroke-dashoffset": strokeDashoffset,
  };

  const renderCircle = (
    <div className="upgradeSemiCircleSvgContainer" style={svgStyle as React.CSSProperties}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="135" viewBox="0 0 270 160" fill="none">
        <defs>
          <linearGradient
            id="gradient"
            x1="206.257"
            y1="47.4706"
            x2="5.20544"
            y2="61.7692"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8D7A5B" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          strokeLinecap="square"
          d="M6.99999 135C6.99999 101.052 20.3803 68.495 44.1974 44.4903C68.0145 20.4857 100.317 7 134 7C167.682 7 199.985 20.4857 223.803 44.4903C247.62 68.495 261 101.052 261 135"
          stroke="#8D7A5B"
          strokeOpacity={0.2}
          strokeWidth="14"
          strokeLinejoin="round"
          id="full-path"
        />
        <path
          d="M6.99999 135C6.99999 101.052 20.3803 68.495 44.1974 44.4903C68.0145 20.4857 100.317 7 134 7C167.682 7 199.985 20.4857 223.803 44.4903C247.62 68.495 261 101.052 261 135"
          stroke="url(#gradient)"
          fill="none"
          strokeLinecap="square"
          strokeWidth="14"
          strokeLinejoin="round"
          strokeDasharray={totalPathLength}
          strokeDashoffset={strokeDashoffset}
          className="filled-path"
        />
        <circle className="" cx={position.x} cy={position.y} r="14" fill="#282828" />
      </svg>
      <div className="upgradeSemiCircleSvgTextContainer">
        <h3>
          ${spending && formatted(spending)}
          <span className={`${memberTierCode === 1 ? "text-primaryGold" : "text-primaryDark"}`}>
            / ${formatted(requiredSpending)}
          </span>
        </h3>
      </div>
    </div>
  );

  return <div className="upgradeSemiCircleContainer">{renderCircle}</div>;
};
