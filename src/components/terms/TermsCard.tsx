"use client";

import Image from "next/image";
// import Basic from "@/images/icons/basic@3x.png";
// import Elite from "@/images/icons/premium@3x.png";
// import Prestige from "@/images/icons/prestige@3x.png";
// import BasicTC from "@/images/icons/memberTier/BasicTC.png";
// import EliteTC from "@/images/icons/memberTier/EliteTC.png";
// import PrestigeTC from "@/images/icons/memberTier/PrestigeTC.png";
import BasicBG from "@/images/icons/memberTier/BasicPlain.png";
import EliteBG from "@/images/icons/memberTier/ElitePlain.png";
import PrestigeBG from "@/images/icons/memberTier/PrestigePlain.png";
import { Terms } from "@/types/terms/terms";
import { ScrollToTopBtn } from "../ScrollToTopBtn";
import "@/style/general-information/general-information.scss";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
// import { useTranslation } from "@/app/i18n/client";

export const TermsCard = ({ ...items }: Terms) => {
  const path = usePathname();
  const lang = getLangFromString(path);

  return (
    <article className="relative">
      <ScrollToTopBtn />
      <div className="TermsCardTitleDiv">
        <h1 className=""> {lang === "en" ? items.title : items.titleTC} </h1>
        <span className=" ">{lang === "en" ? items.updated : items.updatedTC} </span>
      </div>
      <article className="TermsCardContentArticle">
        <p className="TermsCardPTag" style={{ whiteSpace: "pre-line" }}>
          {`${
            lang === "en"
              ? `${items.description.split("<br/>").join("\n")}`
              : `${items.descriptionTC?.split("<br/>").join("\n")}`
          }`}
        </p>
      </article>
      <ol start={1}>
        {items.sections.map(item => (
          <li key={item.title}>
            <h2 className=" TermsCardH2">
              {`${lang === "en" ? `${item.title}` : `${item.titleTC && item.titleTC}`}`}{" "}
            </h2>
            <ol start={1}>
              {item.terms.map(term => (
                <li key={term.id}>
                  <h3 className="TermsCardH3">
                    {/* {term.title} */}
                    {`${lang === "en" ? `${term.title}` : `${term.titleTC && term.titleTC}`}`}{" "}
                  </h3>
                  {/* <p className="TermsCardPTag pb-8">{term.content}</p> */}
                  <p className="TermsCardPTag pb-8">
                    {`${
                      lang === "en"
                        ? `${term.content?.split("<br/>").join("\n")}`
                        : `${term.contentTC && term.contentTC?.split("<br/>").join("\n")}`
                    }`}{" "}
                  </p>
                  {term.content2 && <p className="TermsCardPTag pb-8">{term.content2?.split("<br/>").join("\n")}</p>}
                  <div className={`TermsCardMemberColumn ${term.type ? "flex" : "hidden"}`}>
                    {term.type &&
                      term.type.map(type => (
                        <figure className="" key={type.type}>
                          {type.type === "Basic Pass" && (
                            <div className="relative">
                              <p className="TermsCardMemberTireNameText ">
                                {" "}
                                {`${lang === "en" ? "Basic Pass" : "百 両 會 員"}`}
                              </p>
                              <Image src={BasicBG} width={0} height={0} alt="Basic Pass" className="h-full pb-2" />
                            </div>
                          )}
                          {type.type === "Premium Pass" && (
                            <div className="relative">
                              <p className="TermsCardMemberTireNameText ">{`${
                                lang === "en" ? "Elite Pass" : "千 両 會 員"
                              }`}</p>
                              <Image src={EliteBG} width={0} height={0} alt="Elite Pass" className="h-full pb-2" />
                            </div>
                          )}
                          {type.type === "Prestige Pass" && (
                            <div className="relative">
                              <p className="TermsCardMemberTireNameText ">{`${
                                lang === "en" ? "Prestige Pass" : "万 両 會 員"
                              }`}</p>
                              <Image
                                src={PrestigeBG}
                                width={0}
                                height={0}
                                alt="Prestige Pass"
                                className="h-full pb-2"
                              />
                            </div>
                          )}

                          <figcaption className="flex flex-col gap-2">
                            <p className="TermsCardMemberDayText">
                              {type.days} {lang === "en" ? " days" : " 天"}
                            </p>
                            <p className="TermsCardMemberDayText whitespace-pre-line">{type.membershipTime}</p>
                            <p className="TermsCardMemberDescriptionText">{type.description}</p>
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
  );
};
