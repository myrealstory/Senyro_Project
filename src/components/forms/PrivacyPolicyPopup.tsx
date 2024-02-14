"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Close from "@/images/icons/Icon_page-close@3x.png";
import "@/style/auth/auth.scss";

import Mask from "../Mask";

import { Policies } from "@/types/terms/terms";

import BasicBG from "@/images/icons/memberTier/BasicPlain.png";
import EliteBG from "@/images/icons/memberTier/ElitePlain.png";
import PrestigeBG from "@/images/icons/memberTier/PrestigePlain.png";

export const PrivacyPolicyPopup = ({
  terms,
  lang,
  onClose,
  showModal,
}: {
  terms: Policies[];
  lang: any;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showModal: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerEleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showModal) {
      const popup = modalRef.current;
      const firstFocusableEle = popup?.querySelector("button");
      document.body.style.overflow = "hidden";

      firstFocusableEle?.focus();
    } else {
      triggerEleRef.current?.focus();
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <>
      <Mask>
        <div className="fixed bottom-0 left-0 right-0 top-16 z-10 flex items-center justify-center bg-[#4141414d] md:top-10 xl:top-0">
          <div
            ref={modalRef}
            className=" flex h-[75%] w-[90%] flex-col rounded-[24px] bg-primaryGold15 px-4 pb-12 sm:h-[60%] sm:w-[70%] lg:h-[70%] lg:w-[51%] lg:px-7 2xl:lg:w-[50%]"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="self-end pt-[20px] md:pt-[30px]">
              <Image src={Close} width={40} height={40} alt="close modal" className="h-auto w-[38px]" />
            </button>

            {terms.map(items => (
              <>
                <div className="my-[20px] pr-[20px] xl:text-[18px]">
                  <h2 className="pl-3 text-left text-[20px] font-semibold text-primaryDark">
                    {`${lang === "en" ? `${items.title}` : `${items.titleTC && items.titleTC}`}`}{" "}
                  </h2>
                </div>
                <article className="popup-scrollbar relative mr-[12px]">
                  <article className=" relative flex flex-col gap-5 break-words pl-4 pr-5 text-left">
                    <p
                      className="text-[14px] leading-5 text-primaryDark lg:text-[16px]"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {`${
                        lang === "en"
                          ? `${items.description.split("<br/>").join("\n")}`
                          : `${items.descriptionTC?.split("<br/>").join("\n")}`
                      }`}
                    </p>
                  </article>
                  <ol start={1} className="flex flex-col gap-5 break-words pl-4 pr-5 text-left">
                    {items.sections.map(item => (
                      <li key={item.title}>
                        {/* <h2 className=" TermsCardH2"> */}
                        <h2 className="pt-5 text-left text-[20px] font-semibold text-primaryDark">
                          {`${lang === "en" ? `${item.title}` : `${item.titleTC && item.titleTC}`}`}{" "}
                        </h2>
                        <ol start={1} className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                          {item.terms.map(term => (
                            <li key={term.id}>
                              {/* <h3 className="TermsCardH3"> {term.title}</h3> */}
                              <h3 className="pt-5 text-left text-[20px] font-semibold text-primaryDark">
                                {`${lang === "en" ? `${term.title}` : `${term.titleTC}`}`}
                              </h3>
                              {/* <p className="TermsCardPTag pb-8">{term.content}</p> */}
                              <p className="pb-5 pt-3">{`${
                                lang === "en"
                                  ? `${term.content?.split("<br/>").join("\n")}`
                                  : `${term.contentTC?.split("<br/>").join("\n")}`
                              }`}</p>
                              {/* {term.content2 && <p className="TermsCardPTag pb-8">{term.content2}</p>} */}
                              {term.content2 && (
                                <p className="pb-5 pt-3">
                                  {`${
                                    lang === "en"
                                      ? `${term.content2?.split("<br/>").join("\n")}`
                                      : `${term.content2TC?.split("<br/>").join("\n")}`
                                  }`}
                                </p>
                              )}
                              <div className={`flex flex-col gap-5 xl:flex-row ${term.type ? "flex" : "hidden"}`}>
                                {term.type &&
                                  term.type.map(type => (
                                    <figure className="" key={type.type}>
                                      {type.type === "Basic Pass" && (
                                        <div className="relative">
                                          <p className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 transform text-[14px] font-semibold leading-[26px] tracking-[-0.4px] text-primaryGold05">
                                            {" "}
                                            {`${lang === "en" ? "Basic Pass" : "百 両 會 員"}`}
                                          </p>
                                          <Image
                                            src={BasicBG}
                                            width={0}
                                            height={0}
                                            alt="Basic Pass"
                                            className=" h-[80px] pb-2 lg:h-auto"
                                          />
                                        </div>
                                      )}
                                      {type.type === "Premium Pass" && (
                                        <div className="relative">
                                          <p className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 transform text-[14px] font-semibold leading-[26px] tracking-[-0.4px] text-primaryGold05">{`${
                                            lang === "en" ? "Elite Pass" : "千 両 會 員"
                                          }`}</p>
                                          <Image
                                            src={EliteBG}
                                            width={0}
                                            height={0}
                                            alt="Elite Pass"
                                            className="h-[80px] pb-2 lg:h-auto"
                                          />
                                        </div>
                                      )}
                                      {type.type === "Prestige Pass" && (
                                        <div className="relative">
                                          <p className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 transform text-[14px] font-semibold leading-[26px] tracking-[-0.4px] text-primaryGold05">{`${
                                            lang === "en" ? "Prestige Pass" : "万 両 會 員"
                                          }`}</p>
                                          <Image
                                            src={PrestigeBG}
                                            width={0}
                                            height={0}
                                            alt="Prestige Pass"
                                            className="h-[80px] pb-2 lg:h-auto"
                                          />
                                        </div>
                                      )}

                                      <figcaption className="flex flex-col gap-2 ">
                                        <p className="TermsCardMemberDayText bg-white p-7 text-center font-semibold">
                                          {type.days} {lang === "en" ? " days" : " 天"}
                                        </p>
                                        <p className="TermsCardMemberDayText whitespace-pre-line bg-white p-7 text-center  font-semibold">
                                          {type.membershipTime}
                                        </p>
                                        <p className="TermsCardMemberDescriptionText rounded-b-[32px] bg-white p-7  text-center  font-semibold">
                                          {type.description}
                                        </p>
                                      </figcaption>
                                    </figure>
                                  ))}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </li>
                    ))}
                  </ol>
                </article>
              </>
            ))}
          </div>
        </div>
      </Mask>
    </>
  );
};
