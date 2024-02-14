"use client";
import { ProgressType } from "@/types/form/formTypes";
import { useEffect, useState } from "react";

export const AuthProgressbar = ({ title, progress, path }: ProgressType) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 500);
  }, []);

  if (!isReady) {
    return <></>;
  }
  return (
    <ul className={`authProgressbarContainer ${path === "info" ? "py-8" : "py-0"}`}>
      {title.map((item, i) => (
        <li key={i} className="authProgressbar-list">
          <div className={` ${i + 1 === progress ? "border " : "w-7 sm:w-9 lg:w-[2.389vw]"}`}>
            <span
              className={`absolute left-0 flex h-full w-7 items-center justify-center rounded-full bg-primaryGold text-white sm:w-9 lg:w-[2.389vw] ${
                i + 1 <= progress ? "" : "opacity-20"
              }`}
            >
              {i + 1}
            </span>
            <p className={`text-11 ${i + 1 === progress ? "block" : "hidden"}`}>{item}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
